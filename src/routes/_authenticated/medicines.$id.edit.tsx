import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicineForm } from "@/components/app/MedicineForm";
import { medicineApi } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/medicines/$id/edit")({
  head: () => ({ meta: [{ title: "Edit medicine — DosePilot" }] }),
  component: EditMed,
});

function EditMed() {
  const { id } = Route.useParams();
  const { data: med, isLoading } = useQuery({ queryKey: ["medicine", id], queryFn: () => medicineApi.get(id) });

  return (
    <div className="max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" asChild><Link to="/medicines/$id" params={{ id }}><ArrowLeft className="h-4 w-4 mr-1" />Back</Link></Button>
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Edit medicine</h1>
        <p className="text-muted-foreground mt-1">Update schedule, stock, or notes.</p>
      </div>
      {isLoading ? <Skeleton className="h-96" /> : med ? <MedicineForm initial={med} /> : <p>Not found.</p>}
    </div>
  );
}
