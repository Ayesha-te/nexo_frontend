import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Phone, CreditCard, Hash } from "lucide-react";
import { api } from "@/lib/api";

type PinRequestRow = {
  id: number;
  accountNumber: string;
  trxId: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  processedAt: string | null;
  quantity: number;
  generatedPins: string[];
};

const PIN_COST = 1000;

const PinRequest = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [requests, setRequests] = useState<PinRequestRow[]>([]);
  const { toast } = useToast();

  const totalAmount = Number(quantity) * PIN_COST;

  const loadRequests = async () => {
    const data = await api("/api/pins/requests/");
    setRequests(data);
  };

  useEffect(() => {
    loadRequests().catch(() => setRequests([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !trxId || !quantity) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    try {
      await api("/api/pins/requests/", {
        method: "POST",
        body: JSON.stringify({
          account_number: accountNumber,
          trx_id: trxId,
          quantity: Number(quantity),
          amount: totalAmount,
          description: "Pin purchase request awaiting admin verification.",
        }),
      });
      await loadRequests();
      toast({ title: "Request Submitted", description: `Your request for ${quantity} pin(s) is now pending admin review.` });
      setAccountNumber("");
      setTrxId("");
      setQuantity("1");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to submit request", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: PinRequestRow["status"]) => {
    if (status === "approved") return "bg-primary/10 text-primary border-primary/20";
    if (status === "rejected") return "bg-destructive/10 text-destructive border-destructive/20";
    return "bg-secondary/10 text-secondary border-secondary/20";
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground">
          <Ticket className="h-6 w-6 text-primary" />
          Pin Code Request
        </h1>

        <Card className="border-secondary/30 bg-secondary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display text-secondary">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Admin Account Number: <span className="font-bold text-primary">03448252109</span></span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Payment Method: <span className="font-bold text-primary">EasyPaisa</span></span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Account Title: <span className="font-bold text-primary">Sardar Laeiq Ahmed</span></span>
            </div>
            <Badge variant="secondary" className="mt-2">Pin Cost: PKR 1,000 per token</Badge>
          </CardContent>
        </Card>

        <Card className="nexo-card-glow border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-display">Submit Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Select value={quantity} onValueChange={setQuantity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quantity" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }).map((_, index) => {
                      const count = index + 1;
                      return (
                        <SelectItem key={count} value={String(count)}>
                          {count} Pin{count > 1 ? "s" : ""} - PKR {(count * PIN_COST).toLocaleString()}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Account Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="03XXXXXXXXX" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>TRX ID</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Transaction ID" value={trxId} onChange={(e) => setTrxId(e.target.value)} className="pl-10" />
                </div>
              </div>

              <Button type="submit" className="w-full font-semibold text-primary-foreground nexo-gradient">
                Submit Request ({quantity} x PKR 1,000 = PKR {totalAmount.toLocaleString()})
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="nexo-card-glow border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-display">My Submitted Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests.length === 0 && (
              <p className="text-sm text-muted-foreground">No pin requests yet.</p>
            )}
            {requests.map((request) => (
              <div key={request.id} className="rounded-lg border border-border/50 bg-muted/40 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-foreground">TRX: {request.trxId}</p>
                    <p className="text-muted-foreground">Quantity: {request.quantity} | Amount: PKR {request.amount.toLocaleString()}</p>
                    <p className="text-muted-foreground">Requested: {request.requestedAt}{request.processedAt ? ` | Processed: ${request.processedAt}` : ""}</p>
                    {request.generatedPins.length > 0 && (
                      <p className="font-mono text-xs text-primary">Generated pins: {request.generatedPins.join(", ")}</p>
                    )}
                  </div>
                  <Badge className={getStatusBadge(request.status)}>{request.status.toUpperCase()}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PinRequest;
