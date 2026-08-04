import { useState } from "react";
import type { Exercise } from "../../../content/academy/types";

type Data = Extract<Exercise, { kind: "calculadoraGuiada" }>;

export function CalculadoraGuiada({ data, onSolved }: { data: Data; onSolved: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);

  const numericValues: Record<string, number> = Object.fromEntries(
    data.campos.map((c) => [c.id, Number(values[c.id] ?? 0)]),
  );
  const expected = data.calcular(numericValues);
  const userAnswer = Number(answer);
  const isCorrect = Number.isFinite(userAnswer) && Math.abs(userAnswer - expected) <= data.tolerancia;

  function handleCheck() {
    setChecked(true);
    if (isCorrect && !solved) {
      setSolved(true);
      onSolved();
    }
  }

  return (
    <div className="bg-void-soft rounded-xl p-4 border border-void-border">
      <div className="text-[10px] font-mono font-bold tracking-widest text-neon-blue mb-2">CALCULÁ VOS MISMO</div>
      <p className="text-sm text-white font-medium mb-3">{data.instruccion}</p>
      <div className="grid sm:grid-cols-2 gap-2.5 mb-3">
        {data.campos.map((c) => (
          <div key={c.id}>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">{c.label}</label>
            <input
              type="number"
              placeholder={c.placeholder}
              value={values[c.id] ?? ""}
              onChange={(e) => {
                setValues((v) => ({ ...v, [c.id]: e.target.value }));
                setChecked(false);
              }}
              disabled={solved}
              className="w-full bg-void-panel border border-void-border rounded-lg px-3 py-1.5 text-sm value-mono text-slate-100 outline-none focus:border-neon-blue/50 disabled:opacity-60"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-400">Tu resultado ({data.unidad}):</label>
        <input
          type="number"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setChecked(false);
          }}
          disabled={solved}
          className="w-32 bg-void-panel border border-void-border rounded-lg px-3 py-1.5 text-sm value-mono text-slate-100 outline-none focus:border-neon-blue/50 disabled:opacity-60"
        />
        {!solved && (
          <button onClick={handleCheck} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green">
            Verificar
          </button>
        )}
      </div>
      {checked && (
        <div className="bg-void-panel rounded-lg p-3 mt-3 text-xs">
          {isCorrect ? (
            <span className="text-neon-green font-semibold">¡Correcto! El resultado es {expected.toFixed(2)} {data.unidad}.</span>
          ) : (
            <span className="text-neon-red font-semibold">
              Todavía no — revisá los datos que ingresaste y volvé a calcular.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
