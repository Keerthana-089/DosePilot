import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { doseApi, medicineApi, notificationApi, profileApi, settingsApi, type DoseLog, type Medicine, type Notification } from "./store";

const FIRED_KEY = "dp_fired_reminders";

function loadFired(): Record<string, true> {
  try { return JSON.parse(localStorage.getItem(FIRED_KEY) || "{}"); } catch { return {}; }
}
function saveFired(f: Record<string, true>) {
  localStorage.setItem(FIRED_KEY, JSON.stringify(f));
}

export function useReminderScheduler() {
  const qc = useQueryClient();
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    const tick = async () => {
      try {
        const profileId = profileApi.active();
        if (!profileId) return;
        const settings = await settingsApi.get();
        if (!settings.notifyReminders) return;

        const [meds, logs, notifs] = await Promise.all([
          medicineApi.list(profileId),
          doseApi.list(profileId),
          notificationApi.list(),
        ]);
        const medById = new Map<string, Medicine>(meds.map((m) => [m.id, m]));
        const fired = loadFired();
        const now = Date.now();
        let added = 0;
        const newNotifs: Notification[] = [];

        for (const l of logs as DoseLog[]) {
          if (l.status !== "pending") continue;
          if (fired[l.id]) continue;
          const t = new Date(l.scheduledAt).getTime();
          // Fire from scheduled time up to 60 minutes after
          if (t > now || now - t > 60 * 60 * 1000) continue;
          const m = medById.get(l.medicineId);
          if (!m) continue;

          const title = `Time for ${m.name}`;
          const body = `${m.dosage} · ${m.meal}`;

          if ("Notification" in window && Notification.permission === "granted") {
            try { new Notification(title, { body, tag: l.id }); } catch { /* noop */ }
          }
          toast(title, { description: body, duration: 8000 });
          newNotifs.push({
            id: Math.random().toString(36).slice(2, 10),
            title, body, kind: "reminder",
            createdAt: new Date().toISOString(), read: false,
          });
          fired[l.id] = true;
          added++;
        }

        if (added > 0) {
          localStorage.setItem("dp_notifications", JSON.stringify([...newNotifs, ...notifs]));
          saveFired(fired);
          qc.invalidateQueries({ queryKey: ["notifications"] });
        }
      } catch { /* ignore */ }
    };

    tick();
    tickRef.current = window.setInterval(tick, 30_000) as unknown as number;
    return () => { if (tickRef.current) window.clearInterval(tickRef.current); };
  }, [qc]);
}
