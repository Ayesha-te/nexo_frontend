import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { findTreeNodeById, mockTree, mockWithdrawals, TreeNode } from "@/lib/mock-data";
import { useLocation } from "react-router-dom";
import { Wallet } from "lucide-react";

const WithdrawHistory = () => {
  const location = useLocation();
  const selectedUserId = location.state?.selectedUserId as string | undefined;
  const selectedUserName = location.state?.selectedUserName as string | undefined;
  const selectedUserEmail = location.state?.selectedUserEmail as string | undefined;
  const selectedNode = selectedUserId ? findTreeNodeById(mockTree, selectedUserId) : null;
  const rows = selectedUserId ? mockWithdrawals.filter((w) => w.userId === selectedUserId) : mockWithdrawals;

  const MiniTreeNode = ({ node }: { node: TreeNode }) => (
    <div className="ml-3 mt-2 border-l border-border pl-3">
      <p className="text-sm font-medium text-foreground">{node.name}</p>
      <p className="text-xs text-muted-foreground">{node.email}</p>
      {node.children.left && <MiniTreeNode node={node.children.left} />}
      {node.children.right && <MiniTreeNode node={node.children.right} />}
    </div>
  );

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

        {selectedUserId && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg font-display">Selected Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="font-semibold">Name:</span> {selectedUserName}</p>
              <p><span className="font-semibold">Email:</span> {selectedUserEmail}</p>
              {selectedNode && (
                <div className="pt-2">
                  <p className="font-semibold text-foreground">Selected Account Tree Snapshot</p>
                  <MiniTreeNode node={selectedNode} />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="nexo-card-glow border-border/50">
          <CardContent className="pt-6">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow>
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
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
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
