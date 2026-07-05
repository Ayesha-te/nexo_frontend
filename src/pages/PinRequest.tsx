import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Hash, Image, Info, QrCode, Ticket } from "lucide-react";
import { api } from "@/lib/api";

type PinRequestRow = {
  id: string;
  trxId: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  processedAt: string | null;
  quantity: number;
  generatedPins: string[];
};

type PinConfig = {
  purchaseEnabled: boolean;
  disabledMessage: string;
  pinPrice: number;
  minQuantity: number;
  maxQuantity: number;
  paymentDetails: {
    accountTitle: string;
    accountNumber: string;
    paymentMethod: string;
    instructions: string;
    qrCodeUrl: string | null;
  };
  paymentMethods?: PaymentMethodDetail[];
};

type PaymentMethodDetail = {
  accountTitle: string;
  accountNumber: string;
  paymentMethod: string;
  instructions: string;
  qrCodeUrl: string | null;
};

const defaultConfig: PinConfig = {
  purchaseEnabled: true,
  disabledMessage: "PIN/Token Purchase is temporarily unavailable. Please try again later.",
  pinPrice: 1000,
  minQuantity: 1,
  maxQuantity: 1000,
  paymentDetails: {
    accountTitle: "",
    accountNumber: "",
    paymentMethod: "",
    instructions: "",
    qrCodeUrl: null,
  },
};

const SUPPORTED_PAYMENT_METHODS = ["JazzCash", "Easypaisa", "Bank Account"];

const normalizePaymentMethods = (config: PinConfig): PaymentMethodDetail[] => {
  const source = config.paymentMethods?.length ? config.paymentMethods : [config.paymentDetails];
  return SUPPORTED_PAYMENT_METHODS.map((paymentMethod) => {
    const saved = source.find((method) => method.paymentMethod === paymentMethod);
    return {
      paymentMethod,
      accountTitle: saved?.accountTitle || "",
      accountNumber: saved?.accountNumber || "",
      instructions: saved?.instructions || "",
      qrCodeUrl: saved?.qrCodeUrl || null,
    };
  });
};

const PinRequest = () => {
  const [trxId, setTrxId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [requests, setRequests] = useState<PinRequestRow[]>([]);
  const [config, setConfig] = useState<PinConfig>(defaultConfig);
  const { toast } = useToast();

  const numericQuantity = Number(quantity);
  const validQuantity = Number.isInteger(numericQuantity)
    ? Math.min(Math.max(numericQuantity, config.minQuantity), config.maxQuantity)
    : config.minQuantity;
  const totalAmount = validQuantity * config.pinPrice;
  const quantityOptions = useMemo(() => {
    const common = [1, 10, 25, 50, 100, 250, 500, 1000];
    return common.filter((value) => value >= config.minQuantity && value <= config.maxQuantity);
  }, [config.minQuantity, config.maxQuantity]);
  const paymentMethods = normalizePaymentMethods(config);

  const load = async () => {
    const [settings, rows] = await Promise.all([
      api("/api/pins/config/"),
      api("/api/pins/requests/"),
    ]);
    setConfig(settings);
    setRequests(rows);
  };

  useEffect(() => {
    load().catch(() => setRequests([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.purchaseEnabled) {
      toast({ title: "Unavailable", description: config.disabledMessage, variant: "destructive" });
      return;
    }
    if (!Number.isInteger(numericQuantity) || numericQuantity < config.minQuantity || numericQuantity > config.maxQuantity) {
      toast({ title: "Error", description: `Quantity must be between ${config.minQuantity} and ${config.maxQuantity}.`, variant: "destructive" });
      return;
    }
    if (!trxId.trim() || !screenshot) {
      toast({ title: "Error", description: "Transaction ID and payment screenshot are required.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("trx_id", trxId.trim());
    formData.append("quantity", String(numericQuantity));
    formData.append("proofFile", screenshot);

    try {
      await api("/api/pins/requests/", {
        method: "POST",
        body: formData,
      });
      await load();
      toast({ title: "Request Submitted", description: `Your request for ${numericQuantity} PIN(s) is pending admin review.` });
      setTrxId("");
      setQuantity("1");
      setScreenshot(null);
      const fileInput = document.getElementById("payment-screenshot") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
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
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              {paymentMethods.map((method, index) => (
                <div key={`${method.paymentMethod}-${index}`} className="rounded-md border border-border/50 bg-background/70 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <CreditCard className="h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="min-w-0 break-words text-sm font-medium text-foreground">Method: <span className="font-bold text-primary">{method.paymentMethod || "-"}</span></span>
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <CreditCard className="h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="min-w-0 break-words text-sm font-medium text-foreground">Account: <span className="font-bold text-primary">{method.accountNumber || "-"}</span></span>
                    </div>
                    <div className="flex items-center gap-3 min-w-0 sm:col-span-2">
                      <Info className="h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="min-w-0 break-words text-sm font-medium text-foreground">Title: <span className="font-bold text-primary">{method.accountTitle || "-"}</span></span>
                    </div>
                  </div>

                  {method.instructions ? (
                    <div className="mt-3 rounded-md border border-border/50 bg-muted/30 p-3 text-sm text-foreground whitespace-pre-line">
                      {method.instructions}
                    </div>
                  ) : null}

                  {method.qrCodeUrl ? (
                    <div className="mt-3 flex items-center gap-4">
                      <QrCode className="h-4 w-4 text-primary" />
                      <img src={method.qrCodeUrl} alt={`${method.paymentMethod} QR Code`} className="h-28 w-28 rounded-md border object-contain" />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <Badge variant="secondary">PIN Cost: PKR {config.pinPrice.toLocaleString()} per token</Badge>
          </CardContent>
        </Card>

        {!config.purchaseEnabled ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-6 text-sm font-medium text-destructive">
              {config.disabledMessage}
            </CardContent>
          </Card>
        ) : (
          <Card className="nexo-card-glow border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-display">Submit Request</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>PIN Quantity</Label>
                  <Input
                    type="number"
                    list="pin-quantity-options"
                    min={config.minQuantity}
                    max={config.maxQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <datalist id="pin-quantity-options">
                    {quantityOptions.map((count) => (
                      <option key={count} value={count}>{`${count} PINs`}</option>
                    ))}
                  </datalist>
                  <p className="text-xs text-muted-foreground">Minimum {config.minQuantity}, maximum {config.maxQuantity} PINs per request.</p>
                </div>

                <div className="rounded-md border border-border/50 bg-muted/40 p-3 text-sm font-semibold text-foreground">
                  Total Amount: PKR {totalAmount.toLocaleString()}
                </div>

                <div className="space-y-2">
                  <Label>Transaction ID</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Transaction ID" value={trxId} onChange={(e) => setTrxId(e.target.value)} className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Payment Screenshot</Label>
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="payment-screenshot"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full font-semibold text-primary-foreground nexo-gradient">
                  Submit Request ({validQuantity} x PKR {config.pinPrice.toLocaleString()} = PKR {totalAmount.toLocaleString()})
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

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
