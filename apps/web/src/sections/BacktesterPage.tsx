import { useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { StatCard } from "../components/StatCard";
import { PriceLineChart } from "../components/charts/PriceLineChart";
import { ConditionRow } from "../components/backtest/ConditionRow";
import { fetchBacktestCandles } from "../lib/backtest/candleCache";
import { useBacktestWorker } from "../hooks/useBacktestWorker";
import { formatUsd } from "../lib/format";
import { BINANCE_PAIRS, type BinancePair } from "../lib/binance/types";
import type { BacktestCondition, BacktestConfig, BacktestResult } from "@spider/types";

const PAIR_LABELS: Record<BinancePair, string> = { BTCUSDT: "BTC/USDT", TRXUSDT: "TRX/USDT" };

const BACKTEST_INTERVALS = ["15m", "1h", "4h", "1d"] as const;
const SLOW_INTERVALS = new Set(["15m", "1h"]);
const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

const DEFAULT_CONDITION: BacktestCondition = {
  left: { indicator: "rsi", period: 14 },
  operator: "crosses_below",
  right: { value: 30 },
};

function ratioLabel(profitFactor: number): string {
  return profitFactor === Infinity ? "∞" : profitFactor.toFixed(2);
}

export function BacktesterPage() {
  const { runBacktest } = useBacktestWorker();

  const [symbol, setSymbol] = useState<BinancePair>("BTCUSDT");
  const [interval, setIntervalValue] = useState<(typeof BACKTEST_INTERVALS)[number]>("4h");
  const [yearsBack, setYearsBack] = useState(2);
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [initialBalance, setInitialBalance] = useState(10_000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [stopLossPercent, setStopLossPercent] = useState(2);
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(true);
  const [takeProfitPercent, setTakeProfitPercent] = useState(4);
  const [entryConditions, setEntryConditions] = useState<BacktestCondition[]>([DEFAULT_CONDITION]);

  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const running = progress !== null;

  function updateCondition(index: number, condition: BacktestCondition) {
    setEntryConditions((prev) => prev.map((c, i) => (i === index ? condition : c)));
  }

  function removeCondition(index: number) {
    setEntryConditions((prev) => prev.filter((_, i) => i !== index));
  }

  async function execute() {
    if (entryConditions.length === 0 || running) return;
    setError(null);
    setResult(null);
    setProgress("Descargando velas…");

    try {
      const endTime = Date.now();
      const startTime = endTime - yearsBack * YEAR_MS;
      const candles = await fetchBacktestCandles(symbol, interval, startTime, endTime, (count) =>
        setProgress(`Descargando velas… ${count.toLocaleString("es-MX")}`),
      );

      if (candles.length < 50) {
        setError("No hay suficiente histórico de Binance para este rango y temporalidad. Prueba con un rango más amplio.");
        setProgress(null);
        return;
      }

      setProgress("Ejecutando backtest…");
      const config: BacktestConfig = {
        symbol,
        interval,
        startTime,
        endTime,
        initialBalance,
        riskPercent,
        stopLossPercent,
        takeProfitPercent: takeProfitEnabled ? takeProfitPercent : null,
        direction,
        entryConditions,
      };
      const backtestResult = await runBacktest(candles, config);
      setResult(backtestResult);
    } catch {
      setError("No se pudo completar el backtest. Puede ser un bloqueo temporal de Binance — prueba de nuevo en unos segundos.");
    } finally {
      setProgress(null);
    }
  }

  return (
    <div>
      <SectionHeader
        title="Backtester"
        subtitle="Define reglas de entrada con indicadores reales y corre la estrategia contra años de velas históricas de Binance — todo por reglas, cero IA."
      />
      <Disclaimer text="El desempeño pasado no garantiza resultados futuros. Este backtester es una herramienta educativa con simplificaciones conocidas (sin comisiones, sin slippage) — no es asesoría financiera (NFA)." />

      <div className="panel p-6 mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">PAR</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value as BinancePair)}
              className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-neon-blue/50"
            >
              {BINANCE_PAIRS.map((p) => (
                <option key={p} value={p}>
                  {PAIR_LABELS[p]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">TEMPORALIDAD</label>
            <select
              value={interval}
              onChange={(e) => setIntervalValue(e.target.value as (typeof BACKTEST_INTERVALS)[number])}
              className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-neon-blue/50"
            >
              {BACKTEST_INTERVALS.map((i) => (
                <option key={i} value={i}>
                  {i}
                  {SLOW_INTERVALS.has(i) ? " (puede tardar más)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">RANGO</label>
            <select
              value={yearsBack}
              onChange={(e) => setYearsBack(Number(e.target.value))}
              className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-neon-blue/50"
            >
              {[1, 2, 3, 5].map((y) => (
                <option key={y} value={y}>
                  Últimos {y} {y === 1 ? "año" : "años"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">DIRECCIÓN</label>
            <div className="flex gap-1.5">
              <button
                onClick={() => setDirection("long")}
                className={`flex-1 py-2 rounded-lg text-sm font-bold border ${direction === "long" ? "border-neon-green/60 text-neon-green bg-neon-green/10" : "border-void-border text-slate-500"}`}
              >
                LONG
              </button>
              <button
                onClick={() => setDirection("short")}
                className={`flex-1 py-2 rounded-lg text-sm font-bold border ${direction === "short" ? "border-neon-red/60 text-neon-red bg-neon-red/10" : "border-void-border text-slate-500"}`}
              >
                SHORT
              </button>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">BALANCE INICIAL</label>
            <input
              type="number"
              value={initialBalance}
              onChange={(e) => setInitialBalance(Number(e.target.value))}
              className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100 outline-none focus:border-neon-blue/50"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">RIESGO POR TRADE (%)</label>
            <input
              type="number"
              step={0.1}
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100 outline-none focus:border-neon-blue/50"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">STOP LOSS (%)</label>
            <input
              type="number"
              step={0.1}
              value={stopLossPercent}
              onChange={(e) => setStopLossPercent(Number(e.target.value))}
              className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100 outline-none focus:border-neon-blue/50"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 mb-1">
              <input type="checkbox" checked={takeProfitEnabled} onChange={(e) => setTakeProfitEnabled(e.target.checked)} />
              TAKE PROFIT (%)
            </label>
            <input
              type="number"
              step={0.1}
              disabled={!takeProfitEnabled}
              value={takeProfitPercent}
              onChange={(e) => setTakeProfitPercent(Number(e.target.value))}
              className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100 outline-none focus:border-neon-blue/50 disabled:opacity-40"
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-mono text-slate-500">CONDICIONES DE ENTRADA (todas deben cumplirse)</label>
            <button
              onClick={() => setEntryConditions((prev) => [...prev, DEFAULT_CONDITION])}
              className="text-[10px] font-mono text-neon-blue px-2 py-1 border border-neon-blue/40 rounded hover:bg-neon-blue/10"
            >
              + AGREGAR CONDICIÓN
            </button>
          </div>
          <div className="space-y-2">
            {entryConditions.map((condition, i) => (
              <ConditionRow key={i} condition={condition} onChange={(c) => updateCondition(i, c)} onRemove={() => removeCondition(i)} />
            ))}
            {entryConditions.length === 0 && <p className="text-xs text-slate-500">Agrega al menos una condición para poder ejecutar el backtest.</p>}
          </div>
        </div>

        <button
          onClick={execute}
          disabled={running || entryConditions.length === 0}
          className="px-5 py-2.5 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green disabled:opacity-40"
        >
          {running ? progress : "Ejecutar backtest"}
        </button>
        {error && <p className="text-xs text-neon-red mt-3">{error}</p>}
      </div>

      {result && (
        <div className="panel p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Resultados</h2>

          <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <StatCard label="Trades" value={result.metrics.totalTrades} accent="neutral" />
            <StatCard label="Win Rate" value={`${result.metrics.winRate.toFixed(1)}%`} accent={result.metrics.winRate >= 50 ? "green" : "red"} />
            <StatCard label="Profit Factor" value={ratioLabel(result.metrics.profitFactor)} accent={result.metrics.profitFactor >= 1 ? "green" : "red"} />
            <StatCard label="Max Drawdown" value={`${result.metrics.maxDrawdownPercent.toFixed(1)}%`} accent="red" />
            <StatCard label="Expectancy" value={formatUsd(result.metrics.expectancy, 2)} accent={result.metrics.expectancy >= 0 ? "green" : "red"} />
            <StatCard
              label="Retorno total"
              value={`${result.metrics.totalReturnPercent >= 0 ? "+" : ""}${result.metrics.totalReturnPercent.toFixed(1)}%`}
              sub={formatUsd(result.metrics.finalBalance, 0)}
              accent={result.metrics.totalReturnPercent >= 0 ? "green" : "red"}
            />
          </div>

          <div className="mb-6">
            <div className="text-[10px] font-mono text-slate-500 mb-2">CURVA DE EQUITY</div>
            <PriceLineChart points={result.equityCurve.map((p) => ({ time: p.time, price: p.value }))} color="#39ff9c" height={220} />
          </div>

          {result.trades.length > 0 && (
            <div className="overflow-x-auto">
              <div className="text-[10px] font-mono text-slate-500 mb-2">ÚLTIMOS TRADES ({Math.min(20, result.trades.length)} de {result.trades.length})</div>
              <table className="w-full text-xs min-w-[560px]">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-void-border">
                    <th className="py-2 pr-3">Entrada</th>
                    <th className="py-2 pr-3">Salida</th>
                    <th className="py-2 pr-3">Lado</th>
                    <th className="py-2 pr-3">P&amp;L</th>
                    <th className="py-2 pr-3">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {result.trades.slice(-20).reverse().map((t, i) => (
                    <tr key={i} className="border-b border-void-border/50 last:border-0">
                      <td className="py-1.5 pr-3 value-mono text-slate-300">{new Date(t.entryTime).toLocaleDateString("es-MX")}</td>
                      <td className="py-1.5 pr-3 value-mono text-slate-300">{new Date(t.exitTime).toLocaleDateString("es-MX")}</td>
                      <td className="py-1.5 pr-3">{t.side === "long" ? "LONG" : "SHORT"}</td>
                      <td className={`py-1.5 pr-3 value-mono font-semibold ${t.pnl >= 0 ? "text-neon-green" : "text-neon-red"}`}>
                        {t.pnl >= 0 ? "+" : ""}
                        {formatUsd(t.pnl, 2)}
                      </td>
                      <td className="py-1.5 pr-3 text-slate-400">
                        {t.exitReason === "stop_loss" ? "Stop Loss" : t.exitReason === "take_profit" ? "Take Profit" : t.exitReason === "exit_signal" ? "Señal de salida" : "Fin de datos"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
