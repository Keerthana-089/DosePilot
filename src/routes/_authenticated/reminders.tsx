import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Check, X, Clock4 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { medicineApi, doseApi, profileApi } from "@/lib/store";
import { fmtDay, fmtTime } from "@/lib/metrics";

export const Route = createFileRoute("/_authenticated/reminders")({
  head: () => ({ meta: [{ title: "Reminders — DosePilot" }] }),
  component: Reminders,
});

function Reminders() {
  const profileId = profileApi.active();
  const qc = useQueryClient();
  const { data: meds = [] } = useQuery({ queryKey: ["medicines", profileId], queryFn: () => medicineApi.list(profileId) });
  const { data: logs = [] } = useQuery({ queryKey: ["doses", profileId], queryFn: () => doseApi.list(profileId) });

  const grouped = useMemo(() => {
    const m = new Map<string, typeof logs>();
    logs
      .filter((l) => l.status === "pending" || new Date(l.scheduledAt).toDateString() === new Date().toDateString())
      .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt))
      .forEach((l) => {
        const key = new Date(l.scheduledAt).toDateString();
        if (!m.has(key)) m.set(key, []);
        m.get(key)!.push(l);
      });
    return Array.from(m.entries()).slice(0, 7);
  }, [logs]);

  const medById = (id: string) => meds.find((m) => m.id === id);

  const set = async (id: string, status: "taken" | "skipped") => {
    await doseApi.setStatus(id, status);
    qc.invalidateQueries({ queryKey: ["doses"] });
    qc.invalidateQueries({ queryKey: ["medicines"] });
    qc.invalidateQueries({ queryKey: ["notifications"] });
    toast.success(status === "taken" ? "Marked as taken" : "Skipped");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Reminders</h1>
        <p className="text-muted-foreground mt-1">Your upcoming and recent doses.</p>
      </div>

      {grouped.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Clock4 className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-display text-xl font-semibold">No reminders right now</h3>
          <p className="text-sm text-muted-foreground mt-1">Add a medicine to start scheduling.</p>
        </Card>
      ) : (
        grouped.map(([day, items]) => (
          <div key={day}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">{fmtDay(day)}</div>
            <Card className="border-border divide-y divide-border">
              {items.map((l) => {
                const m = medById(l.medicineId);
                return (
                  <div key={l.id} className="flex items-center gap-4 p-4">
                    <div className="text-sm font-mono text-muted-foreground w-16 shrink-0">{fmtTime(l.scheduledAt)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{m?.name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{m?.dosage} · {m?.meal}</div>
                    </div>
                    {l.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="rounded-full" onClick={() => set(l.id, "skipped")}><X className="h-3.5 w-3.5 mr-1" />Skip</Button>
                        <Button size="sm" className="rounded-full" onClick={() => set(l.id, "taken")}><Check className="h-3.5 w-3.5 mr-1" />Take</Button>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="capitalize">{l.status}</Badge>
                    )}
                  </div>
                );
              })}
            </Card>
          </div>
        ))
      )}
    </div>
  );
}
