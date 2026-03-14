import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Gift, Wallet, Key, Users, ArrowLeftRight, Trophy } from "lucide-react";
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

  useEffect(() => {
    refreshUser().catch(() => undefined);
    api("/api/rewards/plan/").then(setRewardPlan).catch(() => setRewardPlan([]));
    api("/api/rewards/me/").then(setEarnedRewards).catch(() => setEarnedRewards([]));
  }, [refreshUser]);

  const stats = [
    { title: "Current Income", value: `PKR ${Number(user?.currentIncome || 0).toLocaleString()}`, icon: DollarSign, gradient: "from-primary to-nexo-green-light" },
    { title: "Reward Income", value: `PKR ${Number(user?.rewardIncome || 0).toLocaleString()}`, icon: Gift, gradient: "from-secondary to-nexo-gold-light" },
    { title: "Total Withdraw", value: `PKR ${Number(user?.totalWithdraw || 0).toLocaleString()}`, icon: Wallet, gradient: "from-primary to-secondary" },
    { title: "Available Pins", value: String(user?.availablePins || 0), icon: Key, gradient: "from-nexo-green-light to-primary" },
    { title: "Left Team", value: String(user?.leftTeam || 0), icon: Users, gradient: "from-primary to-nexo-green-light" },
    { title: "Right Team", value: String(user?.rightTeam || 0), icon: ArrowLeftRight, gradient: "from-secondary to-nexo-gold-light" },
  ];

  const earnedLevels = new Set(earnedRewards.map((reward) => reward.level));
  const nextReward = rewardPlan.find((reward) => !earnedLevels.has(reward.level));

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Welcome back, <span className="nexo-gradient-text">{user?.firstName || "User"}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Here&apos;s your network overview</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} className="nexo-card-glow overflow-hidden border-border/50 transition-transform duration-200 hover:scale-[1.02]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="mt-1 font-display text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="nexo-card-glow border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Income System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border/50 bg-muted/50 p-4">
                <h3 className="font-semibold text-foreground">Tree Pair Income</h3>
                <p className="mt-1 text-sm text-muted-foreground">1st completed left/right pair: <span className="font-bold text-primary">PKR 400</span></p>
                <p className="text-sm text-muted-foreground">Pairs 2 to 99: <span className="font-bold text-primary">PKR 200</span> each</p>
                <p className="text-sm text-muted-foreground">Pair 100 onward: <span className="font-bold text-primary">PKR 100</span> each</p>
                <p className="mt-2 text-xs text-muted-foreground">Income is generated only when both left and right sides complete a pair.</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/50 p-4">
                <h3 className="font-semibold text-foreground">Progress</h3>
                <p className="mt-2 text-sm text-muted-foreground">Completed pairs: <span className="font-bold text-foreground">{user?.pairCount || 0}</span></p>
                <p className="text-sm text-muted-foreground">Left side members: <span className="font-bold text-foreground">{user?.leftTeam || 0}</span></p>
                <p className="text-sm text-muted-foreground">Right side members: <span className="font-bold text-foreground">{user?.rightTeam || 0}</span></p>
                <p className="mt-2 text-sm text-muted-foreground">After 50,000 pairs, pair income stops and salary flow takes over.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary/30 bg-secondary/5">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Wallet className="h-5 w-5 text-secondary" />
              Withdraw Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-foreground">Daily clearing works automatically per user.</p>
            <p className="text-foreground">Cap limit: <span className="font-bold text-primary">PKR 4,000</span></p>
            <p className="text-foreground">Normal withdraw tax: <span className="font-bold text-primary">5%</span></p>
            <p className="text-foreground">Cap and reward tax cut: <span className="font-bold text-secondary">10%</span></p>
          </CardContent>
        </Card>

        <Card className="nexo-card-glow border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Trophy className="h-5 w-5 text-secondary" />
              Leadership Reward Plan
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Earned rewards: <span className="font-semibold text-foreground">{earnedRewards.length}</span>
              {nextReward ? ` | Next target L ${nextReward.left} / R ${nextReward.right}` : " | All listed rewards unlocked"}
            </p>
          </CardHeader>
          <CardContent>
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
                      {row.reward}
                      {row.amount > 0 ? ` (PKR ${row.amount.toLocaleString()})` : ""}
                      {earnedLevels.has(row.level) ? " - unlocked" : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {earnedRewards.length > 0 && (
              <div className="mt-4 space-y-2">
                {earnedRewards.map((reward) => (
                  <div key={reward.id} className="rounded-lg border border-secondary/20 bg-secondary/10 p-3 text-sm">
                    <p className="font-semibold text-secondary">Level {reward.level}: {reward.reward}</p>
                    <p className="text-muted-foreground">
                      Unlocked on {reward.rewardedAt}
                      {reward.amount > 0 ? ` | Credited PKR ${reward.amount.toLocaleString()}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
