import { useMemo, useState } from "react";
import type { Exercise } from "../../../content/academy/types";

type Data = Extract<Exercise, { kind: "emparejar" }>;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function Emparejar({ data, onSolved }: { data: Data; onSolved: () => void }) {
  const rightShuffled = useMemo(() => shuffle(data.pares.map((p) => p.derecha)), [data.pares]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPulse, setWrongPulse] = useState<string | null>(null);
  const solvedCalled = useMemo(() => ({ current: false }), []);

  function pickLeft(left: string) {
    if (matched.has(left)) return;
    setSelectedLeft(left);
  }

  function pickRight(right: string) {
    if (!selectedLeft) return;
    const pair = data.pares.find((p) => p.izquierda === selectedLeft);
    if (pair && pair.derecha === right) {
      const next = new Set(matched);
      next.add(selectedLeft);
      setMatched(next);
      setSelectedLeft(null);
      if (next.size === data.pares.length && !solvedCalled.current) {
        solvedCalled.current = true;
        onSolved();
      }
    } else {
      setWrongPulse(right);
      setTimeout(() => setWrongPulse(null), 400);
    }
  }

  return (
    <div className="bg-void-soft rounded-xl p-4 border border-void-border">
      <div className="text-[10px] font-mono font-bold tracking-widest text-neon-blue mb-2">EMPAREJÁ</div>
      <p className="text-sm text-white font-medium mb-3">{data.instruccion}</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          {data.pares.map((p) => (
            <button
              key={p.izquierda}
              onClick={() => pickLeft(p.izquierda)}
              disabled={matched.has(p.izquierda)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-colors ${
                matched.has(p.izquierda)
                  ? "border-neon-green/50 bg-neon-green/10 text-neon-green"
                  : selectedLeft === p.izquierda
                    ? "border-neon-blue/60 bg-neon-blue/10 text-neon-blue"
                    : "border-void-border text-slate-300 hover:border-slate-600"
              }`}
            >
              {p.izquierda}
            </button>
          ))}
        </div>
        <div className="space-y-1.5">
          {rightShuffled.map((right) => {
            const isMatchedRight = data.pares.some((p) => p.derecha === right && matched.has(p.izquierda));
            return (
              <button
                key={right}
                onClick={() => pickRight(right)}
                disabled={isMatchedRight}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-colors ${
                  isMatchedRight
                    ? "border-neon-green/50 bg-neon-green/10 text-neon-green"
                    : wrongPulse === right
                      ? "border-neon-red/60 bg-neon-red/10 text-neon-red"
                      : "border-void-border text-slate-300 hover:border-slate-600"
                }`}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>
      {matched.size === data.pares.length && (
        <div className="bg-void-panel rounded-lg p-3 mt-3 text-xs text-neon-green font-semibold">
          ¡Todos los pares correctos!
        </div>
      )}
    </div>
  );
}
