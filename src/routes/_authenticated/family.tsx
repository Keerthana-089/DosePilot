import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Plus, Trash2, Users as UsersIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { profileApi } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/family")({
  head: () => ({ meta: [{ title: "Family — DosePilot" }] }),
  component: Family,
});

const colors = [
  "from-primary to-primary-glow",
  "from-mint to-primary-glow",
  "from-coral to-primary",
  "from-primary to-mint",
];

function Family() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: profiles = [] } = useQuery({ queryKey: ["profiles", user?.id], queryFn: () => profileApi.list(user!.id), enabled: !!user });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [age, setAge] = useState<number | "">("");
  const active = profileApi.active();

  const onAdd = async (e: FormEvent) => {
    e.preventDefault();
    await profileApi.add({ name, relation, age: age ? Number(age) : undefined, color: colors[Math.floor(Math.random() * colors.length)] });
    qc.invalidateQueries({ queryKey: ["profiles"] });
    toast.success(`${name} added`);
    setOpen(false); setName(""); setRelation(""); setAge("");
  };

  const onRemove = async (id: string, name: string) => {
    await profileApi.remove(id);
    qc.invalidateQueries({ queryKey: ["profiles"] });
    toast.success(`Removed ${name}`);
  };

  const setActive = (id: string) => {
    profileApi.setActive(id);
    qc.invalidateQueries();
    toast.success("Profile switched");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Family</h1>
          <p className="text-muted-foreground mt-1">Manage profiles for the people you care for.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-full"><Plus className="h-4 w-4 mr-1" />Add member</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add family member</DialogTitle></DialogHeader>
            <form onSubmit={onAdd} className="space-y-4">
              <div className="space-y-1.5"><Label>Name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Relation</Label><Input required value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Mother, Son…" /></div>
                <div className="space-y-1.5"><Label>Age</Label><Input type="number" value={age} onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")} /></div>
              </div>
              <DialogFooter><Button type="submit" className="rounded-full">Add member</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {profiles.length === 0 ? (
        <Card className="p-12 text-center border-dashed"><UsersIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No profiles yet.</p></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <Card key={p.id} className={`p-5 border-border ${active === p.id ? "ring-2 ring-primary" : ""}`}>
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${p.color} grid place-items-center text-primary-foreground font-display text-lg font-semibold`}>{p.name[0]}</div>
              <div className="mt-3 font-display text-lg font-semibold">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.relation}{p.age ? ` · ${p.age}y` : ""}</div>
              <div className="mt-4 flex items-center justify-between">
                {active === p.id ? (
                  <span className="inline-flex items-center text-xs text-mint font-medium gap-1"><CheckCircle2 className="h-3.5 w-3.5" />Active</span>
                ) : (
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => setActive(p.id)}>Switch to</Button>
                )}
                {p.relation !== "Self" && (
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-coral" onClick={() => onRemove(p.id, p.name)}><Trash2 className="h-3.5 w-3.5" /></Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
