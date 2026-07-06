import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DollarSign, Gift, Wallet, Key, Users, ArrowLeftRight, Trophy, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";

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

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [rewardPlan, setRewardPlan] = useState<RewardPlanItem[]>([]);
  const [earnedRewards, setEarnedRewards] = useState<EarnedReward[]>([]);
  const [usdRatePkr, setUsdRatePkr] = useState(0);
  const [displayCurrency, setDisplayCurrency] = useState<"PKR" | "USD">("PKR");

  useEffect(() => {
    refreshUser().catch(() => undefined);
    api("/api/rewards/plan/").then(setRewardPlan).catch(() => setRewardPlan([]));
    api("/api/rewards/me/").then(setEarnedRewards).catch(() => setEarnedRewards([]));
    api("/api/accounts/settings/").then((settings) => setUsdRatePkr(Number(settings.usdRatePkr || 0))).catch(() => setUsdRatePkr(0));
  }, [refreshUser]);

  const formatPkr = (amount: number) => `PKR ${Number(amount || 0).toLocaleString()}`;
  const formatEarning = (amount: number) => {
    const value = Number(amount || 0);
    if (displayCurrency === "USD" && usdRatePkr > 0) {
      return `$ ${(value / usdRatePkr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return formatPkr(value);
  };

  const stats = [
    { title: "Current Income", value: formatEarning(Number(user?.currentIncome || 0)), icon: DollarSign, gradient: "from-primary to-nexo-green-light", bar: "bg-primary" },
    { title: "Reward Income", value: formatEarning(Number(user?.rewardIncome || 0)), icon: Gift, gradient: "from-secondary to-nexo-gold-light", bar: "bg-secondary" },
    { title: "Total Withdraw", value: formatEarning(Number(user?.totalWithdraw || 0)), icon: Wallet, gradient: "from-primary to-secondary", bar: "bg-sky-400" },
    { title: "Available Pins", value: String(user?.availablePins || 0), icon: Key, gradient: "from-nexo-green-light to-primary", bar: "bg-emerald-400" },
    { title: "Left Team", value: String(user?.leftTeam || 0), icon: Users, gradient: "from-primary to-nexo-green-light", bar: "bg-teal-400" },
    { title: "Right Team", value: String(user?.rightTeam || 0), icon: ArrowLeftRight, gradient: "from-secondary to-nexo-gold-light", bar: "bg-cyan-400" },
  ];

  const earnedLevels = new Set(earnedRewards.map((reward) => reward.level));
  const nextReward = rewardPlan.find((reward) => !earnedLevels.has(reward.level));
  const getRewardLabel = (reward: string, amount: number) =>
    amount > 0 ? formatEarning(amount) : reward;

  return (
    <DashboardLayout>
      <div className="relative -m-4 overflow-hidden bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.20),transparent_28%),radial-gradient(circle_at_85%_15%,hsl(var(--secondary)/0.22),transparent_26%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)/0.55))] px-4 py-5 sm:px-6 md:-m-6 lg:px-8 animate-fade-in">
        <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(circle,hsl(var(--primary)/0.35)_1px,transparent_1px),radial-gradient(circle,hsl(var(--secondary)/0.28)_1px,transparent_1px)] [background-position:0_0,22px_28px] [background-size:46px_46px,64px_64px]" />
        <div className="relative mx-auto max-w-7xl space-y-6">
          <section className="overflow-hidden rounded-2xl border border-white/60 bg-white/55 p-4 shadow-[0_20px_60px_-35px_hsl(var(--nexo-dark)/0.45)] backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Network dashboard
                </div>
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Welcome back, <span className="nexo-gradient-text">{user?.firstName || "User"}</span>
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">Here&apos;s your network overview</p>
                <div className="mt-4 inline-flex rounded-xl border border-white/60 bg-white/55 p-1 shadow-sm backdrop-blur-md">
                  {(["PKR", "USD"] as const).map((currency) => (
                    <Button
                      key={currency}
                      type="button"
                      size="sm"
                      variant={displayCurrency === currency ? "default" : "ghost"}
                      className="h-8 px-4"
                      onClick={() => setDisplayCurrency(currency)}
                      disabled={currency === "USD" && usdRatePkr <= 0}
                    >
                      {currency}
                    </Button>
                  ))}
                </div>
                {displayCurrency === "USD" && usdRatePkr > 0 ? (
                  <p className="mt-2 text-xs text-muted-foreground">Showing financial amounts at 1 USD = PKR {usdRatePkr.toLocaleString()}.</p>
                ) : null}
              </div>
              <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/60 bg-white/50 p-2 backdrop-blur-md sm:min-w-[360px]">
                <div className="rounded-lg bg-background/70 p-3 text-center">
                  <p className="text-[11px] font-semibold uppercase text-muted-foreground">Left</p>
                  <p className="font-display text-xl font-bold text-foreground">{user?.leftTeam || 0}</p>
                </div>
                <div className="rounded-lg bg-background/70 p-3 text-center">
                  <p className="text-[11px] font-semibold uppercase text-muted-foreground">Right</p>
                  <p className="font-display text-xl font-bold text-foreground">{user?.rightTeam || 0}</p>
                </div>
                <div className="rounded-lg bg-background/70 p-3 text-center">
                  <p className="text-[11px] font-semibold uppercase text-muted-foreground">Sets</p>
                  <p className="font-display text-xl font-bold text-foreground">{user?.pairCount || 0}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat, index) => (
              <Card
                key={stat.title}
                className="group overflow-hidden rounded-2xl border-white/60 bg-white/60 shadow-[0_18px_45px_-35px_hsl(var(--nexo-dark)/0.55)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/75 hover:shadow-[0_22px_55px_-35px_hsl(var(--nexo-dark)/0.7)]"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{stat.title}</p>
                      <p className="mt-2 truncate font-display text-2xl font-extrabold text-foreground" title={stat.value}>{stat.value}</p>
                    </div>
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg shadow-primary/15 transition-transform duration-300 group-hover:scale-105`}>
                      <stat.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full w-4/5 rounded-full ${stat.bar}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="overflow-hidden rounded-2xl border-white/60 bg-white/60 shadow-[0_18px_50px_-38px_hsl(var(--nexo-dark)/0.55)] backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="font-display flex items-center gap-2 text-xl">
                <TrendingUp className="h-5 w-5 text-primary" />
                Income System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                  <h3 className="font-semibold text-foreground">User Set Income</h3>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p>Income is based on completed binary sets from your total left and right teams.</p>
                    <p>A new set is counted whenever one user exists on the left side and one user exists on the right side.</p>
                    <p>Direct and indirect users both help complete these matched binary sets.</p>
                    <p>1st completed set: <span className="font-bold text-primary">PKR 400</span></p>
                    <p>Sets 2 to 99: <span className="font-bold text-primary">PKR 200</span> each</p>
                    <p>Set 100 onward: <span className="font-bold text-primary">PKR 100</span> each</p>
                  </div>
                </div>
                <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4">
                  <h3 className="font-semibold text-foreground">Progress</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-background/70 p-3">
                      <p className="text-xs text-muted-foreground">Binary left team</p>
                      <p className="font-display text-xl font-bold text-foreground">{user?.leftTeam || 0}</p>
                    </div>
                    <div className="rounded-lg bg-background/70 p-3">
                      <p className="text-xs text-muted-foreground">Binary right team</p>
                      <p className="font-display text-xl font-bold text-foreground">{user?.rightTeam || 0}</p>
                    </div>
                    <div className="rounded-lg bg-background/70 p-3">
                      <p className="text-xs text-muted-foreground">Completed matched sets</p>
                      <p className="font-display text-xl font-bold text-foreground">{user?.pairCount || 0}</p>
                    </div>
                    <div className="rounded-lg bg-background/70 p-3">
                      <p className="text-xs text-muted-foreground">Set earnings</p>
                      <p className="font-display text-xl font-bold text-primary">{formatEarning(Number(user?.systemPairIncomeTotal || 0))}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/60 bg-white/55 shadow-[0_18px_45px_-38px_hsl(var(--nexo-dark)/0.55)] backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="font-display flex items-center gap-2 text-xl">
                <ShieldCheck className="h-5 w-5 text-secondary" />
                Withdraw Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Daily clearing", "Automatic per user"],
                  ["Cap limit", "PKR 4,000"],
                  ["Normal withdraw tax", "5%"],
                  ["Cap and reward tax cut", "10%"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-border/50 bg-background/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="mt-1 font-display text-lg font-bold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-2xl border-white/60 bg-white/60 shadow-[0_18px_50px_-38px_hsl(var(--nexo-dark)/0.55)] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-xl">
                <Trophy className="h-5 w-5 text-secondary" />
                Leadership Reward Plan
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Earned rewards: <span className="font-semibold text-foreground">{earnedRewards.length}</span>
                {nextReward ? ` | Next target L ${nextReward.left} / R ${nextReward.right}` : " | All listed rewards unlocked"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-border/50 bg-background/65">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Level</TableHead>
                      <TableHead>Left Team</TableHead>
                      <TableHead>Right Team</TableHead>
                      <TableHead>Reward</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rewardPlan.map((row) => (
                      <TableRow key={row.level} className={earnedLevels.has(row.level) ? "bg-primary/5" : ""}>
                        <TableCell className="font-semibold text-primary">{row.level}</TableCell>
                        <TableCell>{row.left.toLocaleString()}</TableCell>
                        <TableCell>{row.right.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold text-secondary">
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
                    <div key={reward.id} className="rounded-xl border border-secondary/20 bg-secondary/10 p-3 text-sm">
                      <p className="font-semibold text-secondary">Level {reward.level}: {getRewardLabel(reward.reward, reward.amount)}</p>
                      <p className="text-muted-foreground">
                        Unlocked on {reward.rewardedAt}
                        {reward.amount > 0 ? " | Credited" : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
