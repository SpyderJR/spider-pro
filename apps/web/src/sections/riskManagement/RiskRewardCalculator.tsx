import { useMemo, useState } from "react";
import { breakevenWinRate } from "../../lib/riskMath";

const REFERENCE_RATIOS = [0.5, 1, 1.5, 2, 3, 4, 5];

export function RiskRewardCalculator() {
  const [entry, setEntry] = useState("65000");
  const [stopLoss, setStopLoss] = useState("63500");
  const [takeProfit, setTakeProfit] = useState("68000");

  const { ratio, minWinRate } = useMemo(() => {
    const e = Number(entry);
    const sl = Number(stopLoss);
    const tp = Number(takeProfit);
    const risk = Math.abs(e - sl);
    const reward = Math.abs(tp - e);
    if (risk === 0) return { ratio: null, minWinRate: null };
    const r = reward / risk;
    return { ratio: r, minWinRate: breakevenWinRate(r) };
  }, [entry, stopLoss, takeProfit]);

  return (
    <section id="riesgo-beneficio" className="scroll-mt-24 mb-10">
      <h2 className="text-xl font-bold text-white mb-4">2. Ratio Riesgo/Beneficio</h2>

      <div className="panel p-5 mb-4">
        <p className="text-sm text-slate-300 leading-relaxed">
          El ratio riesgo/beneficio compara cuánto arriesgas contra cuánto buscas ganar en el mismo trade. Un
          ratio de <strong className="text-white">1:2</strong> significa que arriesgas $1 para buscar $2 —
          y con ese ratio, matemáticamente <strong className="text-white">puedes perder más trades de los que
          ganas y aun así terminar en verde</strong>. Esto es contraintuitivo para la mayoría de los
          principiantes, que buscan sistemas con win rate alto sin prestarle atención al ratio.
        </p>
      </div>

      <div className="panel p-5 mb-4">
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">ENTRADA</label>
            <input type="number" value={entry} onChange={(e) => setEntry(e.target.value)} className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100 outline-none focus:border-neon-blue/50" />
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">STOP LOSS</label>
            <input type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100 outline-none focus:border-neon-red/50" />
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">TAKE PROFIT</label>
            <input type="number" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100 outline-none focus:border-neon-green/50" />
          </div>
        </div>

        {ratio !== null && minWinRate !== null && (
          <>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-2xl font-bold value-mono text-neon-blue">1:{ratio.toFixed(2)}</div>
              <div className="text-sm text-slate-400">
                Necesitas ganar al menos <strong className="text-white">{minWinRate.toFixed(1)}%</strong> de tus trades para no perder dinero (sin contar comisiones).
              </div>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex bg-void-soft">
              <div className="bg-neon-red/60" style={{ width: `${(1 / (1 + ratio)) * 100}%` }} />
              <div className="bg-neon-green/60" style={{ width: `${(ratio / (1 + ratio)) * 100}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>Riesgo</span>
              <span>Beneficio</span>
            </div>
          </>
        )}
      </div>

      <div className="panel overflow-hidden">
        <div className="p-4 pb-0">
          <div className="text-[11px] font-mono text-slate-500 tracking-widest mb-1">
            WIN RATE MÍNIMO NECESARIO POR RATIO
          </div>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-void-border">
                <th className="py-2 pr-4">Ratio R:R</th>
                <th className="py-2 pr-4">Win rate mínimo para empatar</th>
                <th className="py-2">Ejemplo</th>
              </tr>
            </thead>
            <tbody>
              {REFERENCE_RATIOS.map((r) => {
                const wr = breakevenWinRate(r);
                const isCurrent = ratio !== null && Math.abs(ratio - r) < 0.05;
                return (
                  <tr key={r} className={`border-b border-void-border/50 last:border-0 ${isCurrent ? "bg-neon-blue/5" : ""}`}>
                    <td className="py-2 pr-4 value-mono text-slate-200 font-semibold">1:{r}</td>
                    <td className="py-2 pr-4 value-mono text-neon-blue">{wr.toFixed(1)}%</td>
                    <td className="py-2 text-slate-500 text-xs">
                      {r >= 2
                        ? `Puedes perder ${(100 - wr).toFixed(0)}% de tus trades y seguir siendo rentable`
                        : r === 1
                          ? "Necesitas ganar más de la mitad de tus trades"
                          : "Necesitas un win rate alto para compensar el ratio bajo"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
