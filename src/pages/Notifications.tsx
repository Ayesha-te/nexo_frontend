import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
import { api } from "@/lib/api";
import { glassCardClass, PageShell } from "@/components/PageShell";
import { cn } from "@/lib/utils";

type NotificationRow = {
  id: number;
  notifType: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = () => {
    api("/api/notifications/me/")
      .then((data) => {
        setNotifications(data.results || []);
        setUnreadCount(data.unreadCount || 0);
      })
      .catch(() => {
        setNotifications([]);
        setUnreadCount(0);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification: NotificationRow) => {
    if (notification.isRead) return;
    try {
      await api(`/api/notifications/me/${notification.id}/read/`, { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // ignore errors, leave state as-is
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api("/api/notifications/me/read-all/", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // ignore errors, leave state as-is
    }
  };

  return (
    <DashboardLayout>
      <PageShell
        icon={Bell}
        title="Notifications"
        description="Stay up to date with account activity and announcements."
      >
        <Card className={glassCardClass}>
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Bell className="h-5 w-5 text-secondary" />
                All Notifications
              </div>
              {unreadCount > 0 && (
                <Button size="sm" variant="outline" onClick={handleMarkAllRead} className="gap-1">
                  <CheckCheck className="h-3 w-3" />
                  Mark all as read
                </Button>
              )}
            </div>

            {notifications.length === 0 && (
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            )}

            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={cn(
                  "cursor-pointer rounded-xl border-l-4 bg-background/70 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-background/85 sm:p-5",
                  n.isRead ? "border-l-border opacity-70" : "border-l-primary",
                )}
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      {!n.isRead && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />}
                      <p className={cn("truncate text-base", n.isRead ? "font-normal text-muted-foreground" : "font-bold text-foreground")}>
                        {n.title}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                  </div>
                  <p className="flex-shrink-0 text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </PageShell>
    </DashboardLayout>
  );
};

export default Notifications;
