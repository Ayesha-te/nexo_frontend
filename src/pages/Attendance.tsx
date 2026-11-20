import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarCheck, Flame } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { glassCardClass, PageShell } from "@/components/PageShell";

type AttendanceRecord = { date: string };

const Attendance = () => {
  const [presentDays, setPresentDays] = useState(0);
  const [streak, setStreak] = useState(0);
  const [markedToday, setMarkedToday] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    api("/api/attendance/me/history/")
      .then((data) => {
        const rows: AttendanceRecord[] = Array.isArray(data.records) ? data.records : [];
        const today = new Date().toISOString().slice(0, 10);
        setRecords(rows);
        setMarkedToday(rows.some((record) => record.date === today));
        setPresentDays(Number(data.summary?.presentDays || 0));
        setStreak(Number(data.currentStreak || 0));
      })
      .catch(() => {
        setRecords([]);
        setPresentDays(0);
        setStreak(0);
        setMarkedToday(false);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleMark = async () => {
    setMarking(true);
    try {
      await api("/api/attendance/me/mark/", { method: "POST" });
      toast({ title: "Attendance Marked", description: "Your attendance for today has been recorded." });
      load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Unable to mark attendance", variant: "destructive" });
    } finally {
      setMarking(false);
    }
  };

  return (
    <DashboardLayout>
      <PageShell icon={CalendarCheck} title="Daily Attendance" description="Mark your attendance once every day and build your streak.">
        <Card className={glassCardClass}>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${markedToday ? "bg-emerald-100 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                {markedToday ? <CalendarCheck className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
              </div>
              <div>
                <p className="font-display text-lg font-extrabold text-foreground">
                  {markedToday ? "Marked Today" : "Not Marked Yet"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {markedToday ? "Great job! Come back tomorrow." : "Tap the button to mark today's attendance."}
                </p>
              </div>
            </div>
            <Button type="button" size="lg" disabled={markedToday || marking} onClick={handleMark} className="rounded-2xl">
              {marking ? "Marking..." : markedToday ? "Already Marked" : "Mark Attendance"}
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className={glassCardClass}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Total Present Days</p>
                <p className="font-display text-xl font-extrabold text-foreground">{presentDays}</p>
              </div>
            </CardContent>
          </Card>
          <Card className={glassCardClass}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Current Streak</p>
                <p className="font-display text-xl font-extrabold text-foreground">{streak} day{streak === 1 ? "" : "s"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className={glassCardClass}>
          <CardContent className="p-5">
            <h3 className="font-display text-lg font-extrabold text-foreground">Recent Attendance</h3>
            {loading ? (
              <p className="mt-3 text-sm text-muted-foreground">Loading attendance history...</p>
            ) : records.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No attendance marked yet.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {records.slice(0, 30).map((record) => (
                  <span key={record.date} className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {record.date}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PageShell>
    </DashboardLayout>
  );
};

export default Attendance;
