import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockPins } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Key, Copy, Check } from "lucide-react";

const MyPins = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = (token: string, id: string) => {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    toast({ title: "Copied!", description: "Pin token copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-primary/10 text-primary border-primary/20";
      case "used": return "bg-muted text-muted-foreground border-border";
      case "pending": return "bg-secondary/10 text-secondary border-secondary/20";
      default: return "";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Key className="w-6 h-6 text-primary" />
          My Pins
        </h1>

        <div className="grid gap-4">
          {mockPins.map((pin) => (
            <Card key={pin.id} className="nexo-card-glow border-border/50">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-mono text-lg font-bold text-foreground">{pin.token}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Purchased: {pin.purchasedAt}</span>
                      <span>Amount: PKR {pin.amount.toLocaleString()}</span>
                    </div>
                    {pin.usedBy && <p className="text-xs text-muted-foreground">Used by: {pin.usedBy}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(pin.status)}>{pin.status.toUpperCase()}</Badge>
                    {pin.status === "available" && (
                      <Button size="sm" variant="outline" onClick={() => handleCopy(pin.token, pin.id)} className="gap-1">
                        {copiedId === pin.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedId === pin.id ? "Copied" : "Copy"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyPins;
