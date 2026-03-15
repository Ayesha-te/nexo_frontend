import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Ticket,
  Key,
  UserPlus,
  GitBranch,
  Wallet,
  Lock,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const userMenuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Pin Code Request", url: "/pin-request", icon: Ticket },
  { title: "My Pins", url: "/my-pins", icon: Key },
  { title: "Add New User", url: "/add-user", icon: UserPlus },
  { title: "My Tree", url: "/my-tree", icon: GitBranch },
  { title: "Withdraw History", url: "/withdraw-history", icon: Wallet },
  { title: "Change Password 🔑", url: "/change-password", icon: Lock },
  { title: "Profile Setting", url: "/profile", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const items = userMenuItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img
            src="/ChatGPT_Image_Mar_3__2026__02_42_58_PM-removebg-preview.png"
            alt="Nexocart"
            className="h-16 w-auto flex-shrink-0"
          />
          {!collapsed && (
            <div>
              <h2 className="font-display text-lg font-bold text-sidebar-foreground">Nexocart</h2>
              <p className="text-xs text-sidebar-foreground/60">Binary System</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase text-[10px] tracking-wider font-semibold mb-2">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-sidebar-foreground">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-sidebar-foreground/50">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
