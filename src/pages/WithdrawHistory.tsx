import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { api } from "@/lib/api";

const WithdrawHistory = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    api("/api/withdrawals/me/").then(setRows).catch(() => setRows([]));
  }, []);

  const getTaxLabel = (type: string) => {
    switch (type) {
      case "normal": return { label: "5% Tax", className: "bg-primary/10 text-primary border-primary/20" };
      case "cap": return { label: "10% Cap Tax", className: "bg-secondary/10 text-secondary border-secondary/20" };
      case "reward": return { label: "10% Reward Tax", className: "bg-destructive/10 text-destructive border-destructive/20" };
      default: return { label: type, className: "" };
    }
  };

  const formatPaymentMethod = (method: "easypaisa" | "jazzcash") => {
    switch (method) {
      case "easypaisa":
        return "EasyPaisa";
      case "jazzcash":
        return "JazzCash";
      default:
        return method;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Wallet className="w-6 h-6 text-primary" />
          Whitdraw History
        </h1>

        <Card className="border-secondary/30 bg-secondary/5">
          <CardContent className="pt-6 space-y-2 text-sm">
            <p className="text-foreground">• Daily auto-withdrawal — no request needed</p>
            <p className="text-foreground">• Normal tax: <span className="font-bold text-primary">5%</span></p>
            <p className="text-foreground">• Cap limit & Rewards tax: <span className="font-bold text-secondary">10%</span></p>
            <p className="text-foreground">• Cap limit: <span className="font-bold text-primary">PKR 4,000</span></p>
            <p className="text-muted-foreground text-xs mt-2">Please enter the correct account number at activation time. In case of incorrect number entry, the system will not be responsible for loss.</p>
          </CardContent>
        </Card>

        <Card className="nexo-card-glow border-border/50">
          <CardContent className="pt-6">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Request #</TableHead>
                  <TableHead className="whitespace-nowrap">Payment Method</TableHead>
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead className="whitespace-nowrap">Amount</TableHead>
                  <TableHead className="whitespace-nowrap">Tax</TableHead>
                  <TableHead className="whitespace-nowrap">Tax Type</TableHead>
                  <TableHead className="whitespace-nowrap">Net Amount</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((w) => {
                  const taxInfo = getTaxLabel(w.taxType);
                  return (
                    <TableRow key={w.id}>
                      <TableCell className="whitespace-nowrap font-mono font-semibold text-primary">{w.id.toUpperCase()}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatPaymentMethod(w.paymentMethod)}</TableCell>
                      <TableCell className="whitespace-nowrap">{w.date}</TableCell>
                      <TableCell className="whitespace-nowrap">PKR {w.amount.toLocaleString()}</TableCell>
                      <TableCell className="whitespace-nowrap">PKR {w.tax.toLocaleString()}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge className={`whitespace-nowrap ${taxInfo.className}`}>{taxInfo.label}</Badge>
                      </TableCell>
                      <TableCell className="font-bold text-primary whitespace-nowrap">PKR {w.netAmount.toLocaleString()}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge className="bg-primary/10 text-primary border-primary/20 whitespace-nowrap">{w.status}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No withdraw records found for this account.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WithdrawHistory;
