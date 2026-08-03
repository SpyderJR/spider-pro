const STORAGE_KEY = "spider-sync-local-meta";

function readAll(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/** Marca "ahora" como la última vez que este dominio cambió localmente — persistido, sobrevive recargas. */
export function touchLocalUpdatedAt(table: string): string {
  const all = readAll();
  const now = new Date().toISOString();
  all[table] = now;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return now;
}

export function getLocalUpdatedAt(table: string): string | null {
  return readAll()[table] ?? null;
}
