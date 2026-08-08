import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuthStore } from "../../store/authStore";
import { isSupabaseConfigured } from "../../lib/supabase";
import { onSyncStatusChange, type SyncStatus } from "../../lib/storage/cloudSync";
import { downloadBackup } from "../../lib/backup";
import { LoginModal } from "./LoginModal";
import { DeleteAccountModal } from "./DeleteAccountModal";

const SYNC_LABEL: Record<SyncStatus, string> = {
  idle: "Guardado en este dispositivo",
  syncing: "Sincronizando…",
  synced: "Sincronizado en la nube",
  error: "Error de sincronización — reintentando",
};

export function AccountMenu() {
  const { user, status, signOut } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  useEffect(() => onSyncStatusChange(setSyncStatus), []);

  if (!isSupabaseConfigured || status === "unavailable" || status === "loading") return null;

  if (status === "signed-out") {
    return (
      <>
        <button
          onClick={() => setShowLogin(true)}
          className="shrink-0 text-[11px] font-mono text-slate-400 hover:text-neon-green border border-void-border hover:border-neon-green/40 rounded-lg px-3 py-1.5 transition-colors"
        >
          Iniciar sesión
        </button>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </>
    );
  }

  function toggleOpen() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right) });
    }
    setOpen((v) => !v);
  }

  return (
    <div className="shrink-0">
      <button ref={buttonRef} onClick={toggleOpen} className="flex items-center" title="Cuenta">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full border border-void-border" />
        ) : (
          <span className="w-7 h-7 rounded-full bg-neon-green/10 border border-neon-green/40 text-neon-green text-xs font-mono font-bold flex items-center justify-center">
            {(user?.name ?? user?.email ?? "?").charAt(0).toUpperCase()}
          </span>
        )}
      </button>

      {open &&
        createPortal(
          <>
            {/* Portal directo a document.body — la barra superior tiene overflow-x-auto, que
             * recortaba este menú (position: absolute queda atrapado por el overflow de
             * cualquier ancestro), dejando visible solo una esquina en vez del panel completo. */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              className="fixed z-50 w-64 panel p-3"
              style={{ top: menuPos.top, right: menuPos.right }}
            >
              <div className="px-1 pb-2 mb-2 border-b border-void-border">
                <div className="text-sm text-white font-medium truncate">{user?.name ?? "Cuenta"}</div>
                <div className="text-xs text-slate-500 truncate">{user?.email}</div>
              </div>
              <div className="px-1 pb-2 mb-2 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    syncStatus === "synced" ? "bg-neon-green" : syncStatus === "error" ? "bg-neon-red" : "bg-neon-gold animate-pulse"
                  }`}
                />
                {SYNC_LABEL[syncStatus]}
              </div>
              <button
                onClick={() => {
                  downloadBackup();
                  setOpen(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-lg text-sm text-slate-300 hover:bg-white/5"
              >
                Exportar mis datos (JSON)
              </button>
              <button
                onClick={() => {
                  setShowDelete(true);
                  setOpen(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-lg text-sm text-neon-red hover:bg-neon-red/10"
              >
                Eliminar mi cuenta
              </button>
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                  setShowLogin(true);
                }}
                className="w-full text-left px-2 py-1.5 rounded-lg text-sm text-slate-300 hover:bg-white/5"
              >
                Cambiar de cuenta
              </button>
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-lg text-sm text-slate-400 hover:bg-white/5"
              >
                Cerrar sesión
              </button>
            </div>
          </>,
          document.body,
        )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showDelete && <DeleteAccountModal onClose={() => setShowDelete(false)} />}
    </div>
  );
}
