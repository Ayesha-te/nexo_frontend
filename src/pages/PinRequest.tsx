import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Phone, CreditCard, Hash } from "lucide-react";

const PinRequest = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !trxId || !amount) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    toast({ title: "Request Submitted!", description: "Your pin token request is pending verification." });
    setAccountNumber("");
    setTrxId("");
    setAmount("");
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Ticket className="w-6 h-6 text-primary" />
          Pin Code Request
        </h1>

        {/* Admin Payment Info */}
        <Card className="border-secondary/30 bg-secondary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display text-secondary">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Admin Account Number: <span className="text-primary font-bold">03448252109</span></span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Payment Method: <span className="text-primary font-bold">Easy Paisa</span></span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Account Title: <span className="text-primary font-bold">Sardar laeiq Ahmed</span></span>
            </div>
            <Badge variant="secondary" className="mt-2">Joining fee PKR 1,000 — full payment required (1k, 2k, 5k)</Badge>
          </CardContent>
        </Card>

        {/* Urdu Description */}
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <p className="text-right text-sm text-muted-foreground leading-7" dir="rtl">
              اِس نمبر سے پن ٹوکن خریدیں پیمنٹ ہمیشہ ایزی پیسہ سے کیجئے گا۔
              پن ٹوکن ایڈ ہونے کا دورانیہ ایک گھنٹہ ہے جو وریفکیشن ہونے کے بعد ایڈ ہوتی ہیں۔
            </p>
          </CardContent>
        </Card>

        {/* Request Form */}
        <Card className="nexo-card-glow border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-display">Submit Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Account Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="03XXXXXXXXX" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>TRX ID</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Transaction ID" value={trxId} onChange={(e) => setTrxId(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Amount (PKR)</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="number" placeholder="1000" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-10" />
                </div>
              </div>
              <Button type="submit" className="w-full nexo-gradient text-primary-foreground font-semibold">
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PinRequest;
