import { useState } from "react";
import { computePositionSize } from "../../lib/riskMath";
import { formatUsd } from "../../lib/format";

export function PositionSizeCalculator() {
  const [balance, setBalance] = useState("10000");
  const [riskPercent, setRiskPercent] = useState(1);
  const [entry, setEntry] = useState("65000");
  const [stopLoss, setStopLoss] = useState("63500");

  const result = computePositionSize(Number(balance), riskPercent, Number(entry), Number(stopLoss));

  return (
    <section id="tamano-posicion" className="scroll-mt-24 mb-10">
      <h2 className="text-xl font-bold text-white mb-4">1. Calculadora de Tamaño de Posición</h2>

      <div className="panel p-5 mb-4">
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          El tamaño de posición es, con diferencia, <strong className="text-white">la decisión más importante de cada trade</strong> —
          más que la entrada, más que el indicador que uses. Un trader con una estrategia mediocre pero buen
          tamaño de posición sobrevive lo suficiente como para mejorar. Un trader con la mejor estrategia del
          mundo pero mal tamaño de posición quiebra la cuenta antes de que esa ventaja estadística se
          manifieste. No es la parte más interesante del trading, pero es la que decide si sigues jugando o
          no.
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">
          La lógica es simple: defines cuánto estás dispuesto a perder en este trade específico (como % de tu
          cuenta) y dejas que la distancia a tu stop loss determine el tamaño — nunca al revés. Elegir el
          tamaño primero y "ver qué stop loss me queda" es exactamente al revés de cómo se calcula bien.
        </p>
      </div>

      <div className="panel p-5">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">BALANCE DE LA CUENTA (USD)</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100 outline-none focus:border-neon-blue/50"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">% DE RIESGO EN ESTE TRADE</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.25}
                max={10}
                step={0.25}
                value={riskPercent}
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className="flex-1 accent-neon-green"
              />
              <span className={`value-mono text-sm w-14 text-right ${riskPercent > 3 ? "text-neon-red font-bold" : "text-slate-200"}`}>
                {riskPercent.toFixed(2)}%
              </span>
            </div>
            {riskPercent > 3 && (
              <p className="text-[11px] text-neon-red mt-1">
                Por encima del 3% recomendado como límite de alerta — ver el simulador de rachas más abajo para entender por qué.
              </p>
            )}
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">PRECIO DE ENTRADA</label>
            <input
              type="number"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100 outline-none focus:border-neon-blue/50"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">PRECIO DE STOP LOSS</label>
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100 outline-none focus:border-neon-red/50"
            />
          </div>
        </div>

        {result && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label="Distancia al SL" value={`${result.distancePercent.toFixed(2)}%`} accent="gold" />
            <ResultCard label="Riesgo en $" value={formatUsd(result.riskAmount, 2)} accent="red" />
            <ResultCard label="Tamaño de posición" value={formatUsd(result.positionSizeUsd, 2)} accent="blue" />
            <ResultCard label="Cantidad" value={result.quantity.toFixed(6)} accent="green" />
          </div>
        )}

        <p className="text-xs text-slate-500 mt-4">
          Fórmula: <span className="value-mono">Riesgo $ = Balance × %Riesgo</span> →{" "}
          <span className="value-mono">Tamaño = Riesgo $ / Distancia al SL (%)</span>. Cuanto más lejos esté tu
          stop loss, más chica tiene que ser la posición para arriesgar el mismo dinero.
        </p>
      </div>
    </section>
  );
}

function ResultCard({ label, value, accent }: { label: string; value: string; accent: "gold" | "red" | "blue" | "green" }) {
  const cls = { gold: "text-neon-gold", red: "text-neon-red", blue: "text-neon-blue", green: "text-neon-green" }[accent];
  return (
    <div className="bg-void-soft rounded-lg p-3">
      <div className="text-[10px] font-mono text-slate-500 mb-1">{label.toUpperCase()}</div>
      <div className={`value-mono text-sm font-semibold ${cls}`}>{value}</div>
    </div>
  );
}
