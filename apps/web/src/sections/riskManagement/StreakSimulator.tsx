import { useMemo, useState } from "react";
import { simulateStreak, drawdownRecoveryPercent } from "../../lib/riskMath";
import { formatUsd } from "../../lib/format";

const RECOVERY_LOSSES = [10, 20, 30, 40, 50, 60, 70, 80, 90];

export function StreakSimulator() {
  const [riskPercent, setRiskPercent] = useState(2);
  const [seed, setSeed] = useState(0);

  const sim = useMemo(() => {
    void seed; // forces re-simulation when the button below is pressed
    return simulateStreak(10_000, riskPercent, 45, 1.5, 100);
  }, [riskPercent, seed]);

  const minBal = Math.min(...sim.balanceCurve);
  const maxBal = Math.max(...sim.balanceCurve);
  const range = maxBal - minBal || 1;
  const points = sim.balanceCurve
    .map((b, i) => `${(i / (sim.balanceCurve.length - 1)) * 100},${100 - ((b - minBal) / range) * 100}`)
    .join(" ");

  return (
    <section id="simulador-rachas" className="scroll-mt-24 mb-10">
      <h2 className="text-xl font-bold text-white mb-4">3. Simulador Visual de Rachas</h2>

      <div className="panel p-5 mb-4">
        <p className="text-sm text-slate-300 leading-relaxed">
          Simulá 100 trades seguidos con un win rate realista del 45% y un ratio riesgo/beneficio de 1:1.5 —
          un perfil de trader promedio, ni especialmente bueno ni especialmente malo. Lo único que cambia es{" "}
          <strong className="text-white">cuánto arriesgás por trade</strong>. Movés el slider y vas a ver
          cómo el mismo sistema, con la misma ventaja estadística, puede sobrevivir perfectamente bien o
          quebrar la cuenta — la única diferencia es el tamaño de posición.
        </p>
      </div>

      <div className="panel p-5 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <label className="text-[10px] font-mono text-slate-500 whitespace-nowrap">% RIESGO POR TRADE</label>
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={riskPercent}
            onChange={(e) => setRiskPercent(Number(e.target.value))}
            className="flex-1 accent-neon-green"
          />
          <span className={`value-mono text-sm w-14 text-right ${riskPercent > 3 ? "text-neon-red font-bold" : "text-slate-200"}`}>
            {riskPercent.toFixed(1)}%
          </span>
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono border border-void-border text-slate-400 hover:border-neon-blue/50 whitespace-nowrap"
          >
            Simular de nuevo
          </button>
        </div>

        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-40 mb-3">
          <line x1={0} y1={100 - ((10000 - minBal) / range) * 100} x2={100} y2={100 - ((10000 - minBal) / range) * 100} stroke="#334155" strokeWidth={0.3} strokeDasharray="1 1" vectorEffect="non-scaling-stroke" />
          <polyline
            points={points}
            fill="none"
            stroke={sim.wentBust ? "#ef4444" : sim.finalBalance >= 10_000 ? "#22c55e" : "#ffcf4d"}
            strokeWidth={0.6}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox label="Balance final" value={formatUsd(sim.finalBalance, 2)} cls={sim.finalBalance >= 10_000 ? "text-neon-green" : "text-neon-red"} />
          <StatBox label="Trades ganados" value={`${sim.wins}/100`} />
          <StatBox label="¿Quebró la cuenta?" value={sim.wentBust ? `Sí, en el trade #${sim.bustAtTrade}` : "No"} cls={sim.wentBust ? "text-neon-red" : "text-neon-green"} />
          <StatBox label="Riesgo usado" value={`${riskPercent.toFixed(1)}% por trade`} />
        </div>

        {riskPercent > 5 && (
          <p className="text-xs text-neon-red mt-3">
            Con {riskPercent.toFixed(1)}% de riesgo por trade, una racha de solo 15-20 pérdidas seguidas
            (estadísticamente esperable con 45% de win rate) es suficiente para quebrar la cuenta casi por
            completo — corré la simulación varias veces y mirá cuántas terminan en rojo.
          </p>
        )}
      </div>

      <div className="panel overflow-hidden">
        <div className="p-4 pb-0">
          <div className="text-[11px] font-mono text-slate-500 tracking-widest mb-1">
            % PERDIDO VS % NECESARIO PARA RECUPERAR
          </div>
          <p className="text-xs text-slate-500 mb-2">
            Perder no es simétrico con ganar — cuanto más grande la pérdida, desproporcionadamente más grande
            tiene que ser la ganancia para volver al punto de partida.
          </p>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-sm min-w-[380px]">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-void-border">
                <th className="py-2 pr-4">Pérdida</th>
                <th className="py-2">Ganancia necesaria para recuperar</th>
              </tr>
            </thead>
            <tbody>
              {RECOVERY_LOSSES.map((loss) => (
                <tr key={loss} className="border-b border-void-border/50 last:border-0">
                  <td className="py-2 pr-4 value-mono text-neon-red">-{loss}%</td>
                  <td className="py-2 value-mono text-neon-green">+{drawdownRecoveryPercent(loss).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function StatBox({ label, value, cls }: { label: string; value: string; cls?: string }) {
  return (
    <div className="bg-void-soft rounded-lg p-3">
      <div className="text-[10px] font-mono text-slate-500 mb-1">{label.toUpperCase()}</div>
      <div className={`value-mono text-sm font-semibold ${cls ?? "text-slate-200"}`}>{value}</div>
    </div>
  );
}
