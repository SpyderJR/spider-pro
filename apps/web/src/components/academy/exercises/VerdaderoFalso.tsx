import { useState } from "react";
import type { Exercise } from "../../../content/academy/types";

type Data = Extract<Exercise, { kind: "verdaderoFalso" }>;

export function VerdaderoFalso({ data, onSolved }: { data: Data; onSolved: () => void }) {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [solved, setSolved] = useState(false);

  function handleSelect(value: boolean) {
    setAnswer(value);
    if (value === data.respuesta && !solved) {
      setSolved(true);
      onSolved();
    }
  }

  return (
    <div className="bg-void-soft rounded-xl p-4 border border-void-border">
      <div className="text-[10px] font-mono font-bold tracking-widest text-neon-blue mb-2">VERDADERO O FALSO</div>
      <p className="text-sm text-white font-medium mb-3">{data.enunciado}</p>
      <div className="flex gap-2">
        {[true, false].map((value) => {
          let cls = "border-void-border text-slate-300 hover:border-slate-600";
          if (solved && value === data.respuesta) cls = "border-neon-green/60 bg-neon-green/10 text-neon-green";
          else if (value === answer) cls = "border-neon-red/60 bg-neon-red/10 text-neon-red";
          return (
            <button
              key={String(value)}
              onClick={() => handleSelect(value)}
              disabled={solved}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-colors ${cls}`}
            >
              {value ? "Verdadero" : "Falso"}
            </button>
          );
        })}
      </div>
      {answer !== null && (
        <div className="bg-void-panel rounded-lg p-3 mt-3 text-xs text-slate-400 leading-relaxed">
          <span className={answer === data.respuesta ? "text-neon-green font-semibold" : "text-neon-red font-semibold"}>
            {answer === data.respuesta ? "Correcto. " : "Todavía no — probá de nuevo. "}
          </span>
          {solved && data.explicacion}
        </div>
      )}
    </div>
  );
}
