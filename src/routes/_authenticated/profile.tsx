import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — DosePilot" }] }),
  component: Profile,
});

function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [pwCur, setPwCur] = useState("");
  const [pwNew, setPwNew] = useState("");

  const save = (e: FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated");
  };
  const changePw = (e: FormEvent) => {
    e.preventDefault();
    if (!pwCur || pwNew.length < 6) { toast.error("Provide current password and new password (min 6 chars)"); return; }
    setPwCur(""); setPwNew("");
    toast.success("Password changed");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information.</p>
      </div>

      <Card className="p-6 border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-primary-foreground font-display text-xl font-semibold">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="font-display text-xl font-semibold">{user?.name}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
        </div>
        <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="sm:col-span-2 flex justify-end"><Button type="submit" className="rounded-full">Save changes</Button></div>
        </form>
      </Card>

      <Card className="p-6 border-border">
        <h2 className="font-display text-lg font-semibold mb-4">Change password</h2>
        <form onSubmit={changePw} className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Current password</Label><Input type="password" value={pwCur} onChange={(e) => setPwCur(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>New password</Label><Input type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} /></div>
          <div className="sm:col-span-2 flex justify-end"><Button type="submit" variant="outline" className="rounded-full">Update password</Button></div>
        </form>
      </Card>
    </div>
  );
}
