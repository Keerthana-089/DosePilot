import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Trash2, CheckCheck, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notificationApi } from "@/lib/store";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications — DosePilot" }] }),
  component: Notifications,
});

function Notifications() {
  const qc = useQueryClient();
  const { data: notifs = [] } = useQuery({ queryKey: ["notifications"], queryFn: notificationApi.list });

  const markAll = async () => { await notificationApi.markAllRead(); qc.invalidateQueries({ queryKey: ["notifications"] }); toast.success("All marked as read"); };
  const remove = async (id: string) => { await notificationApi.remove(id); qc.invalidateQueries({ queryKey: ["notifications"] }); };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">{notifs.filter((n) => !n.read).length} unread</p>
        </div>
        <Button variant="outline" className="rounded-full" onClick={markAll}><CheckCheck className="h-4 w-4 mr-1" />Mark all read</Button>
      </div>

      {notifs.length === 0 ? (
        <Card className="p-12 text-center border-dashed"><Inbox className="h-10 w-10 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No notifications.</p></Card>
      ) : (
        <Card className="border-border divide-y divide-border">
          {notifs.map((n) => (
            <div key={n.id} className={`flex items-start gap-3 p-4 ${!n.read ? "bg-accent/30" : ""}`}>
              <span className="grid place-items-center h-9 w-9 rounded-xl bg-accent text-primary shrink-0"><Bell className="h-4 w-4" /></span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{n.title}</span>
                  {!n.read && <Badge className="bg-primary/15 text-primary border-0 h-5">New</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
                <p className="text-xs text-muted-foreground mt-1">{format(new Date(n.createdAt), "MMM d, h:mm a")}</p>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => remove(n.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
