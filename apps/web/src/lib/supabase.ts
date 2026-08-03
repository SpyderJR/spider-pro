import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * `null` cuando no hay variables de entorno configuradas — la app entera es local-first
 * por diseño, así que todo lo que toque este cliente debe chequear `isSupabaseConfigured`
 * (o simplemente el valor `null`) y degradar a modo local sin romper nada.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
