/** Toda la persistencia local de la app (Zustand `persist` + flags sueltos) usa este prefijo. */
const LOCAL_STATE_PREFIX = "spider-";

/** Preferencias del NAVEGADOR, no de la cuenta — ya viste el onboarding o aceptaste los términos
 * en este navegador sin importar qué cuenta esté activa ahora. Borrarlas en cada cambio de cuenta
 * haría reaparecer el modal de bienvenida cada vez que alguien cierra e inicia sesión de nuevo. */
const PRESERVE_KEYS = new Set(["spider-onboarding-completed", "spider-legal-consent-accepted"]);

/**
 * Borra todo el progreso local (racha de Academia, Diario, paper trading, watchlists,
 * preferencias, etc.) — se usa cuando una cuenta recién creada arranca sesión, para que no
 * herede datos de "invitado" acumulados en el navegador antes de crear la cuenta. No toca el
 * caché de velas en IndexedDB (`spider-cache` en localStorage sí se borra, pero eso es solo un
 * flag pequeño — el caché real de velas no es "progreso" del usuario), ni las preferencias de
 * navegador en PRESERVE_KEYS.
 */
export function resetLocalState(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(LOCAL_STATE_PREFIX) && !PRESERVE_KEYS.has(key)) keysToRemove.push(key);
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
