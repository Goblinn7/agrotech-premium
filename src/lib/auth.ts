import { useEffect, useState } from "react";

const KEY = "agrotech_admin_auth";

export const ADMIN_USER = "admin";
export const ADMIN_PASS = "admin123";

const listeners = new Set<(v: boolean) => void>();

export const auth = {
  isLoggedIn(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(KEY) === "1";
  },
  login(u: string, p: string): boolean {
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      localStorage.setItem(KEY, "1");
      listeners.forEach((l) => l(true));
      return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem(KEY);
    listeners.forEach((l) => l(false));
  },
  subscribe(l: (v: boolean) => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useAuth() {
  const [v, setV] = useState(false);
  useEffect(() => {
    setV(auth.isLoggedIn());
    const off = auth.subscribe(setV);
    return () => { off(); };
  }, []);
  return v;
}
