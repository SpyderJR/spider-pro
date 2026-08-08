import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { startCloudSync, stopCloudSync } from "../lib/storage/cloudSync";
import { ALL_BLOB_TARGETS, ALL_SET_TARGETS } from "../lib/storage/adapters";
import { resetLocalState } from "../lib/storage/resetLocalState";

/** Ventana de gracia entre "la cuenta se creó" y "esta sesión arrancó" — cubre el ida y vuelta
 * del redirect de OAuth/confirmación de correo, que puede tardar unos segundos. */
const FRESH_ACCOUNT_WINDOW_MS = 5 * 60 * 1000;

/** Arranca/para la sincronización con la nube según haya sesión — montar una sola vez en el dashboard. */
export function useCloudSync() {
  const { init, status, user } = useAuthStore();
  const syncedUserId = useRef<string | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (status === "signed-in" && user && syncedUserId.current !== user.id) {
      syncedUserId.current = user.id;

      // Cuenta recién creada — no debe heredar racha/trades/etc. acumulados en el navegador
      // ANTES de crear la cuenta (datos de "invitado"). Se detecta con la fecha real de
      // creación que da Supabase, así funciona igual para Google y para correo/contraseña.
      // La marca de "ya se reseteó" vive fuera del prefijo que resetLocalState() borra, para
      // no auto-eliminarse y así no repetir el reset en cada visita dentro de la ventana.
      const resetDoneKey = `spider-reset-done-${user.id}`;
      const accountAgeMs = Date.now() - new Date(user.createdAt).getTime();
      const isFreshAccount = accountAgeMs >= 0 && accountAgeMs < FRESH_ACCOUNT_WINDOW_MS;
      if (isFreshAccount && !localStorage.getItem(resetDoneKey)) {
        resetLocalState();
        localStorage.setItem(resetDoneKey, "1");
        window.location.reload();
        return;
      }

      startCloudSync(user.id, ALL_BLOB_TARGETS, ALL_SET_TARGETS);
    }
    if (status === "signed-out" && syncedUserId.current !== null) {
      syncedUserId.current = null;
      stopCloudSync();
    }
  }, [status, user]);
}
