import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockWithdrawals, mockAllUsers, Withdrawal } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Check } from "lucide-react";

const allWithdrawals: Withdrawal[] = [
  ...mockWithdrawals,
  { id: "w6", userId: "u2", userName: "Ali Raza", amount: 500, tax: 25, taxType: "normal", netAmount: 475, date: "2025-12-10", status: "pending" },
  { id: "w7", userId: "u3", userName: "Sara Ahmed", amount: 300, tax: 15, taxType: "normal", netAmount: 285, date: "2025-12-10", status: "pending" },
];

const ManageWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(allWithdrawals);
  const { toast } = useToast();

  const processWithdrawal = (id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: "processed" as const } : w));
    toast({ title: "Withdrawal Processed", description: "Payment has been marked as processed." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Wallet className="w-6 h-6 text-primary" />
          Manage Withdrawals
        </h1>

        <Card className="nexo-card-glow border-border/50">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Net</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium">{w.userName}</TableCell>
                    <TableCell>{w.date}</TableCell>
                    <TableCell>PKR {w.amount.toLocaleString()}</TableCell>
                    <TableCell>PKR {w.tax.toLocaleString()}</TableCell>
                    <TableCell className="font-bold text-primary">PKR {w.netAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={w.status === "processed" ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/10 text-secondary border-secondary/20"}>
                        {w.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {w.status === "pending" && (
                        <Button size="sm" variant="outline" className="text-primary" onClick={() => processWithdrawal(w.id)}>
                          <Check className="w-3 h-3 mr-1" /> Process
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManageWithdrawals;
