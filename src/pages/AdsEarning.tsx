import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/useCurrency";
import { api } from "@/lib/api";
import { glassCardClass, PageShell } from "@/components/PageShell";
import { Clapperboard, Lock, PlayCircle } from "lucide-react";

type AdsStatus = {
  enabled: boolean;
  cycleType: "welcome" | "pair" | null;
  startDate: string | null;
  endDate: string | null;
  dailyLimit: number;
  watchedToday: number;
  remainingToday: number;
  rewardPerAd: number;
  canWatch: boolean;
};

const WATCH_SECONDS = 5;

const AdsEarning = () => {
  const [status, setStatus] = useState<AdsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [watching, setWatching] = useState(false);
  const [countdown, setCountdown] = useState(WATCH_SECONDS);
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

  useEffect(() => {
    setLoading(true);
    loadStatus().finally(() => setLoading(false));
  }, []);

  const handleStartWatch = () => {
    if (!status || !status.canWatch) return;
    setWatching(true);
    setCountdown(WATCH_SECONDS);
  };

  useEffect(() => {
    if (!watching) return;
    if (countdown <= 0) {
      const rewardBeforeWatch = status?.rewardPerAd || 0;
      api("/api/ads/me/watch/", { method: "POST" })
        .then((data) => {
          setStatus(data);
          toast({ title: "Ad Watched", description: `You earned ${formatMoney(rewardBeforeWatch)}!` });
        })
        .catch((err: any) => {
          toast({ title: "Error", description: err.message || "Unable to record ad watch", variant: "destructive" });
        })
        .finally(() => setWatching(false));
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [watching, countdown]);

  const cycleActive = status?.cycleType === "welcome" || status?.cycleType === "pair";
  const progressPercent = status && status.dailyLimit > 0 ? Math.min(100, Math.round((status.watchedToday / status.dailyLimit) * 100)) : 0;

  return (
    <DashboardLayout>
      <PageShell
        icon={Clapperboard}
        title="Ads Earning"
        description="Watch short ads during your active cycle to earn extra rewards."
      >
        {loading ? (
          <Card className={glassCardClass}>
            <CardContent className="p-6 text-sm text-muted-foreground">Loading ads status...</CardContent>
          </Card>
        ) : !status || !cycleActive ? (
          <Card className={glassCardClass}>
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Lock className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-extrabold text-foreground">Ads Locked</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                Ads earning unlocks during your welcome window or after completing a qualifying Binary Pair. Keep
                growing your team or check back once your cycle starts.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className={glassCardClass}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                {status.cycleType === "welcome" ? "🎉 Welcome Ads Active" : "🔓 Ads Cycle Active"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-background/70 p-3">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Cycle Window</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {status.startDate ? new Date(status.startDate).toLocaleDateString() : "-"} -{" "}
                    {status.endDate ? new Date(status.endDate).toLocaleDateString() : "-"}
                  </p>
                </div>
                <div className="rounded-xl bg-background/70 p-3">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Reward Per Ad</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{formatMoney(status.rewardPerAd)}</p>
                </div>
                <div className="rounded-xl bg-background/70 p-3">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Today's Progress</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {status.watchedToday} / {status.dailyLimit}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Progress value={progressPercent} />
                <p className="text-xs text-muted-foreground">{status.remainingToday} ad(s) remaining today.</p>
              </div>

              <Button
                type="button"
                size="lg"
                onClick={handleStartWatch}
                disabled={!status.canWatch}
                className="w-full gap-2 rounded-2xl sm:w-auto"
              >
                <PlayCircle className="h-5 w-5" />
                {status.canWatch ? "Watch Ad" : "No Ads Available Right Now"}
              </Button>
            </CardContent>
          </Card>
        )}
      </PageShell>

      <Dialog open={watching} onOpenChange={() => undefined}>
        <DialogContent className="sm:max-w-sm" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Watching Ad...</DialogTitle>
            <DialogDescription>Please wait while your ad plays. Do not close this window.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-3 py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {countdown > 0 ? countdown : "..."}
            </div>
            <p className="text-sm text-muted-foreground">Ad will finish shortly.</p>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdsEarning;
