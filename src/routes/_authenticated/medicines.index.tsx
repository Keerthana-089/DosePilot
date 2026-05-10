import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Search, Trash2, Pencil, Pill } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { medicineApi, profileApi, type MedType } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/medicines/")({
  head: () => ({ meta: [{ title: "Medicines — DosePilot" }] }),
  component: MedsPage,
});

function MedsPage() {
  const profileId = profileApi.active();
  const qc = useQueryClient();
  const { data: meds = [], isLoading } = useQuery({ queryKey: ["medicines", profileId], queryFn: () => medicineApi.list(profileId) });
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");

  const filtered = meds.filter((m) => {
    const okQ = !q || m.name.toLowerCase().includes(q.toLowerCase()) || m.generic?.toLowerCase().includes(q.toLowerCase());
    const okT = type === "all" || m.type === type;
    return okQ && okT;
  });

  const onDelete = async (id: string, name: string) => {
    await medicineApi.remove(id);
    qc.invalidateQueries({ queryKey: ["medicines"] });
    qc.invalidateQueries({ queryKey: ["doses"] });
    toast.success(`Removed ${name}`);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Medicines</h1>
          <p className="text-muted-foreground mt-1">{meds.length} active medications</p>
        </div>
        <Button asChild className="rounded-full"><Link to="/medicines/new"><Plus className="h-4 w-4 mr-1" />Add medicine</Link></Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {(["Tablet", "Capsule", "Syrup", "Injection", "Drops", "Inhaler"] as MedType[]).map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Card key={i} className="h-40 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <div className="grid place-items-center h-16 w-16 mx-auto rounded-2xl bg-accent text-primary mb-4"><Pill className="h-7 w-7" /></div>
          <h3 className="font-display text-xl font-semibold">No medicines yet</h3>
          <p className="text-muted-foreground text-sm mt-1">Add your first medicine to start tracking doses.</p>
          <Button asChild className="rounded-full mt-5"><Link to="/medicines/new"><Plus className="h-4 w-4 mr-1" />Add medicine</Link></Button>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => {
            const lowStock = m.stock <= m.refillThreshold;
            return (
              <Card key={m.id} className="p-5 border-border hover:shadow-[var(--shadow-elevated)] transition-shadow group">
                <div className="flex items-start justify-between">
                  <Link to="/medicines/$id" params={{ id: m.id }} className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="grid place-items-center h-10 w-10 rounded-xl bg-accent text-primary shrink-0"><Pill className="h-5 w-5" /></span>
                    <div className="min-w-0">
                      <div className="font-display text-lg font-semibold truncate">{m.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{m.dosage} · {m.type}</div>
                    </div>
                  </Link>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                      <Link to="/medicines/$id/edit" params={{ id: m.id }}><Pencil className="h-3.5 w-3.5" /></Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-coral"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {m.name}?</AlertDialogTitle>
                          <AlertDialogDescription>This removes the medicine and its dose history.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(m.id, m.name)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full">{m.times.length}× daily</Badge>
                  <Badge variant="secondary" className="rounded-full">{m.meal}</Badge>
                  {lowStock && <Badge className="rounded-full bg-coral/15 text-coral border-0">Low stock</Badge>}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Stock: <span className="font-medium text-foreground">{m.stock}</span></span>
                  <span>{m.times.join(" · ")}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
