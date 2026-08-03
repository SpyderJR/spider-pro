import { useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "spider-legal-consent-accepted";

/** Banner no bloqueante de aceptación de Términos/Privacidad en el primer uso del dashboard. */
export function LegalConsentBanner() {
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY),
  );

  if (!visible) return null;

  function accept() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-[90] bg-void-panel border-t border-void-border px-4 py-3 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-400 leading-relaxed">
          Al continuar aceptás los{" "}
          <Link to="/terminos" target="_blank" className="text-neon-blue hover:underline">
            Términos y Condiciones
          </Link>{" "}
          y la{" "}
          <Link to="/privacidad" target="_blank" className="text-neon-blue hover:underline">
            Política de Privacidad
          </Link>{" "}
          de Spider Pro. Todo el trading en esta plataforma es simulado (NFA).
        </p>
        <button
          onClick={accept}
          className="shrink-0 px-4 py-1.5 rounded-lg text-xs font-mono font-bold border border-neon-green/50 text-neon-green bg-neon-green/10 hover:bg-neon-green/20 transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
