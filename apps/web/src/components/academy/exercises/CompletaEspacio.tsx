import { useState } from "react";
import type { Exercise } from "../../../content/academy/types";

type Data = Extract<Exercise, { kind: "completaEspacio" }>;

export function CompletaEspacio({ data, onSolved }: { data: Data; onSolved: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  function handleSelect(opt: string) {
    setSelected(opt);
    if (opt === data.correcta && !solved) {
      setSolved(true);
      onSolved();
    }
  }

  const [before, after] = data.plantilla.split("___");

  return (
    <div className="bg-void-soft rounded-xl p-4 border border-void-border">
      <div className="text-[10px] font-mono font-bold tracking-widest text-neon-blue mb-2">COMPLETA EL ESPACIO</div>
      <p className="text-sm text-white font-medium mb-3">
        {before}
        <span className="inline-block min-w-[70px] border-b-2 border-dashed border-neon-blue/60 text-neon-blue text-center mx-1">
          {solved ? data.correcta : "___"}
        </span>
        {after}
      </p>
      <div className="flex flex-wrap gap-2">
        {data.opciones.map((opt) => {
          let cls = "border-void-border text-slate-300 hover:border-slate-600";
          if (solved && opt === data.correcta) cls = "border-neon-green/60 bg-neon-green/10 text-neon-green";
          else if (opt === selected) cls = "border-neon-red/60 bg-neon-red/10 text-neon-red";
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={solved}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
