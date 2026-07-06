import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { glassCardClass, PageShell } from "@/components/PageShell";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    try {
      await api("/api/accounts/change-password/", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast({ title: "Success", description: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to change password", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <PageShell
        icon={Lock}
        title="Change Password"
        description="Update your account password securely."
        maxWidth="max-w-xl"
      >
        <Card className={glassCardClass}>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type={showPasswords ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type={showPasswords ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowPasswords(!showPasswords)}>
                  {showPasswords ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  {showPasswords ? "Hide" : "Show"} Passwords
                </Button>
              </div>
              <Button type="submit" className="w-full nexo-gradient text-primary-foreground font-semibold">
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </PageShell>
    </DashboardLayout>
  );
};

export default ChangePassword;
