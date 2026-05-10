import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Pill, Bell, AlertTriangle, TrendingUp, Plus, Check, X, ChevronRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { medicineApi, doseApi, profileApi } from "@/lib/store";
import { adherence, todayLogs, lowStock, adherenceByDay, fmtTime } from "@/lib/metrics";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — DosePilot" }] }),
  component: Dashboard,
});

function Dashboard() {
  const profileId = profileApi.active();
  const qc = useQueryClient();
  const { data: meds = [] } = useQuery({ queryKey: ["medicines", profileId], queryFn: () => medicineApi.list(profileId) });
  const { data: logs = [] } = useQuery({ queryKey: ["doses", profileId], queryFn: () => doseApi.list(profileId) });

  const today = useMemo(() => todayLogs(logs), [logs]);
  const adh = useMemo(() => adherence(logs, 30), [logs]);
  const week = useMemo(() => adherenceByDay(logs, 7), [logs]);
  const low = useMemo(() => lowStock(meds), [meds]);
  const missed = today.filter((l) => l.status === "missed").length;
  const pendingToday = today.filter((l) => l.status === "pending").length;

  const medById = (id: string) => meds.find((m) => m.id === id);

  const setStatus = async (id: string, status: "taken" | "skipped") => {
    await doseApi.setStatus(id, status);
    qc.invalidateQueries({ queryKey: ["doses"] });
    qc.invalidateQueries({ queryKey: ["medicines"] });
    qc.invalidateQueries({ queryKey: ["notifications"] });
    toast.success(status === "taken" ? "Dose marked as taken" : "Dose skipped");
  };

  const stats = [
    { label: "Today's doses", value: today.length, sub: `${pendingToday} pending`, icon: Pill, color: "text-primary bg-accent" },
    { label: "Missed today", value: missed, sub: missed ? "Catch up soon" : "All on track", icon: AlertTriangle, color: "text-coral bg-coral/10" },
    { label: "Low stock", value: low.length, sub: low.length ? `${low.length} need refill` : "Stocked up", icon: Bell, color: "text-foreground bg-muted" },
    { label: "30-day adherence", value: `${adh}%`, sub: "Above 80% target", icon: TrendingUp, color: "text-mint bg-mint/15" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Good day 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's on your plate today.</p>
        </div>
        <Button asChild className="rounded-full"><Link to="/medicines/new"><Plus className="h-4 w-4 mr-1" />Add medicine</Link></Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 shadow-[var(--shadow-soft)] border-border">
            <div className="flex items-center justify-between">
              <span className={`grid place-items-center h-10 w-10 rounded-xl ${s.color}`}><s.icon className="h-5 w-5" /></span>
            </div>
            <div className="mt-4 font-display text-3xl font-semibold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label} · {s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6 border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-semibold">Weekly adherence</h2>
              <p className="text-xs text-muted-foreground">Doses taken vs scheduled, last 7 days</p>
            </div>
            <Badge variant="secondary" className="rounded-full">{adh}% avg</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={week}>
                <CartesianGrid stroke="oklch(0.92 0.01 220)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.5 0.025 240)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="oklch(0.5 0.025 240)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 220)" }} formatter={(v) => `${v}%`} />
                <Bar dataKey="pct" radius={[8, 8, 0, 0]} fill="oklch(0.55 0.13 220)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <h2 className="font-display text-lg font-semibold mb-4">Today's timeline</h2>
          {today.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">No doses scheduled today.</div>
          ) : (
            <ul className="space-y-3 max-h-72 overflow-auto pr-1">
              {today.map((l) => {
                const m = medById(l.medicineId);
                return (
                  <li key={l.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <div className="text-xs font-mono text-muted-foreground w-14">{fmtTime(l.scheduledAt)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{m?.name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{m?.dosage} · {m?.meal}</div>
                    </div>
                    {l.status === "pending" ? (
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-mint" onClick={() => setStatus(l.id, "taken")}><Check className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-coral" onClick={() => setStatus(l.id, "skipped")}><X className="h-4 w-4" /></Button>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="capitalize text-xs">{l.status}</Badge>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6 border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Low stock</h2>
            <Button variant="ghost" size="sm" asChild><Link to="/stock">View all<ChevronRight className="h-4 w-4 ml-1" /></Link></Button>
          </div>
          {low.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">All medicines well stocked.</div>
          ) : (
            <ul className="space-y-3">
              {low.map((m) => (
                <li key={m.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.stock} / {m.refillThreshold * 2} doses</span>
                  </div>
                  <Progress value={(m.stock / (m.refillThreshold * 2)) * 100} className="h-2" />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6 border-border">
          <h2 className="font-display text-lg font-semibold mb-4">Adherence trend</h2>
          <div className="h-48">
            <ResponsiveContainer>
              <LineChart data={week}>
                <XAxis dataKey="day" stroke="oklch(0.5 0.025 240)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(v) => `${v}%`} />
                <Line type="monotone" dataKey="pct" stroke="oklch(0.55 0.13 220)" strokeWidth={2.5} dot={{ r: 4, fill: "oklch(0.78 0.12 200)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
