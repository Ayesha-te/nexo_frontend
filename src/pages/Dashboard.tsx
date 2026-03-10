import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { rewardsTable } from "@/lib/mock-data";
import { DollarSign, Gift, Wallet, Key, Users, ArrowLeftRight, Trophy } from "lucide-react";

const stats = [
  { title: "Current Income", value: "PKR 16,600", icon: DollarSign, gradient: "from-primary to-nexo-green-light" },
  { title: "Reward Income", value: "PKR 5,000", icon: Gift, gradient: "from-secondary to-nexo-gold-light" },
  { title: "Total Whitdraw", value: "PKR 12,500", icon: Wallet, gradient: "from-primary to-secondary" },
  { title: "Available Pins", value: "2", icon: Key, gradient: "from-nexo-green-light to-primary" },
  { title: "Left Team", value: "45", icon: Users, gradient: "from-primary to-nexo-green-light" },
  { title: "Right Team", value: "38", icon: ArrowLeftRight, gradient: "from-secondary to-nexo-gold-light" },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Welcome back, <span className="nexo-gradient-text">{user?.firstName || "User"}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here&apos;s your network overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="nexo-card-glow border-border/50 overflow-hidden group hover:scale-[1.02] transition-transform duration-200">
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

        {/* Income System Info */}
        <Card className="nexo-card-glow border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Income System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <h3 className="font-semibold text-foreground">Referral Income (Pair Based)</h3>
                <p className="text-sm text-muted-foreground mt-1">First pair: <span className="text-primary font-bold">PKR 400</span></p>
                <p className="text-sm text-muted-foreground">Remaining pairs: <span className="text-primary font-bold">PKR 200</span></p>
                <p className="text-xs text-muted-foreground mt-2">Non-working / per-day income is not available.</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <h3 className="font-semibold text-foreground">Strong Side & Cap Rule</h3>
                <p className="text-sm text-muted-foreground mt-2">• If only one side (left or right) is strong, no income will be generated.</p>
                <p className="text-sm text-muted-foreground">• Income is generated only when both sides (left and right) form a complete pair.</p>
                <p className="text-sm text-muted-foreground mt-2">• Once 50,000 pairs (100,000 members) are completed:</p>
                <p className="text-sm text-muted-foreground">Pair income will stop, fixed salary <span className="text-secondary font-bold">PKR 50,000/month</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary/30 bg-secondary/5">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Wallet className="w-5 h-5 text-secondary" />
              Whitdraw Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-foreground">• Whitdraw request is not needed. Daily base per user clear ho ga.</p>
            <p className="text-foreground">• Cap limit: <span className="font-bold text-primary">PKR 4,000</span></p>
            <p className="text-foreground">• Normal whitdraw tax: <span className="font-bold text-primary">5%</span></p>
            <p className="text-foreground">• Cap limit and rewards tax cut: <span className="font-bold text-secondary">10%</span></p>
            <p className="text-xs text-muted-foreground mt-1">Account active karte waqt number sahi likhen, warna loss ki surat mein system zimadar nahi ho ga.</p>
          </CardContent>
        </Card>

        {/* Rewards Table */}
        <Card className="nexo-card-glow border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Trophy className="w-5 h-5 text-secondary" />
              Leadership Reward Plan ✨
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Left Team</TableHead>
                  <TableHead>Right Team</TableHead>
                  <TableHead>Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewardsTable.map((row) => (
                  <TableRow key={row.level}>
                    <TableCell className="font-semibold text-primary">{row.level}</TableCell>
                    <TableCell>{row.left.toLocaleString()}</TableCell>
                    <TableCell>{row.right.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold text-secondary">{row.reward}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-center">
              <p className="text-sm font-semibold text-secondary">💰 Total Rewards: PKR 3,900,000</p>
              <p className="text-xs text-muted-foreground mt-1">Total Team: 1 Lakh</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
