import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockWithdrawals } from "@/lib/mock-data";
import { Wallet } from "lucide-react";

const WithdrawHistory = () => {
  const getTaxLabel = (type: string) => {
    switch (type) {
      case "normal": return { label: "5% Tax", className: "bg-primary/10 text-primary border-primary/20" };
      case "cap": return { label: "10% Cap Tax", className: "bg-secondary/10 text-secondary border-secondary/20" };
      case "reward": return { label: "10% Reward Tax", className: "bg-destructive/10 text-destructive border-destructive/20" };
      default: return { label: type, className: "" };
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Wallet className="w-6 h-6 text-primary" />
          Withdraw History
        </h1>

        <Card className="border-secondary/30 bg-secondary/5">
          <CardContent className="pt-6 space-y-2 text-sm">
            <p className="text-foreground">• Daily auto-withdrawal — no request needed</p>
            <p className="text-foreground">• Normal tax: <span className="font-bold text-primary">5%</span></p>
            <p className="text-foreground">• Cap limit & Rewards tax: <span className="font-bold text-secondary">10%</span></p>
            <p className="text-foreground">• Cap limit: <span className="font-bold text-primary">PKR 4,000</span></p>
            <p className="text-muted-foreground text-xs mt-2">اکاؤنٹ ایکٹو کرتے وقت نمبر صحیح لکھیں ورنہ لاس کی صورت میں سسٹم ذمہ دار نہیں ہوگا</p>
          </CardContent>
        </Card>

        <Card className="nexo-card-glow border-border/50">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Tax Type</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockWithdrawals.map((w) => {
                  const taxInfo = getTaxLabel(w.taxType);
                  return (
                    <TableRow key={w.id}>
                      <TableCell>{w.date}</TableCell>
                      <TableCell>PKR {w.amount.toLocaleString()}</TableCell>
                      <TableCell>PKR {w.tax.toLocaleString()}</TableCell>
                      <TableCell><Badge className={taxInfo.className}>{taxInfo.label}</Badge></TableCell>
                      <TableCell className="font-bold text-primary">PKR {w.netAmount.toLocaleString()}</TableCell>
                      <TableCell><Badge className="bg-primary/10 text-primary border-primary/20">{w.status}</Badge></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WithdrawHistory;
