export const BACKUP_KEYS = [
  "spider-paper-trading",
  "spider-futures-trading",
  "spider-academy-progress",
  "spider-arcade-progress",
  "spider-diary",
  "spider-replay-trading",
  "spider-terminal-preferences",
  "spider-onboarding-completed",
  "spider-legal-consent-accepted",
];

export function exportBackup(): string {
  const data: Record<string, string> = {};
  for (const key of BACKUP_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw !== null) data[key] = raw;
  }
  return JSON.stringify({ app: "spider-pro", version: 1, exportedAt: new Date().toISOString(), data }, null, 2);
}

export function downloadBackup(): void {
  const json = exportBackup();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `spider-pro-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importBackup(json: string): { success: boolean; error?: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { success: false, error: "El archivo no es un JSON válido." };
  }
  if (typeof parsed !== "object" || parsed === null || !("data" in parsed) || typeof (parsed as { data: unknown }).data !== "object") {
    return { success: false, error: "Este archivo no tiene el formato de un respaldo de Spider Pro." };
  }
  const data = (parsed as { data: Record<string, unknown> }).data;
  let restored = 0;
  for (const key of BACKUP_KEYS) {
    const value = data[key];
    if (typeof value === "string") {
      localStorage.setItem(key, value);
      restored += 1;
    }
  }
  if (restored === 0) return { success: false, error: "El archivo no contenía ningún dato reconocible." };
  return { success: true };
}
