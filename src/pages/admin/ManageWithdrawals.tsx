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
  { id: "w11", userId: "u2", userName: "Ali Raza", paymentMethod: "easypaisa", accountNumber: "03119876543", amount: 500, tax: 25, taxType: "normal", netAmount: 475, date: "2025-12-10", status: "pending" },
  { id: "w12", userId: "u3", userName: "Sara Ahmed", paymentMethod: "bank_account", accountNumber: "2010-887766-2211", amount: 300, tax: 15, taxType: "normal", netAmount: 285, date: "2025-12-10", status: "pending" },
];

const ManageWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(allWithdrawals);
  const { toast } = useToast();

  const formatPaymentMethod = (method: Withdrawal["paymentMethod"]) => {
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
            <div className="overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">User</TableHead>
                    <TableHead className="whitespace-nowrap">Payment Method</TableHead>
                    <TableHead className="whitespace-nowrap">Account Number</TableHead>
                    <TableHead className="whitespace-nowrap">Date</TableHead>
                    <TableHead className="whitespace-nowrap">Amount</TableHead>
                    <TableHead className="whitespace-nowrap">Tax</TableHead>
                    <TableHead className="whitespace-nowrap">Net</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Action</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {withdrawals.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium whitespace-nowrap">{w.userName}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatPaymentMethod(w.paymentMethod)}</TableCell>
                    <TableCell className="font-mono font-semibold text-secondary whitespace-nowrap">{w.accountNumber}</TableCell>
                    <TableCell className="whitespace-nowrap">{w.date}</TableCell>
                    <TableCell className="whitespace-nowrap">PKR {w.amount.toLocaleString()}</TableCell>
                    <TableCell className="whitespace-nowrap">PKR {w.tax.toLocaleString()}</TableCell>
                    <TableCell className="font-bold text-primary whitespace-nowrap">PKR {w.netAmount.toLocaleString()}</TableCell>
                    <TableCell className="whitespace-nowrap">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManageWithdrawals;
