import { useEffect, useState } from "react";
import { useMonteCarloWorker } from "../../hooks/useMonteCarloWorker";
import type { MonteCarloResult } from "../../lib/riskMath";
import { useDiaryStore } from "../../store/diaryStore";
import { overallWinRate } from "../../lib/diary/analysis";
import { formatUsd } from "../../lib/format";

const INITIAL_BALANCE = 10_000;
const TRADES = 200;
const ITERATIONS = 1000;

function averageAbsPnlPercent(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + Math.abs(v), 0) / values.length;
}

export function MonteCarloSimulator() {
  const { runMonteCarlo } = useMonteCarloWorker();
  const diaryEntries = useDiaryStore((s) => s.entries);

  const [riskPercent, setRiskPercent] = useState(2);
  const [winRatePercent, setWinRatePercent] = useState(45);
  const [rewardMultiple, setRewardMultiple] = useState(1.5);
  const [result, setResult] = useState<MonteCarloResult | null>(null);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    try {
      const r = await runMonteCarlo(
        { initialBalance: INITIAL_BALANCE, riskPercent, winRatePercent, rewardMultiple, trades: TRADES },
        ITERATIONS,
      );
      setResult(r);
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decidedEntries = diaryEntries.filter((e) => e.result === "win" || e.result === "loss");
  const canUseRealData = decidedEntries.length >= 5;

  function useRealDiaryData() {
    const wins = decidedEntries.filter((e) => e.result === "win").map((e) => e.pnlPercent);
    const losses = decidedEntries.filter((e) => e.result === "loss").map((e) => e.pnlPercent);
    const avgWin = averageAbsPnlPercent(wins);
    const avgLoss = averageAbsPnlPercent(losses);
    setWinRatePercent(overallWinRate(diaryEntries));
    if (avgLoss > 0) setRewardMultiple(Math.max(0.1, avgWin / avgLoss));
  }

  const curves = result?.percentileCurves;
  const allValues = curves ? [...curves.p10, ...curves.p90] : [INITIAL_BALANCE];
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, INITIAL_BALANCE);
  const range = maxVal - minVal || 1;
  const toY = (v: number) => 100 - ((v - minVal) / range) * 100;
  const toX = (i: number, len: number) => (i / (len - 1)) * 100;

  function pathFor(values: number[]): string {
    return values.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i, values.length)} ${toY(v)}`).join(" ");
  }

  function bandPath(): string {
    if (!curves) return "";
    const n = curves.p10.length;
    const top = curves.p90.map((v, i) => `${toX(i, n)},${toY(v)}`).join(" L ");
    const bottomReversed = [...curves.p10]
      .map((v, i) => `${toX(i, n)},${toY(v)}`)
      .reverse()
      .join(" L ");
    return `M ${top} L ${bottomReversed} Z`;
  }

  return (
    <section id="monte-carlo" className="scroll-mt-24 mb-10">
      <h2 className="text-xl font-bold text-white mb-4">4. Simulador de Monte Carlo — probabilidad real de ruina</h2>

      <div className="panel p-5 mb-4">
        <p className="text-sm text-slate-300 leading-relaxed">
          El simulador de arriba te muestra <strong className="text-white">un</strong> camino aleatorio posible.
          Este corre {ITERATIONS.toLocaleString("es-MX")} caminos distintos con el mismo win rate y riesgo/beneficio,
          y te muestra la banda donde cayó el 80% de esos caminos (p10-p90) más el % que realmente terminó en
          ruina — no una sola simulación con suerte o mala suerte, sino la distribución completa.
        </p>
      </div>

      <div className="panel p-5 mb-4">
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">% RIESGO POR TRADE</label>
            <input
              type="range"
              min={1}
              max={15}
              step={0.5}
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              className="w-full accent-neon-green"
            />
            <span className={`value-mono text-sm ${riskPercent > 5 ? "text-neon-red font-bold" : "text-slate-200"}`}>
              {riskPercent.toFixed(1)}%
            </span>
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">WIN RATE</label>
            <input
              type="range"
              min={10}
              max={90}
              step={1}
              value={winRatePercent}
              onChange={(e) => setWinRatePercent(Number(e.target.value))}
              className="w-full accent-neon-blue"
            />
            <span className="value-mono text-sm text-slate-200">{winRatePercent}%</span>
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">RATIO RIESGO:BENEFICIO</label>
            <input
              type="range"
              min={0.5}
              max={4}
              step={0.1}
              value={rewardMultiple}
              onChange={(e) => setRewardMultiple(Number(e.target.value))}
              className="w-full accent-neon-gold"
            />
            <span className="value-mono text-sm text-slate-200">1:{rewardMultiple.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap mb-4">
          <button
            onClick={run}
            disabled={running}
            className="px-4 py-2 rounded-lg text-xs font-mono font-bold border border-neon-green/50 text-neon-green bg-neon-green/10 hover:bg-neon-green/20 disabled:opacity-40"
          >
            {running ? "Simulando…" : `Correr ${ITERATIONS.toLocaleString("es-MX")} simulaciones`}
          </button>
          <button
            onClick={useRealDiaryData}
            disabled={!canUseRealData}
            title={canUseRealData ? undefined : "Registra al menos 5 operaciones con resultado en tu Diario para usar esta opción"}
            className="px-4 py-2 rounded-lg text-xs font-mono border border-neon-blue/40 text-neon-blue hover:bg-neon-blue/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Usar mis datos reales del Diario
          </button>
        </div>

        {result && (
          <>
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-40 mb-3">
              <line
                x1={0}
                y1={toY(INITIAL_BALANCE)}
                x2={100}
                y2={toY(INITIAL_BALANCE)}
                stroke="#334155"
                strokeWidth={0.3}
                strokeDasharray="1 1"
                vectorEffect="non-scaling-stroke"
              />
              <path d={bandPath()} fill="#3ba8ff" fillOpacity={0.12} />
              <path d={pathFor(curves!.p50)} fill="none" stroke="#3ba8ff" strokeWidth={0.7} vectorEffect="non-scaling-stroke" />
            </svg>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatBox
                label="Probabilidad de ruina"
                value={`${result.ruinProbabilityPercent}%`}
                cls={result.ruinProbabilityPercent > 20 ? "text-neon-red" : result.ruinProbabilityPercent > 0 ? "text-neon-gold" : "text-neon-green"}
              />
              <StatBox label="Balance final mediano" value={formatUsd(result.medianFinalBalance, 0)} cls={result.medianFinalBalance >= INITIAL_BALANCE ? "text-neon-green" : "text-neon-red"} />
              <StatBox label="Caminos simulados" value={result.iterations.toLocaleString("es-MX")} />
            </div>

            <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
              La banda azul muestra dónde cayó el 80% de los caminos simulados (percentil 10 a 90) tras {TRADES}{" "}
              trades; la línea es la mediana. "Probabilidad de ruina" es el % de esos {result.iterations.toLocaleString("es-MX")}{" "}
              caminos que llegaron a un balance cercano a cero en algún punto — no una estimación teórica, es lo
              que de verdad pasó en la simulación con estos parámetros.
            </p>
          </>
        )}
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
