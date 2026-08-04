import { useState } from "react";
import type { Exercise } from "../../../content/academy/types";

type Data = Extract<Exercise, { kind: "ordenar" }>;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function Ordenar({ data, onSolved }: { data: Data; onSolved: () => void }) {
  const [order, setOrder] = useState(() => shuffle(data.items).map((it) => it.id));
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);

  function move(index: number, direction: -1 | 1) {
    if (solved) return;
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target]!, next[index]!];
    setOrder(next);
    setChecked(false);
  }

  function handleCheck() {
    const correct = order.every((id, i) => id === data.ordenCorrecto[i]);
    setChecked(true);
    if (correct && !solved) {
      setSolved(true);
      onSolved();
    }
  }

  const isCorrect = checked && order.every((id, i) => id === data.ordenCorrecto[i]);
  const byId = new Map(data.items.map((it) => [it.id, it.texto]));

  return (
    <div className="bg-void-soft rounded-xl p-4 border border-void-border">
      <div className="text-[10px] font-mono font-bold tracking-widest text-neon-blue mb-2">ORDENÁ</div>
      <p className="text-sm text-white font-medium mb-3">{data.instruccion}</p>
      <div className="space-y-1.5 mb-3">
        {order.map((id, i) => {
          const correctHere = checked && id === data.ordenCorrecto[i];
          return (
            <div
              key={id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                checked
                  ? correctHere
                    ? "border-neon-green/50 bg-neon-green/10 text-neon-green"
                    : "border-neon-red/50 bg-neon-red/10 text-neon-red"
                  : "border-void-border text-slate-300"
              }`}
            >
              <span className="value-mono text-xs text-slate-500 w-5">{i + 1}.</span>
              <span className="flex-1">{byId.get(id)}</span>
              {!solved && (
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="text-slate-500 hover:text-white disabled:opacity-20 text-xs leading-none">
                    ▲
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === order.length - 1} className="text-slate-500 hover:text-white disabled:opacity-20 text-xs leading-none">
                    ▼
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!solved && (
        <button onClick={handleCheck} className="px-4 py-2 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green">
          Verificar orden
        </button>
      )}
      {checked && (
        <div className="bg-void-panel rounded-lg p-3 text-xs text-slate-400 mt-3">
          <span className={isCorrect ? "text-neon-green font-semibold" : "text-neon-red font-semibold"}>
            {isCorrect ? "¡Orden correcto!" : "Todavía no — el verde marca lo que ya está en su lugar, seguí ajustando."}
          </span>
        </div>
      )}
    </div>
  );
}
