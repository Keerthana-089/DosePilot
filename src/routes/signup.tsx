import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Pill, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — DosePilot" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success("Account created — welcome aboard!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-12 order-2 lg:order-1">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
          <div className="lg:hidden flex items-center gap-2">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-[var(--gradient-primary)] text-primary-foreground"><Pill className="h-4.5 w-4.5" /></span>
            <span className="font-display text-xl font-semibold">DosePilot</span>
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Create your account</h1>
            <p className="mt-1 text-muted-foreground text-sm">Free forever for personal use.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 rounded-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Create account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
          </p>
        </form>
      </div>
      <div className="hidden lg:flex flex-col justify-between p-12 order-1 lg:order-2" style={{ background: "var(--gradient-primary)" }}>
        <Link to="/" className="flex items-center gap-2 text-primary-foreground">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-white/15"><Pill className="h-4.5 w-4.5" /></span>
          <span className="font-display text-xl font-semibold">DosePilot</span>
        </Link>
        <div className="text-primary-foreground">
          <h2 className="font-display text-4xl font-semibold leading-tight">Healthier living,<br />one dose at a time.</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-md">Join 200,000+ families staying on top of their medications with calm, beautiful tools.</p>
        </div>
        <div className="text-primary-foreground/60 text-sm">© 2026 DosePilot</div>
      </div>
    </div>
  );
}
