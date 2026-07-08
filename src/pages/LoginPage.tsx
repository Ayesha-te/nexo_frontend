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

      <div className="relative z-10 w-full max-w-md space-y-4">
        <Card className="overflow-hidden rounded-2xl border-white/60 bg-white/70 shadow-[0_22px_70px_-38px_hsl(var(--nexo-dark)/0.65)] backdrop-blur-xl">
          <CardHeader className="text-center pb-0 pt-5">
            <div className="mx-auto flex h-28 w-56 items-center justify-center overflow-hidden">
              <img
                src="/ChatGPT_Image_Mar_3__2026__02_42_58_PM-removebg-preview.png"
                alt="Nexocart"
                className="h-44 w-auto max-w-none"
              />
            </div>
            <CardTitle className="font-display text-base font-medium tracking-wide text-muted-foreground">The Binary System</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-5 sm:p-6 sm:pt-5">
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

        <Card className="overflow-hidden rounded-2xl border-white/70 bg-white/80 shadow-[0_18px_52px_-38px_hsl(var(--nexo-dark)/0.65)] backdrop-blur-xl">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#10c98b] text-white shadow-[0_14px_30px_-18px_rgba(16,201,139,0.9)]">
              <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7">
                <path
                  fill="currentColor"
                  d="M16.04 4.8c-6.08 0-11.02 4.86-11.02 10.84 0 1.9.51 3.76 1.48 5.39L4.8 27.2l6.36-1.66a11.16 11.16 0 0 0 4.88 1.13c6.07 0 11.01-4.86 11.01-10.84S22.11 4.8 16.04 4.8Zm0 19.96c-1.55 0-3.06-.39-4.4-1.14l-.31-.18-3.77.98 1.01-3.6-.2-.33a8.84 8.84 0 0 1-1.43-4.85c0-4.92 4.08-8.93 9.1-8.93s9.1 4.01 9.1 8.93-4.08 9.12-9.1 9.12Zm5-6.68c-.27-.13-1.62-.79-1.87-.88-.25-.09-.43-.13-.61.13-.18.26-.7.87-.85 1.05-.16.17-.31.2-.58.07-.27-.13-1.14-.41-2.17-1.31-.8-.7-1.34-1.57-1.5-1.83-.16-.26-.02-.4.12-.53.12-.12.27-.31.41-.46.14-.16.18-.26.27-.43.09-.17.05-.33-.02-.46-.07-.13-.61-1.45-.83-1.98-.22-.51-.44-.44-.61-.45h-.52c-.18 0-.46.07-.7.33-.24.26-.92.89-.92 2.17s.94 2.52 1.07 2.69c.13.17 1.85 2.78 4.49 3.9.63.27 1.12.43 1.5.55.63.2 1.2.17 1.65.1.5-.08 1.62-.65 1.85-1.28.23-.63.23-1.16.16-1.28-.07-.12-.25-.19-.52-.32Z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-normal leading-snug text-foreground">Need system details before joining?</h3>
              <p className="text-xs font-normal text-muted-foreground">Contact us on WhatsApp: +92 344 8252109</p>
            </div>
            <a
              href="https://wa.me/923448252109"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#10c98b] px-3 py-2 text-xs font-bold text-white transition-all hover:bg-[#0fbd82]"
            >
              Open
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
