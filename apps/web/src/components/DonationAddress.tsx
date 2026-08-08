import { useEffect, useRef, useState } from "react";
import { DONATION_ADDRESS, DONATION_ASSETS, DONATION_NETWORK } from "../data/donation";

function shorten(address: string): string {
  return `${address.slice(0, 8)}…${address.slice(-6)}`;
}

interface Props {
  /** Botón de una línea para lugares angostos (sidebar, menú de cuenta) en vez del panel completo. */
  compact?: boolean;
}

export function DonationAddress({ compact = false }: Props) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(DONATION_ADDRESS);
      setCopied(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Portapapeles no disponible (permiso denegado o contexto no seguro) — el usuario
      // siempre puede seleccionar y copiar la dirección manualmente.
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleCopy}
        className="w-full flex items-center gap-1.5 text-[11px] font-mono text-slate-500 hover:text-neon-gold transition-colors"
        title={DONATION_ADDRESS}
      >
        <span>🕸</span>
        {copied ? "¡Dirección copiada!" : "Apoyar el proyecto (TRX/USDT)"}
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-void-border bg-void-soft/60 p-3">
      <div className="text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-1.5">
        APOYA EL PROYECTO — {DONATION_NETWORK}
      </div>
      <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
        Spider Pro es y seguirá siendo gratis. Si te ha servido, una donación en {DONATION_ASSETS} ayuda a
        cubrir costos — totalmente opcional, nunca requerida.
      </p>
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-void border border-void-border hover:border-neon-gold/40 transition-colors"
      >
        <span className="font-mono text-xs text-slate-300 truncate">{shorten(DONATION_ADDRESS)}</span>
        <span className="text-[10px] font-mono font-bold text-neon-gold shrink-0">
          {copied ? "¡COPIADO!" : "COPIAR"}
        </span>
      </button>
    </div>
  );
}
