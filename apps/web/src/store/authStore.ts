import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  /** ISO timestamp de cuándo se creó la cuenta en Supabase — usado para distinguir una
   * cuenta recién creada (debe arrancar en cero) de una que ya inicia sesión de vuelta. */
  createdAt: string;
}

function toAuthUser(user: User): AuthUser {
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? null,
    name: (meta.full_name as string) ?? (meta.name as string) ?? null,
    avatarUrl: (meta.avatar_url as string) ?? (meta.picture as string) ?? null,
    createdAt: user.created_at,
  };
}

interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  status: "loading" | "signed-out" | "signed-in" | "unavailable";
  initialized: boolean;
  init: () => void;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signUpWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  status: isSupabaseConfigured ? "loading" : "unavailable",
  initialized: false,

  init: () => {
    if (get().initialized) return;
    set({ initialized: true });

    if (!supabase) {
      set({ status: "unavailable" });
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      set({
        session,
        user: session?.user ? toAuthUser(session.user) : null,
        status: session?.user ? "signed-in" : "signed-out",
      });
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ? toAuthUser(session.user) : null,
        status: session?.user ? "signed-in" : "signed-out",
      });
    });
  },

  signInWithGoogle: async () => {
    if (!supabase) return { error: "Supabase no está configurado en este despliegue." };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/app` },
    });
    return { error: error?.message ?? null };
  },

  signUpWithPassword: async (email: string, password: string) => {
    if (!supabase) return { error: "Supabase no está configurado en este despliegue." };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/app` },
    });
    return { error: error?.message ?? null };
  },

  signInWithPassword: async (email: string, password: string) => {
    if (!supabase) return { error: "Supabase no está configurado en este despliegue." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  },

  signOut: async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    set({ user: null, session: null, status: "signed-out" });
  },
}));
