import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import { env } from "./env.js";

export const isSupabaseAdminConfigured = Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Cliente con la service role key — SOLO se usa en el servidor (nunca se expone al
 * navegador) para verificar JWTs de usuarios y para el borrado de cuenta, que requiere
 * privilegios de administrador sobre auth.users. Nunca usa Realtime, pero `createClient`
 * igual instancia un `RealtimeClient` internamente y este SDK (2.112.0) ya no hace fallback
 * automático al paquete `ws` — solo revisa si existe un `WebSocket` global (Node 22+,
 * navegador, Deno) y si no lo encuentra, lanza en vez de degradar. El runtime de Netlify
 * Functions corre en Node 20 sin ese global, así que sin pasar `transport` explícito esto
 * tumbaba la función completa al cargar el módulo.
 */
export const supabaseAdmin: SupabaseClient | null = isSupabaseAdminConfigured
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { transport: WebSocket as unknown as typeof globalThis.WebSocket },
    })
  : null;

/** Devuelve el user id si el JWT es válido, o null (sin lanzar) si no hay token, es inválido, o Supabase no está configurado. */
export async function verifyUserToken(authorizationHeader: string | undefined): Promise<string | null> {
  if (!supabaseAdmin || !authorizationHeader?.startsWith("Bearer ")) return null;
  const token = authorizationHeader.slice("Bearer ".length);
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}
