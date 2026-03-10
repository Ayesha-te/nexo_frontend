import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Key, Mail, Phone, User, Users } from "lucide-react";

const AddUser = () => {
  const [formData, setFormData] = useState({
    pinToken: "", firstName: "", lastName: "", email: "",
    accountNumber: "", referralEmail: "", position: "", paymentMethod: "",
  });
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = Object.entries(formData);
    const emptyField = requiredFields.find(([_, v]) => !v);
    if (emptyField) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    toast({ title: "Account Activated!", description: `Account created for ${formData.firstName} ${formData.lastName}. Password is the phone number.` });
    setFormData({ pinToken: "", firstName: "", lastName: "", email: "", accountNumber: "", referralEmail: "", position: "", paymentMethod: "" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-primary" />
          Add New User
        </h1>

        <Card className="nexo-card-glow border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-display">Account Activation</CardTitle>
            <p className="text-sm text-muted-foreground">Password will be automatically generated (Phone Number is the password)</p>
          </CardHeader>
          <CardContent>
            <div className="mb-4 rounded-lg border border-secondary/20 bg-secondary/5 p-3 text-sm">
              <p className="font-semibold text-foreground mb-2">New user account active karne ke liye required data:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• User Name</li>
                <li>• User Email</li>
                <li>• User account number (EasyPaisa / JazzCash)</li>
                <li>• Referral Email</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Pin Token</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Paste pin token here" value={formData.pinToken} onChange={(e) => handleChange("pinToken", e.target.value)} className="pl-10 font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="First name" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Last name" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="email" placeholder="user@email.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>User Account Number (EasyPaisa / JazzCash)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="03XXXXXXXXX" value={formData.accountNumber} onChange={(e) => handleChange("accountNumber", e.target.value)} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Referral Email</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="email" placeholder="referrer@email.com" value={formData.referralEmail} onChange={(e) => handleChange("referralEmail", e.target.value)} className="pl-10" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Select value={formData.position} onValueChange={(v) => handleChange("position", v)}>
                    <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={formData.paymentMethod} onValueChange={(v) => handleChange("paymentMethod", v)}>
                    <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easypaisa">EasyPaisa</SelectItem>
                      <SelectItem value="jazzcash">JazzCash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full nexo-gradient text-primary-foreground font-semibold">
                Activate Account
              </Button>
            </form>

            <div className="mt-4 rounded-lg border border-border/50 bg-muted/30 p-3 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Activation Steps:</p>
              <p>1) Pin token copy karke paste karein</p>
              <p>2) User First Name and Second Name</p>
              <p>3) User Email</p>
              <p>4) User account number</p>
              <p>5) Referral Email</p>
              <p>6) Select Position (Left / Right)</p>
              <p>7) Payment method for income receive (EasyPaisa / JazzCash)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddUser;
