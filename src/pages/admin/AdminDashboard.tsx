import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { mockAllUsers, mockPinRequests, mockWithdrawals } from "@/lib/mock-data";
import { LayoutDashboard, Users, Ticket, Wallet, TrendingUp } from "lucide-react";

const adminStats = [
  { title: "Total Users", value: mockAllUsers.length.toString(), icon: Users, gradient: "from-primary to-nexo-green-light" },
  { title: "Active Users", value: mockAllUsers.filter(u => u.isActive).length.toString(), icon: TrendingUp, gradient: "from-nexo-green-light to-primary" },
  { title: "Pending Pin Requests", value: mockPinRequests.filter(r => r.status === "pending").length.toString(), icon: Ticket, gradient: "from-secondary to-nexo-gold-light" },
  { title: "Total Withdrawals", value: `PKR ${mockWithdrawals.reduce((s, w) => s + w.netAmount, 0).toLocaleString()}`, icon: Wallet, gradient: "from-primary to-secondary" },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-primary" />
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminStats.map((stat) => (
            <Card key={stat.title} className="nexo-card-glow border-border/50 hover:scale-[1.02] transition-transform">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold font-display mt-1 text-foreground">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Pending Requests */}
        <Card className="nexo-card-glow border-border/50">
          <CardContent className="pt-6">
            <h3 className="font-display font-semibold mb-4 text-foreground">Recent Pending Requests</h3>
            <div className="space-y-3">
              {mockPinRequests.filter(r => r.status === "pending").map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                  <div>
                    <p className="font-medium text-foreground">{req.userName}</p>
                    <p className="text-sm text-muted-foreground">TRX: {req.trxId} | PKR {req.amount.toLocaleString()}</p>
                  </div>
                  <span className="text-xs text-secondary font-semibold">{req.requestedAt}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
