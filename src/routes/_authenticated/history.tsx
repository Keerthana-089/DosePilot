import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { medicineApi, doseApi, profileApi } from "@/lib/store";
import { fmtDay, fmtTime, adherence } from "@/lib/metrics";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "History — DosePilot" }] }),
  component: History,
});

function History() {
  const profileId = profileApi.active();
  const { data: meds = [] } = useQuery({ queryKey: ["medicines", profileId], queryFn: () => medicineApi.list(profileId) });
  const { data: logs = [] } = useQuery({ queryKey: ["doses", profileId], queryFn: () => doseApi.list(profileId) });
  const [med, setMed] = useState("all");
  const [range, setRange] = useState<"7" | "30" | "90">("30");

  const filtered = useMemo(() => {
    const cutoff = Date.now() - Number(range) * 86400000;
    return logs
      .filter((l) => new Date(l.scheduledAt).getTime() >= cutoff && l.status !== "pending")
      .filter((l) => med === "all" || l.medicineId === med)
      .sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt));
  }, [logs, med, range]);

  const adh = adherence(logs, Number(range));
  const taken = filtered.filter((l) => l.status === "taken").length;
  const skipped = filtered.filter((l) => l.status === "skipped").length;
  const missed = filtered.filter((l) => l.status === "missed").length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Dose history</h1>
        <p className="text-muted-foreground mt-1">Review your adherence over time.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Tabs value={range} onValueChange={(v) => setRange(v as "7" | "30" | "90")}>
          <TabsList>
            <TabsTrigger value="7">Last 7 days</TabsTrigger>
            <TabsTrigger value="30">Last 30 days</TabsTrigger>
            <TabsTrigger value="90">Last 90 days</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={med} onValueChange={setMed}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All medicines</SelectItem>
            {meds.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        <Card className="p-5 border-border"><div className="text-xs text-muted-foreground">Adherence</div><div className="font-display text-2xl font-semibold mt-1">{adh}%</div></Card>
        <Card className="p-5 border-border"><div className="text-xs text-muted-foreground">Taken</div><div className="font-display text-2xl font-semibold mt-1 text-mint">{taken}</div></Card>
        <Card className="p-5 border-border"><div className="text-xs text-muted-foreground">Skipped</div><div className="font-display text-2xl font-semibold mt-1">{skipped}</div></Card>
        <Card className="p-5 border-border"><div className="text-xs text-muted-foreground">Missed</div><div className="font-display text-2xl font-semibold mt-1 text-coral">{missed}</div></Card>
      </div>

      <Card className="border-border divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">No history in this range.</div>
        ) : filtered.slice(0, 100).map((l) => {
          const m = meds.find((mm) => mm.id === l.medicineId);
          return (
            <div key={l.id} className="flex items-center gap-4 p-4">
              <div className="w-32 shrink-0">
                <div className="text-sm font-medium">{fmtDay(l.scheduledAt)}</div>
                <div className="text-xs text-muted-foreground">{fmtTime(l.scheduledAt)}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{m?.name}</div>
                <div className="text-xs text-muted-foreground">{m?.dosage}</div>
              </div>
              <Badge variant={l.status === "taken" ? "default" : "secondary"} className="capitalize">{l.status}</Badge>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
