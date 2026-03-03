import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockPinRequests, PinRequest } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Check, X } from "lucide-react";

const ManagePinRequests = () => {
  const [requests, setRequests] = useState<PinRequest[]>([...mockPinRequests]);
  const { toast } = useToast();

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    toast({ title: `Request ${action}!`, description: `Pin request has been ${action}.` });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return "bg-secondary/10 text-secondary border-secondary/20";
      case "approved": return "bg-primary/10 text-primary border-primary/20";
      case "rejected": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Ticket className="w-6 h-6 text-primary" />
          Manage Pin Requests
        </h1>

        <Card className="nexo-card-glow border-border/50">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Account #</TableHead>
                  <TableHead>TRX ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.userName}</TableCell>
                    <TableCell>{req.accountNumber}</TableCell>
                    <TableCell className="font-mono text-sm">{req.trxId}</TableCell>
                    <TableCell>PKR {req.amount.toLocaleString()}</TableCell>
                    <TableCell>{req.requestedAt}</TableCell>
                    <TableCell><Badge className={getStatusBadge(req.status)}>{req.status}</Badge></TableCell>
                    <TableCell>
                      {req.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-primary border-primary/30 hover:bg-primary/10" onClick={() => handleAction(req.id, "approved")}>
                            <Check className="w-3 h-3 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleAction(req.id, "rejected")}>
                            <X className="w-3 h-3 mr-1" /> Reject
                          </Button>
                        </div>
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

export default ManagePinRequests;
