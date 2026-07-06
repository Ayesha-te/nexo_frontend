import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(identifier, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.20),transparent_30%),radial-gradient(circle_at_85%_15%,hsl(var(--secondary)/0.22),transparent_28%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)/0.60))] px-4 py-8">
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:radial-gradient(circle,hsl(var(--primary)/0.35)_1px,transparent_1px),radial-gradient(circle,hsl(var(--secondary)/0.25)_1px,transparent_1px)] [background-position:0_0,22px_28px] [background-size:46px_46px,64px_64px]" />

      <Card className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border-white/60 bg-white/65 shadow-[0_22px_70px_-38px_hsl(var(--nexo-dark)/0.65)] backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 rounded-full border border-white/70 bg-background/70 px-5 py-2 shadow-sm">
            <img
              src="/ChatGPT_Image_Mar_3__2026__02_42_58_PM-removebg-preview.png"
              alt="Nexocart"
              className="mx-auto h-16 w-auto"
            />
          </div>
          <CardTitle className="font-display text-3xl font-extrabold text-foreground">Nexocart</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">The Binary System</p>
        </CardHeader>
        <CardContent className="p-5 pt-6 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-foreground/80">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="identifier"
                  type="email"
                  placeholder="Enter your email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting} className="h-11 w-full font-semibold text-primary-foreground nexo-gradient hover:opacity-90 transition-opacity">
              {submitting ? "Please wait..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
