import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Gift,
  KeyRound,
  Network,
  ShieldCheck,
  Trophy,
  UsersRound,
  Wallet,
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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

type HistoryPoint = {
  label: string;
  amount: number;
};

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

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [rewardPlan, setRewardPlan] = useState<RewardPlanItem[]>([]);
  const [earnedRewards, setEarnedRewards] = useState<EarnedReward[]>([]);
  const [usdRatePkr, setUsdRatePkr] = useState(0);
  const [displayCurrency, setDisplayCurrency] = useState<"PKR" | "USD">("PKR");
  const [notifications, setNotifications] = useState<string[]>([]);
  const [monthlyHistory, setMonthlyHistory] = useState<HistoryPoint[]>([]);
  const [weeklyIncome, setWeeklyIncome] = useState(0);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    refreshUser().catch(() => undefined);
    api("/api/rewards/plan/").then(setRewardPlan).catch(() => setRewardPlan([]));
    api("/api/rewards/me/").then(setEarnedRewards).catch(() => setEarnedRewards([]));
    api("/api/accounts/settings/")
      .then((settings) => setUsdRatePkr(Number(settings.usdRatePkr || 0)))
      .catch(() => setUsdRatePkr(0));
    api("/api/accounts/notifications/")
      .then((data) => setNotifications(Array.isArray(data.messages) ? data.messages : []))
      .catch(() => setNotifications([]));
    api("/api/accounts/income-history/")
      .then((data) => {
        setMonthlyHistory(Array.isArray(data.monthlyHistory) ? data.monthlyHistory : []);
        setWeeklyIncome(Number(data.weeklyIncome || 0));
      })
      .catch(() => {
        setMonthlyHistory([]);
        setWeeklyIncome(0);
      });
  }, [refreshUser]);

  const earnedLevels = useMemo(() => new Set(earnedRewards.map((reward) => reward.level)), [earnedRewards]);
  const achievementLevel = earnedRewards.reduce((max, reward) => Math.max(max, reward.level), 0);
  const nextReward = rewardPlan.find((reward) => !earnedLevels.has(reward.level));
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email || "User";
  const avatarLetter = (user?.firstName || user?.email || "U").trim().charAt(0).toUpperCase();
  const totalIncome = Number(user?.currentIncome || 0) + Number(user?.rewardIncome || 0);
  const financialTarget = Math.max(
    Number(nextReward?.amount || 0),
    Number(user?.currentIncome || 0),
    Number(user?.rewardIncome || 0),
    totalIncome,
  );
  const teamTargetLeft = Number(nextReward?.left || Math.max(Number(user?.leftTeam || 0), 1));
  const teamTargetRight = Number(nextReward?.right || Math.max(Number(user?.rightTeam || 0), 1));

  const formatMoney = (amount: number) => {
    const value = Number(amount || 0);
    if (displayCurrency === "USD" && usdRatePkr > 0) {
      return `$${(value / usdRatePkr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `Rs. ${value.toLocaleString()}`;
  };

  const getRewardLabel = (reward: string, amount: number) => (amount > 0 ? formatMoney(amount) : reward);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackMessage) {
      toast({ title: "Error", description: "Please fill your name and message", variant: "destructive" });
      return;
    }
    try {
      await api("/api/complaints/me/", {
        method: "POST",
        body: JSON.stringify({ message: feedbackMessage, type: "feedback" }),
      });
      toast({ title: "Submitted", description: "Your feedback/complaint has been submitted." });
      setFeedbackName("");
      setFeedbackMessage("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Submission failed", variant: "destructive" });
    }
  };

  const stats = [
    {
      title: "Current Income",
      value: formatMoney(Number(user?.currentIncome || 0)),
      rawValue: Number(user?.currentIncome || 0),
      target: financialTarget,
      icon: Wallet,
      bar: "bg-emerald-500",
      tint: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Reward Income",
      value: formatMoney(Number(user?.rewardIncome || 0)),
      rawValue: Number(user?.rewardIncome || 0),
      target: financialTarget,
      icon: Gift,
      bar: "bg-sky-500",
      tint: "text-sky-600 bg-sky-50",
    },
    {
      title: "Weekly Income",
      value: formatMoney(weeklyIncome),
      rawValue: weeklyIncome,
      target: financialTarget,
      icon: Wallet,
      bar: "bg-violet-500",
      tint: "text-violet-600 bg-violet-50",
    },
    {
      title: "Available Pins",
      value: String(user?.availablePins || 0),
      rawValue: Number(user?.availablePins || 0),
      target: 1000,
      icon: KeyRound,
      bar: "bg-amber-500",
      tint: "text-amber-600 bg-amber-50",
    },
    {
      title: "Left Team",
      value: String(user?.leftTeam || 0),
      rawValue: Number(user?.leftTeam || 0),
      target: teamTargetLeft,
      icon: UsersRound,
      bar: "bg-teal-500",
      tint: "text-teal-600 bg-teal-50",
    },
    {
      title: "Right Team",
      value: String(user?.rightTeam || 0),
      rawValue: Number(user?.rightTeam || 0),
      target: teamTargetRight,
      icon: UsersRound,
      bar: "bg-cyan-500",
      tint: "text-cyan-600 bg-cyan-50",
    },
  ];

  const graphValues = monthlyHistory.length ? monthlyHistory.map((row) => Number(row.amount || 0)) : [
    Number(user?.currentIncome || 0),
    Number(user?.rewardIncome || 0),
    totalIncome,
    weeklyIncome,
  ];
  const graphMax = Math.max(...graphValues, 0);
  const graphPoints =
    graphMax > 0
      ? graphValues
          .map((value, index) => {
            const x = 10 + index * (90 / Math.max(graphValues.length - 1, 1));
            const y = 58 - (value / graphMax) * 44;
            return `${x},${y}`;
          })
          .join(" ")
      : "10,58 40,58 70,58 100,58";

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

          <section className="rounded-[22px] border border-white/80 bg-white p-3 shadow-[0_20px_60px_-38px_rgba(15,23,42,0.65)] sm:rounded-[24px] sm:p-5">
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4">
              <div className={cn("flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 p-1 shadow-lg sm:h-24 sm:w-24", getRingClass(achievementLevel))}>
                <div className="flex h-full w-full overflow-hidden rounded-full bg-slate-100">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <span className="m-auto font-display text-3xl font-bold text-slate-700 sm:text-3xl">{avatarLetter}</span>
                  )}
                </div>
              </div>
              <div className="min-w-0 self-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">Welcome Back</p>
                <h1 className="mt-0.5 truncate font-display text-[1.65rem] font-semibold leading-tight text-slate-900 sm:mt-1 sm:text-3xl" title={fullName}>
                  {fullName}
                </h1>
                <div className="mt-1.5 inline-flex max-w-full items-center rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 sm:mt-2 sm:px-3 sm:py-1">
                  <span className="truncate">{achievementLevel}{"\u2605"} Nexo Leader</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 sm:mt-4 sm:gap-3">
              <div className="inline-flex rounded-2xl border border-slate-100 bg-slate-50 p-1">
                {(["PKR", "USD"] as const).map((currency) => (
                  <Button
                    key={currency}
                    type="button"
                    size="sm"
                    variant={displayCurrency === currency ? "default" : "ghost"}
                    className="h-8 rounded-xl px-4 sm:h-9 sm:px-5"
                    onClick={() => setDisplayCurrency(currency)}
                    disabled={currency === "USD" && usdRatePkr <= 0}
                  >
                    {currency}
                  </Button>
                ))}
              </div>
              <div className="text-right text-xs font-medium text-slate-500">
                <p>Total Withdraw</p>
                <p className="font-display text-sm font-extrabold text-slate-900 sm:text-base">{formatMoney(Number(user?.totalWithdraw || 0))}</p>
              </div>
            </div>
            {displayCurrency === "USD" && usdRatePkr > 0 ? (
              <p className="mt-2 text-xs text-slate-500">Showing financial amounts at 1 USD = PKR {usdRatePkr.toLocaleString()}.</p>
            ) : null}
          </section>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
            {stats.map((stat, index) => {
              const progress = clampPercent(stat.rawValue, stat.target);
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.title}
                  className="overflow-hidden rounded-[20px] border-white bg-white shadow-[0_18px_42px_-35px_rgba(15,23,42,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_52px_-36px_rgba(15,23,42,0.85)] sm:rounded-[22px]"
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  <CardContent className="p-3 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 sm:text-xs">{stat.title}</p>
                        <p className="mt-1.5 truncate font-display text-xl font-extrabold text-slate-900 sm:mt-2 sm:text-2xl" title={stat.value}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl sm:h-11 sm:w-11", stat.tint)}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 sm:mt-4 sm:h-2">
                      <div className={cn("h-full rounded-full transition-all duration-500", stat.bar)} style={{ width: `${progress}%` }} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="rounded-[24px] border-white bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.75)]">
            <CardContent className="grid gap-4 p-4 sm:grid-cols-[1fr_180px] sm:p-5">
              <div>
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-lg font-extrabold text-slate-900">Income Analytics</h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {graphMax > 0 ? "Recent earning report from past months to now." : "No income activity yet."}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase text-slate-500">This Week</p>
                    <p className="font-display text-lg font-extrabold text-slate-900">{formatMoney(weeklyIncome)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Left</p>
                    <p className="font-display text-lg font-extrabold text-slate-900">{user?.leftTeam || 0}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Right</p>
                    <p className="font-display text-lg font-extrabold text-slate-900">{user?.rightTeam || 0}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <svg viewBox="0 0 110 68" role="img" aria-label="Income analytics graph" className="h-28 w-full">
                  <path d="M10 58 H100" fill="none" stroke="rgba(100,116,139,0.22)" strokeWidth="1" />
                  <path d="M10 44 H100 M10 30 H100 M10 16 H100" fill="none" stroke="rgba(100,116,139,0.14)" strokeWidth="1" />
                  <polyline points={graphPoints} fill="none" stroke={graphMax > 0 ? "rgb(16,185,129)" : "rgb(148,163,184)"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  {graphPoints.split(" ").map((point) => {
                    const [cx, cy] = point.split(",");
                    return <circle key={point} cx={cx} cy={cy} r="3" fill={graphMax > 0 ? "rgb(16,185,129)" : "rgb(148,163,184)"} />;
                  })}
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[24px] border-white bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.75)]">
            <CardHeader className="pb-3">
              <CardTitle className="font-display flex items-center gap-2 text-lg text-slate-900 sm:text-xl">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Income System
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-slate-600 lg:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900">User Set Income</h3>
                <p className="mt-2">Income is based on completed binary sets from your total left and right teams.</p>
                <p className="mt-2">1st completed set: <span className="font-bold text-primary">Rs. 400</span></p>
                <p>Sets 2 to 99: <span className="font-bold text-primary">Rs. 200</span> each</p>
                <p>Set 100 onward: <span className="font-bold text-primary">Rs. 100</span> each</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild className="rounded-2xl">
                    <Link to="/my-tree">Open My Tree</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-2xl">
                    <Link to="/networking-posters">Networking / Given Poster</Link>
                  </Button>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900">Withdraw Policy</h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    ["Daily clearing", "Automatic"],
                    ["Cap limit", "Rs. 4,000"],
                    ["Normal tax", "5%"],
                    ["Cap/reward tax", "10%"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-white p-3">
                      <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
                      <p className="mt-1 font-display text-base font-extrabold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[24px] border-white bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.75)]">
            <CardHeader className="pb-3">
              <CardTitle className="font-display flex items-center gap-2 text-lg text-slate-900 sm:text-xl">
                <Trophy className="h-5 w-5 text-amber-500" />
                Leadership Reward Plan
              </CardTitle>
              <p className="text-sm text-slate-500">
                Earned: <span className="font-bold text-slate-900">{earnedRewards.length}</span>
                {nextReward ? ` | Next target ${nextReward.left} / ${nextReward.right}` : " | All listed rewards unlocked"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 px-3">Level</TableHead>
                      <TableHead className="px-3">Left / Right</TableHead>
                      <TableHead className="px-3">Reward</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rewardPlan.map((row) => (
                      <TableRow key={row.level} className={earnedLevels.has(row.level) ? "bg-emerald-50/70" : ""}>
                        <TableCell className="px-3 font-bold text-primary">{row.level}</TableCell>
                        <TableCell className="px-3 font-semibold text-slate-700">{row.left.toLocaleString()} / {row.right.toLocaleString()}</TableCell>
                        <TableCell className="px-3 font-semibold text-slate-900">
                          {getRewardLabel(row.reward, row.amount)}
                          {earnedLevels.has(row.level) ? " - unlocked" : ""}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {earnedRewards.length > 0 && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {earnedRewards.map((reward) => (
                    <div key={reward.id} className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm">
                      <p className="font-bold text-emerald-700">Level {reward.level}: {getRewardLabel(reward.reward, reward.amount)}</p>
                      <p className="text-slate-500">
                        Unlocked on {reward.rewardedAt}
                        {reward.amount > 0 ? " | Credited" : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[24px] border-white bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.75)]">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#10c98b] text-white shadow-[0_14px_30px_-18px_rgba(16,201,139,0.9)]">
                  <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7">
                    <path
                      fill="currentColor"
                      d="M16.04 4.8c-6.08 0-11.02 4.86-11.02 10.84 0 1.9.51 3.76 1.48 5.39L4.8 27.2l6.36-1.66a11.16 11.16 0 0 0 4.88 1.13c6.07 0 11.01-4.86 11.01-10.84S22.11 4.8 16.04 4.8Zm0 19.96c-1.55 0-3.06-.39-4.4-1.14l-.31-.18-3.77.98 1.01-3.6-.2-.33a8.84 8.84 0 0 1-1.43-4.85c0-4.92 4.08-8.93 9.1-8.93s9.1 4.01 9.1 8.93-4.08 9.12-9.1 9.12Zm5-6.68c-.27-.13-1.62-.79-1.87-.88-.25-.09-.43-.13-.61.13-.18.26-.7.87-.85 1.05-.16.17-.31.2-.58.07-.27-.13-1.14-.41-2.17-1.31-.8-.7-1.34-1.57-1.5-1.83-.16-.26-.02-.4.12-.53.12-.12.27-.31.41-.46.14-.16.18-.26.27-.43.09-.17.05-.33-.02-.46-.07-.13-.61-1.45-.83-1.98-.22-.51-.44-.44-.61-.45h-.52c-.18 0-.46.07-.7.33-.24.26-.92.89-.92 2.17s.94 2.52 1.07 2.69c.13.17 1.85 2.78 4.49 3.9.63.27 1.12.43 1.5.55.63.2 1.2.17 1.65.1.5-.08 1.62-.65 1.85-1.28.23-.63.23-1.16.16-1.28-.07-.12-.25-.19-.52-.32Z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-lg font-extrabold text-slate-900">Contact Us</h3>
                  <p className="text-sm text-slate-500">Need help? Message us on WhatsApp.</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">+92 344 8252109</p>
                </div>
              </div>
              <a
                href="https://wa.me/923448252109"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#10c98b] px-5 text-sm font-bold text-white shadow-[0_14px_30px_-18px_rgba(16,201,139,0.9)] transition-all hover:-translate-y-0.5 hover:bg-[#0fbd82]"
              >
                Open WhatsApp
              </a>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[24px] border-white bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.75)]">
            <CardContent className="p-4 sm:p-5">
              <h3 className="font-display text-lg font-extrabold text-slate-900">Feedback & Complaints</h3>
              <form className="mt-3 space-y-3" onSubmit={handleFeedbackSubmit}>
                <div className="space-y-1">
                  <Label>Your Name</Label>
                  <Input value={feedbackName} onChange={(e) => setFeedbackName(e.target.value)} placeholder="Enter your name" />
                </div>
                <div className="space-y-1">
                  <Label>Message</Label>
                  <Textarea
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Write your feedback or complaint"
                    rows={4}
                  />
                </div>
                <Button type="submit" className="nexo-gradient text-primary-foreground">Submit</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
