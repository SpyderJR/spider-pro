import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { Exercise } from "../../../content/academy/types";
import { useChallengeCompletion } from "../../../lib/academy/useChallengeCompletion";
import { ACADEMY_CHALLENGES } from "../../../lib/academy/challenges";

type Data = Extract<Exercise, { kind: "retoTerminal" }>;

export function RetoTerminal({ data, onSolved }: { data: Data; onSolved: () => void }) {
  const met = useChallengeCompletion(data.challengeId);
  const label = ACADEMY_CHALLENGES[data.challengeId]?.label ?? data.instruccion;

  useEffect(() => {
    if (met) onSolved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [met]);

  return (
    <div className={`bg-void-soft rounded-xl p-4 border ${met ? "border-neon-green/50" : "border-void-border"}`}>
      <div className="text-[10px] font-mono font-bold tracking-widest text-neon-gold mb-2">RETO EN LA TERMINAL</div>
      <p className="text-sm text-white font-medium mb-3">{data.instruccion}</p>
      <div className="bg-void-panel rounded-lg p-3 text-xs text-slate-400 mb-3">{label}</div>
      <div className="flex items-center justify-between">
        <Link to="/app/terminal" className="text-xs font-mono text-neon-blue hover:underline">
          → Ir a la Terminal
        </Link>
        <span className={`text-xs font-mono font-bold ${met ? "text-neon-green" : "text-slate-500"}`}>
          {met ? "✓ COMPLETADO" : "PENDIENTE"}
        </span>
      </div>
    </div>
  );
}
