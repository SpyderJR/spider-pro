import { useEffect, useState } from "react";
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

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-lg hover:bg-white/5 transition-colors"
        title="Cuenta"
      >
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full border border-void-border" />
        ) : (
          <span className="w-7 h-7 rounded-full bg-neon-green/10 border border-neon-green/40 text-neon-green text-xs font-mono font-bold flex items-center justify-center">
            {(user?.name ?? user?.email ?? "?").charAt(0).toUpperCase()}
          </span>
        )}
        <span className="text-slate-500 text-[10px]">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-50 w-64 panel p-3">
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
        </>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showDelete && <DeleteAccountModal onClose={() => setShowDelete(false)} />}
    </div>
  );
}
