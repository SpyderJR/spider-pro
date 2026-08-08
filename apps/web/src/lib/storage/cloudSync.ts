import { supabase } from "../supabase";
import type { BlobSyncTarget, SetSyncTarget } from "./types";
import { touchLocalUpdatedAt, getLocalUpdatedAt } from "./localMeta";
import { resetLocalState } from "./resetLocalState";

const PUSH_DEBOUNCE_MS = 2000;
const pushTimers = new Map<string, ReturnType<typeof setTimeout>>();

export type SyncStatus = "idle" | "syncing" | "synced" | "error";
let statusListeners: Array<(s: SyncStatus) => void> = [];
let currentStatus: SyncStatus = "idle";

function setStatus(s: SyncStatus) {
  currentStatus = s;
  statusListeners.forEach((cb) => cb(s));
}

export function onSyncStatusChange(cb: (s: SyncStatus) => void): () => void {
  statusListeners.push(cb);
  cb(currentStatus);
  return () => {
    statusListeners = statusListeners.filter((l) => l !== cb);
  };
}

function schedulePush(key: string, fn: () => Promise<void>) {
  const existing = pushTimers.get(key);
  if (existing) clearTimeout(existing);
  pushTimers.set(
    key,
    setTimeout(() => {
      setStatus("syncing");
      fn()
        .then(() => setStatus("synced"))
        .catch(() => setStatus("error"));
    }, PUSH_DEBOUNCE_MS),
  );
}

const unsubscribers: Array<() => void> = [];

/** Trae el remoto, lo mergea con lo local (sin perder nada), aplica el merge local y lo vuelve a subir. */
async function pullMergeAndPush<T>(userId: string, target: BlobSyncTarget<T>) {
  const { data: row } = await supabase!
    .from(target.table)
    .select("data, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  const remote = (row?.data as T | undefined) ?? null;
  const remoteUpdatedAt = (row?.updated_at as string | undefined) ?? null;
  const localUpdatedAt = getLocalUpdatedAt(target.table);
  const merged = target.merge(target.getLocal(), remote, localUpdatedAt, remoteUpdatedAt);
  target.setLocal(merged);

  await supabase!.from(target.table).upsert({
    user_id: userId,
    data: merged as unknown as Record<string, unknown>,
    updated_at: new Date().toISOString(),
  });
}

async function pullMergeAndPushSet<TItem>(userId: string, target: SetSyncTarget<TItem>) {
  const { data: rows } = await supabase!.from(target.table).select("*").eq("user_id", userId);
  const remoteItems = (rows ?? []).map((r) => target.fromRow(r as Record<string, unknown>));

  const byId = new Map<string, TItem>();
  for (const item of remoteItems) byId.set(target.getId(item), item);
  for (const item of target.getLocalItems()) byId.set(target.getId(item), item); // local gana en empate de id
  const merged = [...byId.values()];

  target.setLocalItems(merged);

  const rowsToUpsert = merged.map((item) => target.toRow(userId, item));
  if (rowsToUpsert.length > 0) {
    await supabase!.from(target.table).upsert(rowsToUpsert, { onConflict: `user_id,${target.idColumn}` });
  }
}

function registerBlobTarget(userId: string, target: BlobSyncTarget<unknown>) {
  const unsub = target.subscribeLocal(() => {
    touchLocalUpdatedAt(target.table);
    schedulePush(target.table, async () => {
      await supabase!.from(target.table).upsert({
        user_id: userId,
        data: target.getLocal() as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      });
    });
  });
  unsubscribers.push(unsub);
}

function registerSetTarget(userId: string, target: SetSyncTarget<unknown>) {
  const unsub = target.subscribeLocal(() => {
    schedulePush(target.table, async () => {
      const rows = target.getLocalItems().map((item) => target.toRow(userId, item));
      if (rows.length === 0) return;
      await supabase!.from(target.table).upsert(rows, { onConflict: `user_id,${target.idColumn}` });
    });
  });
  unsubscribers.push(unsub);
}

/** true si esta cuenta ya tiene ALGO guardado en la nube, en cualquier tabla — no si "acaba de
 * crearse" (esa señal de tiempo resultó frágil: si pasan más de unos minutos entre crear la
 * cuenta y lograr iniciar sesión — ej. por un problema de configuración en el medio — la ventana
 * se cierra y el reseteo nunca se dispara). Esto en cambio nunca falla por tiempo: una cuenta que
 * jamás sincronizó nada, sin importar cuándo se creó, sigue siendo "nueva" hasta su primer sync. */
async function hasAnyRemoteData(
  userId: string,
  blobTargets: BlobSyncTarget<unknown>[],
  setTargets: SetSyncTarget<unknown>[],
): Promise<boolean> {
  for (const target of blobTargets) {
    const { data } = await supabase!.from(target.table).select("user_id").eq("user_id", userId).maybeSingle();
    if (data) return true;
  }
  for (const target of setTargets) {
    const { data } = await supabase!.from(target.table).select("user_id").eq("user_id", userId).limit(1);
    if (data && data.length > 0) return true;
  }
  return false;
}

/**
 * Se llama una vez al iniciar sesión: para cada dominio, trae lo que haya en la nube,
 * lo mergea con el progreso local existente (nunca se pierde nada de ningún lado) y deja
 * ambos lados escuchando cambios futuros para sincronizar en caliente (debounced).
 *
 * Antes de mergear nada, si esta cuenta nunca sincronizó datos en NINGUNA tabla (cuenta
 * genuinamente nueva, en cualquier dispositivo), borra el progreso local acumulado como
 * invitado ANTES de crear la cuenta — si no, ese progreso se "adoptaría" como si fuera de la
 * cuenta nueva. Se marca con un flag por cuenta para no repetir el chequeo en cada visita.
 */
export async function startCloudSync(
  userId: string,
  blobTargets: BlobSyncTarget<unknown>[],
  setTargets: SetSyncTarget<unknown>[],
) {
  if (!supabase) return;
  setStatus("syncing");
  try {
    const resetCheckedKey = `spider-reset-checked-${userId}`;
    if (!localStorage.getItem(resetCheckedKey)) {
      const hasData = await hasAnyRemoteData(userId, blobTargets, setTargets);
      if (!hasData) {
        resetLocalState();
        localStorage.setItem(resetCheckedKey, "1");
        window.location.reload();
        return;
      }
      localStorage.setItem(resetCheckedKey, "1");
    }

    for (const target of blobTargets) {
      await pullMergeAndPush(userId, target);
      registerBlobTarget(userId, target);
    }
    for (const target of setTargets) {
      await pullMergeAndPushSet(userId, target);
      registerSetTarget(userId, target);
    }
    setStatus("synced");
  } catch {
    setStatus("error");
  }
}

export function stopCloudSync() {
  unsubscribers.forEach((u) => u());
  unsubscribers.length = 0;
  pushTimers.forEach((t) => clearTimeout(t));
  pushTimers.clear();
  setStatus("idle");
}
