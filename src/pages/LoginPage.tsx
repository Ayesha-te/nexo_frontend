import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Crown, Mail, Lock, ShieldCheck } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminMode) {
      adminLogin(email, password);
      navigate("/admin/dashboard");
    } else {
      login(email, password);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md mx-4 nexo-card-glow border-border/50 relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl nexo-gradient flex items-center justify-center mb-4 nexo-gold-glow">
            <Crown className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="font-display text-3xl">
            <span className="nexo-gradient-text">NexoKart</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdminMode ? "Admin Panel Login" : "Binary MLM Platform"}
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full nexo-gradient text-primary-foreground font-semibold h-11 hover:opacity-90 transition-opacity">
              {isAdminMode ? "Admin Login" : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 mx-auto transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              {isAdminMode ? "Switch to User Login" : "Login as Admin"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
