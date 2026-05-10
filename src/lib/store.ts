// Mock data store backed by localStorage. All operations are async to mimic a real API.

export type MedType = "Tablet" | "Capsule" | "Syrup" | "Injection" | "Drops" | "Inhaler";
export type Meal = "Before food" | "After food" | "Anytime";
export type DoseStatus = "taken" | "skipped" | "missed" | "pending";

export interface Medicine {
  id: string;
  name: string;
  generic?: string;
  dosage: string;
  type: MedType;
  times: string[]; // ["08:00", "20:00"]
  meal: Meal;
  startDate: string;
  endDate?: string;
  notes?: string;
  stock: number;
  refillThreshold: number;
  doctor?: string;
  profileId: string;
  createdAt: string;
}

export interface DoseLog {
  id: string;
  medicineId: string;
  profileId: string;
  scheduledAt: string; // ISO
  status: DoseStatus;
  takenAt?: string;
}

export interface FamilyProfile {
  id: string;
  name: string;
  relation: string;
  age?: number;
  color: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  kind: "reminder" | "stock" | "system";
  createdAt: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // mock only
  createdAt: string;
}

export interface Settings {
  notifyReminders: boolean;
  notifyStock: boolean;
  notifyEmail: boolean;
  theme: "light" | "dark";
  weekStart: "sunday" | "monday";
}

const KEYS = {
  users: "dp_users",
  session: "dp_session",
  medicines: "dp_medicines",
  doses: "dp_doses",
  profiles: "dp_profiles",
  notifications: "dp_notifications",
  settings: "dp_settings",
  activeProfile: "dp_active_profile",
};

const isBrowser = typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, val: T) {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(val));
}

const uid = () => Math.random().toString(36).slice(2, 10);
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// ---- Seed ----
function seedFor(userId: string) {
  const profiles = read<FamilyProfile[]>(KEYS.profiles, []);
  if (profiles.find((p) => p.id === userId)) return;
  const me: FamilyProfile = { id: userId, name: "You", relation: "Self", color: "from-primary to-primary-glow" };
  write(KEYS.profiles, [me, ...profiles]);
  write(KEYS.activeProfile, userId);

  const meds: Medicine[] = [
    { id: uid(), name: "Metformin", generic: "Metformin HCl", dosage: "500mg", type: "Tablet", times: ["08:00", "20:00"], meal: "After food", startDate: new Date().toISOString(), stock: 24, refillThreshold: 10, doctor: "Dr. Park", profileId: userId, createdAt: new Date().toISOString() },
    { id: uid(), name: "Atorvastatin", dosage: "10mg", type: "Tablet", times: ["21:00"], meal: "After food", startDate: new Date().toISOString(), stock: 12, refillThreshold: 7, profileId: userId, createdAt: new Date().toISOString() },
    { id: uid(), name: "Vitamin D3", dosage: "1000 IU", type: "Capsule", times: ["09:00"], meal: "After food", startDate: new Date().toISOString(), stock: 5, refillThreshold: 7, profileId: userId, createdAt: new Date().toISOString() },
  ];
  write(KEYS.medicines, [...read<Medicine[]>(KEYS.medicines, []), ...meds]);

  // Seed dose history for last 14 days
  const logs: DoseLog[] = [];
  const now = new Date();
  for (let d = 13; d >= 0; d--) {
    for (const m of meds) {
      for (const t of m.times) {
        const [h, mi] = t.split(":").map(Number);
        const at = new Date(now);
        at.setDate(at.getDate() - d);
        at.setHours(h, mi, 0, 0);
        const isFuture = at.getTime() > now.getTime();
        const r = Math.random();
        const status: DoseStatus = isFuture ? "pending" : r < 0.85 ? "taken" : r < 0.93 ? "skipped" : "missed";
        logs.push({
          id: uid(),
          medicineId: m.id,
          profileId: userId,
          scheduledAt: at.toISOString(),
          status,
          takenAt: status === "taken" ? at.toISOString() : undefined,
        });
      }
    }
  }
  write(KEYS.doses, [...read<DoseLog[]>(KEYS.doses, []), ...logs]);

  const notifs: Notification[] = [
    { id: uid(), title: "Low stock: Vitamin D3", body: "Only 5 doses left. Time to refill.", kind: "stock", createdAt: new Date().toISOString(), read: false },
    { id: uid(), title: "Welcome to DosePilot", body: "Your account is ready. Start by reviewing today's doses.", kind: "system", createdAt: new Date().toISOString(), read: false },
  ];
  write(KEYS.notifications, notifs);

  if (!read<Settings | null>(KEYS.settings, null)) {
    write<Settings>(KEYS.settings, { notifyReminders: true, notifyStock: true, notifyEmail: false, theme: "light", weekStart: "sunday" });
  }
}

// ---- Auth ----
export const authApi = {
  async signup(name: string, email: string, password: string): Promise<User> {
    await delay();
    const users = read<User[]>(KEYS.users, []);
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with that email already exists.");
    }
    const user: User = { id: uid(), name, email, password, createdAt: new Date().toISOString() };
    write(KEYS.users, [...users, user]);
    write(KEYS.session, user.id);
    seedFor(user.id);
    return user;
  },
  async login(email: string, password: string): Promise<User> {
    await delay();
    const users = read<User[]>(KEYS.users, []);
    const u = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!u) throw new Error("Invalid email or password.");
    write(KEYS.session, u.id);
    seedFor(u.id);
    return u;
  },
  async logout() {
    if (isBrowser) localStorage.removeItem(KEYS.session);
  },
  current(): User | null {
    if (!isBrowser) return null;
    const id = localStorage.getItem(KEYS.session);
    if (!id) return null;
    return read<User[]>(KEYS.users, []).find((u) => u.id === id?.replace(/"/g, "")) ?? null;
  },
};

// ---- Profiles ----
export const profileApi = {
  async list(userId: string) {
    await delay(100);
    return read<FamilyProfile[]>(KEYS.profiles, []).filter((p) => p.id === userId || p.relation !== "Self");
  },
  async add(p: Omit<FamilyProfile, "id">) {
    await delay();
    const all = read<FamilyProfile[]>(KEYS.profiles, []);
    const np = { ...p, id: uid() };
    write(KEYS.profiles, [...all, np]);
    return np;
  },
  async remove(id: string) {
    await delay();
    write(KEYS.profiles, read<FamilyProfile[]>(KEYS.profiles, []).filter((p) => p.id !== id));
  },
  active(): string {
    if (!isBrowser) return "";
    return localStorage.getItem(KEYS.activeProfile)?.replace(/"/g, "") ?? "";
  },
  setActive(id: string) {
    write(KEYS.activeProfile, id);
  },
};

// Generate pending dose logs for a medicine for the next `days` days.
function generateDosesFor(med: Medicine, days = 14) {
  const all = read<DoseLog[]>(KEYS.doses, []);
  // Drop existing future pending logs for this med so updates re-schedule cleanly.
  const now = Date.now();
  const kept = all.filter((d) => !(d.medicineId === med.id && d.status === "pending" && new Date(d.scheduledAt).getTime() > now));
  const start = new Date(Math.max(now, new Date(med.startDate).getTime()));
  const end = med.endDate ? new Date(med.endDate).getTime() : Infinity;
  const created: DoseLog[] = [];
  for (let i = 0; i < days; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    for (const t of med.times) {
      const [h, mi] = t.split(":").map(Number);
      const at = new Date(day);
      at.setHours(h, mi, 0, 0);
      if (at.getTime() < now) continue;
      if (at.getTime() > end) continue;
      created.push({ id: uid(), medicineId: med.id, profileId: med.profileId, scheduledAt: at.toISOString(), status: "pending" });
    }
  }
  write(KEYS.doses, [...kept, ...created]);
}

// ---- Medicines ----
export const medicineApi = {
  async list(profileId: string) {
    await delay(120);
    return read<Medicine[]>(KEYS.medicines, []).filter((m) => m.profileId === profileId);
  },
  async get(id: string) {
    await delay(80);
    return read<Medicine[]>(KEYS.medicines, []).find((m) => m.id === id) ?? null;
  },
  async create(m: Omit<Medicine, "id" | "createdAt">) {
    await delay();
    const nm: Medicine = { ...m, id: uid(), createdAt: new Date().toISOString() };
    write(KEYS.medicines, [...read<Medicine[]>(KEYS.medicines, []), nm]);
    generateDosesFor(nm);
    return nm;
  },
  async update(id: string, patch: Partial<Medicine>) {
    await delay();
    const all = read<Medicine[]>(KEYS.medicines, []).map((m) => (m.id === id ? { ...m, ...patch } : m));
    write(KEYS.medicines, all);
    const updated = all.find((m) => m.id === id)!;
    generateDosesFor(updated);
    return updated;
  },
  async remove(id: string) {
    await delay();
    write(KEYS.medicines, read<Medicine[]>(KEYS.medicines, []).filter((m) => m.id !== id));
    write(KEYS.doses, read<DoseLog[]>(KEYS.doses, []).filter((d) => d.medicineId !== id));
  },
};

// ---- Doses ----
export const doseApi = {
  async list(profileId: string) {
    await delay(120);
    return read<DoseLog[]>(KEYS.doses, []).filter((d) => d.profileId === profileId);
  },
  async setStatus(id: string, status: DoseStatus) {
    await delay(120);
    const all = read<DoseLog[]>(KEYS.doses, []);
    const log = all.find((d) => d.id === id);
    if (!log) return;
    log.status = status;
    log.takenAt = status === "taken" ? new Date().toISOString() : undefined;
    write(KEYS.doses, all);
    if (status === "taken") {
      // decrement stock
      const meds = read<Medicine[]>(KEYS.medicines, []);
      const m = meds.find((mm) => mm.id === log.medicineId);
      if (m) {
        m.stock = Math.max(0, m.stock - 1);
        write(KEYS.medicines, meds);
        if (m.stock <= m.refillThreshold) {
          const notifs = read<Notification[]>(KEYS.notifications, []);
          if (!notifs.find((n) => n.title === `Low stock: ${m.name}` && !n.read)) {
            notifs.unshift({ id: uid(), title: `Low stock: ${m.name}`, body: `Only ${m.stock} doses left. Refill soon.`, kind: "stock", createdAt: new Date().toISOString(), read: false });
            write(KEYS.notifications, notifs);
          }
        }
      }
    }
    return log;
  },
};

// ---- Notifications ----
export const notificationApi = {
  async list() {
    await delay(80);
    return read<Notification[]>(KEYS.notifications, []);
  },
  async markAllRead() {
    await delay(80);
    const all = read<Notification[]>(KEYS.notifications, []).map((n) => ({ ...n, read: true }));
    write(KEYS.notifications, all);
  },
  async remove(id: string) {
    await delay(80);
    write(KEYS.notifications, read<Notification[]>(KEYS.notifications, []).filter((n) => n.id !== id));
  },
};

// ---- Settings ----
export const settingsApi = {
  async get(): Promise<Settings> {
    await delay(60);
    return read<Settings>(KEYS.settings, { notifyReminders: true, notifyStock: true, notifyEmail: false, theme: "light", weekStart: "sunday" });
  },
  async update(patch: Partial<Settings>) {
    await delay();
    const cur = await settingsApi.get();
    const next = { ...cur, ...patch };
    write(KEYS.settings, next);
    return next;
  },
};
