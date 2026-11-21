import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gift, KeyRound, MessageCircle, ShoppingBag, Sparkles, TrendingUp, UsersRound, Wallet } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/useCurrency";

type RewardPlanItem = {
  level: number;
  left: number;
  right: number;
  reward: string;
  amount: number;
};

type EarnedReward = {
  id: number;
  level: number;
  reward: string;
  amount: number;
  rewardedAt: string;
};

const STAT_COLOR_CLASSES = {
  emerald: { bar: "bg-emerald-500", icon: "text-emerald-600", iconBox: "border-emerald-200 bg-emerald-50" },
  sky: { bar: "bg-sky-500", icon: "text-sky-600", iconBox: "border-sky-200 bg-sky-50" },
  violet: { bar: "bg-violet-500", icon: "text-violet-600", iconBox: "border-violet-200 bg-violet-50" },
  amber: { bar: "bg-amber-500", icon: "text-amber-600", iconBox: "border-amber-200 bg-amber-50" },
  teal: { bar: "bg-teal-500", icon: "text-teal-600", iconBox: "border-teal-200 bg-teal-50" },
  cyan: { bar: "bg-cyan-500", icon: "text-cyan-600", iconBox: "border-cyan-200 bg-cyan-50" },
} as const;

const clampPercent = (value: number, target: number) => {
  if (!value || !target || target <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / target) * 100)));
};

const getRingClass = (level: number) => {
  if (level >= 5) return "border-amber-300 shadow-[0_0_26px_rgba(245,158,11,0.45)] bg-gradient-to-br from-amber-200 via-yellow-50 to-cyan-100";
  if (level === 4) return "border-amber-400 shadow-amber-200/70 bg-amber-50";
  if (level === 3) return "border-purple-400 shadow-purple-200/70 bg-purple-50";
  if (level === 2) return "border-sky-400 shadow-sky-200/70 bg-sky-50";
  if (level === 1) return "border-emerald-400 shadow-emerald-200/70 bg-emerald-50";
  return "border-slate-200 shadow-slate-200/70 bg-slate-50";
};

const WhatsAppGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
    <path
      fill="currentColor"
      d="M16.04 4.8c-6.08 0-11.02 4.86-11.02 10.84 0 1.9.51 3.76 1.48 5.39L4.8 27.2l6.36-1.66a11.16 11.16 0 0 0 4.88 1.13c6.07 0 11.01-4.86 11.01-10.84S22.11 4.8 16.04 4.8Zm0 19.96c-1.55 0-3.06-.39-4.4-1.14l-.31-.18-3.77.98 1.01-3.6-.2-.33a8.84 8.84 0 0 1-1.43-4.85c0-4.92 4.08-8.93 9.1-8.93s9.1 4.01 9.1 8.93-4.08 9.12-9.1 9.12Zm5-6.68c-.27-.13-1.62-.79-1.87-.88-.25-.09-.43-.13-.61.13-.18.26-.7.87-.85 1.05-.16.17-.31.2-.58.07-.27-.13-1.14-.41-2.17-1.31-.8-.7-1.34-1.57-1.5-1.83-.16-.26-.02-.4.12-.53.12-.12.27-.31.41-.46.14-.16.18-.26.27-.43.09-.17.05-.33-.02-.46-.07-.13-.61-1.45-.83-1.98-.22-.51-.44-.44-.61-.45h-.52c-.18 0-.46.07-.7.33-.24.26-.92.89-.92 2.17s.94 2.52 1.07 2.69c.13.17 1.85 2.78 4.49 3.9.63.27 1.12.43 1.5.55.63.2 1.2.17 1.65.1.5-.08 1.62-.65 1.85-1.28.23-.63.23-1.16.16-1.28-.07-.12-.25-.19-.52-.32Z"
    />
  </svg>
);

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [rewardPlan, setRewardPlan] = useState<RewardPlanItem[]>([]);
  const [earnedRewards, setEarnedRewards] = useState<EarnedReward[]>([]);
  const { usdRatePkr, displayCurrency, setDisplayCurrency, formatMoney, whatsappNumber } = useCurrency();
  const [notifications, setNotifications] = useState<string[]>([]);
  const [shopLinkLoading, setShopLinkLoading] = useState(false);
  const [profileImageFailed, setProfileImageFailed] = useState(false);
  const [contactUsOpen, setContactUsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    refreshUser().catch(() => undefined);
    api("/api/rewards/plan/").then(setRewardPlan).catch(() => setRewardPlan([]));
    api("/api/rewards/me/").then(setEarnedRewards).catch(() => setEarnedRewards([]));
    api("/api/accounts/notifications/")
      .then((data) => setNotifications(Array.isArray(data.messages) ? data.messages : []))
      .catch(() => setNotifications([]));
  }, [refreshUser]);

  useEffect(() => {
    setProfileImageFailed(false);
  }, [user?.profilePic]);

  const earnedLevels = useMemo(() => new Set(earnedRewards.map((reward) => reward.level)), [earnedRewards]);
  const achievementLevel = earnedRewards.reduce((max, reward) => Math.max(max, reward.level), 0);
  const nextReward = rewardPlan.find((reward) => !earnedLevels.has(reward.level));
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email || "User";
  const avatarLetter = (user?.firstName || user?.email || "U").trim().charAt(0).toUpperCase();
  // Current Income already includes every credited amount (binary/ads/reward income alike) - it is
  // the user's live available balance. Reward Income is a separate lifetime-only counter that is
  // never decremented by withdrawals. Total Income here means "everything ever earned, whether
  // still available or already withdrawn" = current balance + what has already been paid out. It
  // must NOT add Reward Income on top of Current Income, since that would double count the reward
  // portion that's already inside Current Income.
  const totalIncome = Number(user?.currentIncome || 0) + Number(user?.totalWithdraw || 0);
  const financialTarget = Math.max(
    Number(nextReward?.amount || 0),
    Number(user?.currentIncome || 0),
    Number(user?.rewardIncome || 0),
    totalIncome,
  );
  const teamTargetLeft = Number(nextReward?.left || Math.max(Number(user?.leftTeam || 0), 1));
  const teamTargetRight = Number(nextReward?.right || Math.max(Number(user?.rightTeam || 0), 1));

  const handleShopNow = async () => {
    setShopLinkLoading(true);
    try {
      const data = await api("/api/accounts/perfume-discount-link/");
      window.location.href = data.url;
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Unable to open perfume shop", variant: "destructive" });
    } finally {
      setShopLinkLoading(false);
    }
  };

  const stats = [
    {
      title: "Current Income",
      value: formatMoney(Number(user?.currentIncome || 0)),
      rawValue: Number(user?.currentIncome || 0),
      target: financialTarget,
      icon: Wallet,
      color: "emerald" as const,
    },
    {
      title: "Reward Income",
      value: formatMoney(Number(user?.rewardIncome || 0)),
      rawValue: Number(user?.rewardIncome || 0),
      target: financialTarget,
      icon: Gift,
      color: "sky" as const,
    },
    {
      title: "Total Income",
      value: formatMoney(totalIncome),
      rawValue: totalIncome,
      target: financialTarget,
      icon: TrendingUp,
      color: "violet" as const,
    },
    {
      title: "Available Pins",
      value: String(user?.availablePins || 0),
      rawValue: Number(user?.availablePins || 0),
      target: 1000,
      icon: KeyRound,
      color: "amber" as const,
    },
    {
      title: "Left Team",
      value: String(user?.leftTeam || 0),
      rawValue: Number(user?.leftTeam || 0),
      target: teamTargetLeft,
      icon: UsersRound,
      color: "teal" as const,
    },
    {
      title: "Right Team",
      value: String(user?.rightTeam || 0),
      rawValue: Number(user?.rightTeam || 0),
      target: teamTargetRight,
      icon: UsersRound,
      color: "cyan" as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="relative -m-4 min-h-full overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.30),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(14,165,233,0.25),transparent_28%),linear-gradient(145deg,#b9e7df_0%,#b8dff0_48%,#d8edf7_100%)] px-2.5 py-2.5 sm:px-6 sm:py-4 md:-m-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(circle,rgba(16,185,129,0.40)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto max-w-7xl space-y-3 sm:space-y-5">
          <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/85 px-3 py-2 shadow-[0_14px_38px_-30px_rgba(15,23,42,0.65)]">
            <div className="flex animate-[marquee_28s_linear_infinite] whitespace-nowrap text-xs font-medium text-slate-700">
              {(notifications.length ? notifications : ["Assalam-o-Alaikum. Keep growing your Nexocart network."]).map((message, index) => (
                <span key={`${message}-${index}`} className="mr-10">{message}</span>
              ))}
            </div>
          </div>

          <section className="rounded-[16px] border border-white/80 bg-white p-2.5 shadow-[0_14px_36px_-30px_rgba(15,23,42,0.65)] sm:rounded-[18px] sm:p-3.5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[3px] p-0.5 shadow-md sm:h-16 sm:w-16", getRingClass(achievementLevel))}>
                <div className="flex h-full w-full overflow-hidden rounded-full bg-slate-100">
                  {user?.profilePic && !profileImageFailed ? (
                    <img
                      src={user.profilePic}
                      alt={fullName}
                      onError={() => setProfileImageFailed(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="m-auto font-display text-xl font-bold text-slate-700 sm:text-2xl">{avatarLetter}</span>
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1 self-center">
                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[11px]">Welcome Back</p>
                <h1 className="mt-0.5 truncate font-display text-base font-semibold leading-tight text-slate-900 sm:text-lg" title={fullName}>
                  {fullName}
                </h1>
                <p className="truncate text-[11px] text-slate-500" title={user?.email}>@{user?.email}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <div className="inline-flex max-w-full items-center rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 sm:px-2.5">
                  <span className="truncate">{achievementLevel}{"★"} Nexo Leader</span>
                </div>
                <div className="inline-flex rounded-xl border border-slate-100 bg-slate-50 p-0.5">
                  {(["PKR", "USD"] as const).map((currency) => (
                    <Button
                      key={currency}
                      type="button"
                      size="sm"
                      variant={displayCurrency === currency ? "default" : "ghost"}
                      className="h-7 rounded-lg px-2.5 text-xs sm:h-8 sm:px-3.5"
                      onClick={() => setDisplayCurrency(currency)}
                      disabled={currency === "USD" && usdRatePkr <= 0}
                    >
                      {currency}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-2 sm:gap-2.5">
            {stats.map((stat, index) => {
              const progress = clampPercent(stat.rawValue, stat.target);
              const Icon = stat.icon;
              const colors = STAT_COLOR_CLASSES[stat.color];
              return (
                <Card
                  key={stat.title}
                  className="relative w-full overflow-hidden rounded-2xl border-white bg-white shadow-[0_14px_32px_-28px_rgba(15,23,42,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-30px_rgba(15,23,42,0.85)]"
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  <div className={cn("absolute left-0 top-0 h-full w-1.5", colors.bar)} />
                  <CardContent className="space-y-2 py-2.5 pl-4 pr-3 sm:py-3 sm:pl-5 sm:pr-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[9px] font-extrabold uppercase tracking-wide text-slate-500 sm:text-[11px]">{stat.title}</p>
                        <p className="mt-0.5 truncate font-display text-lg font-extrabold text-slate-900 sm:text-xl" title={stat.value}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 sm:h-10 sm:w-10", colors.iconBox)}>
                        <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", colors.icon)} />
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className={cn("h-full rounded-full transition-all duration-500", colors.bar)} style={{ width: `${progress}%` }} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="overflow-hidden rounded-[24px] border-2 border-emerald-300 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-[0_24px_60px_-34px_rgba(13,148,136,0.95)]">
            <CardContent className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/18 ring-1 ring-white/30">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-white/80">Exclusive Nexocart Member Deal</p>
                  <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight sm:text-3xl">Buy perfumes with 10% extra off</h2>
                  <p className="mt-2 max-w-2xl text-sm font-medium text-white/90">
                    Click Shop Now, choose your perfume, and the extra 10% discount will be applied at checkout. For account safety, this offer is locked to the first device you use.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                size="lg"
                onClick={handleShopNow}
                disabled={shopLinkLoading}
                className="h-12 rounded-2xl bg-white px-6 font-extrabold text-emerald-700 shadow-lg hover:bg-emerald-50"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {shopLinkLoading ? "Opening..." : "Shop Now"}
              </Button>
            </CardContent>
          </Card>

          <button
            type="button"
            onClick={() => setContactUsOpen(true)}
            className="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.75)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-30px_rgba(15,23,42,0.85)]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#10c98b] text-white">
              <MessageCircle className="h-4 w-4" />
            </span>
            Contact Us
          </button>
        </div>
      </div>

      <Dialog open={contactUsOpen} onOpenChange={setContactUsOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold text-slate-900">Contact Us</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-slate-700">
            <p className="font-bold text-slate-900">Helpline Number: +{whatsappNumber} (WhatsApp)</p>
            <p dir="rtl" className="text-right leading-relaxed">
              السلام علیکم!
              <br />
              <br />
              کسی بھی قسم کی معلومات یا ٹیکنیکل مسائل کے حل کے لیے آپ اس نمبر پر ہم سے رابطہ کر سکتے ہیں۔ ہماری ٹیم آپ
              کی رہنمائی کے لیے دستیاب ہے اور آپ کو ایک گھنٹے کے اندر جواب فراہم کرے گی۔
              <br />
              <br />
              شکریہ!
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#10c98b] text-sm font-bold text-white shadow-[0_14px_30px_-18px_rgba(16,201,139,0.9)] transition-all hover:bg-[#0fbd82]"
            >
              <WhatsAppGlyph className="h-5 w-5" />
              Open WhatsApp
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Dashboard;
