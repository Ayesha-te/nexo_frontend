import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Phone, CreditCard, Hash } from "lucide-react";

const PinRequest = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const { toast } = useToast();

  const PIN_COST = 1000;
  const totalAmount = parseInt(quantity) * PIN_COST;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !trxId || !quantity) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    toast({ title: "Request Submitted!", description: `Your pin token request (${quantity} tokens x PKR 1,000 = PKR ${totalAmount.toLocaleString()}) is pending verification.` });
    setAccountNumber("");
    setTrxId("");
    setQuantity("1");
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
            <Badge variant="secondary" className="mt-2">Pin Cost: PKR 1,000 per token</Badge>
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
                <Label>Quantity (Pin Tokens)</Label>
                <Select value={quantity} onValueChange={setQuantity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quantity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Token - PKR 1,000</SelectItem>
                    <SelectItem value="2">2 Tokens - PKR 2,000</SelectItem>
                    <SelectItem value="3">3 Tokens - PKR 3,000</SelectItem>
                    <SelectItem value="4">4 Tokens - PKR 4,000</SelectItem>
                    <SelectItem value="5">5 Tokens - PKR 5,000</SelectItem>
                    <SelectItem value="6">6 Tokens - PKR 6,000</SelectItem>
                    <SelectItem value="7">7 Tokens - PKR 7,000</SelectItem>
                    <SelectItem value="8">8 Tokens - PKR 8,000</SelectItem>
                    <SelectItem value="9">9 Tokens - PKR 9,000</SelectItem>
                    <SelectItem value="10">10 Tokens - PKR 10,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              <Button type="submit" className="w-full nexo-gradient text-primary-foreground font-semibold">
                Submit Request ({quantity} × PKR 1,000 = PKR {totalAmount.toLocaleString()})
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PinRequest;
