import { format, isToday, isTomorrow } from "date-fns";
import type { DoseLog, Medicine } from "./store";

export function adherence(logs: DoseLog[], days = 30) {
  const cutoff = Date.now() - days * 86400000;
  const past = logs.filter((l) => new Date(l.scheduledAt).getTime() < Date.now() && new Date(l.scheduledAt).getTime() > cutoff && l.status !== "pending");
  if (past.length === 0) return 0;
  const taken = past.filter((l) => l.status === "taken").length;
  return Math.round((taken / past.length) * 100);
}

export function todayLogs(logs: DoseLog[]) {
  return logs.filter((l) => isToday(new Date(l.scheduledAt))).sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));
}

export function upcomingLogs(logs: DoseLog[]) {
  const now = Date.now();
  return logs.filter((l) => new Date(l.scheduledAt).getTime() >= now && l.status === "pending").sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));
}

export function missedLogs(logs: DoseLog[]) {
  return logs.filter((l) => l.status === "missed");
}

export function lowStock(meds: Medicine[]) {
  return meds.filter((m) => m.stock <= m.refillThreshold);
}

export function fmtTime(d: string | Date) {
  return format(new Date(d), "h:mm a");
}
export function fmtDay(d: string | Date) {
  const dt = new Date(d);
  if (isToday(dt)) return "Today";
  if (isTomorrow(dt)) return "Tomorrow";
  return format(dt, "EEE, MMM d");
}

export function adherenceByDay(logs: DoseLog[], days = 7) {
  const out: { day: string; taken: number; total: number; pct: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const same = logs.filter((l) => {
      const ld = new Date(l.scheduledAt);
      return ld.toDateString() === d.toDateString() && l.status !== "pending";
    });
    const taken = same.filter((l) => l.status === "taken").length;
    out.push({ day: format(d, "EEE"), taken, total: same.length, pct: same.length ? Math.round((taken / same.length) * 100) : 0 });
  }
  return out;
}
