import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi, type User } from "./store";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(authApi.current());
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await authApi.login(email, password);
    setUser(u);
  }, []);
  const signup = useCallback(async (name: string, email: string, password: string) => {
    const u = await authApi.signup(name, email, password);
    setUser(u);
  }, []);
  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  return <Ctx.Provider value={{ user, loading, login, signup, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
