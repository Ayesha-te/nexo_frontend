import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Key, Copy, Check } from "lucide-react";
import { api } from "@/lib/api";

type PinRow = {
  id: number;
  token: string;
  status: "available" | "used";
  purchasedAt: string;
  amount: number;
  usedBy: string;
  requestId: number | null;
};

const MyPins = () => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [pins, setPins] = useState<PinRow[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    api("/api/pins/me/").then(setPins).catch(() => setPins([]));
  }, []);

  const handleCopy = async (token: string, id: number) => {
    await navigator.clipboard.writeText(token);
    setCopiedId(id);
    toast({ title: "Copied", description: "Pin token copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusColor = (status: PinRow["status"]) => {
    if (status === "available") return "bg-primary/10 text-primary border-primary/20";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground">
            <Key className="h-6 w-6 text-primary" />
            My Pins
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Approved pin requests generate backend pin codes here. Use any available code on the Add New User page.</p>
        </div>

        <Card className="nexo-card-glow border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-display">Approved Pin Codes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pins.length === 0 && (
              <p className="text-sm text-muted-foreground">No pin codes yet. Submit a request and wait for admin approval.</p>
            )}
            {pins.map((pin) => (
              <div key={pin.id} className="rounded-lg border border-border/50 p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <p className="font-mono text-lg font-bold text-foreground">{pin.token}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>Purchased: {pin.purchasedAt}</span>
                      <span>Amount: PKR {pin.amount.toLocaleString()}</span>
                      {pin.requestId ? <span>Request #{pin.requestId}</span> : null}
                    </div>
                    {pin.usedBy ? <p className="text-xs text-muted-foreground">Used by: {pin.usedBy}</p> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(pin.status)}>{pin.status.toUpperCase()}</Badge>
                    {pin.status === "available" && (
                      <Button size="sm" variant="outline" onClick={() => handleCopy(pin.token, pin.id)} className="gap-1">
                        {copiedId === pin.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copiedId === pin.id ? "Copied" : "Copy"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MyPins;
