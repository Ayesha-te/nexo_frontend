import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Settings, User, Mail, Phone } from "lucide-react";
import { glassCardClass, PageShell } from "@/components/PageShell";

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [profileImageFailed, setProfileImageFailed] = useState(false);
  const { toast } = useToast();
  const avatarLetter = (firstName || user?.firstName || user?.email || "U").trim().charAt(0).toUpperCase();

  useEffect(() => {
    setProfileImageFailed(false);
  }, [user?.profilePic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ firstName, lastName });
    toast({ title: "Profile Updated!", description: "Your profile has been updated successfully." });
  };

  return (
    <DashboardLayout>
      <PageShell
        icon={Settings}
        title="Profile Settings"
        description="Manage your profile name."
        maxWidth="max-w-2xl"
      >
        <Card className={glassCardClass}>
          <CardContent className="p-4 sm:p-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {user?.profilePic && !profileImageFailed ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    onError={() => setProfileImageFailed(true)}
                    className="h-36 w-36 rounded-full border-4 border-white/70 object-cover shadow-xl"
                  />
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white/70 nexo-gradient text-4xl font-semibold text-primary-foreground shadow-xl font-display">
                    {avatarLetter}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Editable: profile name</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              {/* Read-only fields */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">Email (Admin only)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={user?.email || ""} disabled className="pl-10 opacity-60" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Phone Number (Admin only)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={user?.phone || ""} disabled className="pl-10 opacity-60" />
                </div>
              </div>

              <Button type="submit" className="w-full nexo-gradient text-primary-foreground font-medium">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </PageShell>
    </DashboardLayout>
  );
};

export default ProfileSettings;
