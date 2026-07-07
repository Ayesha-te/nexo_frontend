import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, userMenuItems } from "@/components/AppSidebar";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, MoreHorizontal } from "lucide-react";

const getMobileNavLabel = (title: string) =>
  title
    .replace("Pin Code Request", "Buy Pins")
    .replace("Withdraw History", "Withdraw")
    .replace("Add New User", "Add User")
    .replace(/^Change Password.*/, "Password")
    .replace("Profile Setting", "Profile");

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackMessage) {
      toast({ title: "Error", description: "Please fill your name and message", variant: "destructive" });
      return;
    }
    try {
      await api("/api/complaints/me/", {
        method: "POST",
        body: JSON.stringify({ message: feedbackMessage, type: "feedback" }),
      });
      toast({ title: "Submitted", description: "Your feedback/complaint has been submitted." });
      setFeedbackName("");
      setFeedbackMessage("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Submission failed", variant: "destructive" });
    }
  };

  const primaryMobileItems = userMenuItems.filter((item) =>
    ["/dashboard", "/pin-request", "/my-pins", "/my-tree"].includes(item.url),
  );
  const drawerMobileItems = userMenuItems.filter((item) =>
    !primaryMobileItems.some((primaryItem) => primaryItem.url === item.url),
  );
  const isDrawerRouteActive = drawerMobileItems.some((item) => item.url === location.pathname);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="flex h-20 items-center border-b border-border bg-card/90 px-4 sticky top-0 z-30 backdrop-blur-xl md:h-14">
            <SidebarTrigger className="mr-4 relative z-50 hidden md:flex md:h-7 md:w-7" />
            <img
              src="/ChatGPT_Image_Mar_3__2026__02_42_58_PM-removebg-preview.png"
              alt="Nexocart"
              className="h-20 w-auto md:h-12"
            />
            <div className="flex-1" />
            <Button variant="outline" size="sm" onClick={handleSignOut}>Sign Out</Button>
          </header>
          <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 pb-40 md:p-6 md:pb-6">
            {children}

            <div className="mt-8 grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-white/60 bg-white/60 p-5 shadow-[0_18px_45px_-38px_hsl(var(--nexo-dark)/0.55)] backdrop-blur-xl">
                <h3 className="font-display text-lg font-semibold text-foreground">Feedback & Complaints</h3>
                <form className="mt-3 space-y-3" onSubmit={handleFeedbackSubmit}>
                  <div className="space-y-1">
                    <Label>Your Name</Label>
                    <Input value={feedbackName} onChange={(e) => setFeedbackName(e.target.value)} placeholder="Enter your name" />
                  </div>
                  <div className="space-y-1">
                    <Label>Message</Label>
                    <Textarea
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Write your feedback or complaint"
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="nexo-gradient text-primary-foreground">Submit</Button>
                </form>
              </div>
            </div>
          </main>
          <nav className="fixed inset-x-3 bottom-3 z-50 rounded-[26px] border border-white/80 bg-white/90 px-2 py-2 shadow-[0_18px_45px_-24px_hsl(var(--nexo-dark)/0.65)] backdrop-blur-xl md:hidden">
            <div className="grid grid-cols-5 gap-1">
              {primaryMobileItems.map((item) => (
                <NavLink
                  key={item.url}
                  to={item.url}
                  end
                  className={({ isActive }) =>
                    cn(
                      "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[10px] font-semibold text-muted-foreground transition-all duration-200",
                      isActive && "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className="w-full truncate text-center">{getMobileNavLabel(item.title)}</span>
                </NavLink>
              ))}
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[10px] font-semibold text-muted-foreground transition-all duration-200",
                      isDrawerRouteActive && "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
                    )}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="w-full truncate text-center">More</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-[28px] border-white/80 bg-white p-4 pb-6">
                  <SheetHeader className="text-left">
                    <SheetTitle className="font-display text-xl">More Options</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {drawerMobileItems.map((item) => (
                      <SheetClose asChild key={item.url}>
                        <NavLink
                          to={item.url}
                          end
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-600 transition-all",
                              isActive && "border-primary/20 bg-primary/10 text-primary",
                            )
                          }
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          <span className="truncate">{getMobileNavLabel(item.title)}</span>
                        </NavLink>
                      </SheetClose>
                    ))}
                    <SheetClose asChild>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-3 py-3 text-left text-sm font-semibold text-red-600 transition-all"
                      >
                        <LogOut className="h-5 w-5 shrink-0" />
                        <span>Sign Out</span>
                      </button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </div>
    </SidebarProvider>
  );
}
