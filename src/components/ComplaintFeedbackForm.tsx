import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { glassCardClass } from "@/components/PageShell";

type SubmissionRow = {
  id: number;
  message: string;
  type: "feedback" | "complaint";
  status: string;
  submittedAt: string;
};

export function ComplaintFeedbackForm({ type }: { type: "feedback" | "complaint" }) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    api("/api/complaints/me/")
      .then((data) => setRows(Array.isArray(data) ? data.filter((row: SubmissionRow) => row.type === type) : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({ title: "Error", description: "Please write your message first.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await api("/api/complaints/me/", { method: "POST", body: JSON.stringify({ message, type }) });
      toast({ title: "Submitted", description: `Your ${type} has been submitted.` });
      setMessage("");
      load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Submission failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const label = type === "feedback" ? "Feedback" : "Complaint";

  return (
    <div className="space-y-6">
      <Card className={glassCardClass}>
        <CardContent className="p-4 sm:p-5">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="text-sm font-semibold text-foreground">Your {label}</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Write your ${type} here...`}
              rows={5}
            />
            <Button type="submit" disabled={submitting} className="nexo-gradient text-primary-foreground">
              {submitting ? "Submitting..." : `Submit ${label}`}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className={glassCardClass}>
        <CardContent className="p-4 sm:p-5">
          <h3 className="font-display text-lg font-extrabold text-foreground">Your Previous {label}s</h3>
          {loading ? (
            <p className="mt-3 text-sm text-muted-foreground">Loading...</p>
          ) : rows.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No {type} submitted yet.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {rows.map((row) => (
                <div key={row.id} className="rounded-xl border border-border/50 bg-background/60 p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{row.submittedAt}</span>
                    <Badge variant="secondary" className="capitalize">{row.status}</Badge>
                  </div>
                  <p className="mt-1 text-foreground">{row.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
