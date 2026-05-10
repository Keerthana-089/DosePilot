import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/_authenticated/help")({
  head: () => ({ meta: [{ title: "Help — DosePilot" }] }),
  component: Help,
});

const faqs = [
  { q: "How do reminders work?", a: "We schedule each dose based on the times you set per medicine. Mark a dose as taken or skipped from the dashboard or reminders page." },
  { q: "How is stock tracked?", a: "Each time you mark a dose as taken, stock decrements by one. When it hits your refill threshold, you'll get a low-stock notification." },
  { q: "Can I switch between family members?", a: "Yes — go to Family and tap 'Switch to' on any profile. The whole app re-scopes to that person." },
  { q: "Is my data exported anywhere?", a: "No. This demo stores everything locally in your browser. Connect a backend to enable cloud sync." },
];

function Help() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const submit = (e: FormEvent) => { e.preventDefault(); setName(""); setMsg(""); toast.success("Message sent — we'll be in touch."); };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground mt-1">Browse common questions or reach out to our team.</p>
      </div>

      <Card className="p-6 border-border">
        <h2 className="font-display text-lg font-semibold mb-4">Frequently asked</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`} className="border border-border rounded-xl px-5">
              <AccordionTrigger className="hover:no-underline font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      <Card className="p-6 border-border">
        <h2 className="font-display text-lg font-semibold mb-4">Contact support</h2>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5"><Label>Your name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Message</Label><Textarea required rows={5} value={msg} onChange={(e) => setMsg(e.target.value)} /></div>
          <div className="flex justify-end"><Button type="submit" className="rounded-full">Send message</Button></div>
        </form>
      </Card>
    </div>
  );
}
