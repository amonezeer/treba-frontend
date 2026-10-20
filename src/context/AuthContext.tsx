"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type UserProfile = {
  phone?: string; lastName?: string; firstName?: string; patronymic?: string; gender?: string; birthDate?: string;
  recipients?: string; address?: string; hobbies?: string; pets?: string; additionalInfo?: string;
  recipientFirstName?: string; recipientLastName?: string; recipientPhone?: string;
  addressCity?: string; addressStreet?: string; addressBuilding?: string; deliveryMethod?: string; addressBranch?: string;
  additionalInfoOptions?: string;
};
type User = { id: string; name: string; email: string } & UserProfile;
export type LoginChallenge = { challengeId: string; methods: string[]; maskedEmail: string; expiresAt: string };
type AuthContextValue = {
  user: User | null; isLoading: boolean;
  register: (name: string, email: string, password: string, profile?: UserProfile) => Promise<void>;
  login: (email: string, password: string, remember?: boolean) => Promise<LoginChallenge | null>;
  verify: (challengeId: string, method: string, code: string, remember?: boolean) => Promise<void>;
  sendEmailCode: (challengeId: string) => Promise<void>;
  logout: () => Promise<void>; updateProfile: (patch: UserProfile) => void;
};
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
async function sessionRequest(body?: unknown) {
  const response = await fetch("/shop-api/session", { method: body ? "POST" : "GET", cache: "no-store", headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message ?? "Не вдалося увійти в акаунт.");
  return result;
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Retire the old demo identities and plaintext passwords. API sessions live in HttpOnly cookies.
    for (const key of ["treba_users", "treba_session"]) localStorage.removeItem(key);
    for (const key of ["treba_demo_users", "treba_demo_session"]) sessionStorage.removeItem(key);
    let active = true;
    void sessionRequest().then(result => { if (active) setUser(result.user); }).catch(() => {}).finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);
  async function register(name: string, email: string, password: string, profile?: UserProfile) {
    const result = await sessionRequest({ action: "register", email, password, firstName: profile?.firstName ?? name.split(" ")[0], lastName: profile?.lastName ?? name.split(" ").slice(1).join(" "), phone: profile?.phone });
    setUser(result.user);
  }
  async function login(email: string, password: string, remember = true) {
    const result = await sessionRequest({ action: "login", email, password, remember });
    if (result.challenge) return result.challenge as LoginChallenge;
    setUser(result.user); return null;
  }
  async function verify(challengeId: string, method: string, code: string, remember = true) {
    const result = await sessionRequest({ action: "verify", challengeId, method, code, remember }); setUser(result.user);
  }
  async function sendEmailCode(challengeId: string) { await sessionRequest({ action: "email", challengeId }); }
  async function logout() { try { await sessionRequest({ action: "logout" }); } finally { setUser(null); } }
  // Existing account preference fields remain local until their dedicated API is connected.
  function updateProfile(patch: UserProfile) { setUser(previous => previous ? { ...previous, ...patch } : null); }
  return <AuthContext.Provider value={{ user, isLoading, register, login, verify, sendEmailCode, logout, updateProfile }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth має використовуватися всередині AuthProvider");
  return context;
}
