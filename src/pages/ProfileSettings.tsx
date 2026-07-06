import { useRef, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Settings, Camera, User, Mail, Phone } from "lucide-react";
import { glassCardClass, PageShell } from "@/components/PageShell";

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [profilePicPreview, setProfilePicPreview] = useState<string>(user?.profilePic || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfilePicPreview(url);
    updateProfile({ profilePic: file }).catch(() => {
      toast({ title: "Error", description: "Failed to upload profile picture.", variant: "destructive" });
    });
    toast({ title: "Profile Picture Updated", description: "Preview updated. Click Save Changes to keep profile details." });
  };

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
        description="Manage your profile picture and name."
        maxWidth="max-w-2xl"
      >
        <Card className={glassCardClass}>
          <CardContent className="p-4 sm:p-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {profilePicPreview ? (
                  <img
                    src={profilePicPreview}
                    alt="Profile"
                    className="h-28 w-28 rounded-full border-4 border-white/70 object-cover shadow-xl"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/70 nexo-gradient text-3xl font-bold text-primary-foreground shadow-xl font-display">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg transition-transform hover:scale-105"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Editable: Profile pic and Name</p>
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

              <Button type="submit" className="w-full nexo-gradient text-primary-foreground font-semibold">
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
