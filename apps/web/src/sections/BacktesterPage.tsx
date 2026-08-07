import { useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { StatCard } from "../components/StatCard";
import { PriceLineChart } from "../components/charts/PriceLineChart";
import { ConditionNodeEditor } from "../components/backtest/ConditionNodeEditor";
import { TermifiedText } from "../components/TermifiedText";
import { fetchBacktestCandles } from "../lib/backtest/candleCache";
import { useBacktestWorker } from "../hooks/useBacktestWorker";
import { formatUsd } from "../lib/format";
import { PairSearchBox } from "../components/terminal/PairSearchBox";
import type { BacktestCondition, BacktestConfig, BacktestResult, ConditionNode } from "@spider/types";

type StopLossMode = BacktestConfig["stopLossMode"];

const QUICK_PAIRS = ["BTCUSDT", "TRXUSDT"];

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

  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setIntervalValue] = useState<(typeof BACKTEST_INTERVALS)[number]>("4h");
  const [yearsBack, setYearsBack] = useState(2);
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [initialBalance, setInitialBalance] = useState(10_000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [stopLossMode, setStopLossMode] = useState<StopLossMode>("percent");
  const [stopLossPercent, setStopLossPercent] = useState(2);
  const [atrMultiplier, setAtrMultiplier] = useState(1.5);
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(true);
  const [takeProfitPercent, setTakeProfitPercent] = useState(4);
  const [entryConditions, setEntryConditions] = useState<ConditionNode[]>([DEFAULT_CONDITION]);

  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const running = progress !== null;

  function updateCondition(index: number, condition: ConditionNode) {
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
        stopLossMode,
        atrMultiplier: stopLossMode === "atr" ? atrMultiplier : null,
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

      <div className="panel border border-neon-blue/30 bg-neon-blue/5 p-5 mb-6">
        <div className="text-xs font-mono font-bold tracking-widest text-neon-blue mb-2">¿QUÉ ES UN BACKTEST Y PARA QUÉ SIRVE?</div>
        <p className="text-sm text-slate-200 leading-relaxed">
          <TermifiedText text="Un backtest responde una pregunta muy concreta: 'si hubiera seguido esta regla exacta de entrada y salida durante los últimos años, ¿qué habría pasado?'. En vez de confiar en la intuición o en 'se ve que va a subir', escribes una regla objetiva basada en un indicador, y el sistema la corre automáticamente contra velas históricas reales de Binance — la misma disciplina de 'regla, no corazonada' que rige el resto de esta plataforma." />
        </p>
        <p className="text-sm text-slate-200 leading-relaxed mt-2">
          No te dice el futuro. Te dice si tu idea ya falló en el pasado (útil para descartarla rápido) o si al menos sobrevivió — lo cual tampoco garantiza que vaya a funcionar mañana, pero es un filtro mucho mejor que operar sin haber probado nada.
        </p>
      </div>

      <div className="panel p-5 mb-6">
        <h2 className="text-sm font-bold text-white mb-4">Cómo funciona, en 4 pasos</h2>
        <ol className="space-y-4">
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-neon-blue/10 border border-neon-blue/40 text-neon-blue text-xs font-bold flex items-center justify-center">1</span>
            <div>
              <div className="text-sm text-white font-medium">Elige el mercado y el rango histórico</div>
              <p className="text-xs text-slate-400 mt-0.5">Par (BTC o TRX), temporalidad de vela y cuántos años atrás quieres probar. Más años = resultado más confiable, pero también más lento de descargar.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-neon-blue/10 border border-neon-blue/40 text-neon-blue text-xs font-bold flex items-center justify-center">2</span>
            <div>
              <div className="text-sm text-white font-medium">Define tu regla de entrada</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Una <TermifiedText text="condición" /> compara un indicador contra otro indicador o un valor fijo (ej. "RSI (14) cruza por abajo de 30" = posible sobreventa). Si agregas varias condiciones, <strong className="text-white">todas</strong> deben cumplirse al mismo tiempo para entrar — son un AND, no un OR.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-neon-blue/10 border border-neon-blue/40 text-neon-blue text-xs font-bold flex items-center justify-center">3</span>
            <div>
              <div className="text-sm text-white font-medium">Configura el riesgo — no solo la señal</div>
              <p className="text-xs text-slate-400 mt-0.5">
                El tamaño de cada operación se calcula solo para que, si toca tu <TermifiedText text="Stop Loss (SL)" />, pierdas exactamente el % de riesgo por trade que definiste — la misma fórmula de tamaño de posición que enseña Gestión de Riesgo, aplicada mecánicamente en cada entrada.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-neon-blue/10 border border-neon-blue/40 text-neon-blue text-xs font-bold flex items-center justify-center">4</span>
            <div>
              <div className="text-sm text-white font-medium">Ejecuta y lee los resultados con ojo crítico</div>
              <p className="text-xs text-slate-400 mt-0.5">Revisa el número de operaciones antes que nada — con menos de ~30 trades, cualquier resultado (bueno o malo) puede ser puro azar. Después mira Win Rate, Profit Factor y Max Drawdown juntos, nunca uno solo aislado (ver la guía abajo de los resultados).</p>
            </div>
          </li>
        </ol>
        <div className="mt-4 bg-void-soft rounded-lg p-3 text-xs text-slate-300">
          <strong className="text-neon-gold">Para probar ya mismo:</strong> deja la configuración que carga por defecto (BTC/USDT, 4h, últimos 2 años, RSI 14 cruza por abajo de 30) y presiona "Ejecutar backtest" — es una regla clásica de sobreventa, un buen primer ejemplo para ver cómo se lee un resultado antes de armar tu propia regla.
        </div>
      </div>

      <div className="panel p-6 mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">PAR</label>
            <div className="flex flex-wrap items-center gap-1.5">
              {QUICK_PAIRS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSymbol(p)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border ${symbol === p ? "border-neon-blue/50 text-neon-blue bg-neon-blue/5" : "border-void-border text-slate-500"}`}
                >
                  {p.replace("USDT", "/USDT")}
                </button>
              ))}
              {!QUICK_PAIRS.includes(symbol) && (
                <span className="px-2.5 py-1.5 rounded-lg text-xs font-mono border border-neon-blue/50 text-neon-blue bg-neon-blue/5">
                  {symbol.replace("USDT", "/USDT")}
                </span>
              )}
            </div>
            <div className="mt-1.5">
              <PairSearchBox onSelect={setSymbol} placeholder="Buscar otro par…" />
            </div>
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
            <p className="text-[10px] text-slate-600 mt-1">Cuenta simulada de la que parte el backtest — no es dinero real.</p>
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
            <p className="text-[10px] text-slate-600 mt-1">% del balance que se pierde si el Stop Loss se activa — define el tamaño de cada posición, no lo eliges tú directamente.</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono text-slate-500">STOP LOSS</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setStopLossMode("percent")}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${stopLossMode === "percent" ? "border-neon-blue/50 text-neon-blue" : "border-void-border text-slate-500"}`}
                >
                  % FIJO
                </button>
                <button
                  type="button"
                  onClick={() => setStopLossMode("atr")}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${stopLossMode === "atr" ? "border-neon-blue/50 text-neon-blue" : "border-void-border text-slate-500"}`}
                >
                  ATR
                </button>
              </div>
            </div>
            {stopLossMode === "percent" ? (
              <>
                <input
                  type="number"
                  step={0.1}
                  value={stopLossPercent}
                  onChange={(e) => setStopLossPercent(Number(e.target.value))}
                  className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100 outline-none focus:border-neon-blue/50"
                />
                <p className="text-[10px] text-slate-600 mt-1">Qué tan lejos del precio de entrada, en %, se cierra la operación en pérdida — el mismo número en cada trade, sin importar la volatilidad del momento.</p>
              </>
            ) : (
              <>
                <input
                  type="number"
                  step={0.1}
                  min={0.1}
                  value={atrMultiplier}
                  onChange={(e) => setAtrMultiplier(Number(e.target.value))}
                  className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm value-mono text-slate-100 outline-none focus:border-neon-blue/50"
                />
                <p className="text-[10px] text-slate-600 mt-1">
                  Múltiplo de <TermifiedText text="ATR" /> (14): el stop se coloca a <strong className="text-white">{atrMultiplier}× el ATR</strong> del precio de entrada, así que se ensancha solo en velas volátiles y se ajusta solo en velas tranquilas — la forma profesional de colocar el stop, en vez de un % arbitrario.
                </p>
              </>
            )}
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
            <p className="text-[10px] text-slate-600 mt-1">Opcional — si lo desmarcas, la única salida además de tu regla es el Stop Loss.</p>
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
          <p className="text-[10px] text-slate-600 mb-2">
            Cada fila compara dos cosas (un indicador o un valor fijo) con "es mayor/menor que" o "cruza por arriba/abajo de". Ejemplo: la fila por defecto dice "RSI (14) cruza por abajo de 30" — se entra cuando el RSI acaba de caer por debajo de esa zona de sobreventa. Todas las filas y grupos de la lista se combinan con Y — usa "+ grupo OR" en una fila para exigir solo UNA de varias condiciones dentro de ese grupo.
          </p>
          <div className="space-y-2">
            {entryConditions.map((node, i) => (
              <ConditionNodeEditor key={i} node={node} onChange={(n) => updateCondition(i, n)} onRemove={() => removeCondition(i)} />
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

          {result.metrics.totalTrades < 30 && (
            <p className="text-xs text-neon-gold bg-neon-gold/10 border border-neon-gold/30 rounded-lg px-3 py-2 mb-4">
              ⚠ Solo {result.metrics.totalTrades} operaciones — con una muestra tan chica, este resultado puede ser
              suerte (buena o mala), no una ventaja real. Prueba un rango más amplio o una temporalidad más rápida
              antes de sacar conclusiones.
            </p>
          )}

          <div className="text-xs text-slate-400 leading-relaxed mb-6 bg-void-soft rounded-lg p-3">
            <strong className="text-white">Cómo leer estos números: </strong>
            <TermifiedText text="el Win Rate por sí solo no dice si el sistema es rentable — un sistema con 30% de aciertos puede ganar dinero si esas ganancias son mucho más grandes que las pérdidas. El Profit Factor junta ambas cosas: arriba de 1 significa que, en conjunto, se ganó más de lo que se perdió. El Max Drawdown es la peor caída que tu cuenta habría sufrido en el camino — la pregunta real es si la hubieras aguantado sin cerrar todo en pánico. Y el Expectancy es el número que más importa: la ganancia promedio esperada por operación, combinando las tres cosas de arriba en una sola cifra." />
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
