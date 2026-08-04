import { useState } from "react";
import type { Exercise } from "../../../content/academy/types";

type Data = Extract<Exercise, { kind: "opcionMultiple" }>;

export function OpcionMultiple({ data, onSolved }: { data: Data; onSolved: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  function handleSelect(i: number) {
    setSelected(i);
    if (data.opciones[i]!.correcta && !solved) {
      setSolved(true);
      onSolved();
    }
  }

  return (
    <div className="bg-void-soft rounded-xl p-4 border border-void-border">
      <div className="text-[10px] font-mono font-bold tracking-widest text-neon-blue mb-2">EJERCICIO</div>
      <p className="text-sm text-white font-medium mb-3">{data.pregunta}</p>
      <div className="space-y-2">
        {data.opciones.map((opt, i) => {
          let cls = "border-void-border text-slate-300 hover:border-slate-600";
          if (solved && opt.correcta) cls = "border-neon-green/60 bg-neon-green/10 text-neon-green";
          else if (i === selected) cls = "border-neon-red/60 bg-neon-red/10 text-neon-red";
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={solved}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm border transition-colors ${cls}`}
            >
              {opt.texto}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="bg-void-panel rounded-lg p-3 mt-3 text-xs text-slate-400 leading-relaxed">
          <span className={data.opciones[selected]!.correcta ? "text-neon-green font-semibold" : "text-neon-red font-semibold"}>
            {data.opciones[selected]!.correcta ? "Correcto. " : "Todavía no — prueba otra. "}
          </span>
          {data.opciones[selected]!.explicacion}
        </div>
      )}
    </div>
  );
}
