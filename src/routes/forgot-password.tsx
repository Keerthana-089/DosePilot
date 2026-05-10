import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — DosePilot" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("Reset link sent (demo).");
  };
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-[var(--gradient-primary)] text-primary-foreground"><Pill className="h-4.5 w-4.5" /></span>
          <span className="font-display text-xl font-semibold">DosePilot</span>
        </Link>
        <h1 className="font-display text-3xl font-semibold">Reset your password</h1>
        <p className="text-muted-foreground text-sm mt-1">We'll send a link to your email.</p>
        {sent ? (
          <div className="mt-8 rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-sm">Check your inbox at <span className="font-medium">{email}</span></p>
            <Button asChild variant="ghost" className="mt-4"><Link to="/login">Back to login</Link></Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" className="w-full rounded-full h-11">Send reset link</Button>
            <Link to="/login" className="block text-center text-sm text-muted-foreground hover:text-foreground">Back to login</Link>
          </form>
        )}
      </div>
    </div>
  );
}
