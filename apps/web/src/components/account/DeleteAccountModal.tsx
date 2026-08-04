import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

export function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const session = useAuthStore((s) => s.session);
  const signOut = useAuthStore((s) => s.signOut);

  async function confirmDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.access_token ?? ""}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      await signOut();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="panel max-w-sm w-full p-6 border border-neon-red/40" onClick={(e) => e.stopPropagation()}>
        <div className="text-sm font-mono font-bold text-neon-red mb-3">ELIMINAR MI CUENTA</div>

        {step === 1 && (
          <>
            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              Esto borra permanentemente tu cuenta y todos tus datos en la nube (progreso de Academia,
              Arcade, logros, historial de Terminal, Diario y ajustes). Tu progreso guardado en este
              navegador (localStorage) no se toca — sigues pudiendo usar la app sin cuenta después.
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full py-2.5 rounded-lg text-sm font-mono font-bold border border-neon-red/50 text-neon-red bg-neon-red/10 hover:bg-neon-red/20 transition-all"
            >
              Entiendo, continuar
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              Última confirmación — esta acción no se puede deshacer. ¿Eliminar la cuenta y todos los
              datos asociados de forma permanente?
            </p>
            {error && <p className="text-xs text-neon-red mb-3">{error}</p>}
            <button
              onClick={confirmDelete}
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-mono font-bold border border-neon-red/50 text-neon-red bg-neon-red/10 hover:bg-neon-red/20 disabled:opacity-40 transition-all"
            >
              {loading ? "Eliminando…" : "Sí, eliminar mi cuenta permanentemente"}
            </button>
          </>
        )}

        <button onClick={onClose} className="w-full mt-2 py-2 text-xs text-slate-500 hover:text-slate-300">
          Cancelar
        </button>
      </div>
    </div>
  );
}
