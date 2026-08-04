import { useRef, useState, type ChangeEvent } from "react";
import { downloadBackup, importBackup } from "../../lib/backup";
import { useAuthStore } from "../../store/authStore";

export function BackupModal({ onClose }: { onClose: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { status, user } = useAuthStore();
  const syncLabel =
    status === "signed-in" && user?.email
      ? `Sincronizado en la nube como ${user.email}`
      : "Guardado en este dispositivo";

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importBackup(String(reader.result));
      if (result.success) {
        setMessage({ type: "success", text: "Respaldo restaurado. Recargando…" });
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setMessage({ type: "error", text: result.error ?? "No se pudo restaurar el respaldo." });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="panel max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Respaldo de datos</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm">
            ✕
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 mb-4">
          <span className={`w-1.5 h-1.5 rounded-full ${status === "signed-in" ? "bg-neon-green" : "bg-slate-600"}`} />
          {syncLabel}
        </div>

        <p className="text-sm text-slate-400 mb-5">
          {status === "signed-in"
            ? "Tu progreso se sincroniza automáticamente con tu cuenta. Este respaldo JSON es una copia adicional, útil para guardar offline o mover datos a mano."
            : "Todo lo que hiciste en Spider Pro (Terminal, Academia, Arcade, Diario, Replay y preferencias) vive únicamente en este navegador. Expórtalo para no perderlo si limpias el caché o cambias de dispositivo — o inicia sesión con Google para un respaldo automático en la nube."}
        </p>

        <button
          onClick={downloadBackup}
          className="w-full py-2.5 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green mb-2.5"
        >
          ⬇ Exportar respaldo (JSON)
        </button>
        <button
          onClick={handleImportClick}
          className="w-full py-2.5 rounded-lg text-sm font-mono border border-neon-blue/40 text-neon-blue"
        >
          ⬆ Importar respaldo
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />

        {message && (
          <p className={`text-xs mt-4 ${message.type === "success" ? "text-neon-green" : "text-neon-red"}`}>{message.text}</p>
        )}

        <p className="text-[11px] text-slate-600 mt-4">
          Importar un respaldo reemplaza los datos actuales de este navegador por los del archivo.
        </p>
      </div>
    </div>
  );
}
