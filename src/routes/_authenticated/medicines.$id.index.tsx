import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Pill, Pencil, ArrowLeft, Calendar, User as UserIcon, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { medicineApi, doseApi, profileApi } from "@/lib/store";
import { fmtTime, fmtDay } from "@/lib/metrics";

export const Route = createFileRoute("/_authenticated/medicines/$id/")({
  head: () => ({ meta: [{ title: "Medicine — DosePilot" }] }),
  component: MedDetail,
});

function MedDetail() {
  const { id } = Route.useParams();
  const profileId = profileApi.active();
  const { data: med, isLoading } = useQuery({ queryKey: ["medicine", id], queryFn: () => medicineApi.get(id) });
  const { data: logs = [] } = useQuery({ queryKey: ["doses", profileId], queryFn: () => doseApi.list(profileId) });

  if (isLoading) return <div className="space-y-4 max-w-4xl"><Skeleton className="h-10 w-64" /><Skeleton className="h-64" /></div>;
  if (!med) return <Card className="p-12 text-center max-w-2xl">Medicine not found. <Link to="/medicines" className="text-primary underline">Back</Link></Card>;

  const recent = logs.filter((l) => l.medicineId === id).sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt)).slice(0, 20);
  const taken = recent.filter((l) => l.status === "taken").length;

  return (
    <div className="max-w-4xl space-y-6">
      <Button variant="ghost" size="sm" asChild><Link to="/medicines"><ArrowLeft className="h-4 w-4 mr-1" />Medicines</Link></Button>

      <Card className="p-6 border-border">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <span className="grid place-items-center h-14 w-14 rounded-2xl bg-accent text-primary"><Pill className="h-6 w-6" /></span>
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight">{med.name}</h1>
              <p className="text-muted-foreground">{med.generic ?? med.type} · {med.dosage}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full">{med.times.length}× daily</Badge>
                <Badge variant="secondary" className="rounded-full">{med.meal}</Badge>
                <Badge variant="secondary" className="rounded-full">{med.type}</Badge>
              </div>
            </div>
          </div>
          <Button asChild className="rounded-full"><Link to="/medicines/$id/edit" params={{ id: med.id }}><Pencil className="h-4 w-4 mr-1" />Edit</Link></Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5 border-border">
          <div className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />Schedule</div>
          <div className="mt-1 font-medium">{med.times.join(" · ")}</div>
          <div className="text-xs text-muted-foreground mt-2">From {fmtDay(med.startDate)}{med.endDate ? ` to ${fmtDay(med.endDate)}` : " · ongoing"}</div>
        </Card>
        <Card className="p-5 border-border">
          <div className="text-xs text-muted-foreground flex items-center gap-1"><UserIcon className="h-3 w-3" />Stock</div>
          <div className="mt-1 font-display text-2xl font-semibold">{med.stock}</div>
          <div className="text-xs text-muted-foreground mt-1">Refill at {med.refillThreshold}</div>
        </Card>
        <Card className="p-5 border-border">
          <div className="text-xs text-muted-foreground flex items-center gap-1"><Stethoscope className="h-3 w-3" />Prescriber</div>
          <div className="mt-1 font-medium">{med.doctor || "—"}</div>
          <div className="text-xs text-muted-foreground mt-1">Recent adherence: {recent.length ? Math.round((taken / recent.filter((l) => l.status !== "pending").length || 1) * 100) : 0}%</div>
        </Card>
      </div>

      {med.notes && (
        <Card className="p-5 border-border">
          <div className="text-xs text-muted-foreground mb-1">Notes</div>
          <p className="text-sm leading-relaxed">{med.notes}</p>
        </Card>
      )}

      <Card className="p-6 border-border">
        <h2 className="font-display text-lg font-semibold mb-4">Recent doses</h2>
        <ul className="divide-y divide-border">
          {recent.map((l) => (
            <li key={l.id} className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-sm">{fmtDay(l.scheduledAt)}</div>
                <div className="text-xs text-muted-foreground">{fmtTime(l.scheduledAt)}</div>
              </div>
              <Badge variant="secondary" className="capitalize">{l.status}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
