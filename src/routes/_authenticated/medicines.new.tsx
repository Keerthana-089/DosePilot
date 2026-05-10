import { createFileRoute } from "@tanstack/react-router";
import { MedicineForm } from "@/components/app/MedicineForm";

export const Route = createFileRoute("/_authenticated/medicines/new")({
  head: () => ({ meta: [{ title: "Add medicine — DosePilot" }] }),
  component: NewMed,
});

function NewMed() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Add medicine</h1>
        <p className="text-muted-foreground mt-1">Tell us about the medication and its schedule.</p>
      </div>
      <MedicineForm />
    </div>
  );
}
