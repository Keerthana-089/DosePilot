import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Pill, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — DosePilot" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => { setEmail("demo@dosepilot.app"); setPassword("demo1234"); };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12" style={{ background: "var(--gradient-primary)" }}>
        <Link to="/" className="flex items-center gap-2 text-primary-foreground">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-white/15"><Pill className="h-4.5 w-4.5" /></span>
          <span className="font-display text-xl font-semibold">DosePilot</span>
        </Link>
        <div className="text-primary-foreground">
          <h2 className="font-display text-4xl font-semibold leading-tight">Welcome back to your<br />calmer routine.</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-md">Pick up right where you left off — your reminders, refills, and family profiles are all waiting.</p>
        </div>
        <div className="text-primary-foreground/60 text-sm">© 2026 DosePilot</div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
          <div className="lg:hidden flex items-center gap-2">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-[var(--gradient-primary)] text-primary-foreground"><Pill className="h-4.5 w-4.5" /></span>
            <span className="font-display text-xl font-semibold">DosePilot</span>
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Log in</h1>
            <p className="mt-1 text-muted-foreground text-sm">Enter your credentials to access your account.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
              </div>
              <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 rounded-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Log in
          </Button>
          <Button type="button" variant="outline" className="w-full h-11 rounded-full" onClick={fillDemo}>Use demo credentials</Button>
          <p className="text-center text-sm text-muted-foreground">
            No account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up free</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
