import { useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarDays, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

type HistoryPoint = {
  label: string;
  amount: number;
};

type IncomeHistory = {
  currentIncome: number;
  currentMonthIncome: number;
  lastMonthIncome: number;
  last3MonthsIncome: number;
  weeklyIncome: number;
  totalIncome: number;
  monthlyHistory: HistoryPoint[];
  weeklyHistory: HistoryPoint[];
};

const emptyHistory: IncomeHistory = {
  currentIncome: 0,
  currentMonthIncome: 0,
  lastMonthIncome: 0,
  last3MonthsIncome: 0,
  weeklyIncome: 0,
  totalIncome: 0,
  monthlyHistory: [],
  weeklyHistory: [],
};

const formatPkr = (value: number) => `Rs. ${Number(value || 0).toLocaleString()}`;

const IncomeBars = ({ title, rows }: { title: string; rows: HistoryPoint[] }) => {
  const max = Math.max(...rows.map((row) => Number(row.amount || 0)), 0);

  return (
    <Card className="rounded-[24px] border-white bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.75)]">
      <CardContent className="p-4 sm:p-5">
        <h2 className="font-display text-lg font-semibold text-slate-900">{title}</h2>
        <div className="mt-4 space-y-3">
          {rows.map((row) => {
            const width = max > 0 ? Math.max(4, Math.round((row.amount / max) * 100)) : 0;
            return (
              <div key={row.label}>
                <div className="mb-1 flex items-center justify-between gap-3 text-xs font-medium text-slate-500">
                  <span>{row.label}</span>
                  <span className="text-slate-900">{formatPkr(row.amount)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
          {rows.length === 0 && <p className="text-sm text-slate-500">No income records yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
};

const IncomeRecords = () => {
  const [history, setHistory] = useState<IncomeHistory>(emptyHistory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/api/accounts/income-history/")
      .then(setHistory)
      .catch(() => setHistory(emptyHistory))
      .finally(() => setLoading(false));
  }, []);

  const progressPoints = useMemo(() => {
    const rows = history.monthlyHistory.length ? history.monthlyHistory : history.weeklyHistory;
    const max = Math.max(...rows.map((row) => row.amount), 0);
    if (!rows.length || max <= 0) return "5,58 30,58 55,58 80,58 105,58";
    return rows
      .map((row, index) => {
        const x = 5 + index * (100 / Math.max(rows.length - 1, 1));
        const y = 58 - (row.amount / max) * 48;
        return `${x},${y}`;
      })
      .join(" ");
  }, [history.monthlyHistory, history.weeklyHistory]);

  return (
    <DashboardLayout>
      <div className="relative -m-4 min-h-full overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(56,189,248,0.22),transparent_28%),linear-gradient(145deg,#caeee8_0%,#c7e5f3_48%,#e2f1f8_100%)] px-3 py-4 sm:px-6 md:-m-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle,rgba(16,185,129,0.40)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto max-w-6xl space-y-4">
          <section className="rounded-[24px] border border-white/80 bg-white p-4 shadow-[0_20px_60px_-38px_rgba(15,23,42,0.65)] sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Monthly & weekly history</p>
                <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Income Records</h1>
              </div>
            </div>
          </section>

          {loading ? (
            <Card className="rounded-[24px] border-white bg-white">
              <CardContent className="p-5 text-sm text-slate-500">Loading income records...</CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  ["Current Month", history.currentMonthIncome],
                  ["Weekly Income", history.weeklyIncome],
                  ["Last Month", history.lastMonthIncome],
                  ["Last 3 Months", history.last3MonthsIncome],
                ].map(([label, value]) => (
                  <Card key={label} className="rounded-[22px] border-white bg-white shadow-[0_18px_42px_-35px_rgba(15,23,42,0.75)]">
                    <CardContent className="p-4">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
                      <p className="mt-2 font-display text-xl font-semibold text-slate-900">{formatPkr(Number(value))}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="rounded-[24px] border-white bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.75)]">
                <CardContent className="grid gap-4 p-4 sm:grid-cols-[1fr_220px] sm:p-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h2 className="font-display text-lg font-semibold text-slate-900">Overall Income Progress</h2>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">Total recorded income: {formatPkr(history.totalIncome)}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <svg viewBox="0 0 110 68" role="img" aria-label="Overall income progress" className="h-28 w-full">
                      <path d="M5 58 H105" fill="none" stroke="rgba(100,116,139,0.22)" strokeWidth="1" />
                      <path d="M5 44 H105 M5 30 H105 M5 16 H105" fill="none" stroke="rgba(100,116,139,0.14)" strokeWidth="1" />
                      <polyline points={progressPoints} fill="none" stroke="rgb(16,185,129)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 lg:grid-cols-2">
                <IncomeBars title="Monthly Income History" rows={history.monthlyHistory} />
                <IncomeBars title="Weekly Income History" rows={history.weeklyHistory} />
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IncomeRecords;
