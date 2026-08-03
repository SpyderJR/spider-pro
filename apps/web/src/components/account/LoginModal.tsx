import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

const CONSENT_KEY = "spider-legal-consent-accepted";

export function LoginModal({ onClose }: { onClose: () => void }) {
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const [accepted, setAccepted] = useState(() => localStorage.getItem(CONSENT_KEY) === "1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    setError(null);
    setLoading(true);
    localStorage.setItem(CONSENT_KEY, "1");
    const { error: err } = await signInWithGoogle();
    setLoading(false);
    if (err) setError(err);
    // en éxito, Supabase redirige a Google — no hay más que hacer acá
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="panel max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-neon-green text-xl">◈</span>
          <span className="font-mono font-bold text-white">Iniciar sesión</span>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Totalmente opcional — Spider Pro funciona completo sin cuenta. Iniciar sesión solo agrega
          respaldo en la nube y sincronización entre tus dispositivos.
        </p>

        <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 accent-neon-green"
          />
          <span className="text-xs text-slate-400 leading-relaxed">
            Acepto los{" "}
            <a href="/terminos" target="_blank" className="text-neon-blue hover:underline">
              Términos y Condiciones
            </a>{" "}
            y la{" "}
            <a href="/privacidad" target="_blank" className="text-neon-blue hover:underline">
              Política de Privacidad
            </a>
            .
          </span>
        </label>

        {error && <p className="text-xs text-neon-red mb-3">{error}</p>}

        <button
          onClick={handleContinue}
          disabled={!accepted || loading}
          className="w-full py-2.5 rounded-lg text-sm font-mono font-bold border border-neon-green/50 text-neon-green bg-neon-green/10 hover:bg-neon-green/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Redirigiendo…" : "Continuar con Google"}
        </button>
        <button onClick={onClose} className="w-full mt-2 py-2 text-xs text-slate-500 hover:text-slate-300">
          Cancelar
        </button>
      </div>
    </div>
  );
}
