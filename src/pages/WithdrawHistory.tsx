import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Wallet, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { glassCardClass, PageShell } from "@/components/PageShell";

const WithdrawHistory = () => {
  const { refreshUser } = useAuth();
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    refreshUser().catch(() => undefined);
    api("/api/withdrawals/me/").then(setRows).catch(() => setRows([]));
  }, []);

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "easypaisa":
        return "EasyPaisa";
      case "jazzcash":
        return "JazzCash";
      case "bank_account":
        return "Bank Account";
      default:
        return method;
    }
  };

  return (
    <DashboardLayout>
      <PageShell
        icon={Wallet}
        title="Withdraw History"
        description="Track automatic wallet withdrawal records and payment status."
      >
        <Card className={glassCardClass}>
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <ShieldCheck className="h-5 w-5 text-secondary" />
              Withdraw Policy
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Normal tax", "5%"],
                ["Cap limit", "PKR 4,000"],
                ["Reward tax", "10%"],
                ["Clearing", "Automatic"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/60 bg-background/70 p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
                  <p className="mt-1 font-display text-lg font-bold text-foreground">{value}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Please enter the correct account number at activation time. In case of incorrect number entry, the system will not be responsible for loss.</p>
          </CardContent>
        </Card>

        <Card className={glassCardClass}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[760px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Request #</TableHead>
                    <TableHead className="whitespace-nowrap">Payment Method</TableHead>
                    <TableHead className="whitespace-nowrap">Date</TableHead>
                    <TableHead className="whitespace-nowrap">Amount</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((w) => {
                    return (
                      <TableRow key={w.id}>
                        <TableCell className="whitespace-nowrap font-mono font-semibold text-primary">{String(w.id).toUpperCase()}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatPaymentMethod(w.paymentMethod)}
                          {w.bankName ? <span className="ml-1 text-muted-foreground">({w.bankName})</span> : null}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{w.date}</TableCell>
                        <TableCell className="whitespace-nowrap font-bold text-primary">PKR {Number(w.amount || 0).toLocaleString()}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge className={`whitespace-nowrap ${w.status === "processed" ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/10 text-secondary border-secondary/20"}`}>
                            {w.status === "processed" ? "paid" : "pending"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No withdraw records found for this account.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </PageShell>
    </DashboardLayout>
  );
};

export default WithdrawHistory;
