import { useEffect, useState } from "react";
import { Crown, Medal, Trophy } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type Leader = {
  userId: number;
  userName: string;
  profilePic: string;
  currentIncome: number;
  weeklyIncome: number;
  monthlyIncome: number;
  totalIncome: number;
};

const rankStyles = [
  {
    label: "Top Leader",
    icon: Crown,
    ring: "border-amber-300 bg-amber-50 text-amber-600 shadow-amber-200/70",
    badge: "bg-amber-500 text-white",
  },
  {
    label: "2nd Leader",
    icon: Trophy,
    ring: "border-sky-300 bg-sky-50 text-sky-600 shadow-sky-200/70",
    badge: "bg-sky-500 text-white",
  },
  {
    label: "3rd Leader",
    icon: Medal,
    ring: "border-violet-300 bg-violet-50 text-violet-600 shadow-violet-200/70",
    badge: "bg-violet-500 text-white",
  },
];

const formatPkr = (value: number) => `Rs. ${Number(value || 0).toLocaleString()}`;

const LeaderBoard = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/api/accounts/leaderboard/")
      .then(setLeaders)
      .catch(() => setLeaders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="relative -m-4 min-h-full overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(56,189,248,0.22),transparent_28%),linear-gradient(145deg,#caeee8_0%,#c7e5f3_48%,#e2f1f8_100%)] px-3 py-4 sm:px-6 md:-m-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle,rgba(16,185,129,0.40)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto max-w-5xl space-y-4">
          <section className="rounded-[24px] border border-white/80 bg-white p-4 shadow-[0_20px_60px_-38px_rgba(15,23,42,0.65)] sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Top 3 earning leaders</p>
                <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Leader Board</h1>
              </div>
            </div>
          </section>

          {loading ? (
            <Card className="rounded-[24px] border-white bg-white">
              <CardContent className="p-5 text-sm text-slate-500">Loading leaders...</CardContent>
            </Card>
          ) : leaders.length === 0 ? (
            <Card className="rounded-[24px] border-white bg-white">
              <CardContent className="p-5 text-sm text-slate-500">No leaders above PKR 100 income yet.</CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {leaders.map((leader, index) => {
                const style = rankStyles[index] || rankStyles[2];
                const RankIcon = style.icon;
                const avatarLetter = (leader.userName || "U").trim().charAt(0).toUpperCase();

                return (
                  <Card key={leader.userId} className="overflow-hidden rounded-[24px] border-white bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.75)]">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 p-1 shadow-lg", style.ring)}>
                          <div className="flex h-full w-full overflow-hidden rounded-full bg-white">
                            {leader.profilePic ? (
                              <img src={leader.profilePic} alt={leader.userName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="m-auto font-display text-2xl font-semibold">{avatarLetter}</span>
                            )}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", style.badge)}>
                              <RankIcon className="h-3.5 w-3.5" />
                              #{index + 1}
                            </span>
                            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{style.label}</span>
                          </div>
                          <h2 className="mt-1 truncate font-display text-xl font-semibold text-slate-900">{leader.userName || "User"}</h2>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
                        {[
                          ["Current Income", leader.currentIncome],
                          ["Weekly Income", leader.weeklyIncome],
                          ["Monthly Income", leader.monthlyIncome],
                          ["Total Income", leader.totalIncome],
                        ].map(([label, amount]) => (
                          <div key={label} className="rounded-2xl bg-slate-50 p-3">
                            <p className="text-[10px] font-medium uppercase text-slate-500">{label}</p>
                            <p className="mt-1 font-display text-base font-semibold text-slate-900">{formatPkr(Number(amount))}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeaderBoard;
