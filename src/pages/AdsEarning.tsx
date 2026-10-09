import { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/useCurrency";
import { api } from "@/lib/api";
import { glassCardClass, PageShell } from "@/components/PageShell";
import { Clapperboard, History, Lock, PlayCircle, Users2, Volume2, VolumeX } from "lucide-react";

type CycleType = "welcome" | "pair";

type AdSlot = {
  cycleType: CycleType;
  active: boolean;
  startDate: string | null;
  endDate: string | null;
  rewardPerAd: number;
  canWatch: boolean;
  watchedToday: number;
  remainingToday: number;
};

type AdsStatus = {
  enabled: boolean;
  dailyLimit: number;
  watchedToday: number;
  remainingToday: number;
  ads: AdSlot[];
};

type WatchVideo = {
  id: number;
  title: string;
  url: string | null;
  durationSeconds: number;
};

type WatchStart = {
  watchId: number;
  video: WatchVideo;
  rewardPerAd: number;
};

type AdsHistoryEntry = {
  id: number;
  date: string;
  rewardPkr: number;
  cycleType: CycleType | null;
  completedAt: string;
};

const formatDate = (value: string | null) => {
  if (!value) return "-";
  // Parse the "YYYY-MM-DD" parts directly rather than via `new Date(value)`, which reads
  // the string as UTC midnight and can shift a day off in non-UTC timezones.
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return "-";
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
};

const SLOT_LABELS: Record<CycleType, { title: string; icon: typeof Clapperboard; activeHeading: string }> = {
  welcome: { title: "Welcome Ads", icon: Clapperboard, activeHeading: "🎉 Welcome Ads Active" },
  pair: { title: "Pair Complete Ads", icon: Users2, activeHeading: "🔓 Pair Complete Ads Active" },
};

const AdsEarning = () => {
  const [status, setStatus] = useState<AdsStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const [startingType, setStartingType] = useState<CycleType | null>(null);
  const [watch, setWatch] = useState<WatchStart | null>(null);
  const [watchingType, setWatchingType] = useState<CycleType | null>(null);
  const [completing, setCompleting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [needsPlayTap, setNeedsPlayTap] = useState(false);
  const [muted, setMuted] = useState(false);

  const [history, setHistory] = useState<AdsHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTimeRef = useRef(0);

  const { formatMoney } = useCurrency();
  const { toast } = useToast();

  const loadStatus = () => {
    return api("/api/ads/me/status/")
      .then((data) => {
        setStatus(data);
        return data as AdsStatus;
      })
      .catch(() => {
        setStatus(null);
        return null;
      });
  };

  const loadHistory = () => {
    setHistoryLoading(true);
    return api("/api/ads/me/history/")
      .then((data) => {
        setHistory(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setHistory([]);
      })
      .finally(() => setHistoryLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    loadStatus().finally(() => setLoading(false));
    loadHistory();
  }, []);

  const resetWatchDialog = () => {
    setWatch(null);
    setWatchingType(null);
    setStartingType(null);
    setCompleting(false);
    setNeedsPlayTap(false);
    setCountdown(0);
    setMuted(false);
    lastTimeRef.current = 0;
  };

  const handleStartWatch = (cycleType: CycleType) => {
    const slot = status?.ads.find((ad) => ad.cycleType === cycleType);
    if (!slot || !slot.canWatch || startingType || watch) return;
    setStartingType(cycleType);
    api("/api/ads/me/watch/start/", { method: "POST", body: JSON.stringify({ cycleType }) })
      .then((data: WatchStart) => {
        setWatch(data);
        setWatchingType(cycleType);
        setCountdown(Math.ceil(data.video?.durationSeconds || 0));
        lastTimeRef.current = 0;
      })
      .catch((err: any) => {
        toast({ title: "Error", description: err.message || "Unable to start ad watch", variant: "destructive" });
      })
      .finally(() => setStartingType(null));
  };

  const handleComplete = () => {
    if (!watch || completing) return;
    setCompleting(true);
    api(`/api/ads/me/watch/${watch.watchId}/complete/`, { method: "POST" })
      .then((data: AdsStatus) => {
        setStatus(data);
        toast({ title: "Ad Watched", description: `You earned ${formatMoney(watch.rewardPerAd)}!` });
        resetWatchDialog();
        loadHistory();
      })
      .catch((err: any) => {
        toast({ title: "Error", description: err.message || "Unable to record ad watch", variant: "destructive" });
        resetWatchDialog();
      })
      .finally(() => setCompleting(false));
  };

  // Try to autoplay as soon as the video element mounts with a source.
  useEffect(() => {
    if (!watch || !watch.video?.url) return;
    const el = videoRef.current;
    if (!el) return;
    setNeedsPlayTap(false);
    const playPromise = el.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(() => {
        setNeedsPlayTap(true);
      });
    }
  }, [watch?.watchId]);

  const handleManualPlay = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    setMuted(false);
    el.play()
      .then(() => setNeedsPlayTap(false))
      .catch(() => {
        // Fall back to a muted autoplay attempt.
        el.muted = true;
        setMuted(true);
        el.play()
          .then(() => setNeedsPlayTap(false))
          .catch(() => setNeedsPlayTap(true));
      });
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || !watch) return;
    lastTimeRef.current = el.currentTime;
    const duration = watch.video?.durationSeconds || el.duration || 0;
    const remaining = Math.max(0, Math.ceil(duration - el.currentTime));
    setCountdown(remaining);
  };

  const handleSeeking = () => {
    const el = videoRef.current;
    if (!el) return;
    // Never allow the user (or any external trigger) to jump the playhead forward.
    if (Math.abs(el.currentTime - lastTimeRef.current) > 0.35) {
      el.currentTime = lastTimeRef.current;
    }
  };

  const handleEnded = () => {
    handleComplete();
  };

  const activeAds = status?.ads.filter((ad) => ad.active) || [];

  const dialogOpen = Boolean(startingType) || Boolean(watch) || completing;

  return (
    <DashboardLayout>
      <PageShell
        icon={Clapperboard}
        title="Ads Earning"
        description="Watch short ads during your active cycles to earn extra rewards."
      >
        {loading ? (
          <Card className={glassCardClass}>
            <CardContent className="p-6 text-sm text-muted-foreground">Loading ads status...</CardContent>
          </Card>
        ) : !status || activeAds.length === 0 ? (
          <Card className={glassCardClass}>
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Lock className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-extrabold text-foreground">Ads Locked</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                Ads earning unlocks during your welcome window or after completing a qualifying Binary Pair. Keep
                growing your team or check back once a cycle starts.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {activeAds.map((slot) => {
              const label = SLOT_LABELS[slot.cycleType];
              const Icon = label.icon;
              const isStartingThis = startingType === slot.cycleType;
              return (
                <Card key={slot.cycleType} className={glassCardClass}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display text-lg">
                      <Icon className="h-5 w-5" />
                      {label.activeHeading}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-background/70 p-3">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Cycle Window</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {formatDate(slot.startDate)} - {formatDate(slot.endDate)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-background/70 p-3">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Reward Per Ad</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{formatMoney(slot.rewardPerAd)}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Progress
                        value={
                          status && status.dailyLimit > 0
                            ? Math.min(100, Math.round((slot.watchedToday / status.dailyLimit) * 100))
                            : 0
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        {slot.watchedToday} / {status?.dailyLimit ?? 0} watched today — {slot.remainingToday}{" "}
                        remaining
                      </p>
                    </div>

                    <Button
                      type="button"
                      size="lg"
                      onClick={() => handleStartWatch(slot.cycleType)}
                      disabled={!slot.canWatch || Boolean(startingType) || Boolean(watch)}
                      className="w-full gap-2 rounded-2xl"
                    >
                      <PlayCircle className="h-5 w-5" />
                      {isStartingThis ? "Starting..." : slot.canWatch ? "Watch Ad" : "No Ads Available Right Now"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card className={glassCardClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <History className="h-5 w-5" />
              Ads Earning History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <p className="text-sm text-muted-foreground">Loading ads history...</p>
            ) : history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No Ads watched yet.</p>
            ) : (
              <div className="divide-y divide-border/60">
                {history.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">
                        {formatDate(entry.date)}
                      </p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {entry.cycleType ? `${entry.cycleType} cycle` : "-"}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">{formatMoney(entry.rewardPkr)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PageShell>

      <Dialog open={dialogOpen} onOpenChange={() => undefined}>
        <DialogContent
          className="sm:max-w-sm"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              Watching {watchingType ? SLOT_LABELS[watchingType].title : "Ad"}...
            </DialogTitle>
            <DialogDescription>Please wait while your ad plays. Do not close this window.</DialogDescription>
          </DialogHeader>

          {Boolean(startingType) || !watch ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
              <p className="text-sm text-muted-foreground">Loading your ad...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="relative w-full overflow-hidden rounded-xl bg-black">
                {watch.video.url ? (
                  <video
                    ref={videoRef}
                    src={watch.video.url}
                    className="aspect-video w-full"
                    playsInline
                    muted={muted}
                    onTimeUpdate={handleTimeUpdate}
                    onSeeking={handleSeeking}
                    onEnded={handleEnded}
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center text-sm text-white/70">
                    Video unavailable
                  </div>
                )}

                <button
                  type="button"
                  onClick={toggleMute}
                  className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>

                {needsPlayTap && (
                  <button
                    type="button"
                    onClick={handleManualPlay}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 text-white"
                  >
                    <PlayCircle className="h-10 w-10" />
                    <span className="text-sm font-semibold">Tap to play</span>
                  </button>
                )}
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                {completing ? "..." : countdown}
              </div>
              <p className="text-center text-sm text-muted-foreground">
                {completing ? "Recording your reward..." : "Ad will finish shortly. Please keep this window open."}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdsEarning;
