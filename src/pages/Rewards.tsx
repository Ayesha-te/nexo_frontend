import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, CheckCircle2, Lock } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";
import { glassCardClass, PageShell } from "@/components/PageShell";

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

const Rewards = () => {
  const [rewardPlan, setRewardPlan] = useState<RewardPlanItem[]>([]);
  const [earnedRewards, setEarnedRewards] = useState<EarnedReward[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatMoney } = useCurrency();

  useEffect(() => {
    Promise.all([api("/api/rewards/plan/"), api("/api/rewards/me/")])
      .then(([plan, earned]) => {
        setRewardPlan(Array.isArray(plan) ? plan : []);
        setEarnedRewards(Array.isArray(earned) ? earned : []);
      })
      .catch(() => {
        setRewardPlan([]);
        setEarnedRewards([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const earnedByLevel = useMemo(() => {
    const map = new Map<number, EarnedReward>();
    earnedRewards.forEach((reward) => map.set(reward.level, reward));
    return map;
  }, [earnedRewards]);

  const nextReward = rewardPlan.find((reward) => !earnedByLevel.has(reward.level));

  const getRewardLabel = (reward: string, amount: number) => (amount > 0 ? formatMoney(amount) : reward);

  return (
    <DashboardLayout>
      <PageShell
        icon={Trophy}
        title="Leadership Reward Plan"
        description="Track every milestone, see what you've unlocked, and know exactly what's next."
      >
        <Card className={glassCardClass}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Rewards Earned</p>
              <p className="font-display text-2xl font-extrabold text-foreground">{earnedRewards.length}</p>
            </div>
            {nextReward && (
              <div className="text-right">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Next Target</p>
                <p className="font-display text-lg font-extrabold text-primary">
                  {nextReward.left.toLocaleString()} / {nextReward.right.toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {loading ? (
          <Card className={glassCardClass}>
            <CardContent className="p-6 text-sm text-muted-foreground">Loading reward plan...</CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rewardPlan.map((row) => {
              const earned = earnedByLevel.get(row.level);
              const isNext = nextReward?.level === row.level;
              return (
                <Card
                  key={row.level}
                  className={cn(
                    glassCardClass,
                    "transition-all",
                    earned ? "border-emerald-300 bg-emerald-50/70" : isNext ? "border-primary/40 ring-1 ring-primary/20" : "",
                  )}
                >
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">Level {row.level}</span>
                      {earned ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Lock className="h-5 w-5 text-slate-300" />
                      )}
                    </div>
                    <p className="font-display text-lg font-extrabold text-foreground">
                      {getRewardLabel(row.reward, row.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Target: {row.left.toLocaleString()} left / {row.right.toLocaleString()} right
                    </p>
                    {earned ? (
                      <p className="text-xs font-semibold text-emerald-700">
                        Unlocked on {earned.rewardedAt}
                        {earned.amount > 0 ? " - Credited" : ""}
                      </p>
                    ) : isNext ? (
                      <p className="text-xs font-semibold text-primary">Your next milestone</p>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
            {rewardPlan.length === 0 && (
              <Card className={glassCardClass}>
                <CardContent className="p-6 text-sm text-muted-foreground">No reward plan configured yet.</CardContent>
              </Card>
            )}
          </div>
        )}
      </PageShell>
    </DashboardLayout>
  );
};

export default Rewards;
