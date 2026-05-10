import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { settingsApi } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — DosePilot" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const { data: s } = useQuery({ queryKey: ["settings"], queryFn: settingsApi.get });

  const update = async (patch: Partial<NonNullable<typeof s>>) => {
    await settingsApi.update(patch);
    qc.invalidateQueries({ queryKey: ["settings"] });
    toast.success("Settings updated");
  };

  if (!s) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize how DosePilot works for you.</p>
      </div>

      <Card className="p-6 border-border space-y-5">
        <h2 className="font-display text-lg font-semibold">Notifications</h2>
        <Row label="Reminder alerts" desc="Get notified when a dose is due">
          <Switch checked={s.notifyReminders} onCheckedChange={(v) => update({ notifyReminders: v })} />
        </Row>
        <Row label="Stock alerts" desc="Notify when stock falls below the refill threshold">
          <Switch checked={s.notifyStock} onCheckedChange={(v) => update({ notifyStock: v })} />
        </Row>
        <Row label="Email summaries" desc="Receive a weekly adherence summary by email">
          <Switch checked={s.notifyEmail} onCheckedChange={(v) => update({ notifyEmail: v })} />
        </Row>
      </Card>

      <Card className="p-6 border-border space-y-5">
        <h2 className="font-display text-lg font-semibold">Preferences</h2>
        <Row label="Week starts on" desc="Used in calendars and weekly reports">
          <Select value={s.weekStart} onValueChange={(v) => update({ weekStart: v as "sunday" | "monday" })}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="sunday">Sunday</SelectItem><SelectItem value="monday">Monday</SelectItem></SelectContent>
          </Select>
        </Row>
      </Card>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 py-2">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      {children}
    </div>
  );
}
