import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { startCloudSync, stopCloudSync } from "../lib/storage/cloudSync";
import { ALL_BLOB_TARGETS, ALL_SET_TARGETS } from "../lib/storage/adapters";

/** Arranca/para la sincronización con la nube según haya sesión — montar una sola vez en el dashboard.
 * startCloudSync() ya decide internamente si esta cuenta necesita resetear el progreso local de
 * invitado antes de mergear (ver lib/storage/cloudSync.ts). */
export function useCloudSync() {
  const { init, status, user } = useAuthStore();
  const syncedUserId = useRef<string | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (status === "signed-in" && user && syncedUserId.current !== user.id) {
      syncedUserId.current = user.id;
      startCloudSync(user.id, ALL_BLOB_TARGETS, ALL_SET_TARGETS);
    }
    if (status === "signed-out" && syncedUserId.current !== null) {
      syncedUserId.current = null;
      stopCloudSync();
    }
  }, [status, user]);
}
