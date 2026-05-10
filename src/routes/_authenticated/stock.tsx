import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { medicineApi, profileApi } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/stock")({
  head: () => ({ meta: [{ title: "Stock — DosePilot" }] }),
  component: Stock,
});

function Stock() {
  const profileId = profileApi.active();
  const qc = useQueryClient();
  const { data: meds = [] } = useQuery({ queryKey: ["medicines", profileId], queryFn: () => medicineApi.list(profileId) });
  const [refillFor, setRefillFor] = useState<string | null>(null);
  const [refillQty, setRefillQty] = useState(30);

  const refill = async (id: string) => {
    const m = meds.find((mm) => mm.id === id);
    if (!m) return;
    await medicineApi.update(id, { stock: m.stock + refillQty });
    qc.invalidateQueries({ queryKey: ["medicines"] });
    toast.success(`Added ${refillQty} doses to ${m.name}`);
    setRefillFor(null);
    setRefillQty(30);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Stock</h1>
        <p className="text-muted-foreground mt-1">Track inventory and log refills.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {meds.map((m) => {
          const max = Math.max(m.refillThreshold * 4, m.stock);
          const pct = (m.stock / max) * 100;
          const low = m.stock <= m.refillThreshold;
          return (
            <Card key={m.id} className="p-5 border-border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-lg font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.dosage} · {m.type}</div>
                </div>
                <div className={`text-right ${low ? "text-coral" : ""}`}>
                  <div className="font-display text-2xl font-semibold">{m.stock}</div>
                  <div className="text-xs">{low ? "Low stock" : "doses left"}</div>
                </div>
              </div>
              <Progress value={pct} className="h-2 mt-4" />
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-muted-foreground">Refill at {m.refillThreshold}</span>
                {refillFor === m.id ? (
                  <div className="flex items-center gap-2">
                    <Input type="number" min={1} value={refillQty} onChange={(e) => setRefillQty(Number(e.target.value))} className="h-8 w-20" />
                    <Button size="sm" onClick={() => refill(m.id)}>Add</Button>
                    <Button size="sm" variant="ghost" onClick={() => setRefillFor(null)}>Cancel</Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => setRefillFor(m.id)}><Plus className="h-3.5 w-3.5 mr-1" />Refill</Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
