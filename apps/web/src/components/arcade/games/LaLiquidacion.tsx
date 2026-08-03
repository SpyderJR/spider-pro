import { useEffect, useMemo, useRef, useState } from "react";
import { ArcadeChart } from "../ArcadeChart";
import { GameHeader } from "../GameHeader";
import { useRandomHistoricalCandles } from "../../../hooks/useRandomHistoricalCandles";
import { computeLiquidationPrice, isLiquidated, type FuturesSide } from "../../../lib/futures/liquidation";
import { formatUsd } from "../../../lib/format";
import { HowToPlayBox } from "../HowToPlayBox";

const TOTAL_ROUNDS = 5;
const CANDLES_PER_ROUND = 36; // 4h candles × 36 = 6 days per round × 5 rounds = 30 days
const START_BALANCE = 500;
const COMPARISON_LEVERAGE = 3;
const REVEAL_TICK_MS = 90;

interface RoundLog {
  round: number;
  direction: FuturesSide;
  leverage: number;
  priceChangePercent: number;
  liquidatedOwn: boolean;
  liquidated3x: boolean;
  balanceAfterOwn: number;
  balanceAfter3x: number;
  balanceAfterSpot: number;
}

interface Props {
  onExit: () => void;
  onFinish: (result: { scorePercent: number; streak: number; record: number; flag: boolean; secondaryFlag: boolean }) => void;
}

export function LaLiquidacion({ onExit, onFinish }: Props) {
  const [sessionKey, setSessionKey] = useState(0);
  const { candles, loading, error } = useRandomHistoricalCandles({
    interval: "4h",
    spanMs: TOTAL_ROUNDS * CANDLES_PER_ROUND * 4 * 60 * 60 * 1000,
    minCandles: TOTAL_ROUNDS * CANDLES_PER_ROUND,
    refreshKey: sessionKey,
  });

  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<"choose" | "revealing" | "roundResult" | "finished">("choose");
  const [direction, setDirection] = useState<FuturesSide>("long");
  const [leverage, setLeverage] = useState(5);
  const [revealIndex, setRevealIndex] = useState(0);

  const [balanceOwn, setBalanceOwn] = useState(START_BALANCE);
  const [balance3x, setBalance3x] = useState(START_BALANCE);
  const [balanceSpot, setBalanceSpot] = useState(START_BALANCE);
  const [liquidatedOwn, setLiquidatedOwn] = useState(false);
  const [liquidated3x, setLiquidated3x] = useState(false);
  const [everLiquidatedOwn, setEverLiquidatedOwn] = useState(false);
  const [onlyLowLeverage, setOnlyLowLeverage] = useState(true);
  const [logs, setLogs] = useState<RoundLog[]>([]);
  const [reported, setReported] = useState(false);

  const roundCandles = useMemo(() => candles.slice(round * CANDLES_PER_ROUND, round * CANDLES_PER_ROUND + CANDLES_PER_ROUND), [candles, round]);
  const entryPrice = roundCandles[0]?.open ?? 0;

  const liqOwn = useMemo(() => (entryPrice > 0 ? computeLiquidationPrice(entryPrice, leverage, direction) : 0), [entryPrice, leverage, direction]);
  const liq3x = useMemo(() => (entryPrice > 0 ? computeLiquidationPrice(entryPrice, COMPARISON_LEVERAGE, direction) : 0), [entryPrice, direction]);

  const revealedCandles = roundCandles.slice(0, Math.max(1, revealIndex + 1));

  const revealTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const roundLiquidatedOwnRef = useRef(false);
  const roundLiquidated3xRef = useRef(false);
  const roundFinishedRef = useRef(false);

  // The interval ONLY advances revealIndex — it must never call setState-heavy logic
  // (like finishRound) from inside a functional updater. React can invoke updaters more
  // than once for purity-checking, and nested setState calls made from in there can be
  // silently dropped — that's what caused the game to hang forever on the last candle.
  useEffect(() => {
    if (phase !== "revealing") return;
    roundLiquidatedOwnRef.current = false;
    roundLiquidated3xRef.current = false;
    roundFinishedRef.current = false;

    revealTimer.current = setInterval(() => {
      setRevealIndex((i) => {
        const nextIndex = i + 1;
        const candle = roundCandles[nextIndex];
        if (!candle) return i;

        if (!roundLiquidatedOwnRef.current && (isLiquidated(direction, candle.low, liqOwn) || isLiquidated(direction, candle.high, liqOwn))) {
          roundLiquidatedOwnRef.current = true;
        }
        if (!roundLiquidated3xRef.current && (isLiquidated(direction, candle.low, liq3x) || isLiquidated(direction, candle.high, liq3x))) {
          roundLiquidated3xRef.current = true;
        }

        return nextIndex;
      });
    }, REVEAL_TICK_MS);

    return () => {
      if (revealTimer.current) clearInterval(revealTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Reacts to revealIndex reaching the last candle as a proper effect, outside of any
  // state updater — this is the only safe place to call finishRound's cascade of setState.
  useEffect(() => {
    if (phase !== "revealing") return;
    if (revealIndex < roundCandles.length - 1) return;
    if (roundFinishedRef.current) return;
    roundFinishedRef.current = true;
    if (revealTimer.current) clearInterval(revealTimer.current);
    finishRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, revealIndex]);

  function finishRound() {
    const lastCandle = roundCandles.at(-1);
    const exitPrice = lastCandle?.close ?? entryPrice;
    const directionSign = direction === "long" ? 1 : -1;
    const priceChangePercent = entryPrice > 0 ? ((exitPrice - entryPrice) / entryPrice) * 100 : 0;

    const ownLiquidatedThisRound = roundLiquidatedOwnRef.current;
    const threeXLiquidatedThisRound = roundLiquidated3xRef.current || liquidated3x;

    const nextBalanceOwn = ownLiquidatedThisRound ? 0 : Math.max(0, balanceOwn * (1 + (priceChangePercent * directionSign * leverage) / 100));
    const nextBalance3x = threeXLiquidatedThisRound ? 0 : Math.max(0, balance3x * (1 + (priceChangePercent * directionSign * COMPARISON_LEVERAGE) / 100));
    const nextBalanceSpot = Math.max(0, balanceSpot * (1 + (priceChangePercent * directionSign * 1) / 100));

    setBalanceOwn(nextBalanceOwn);
    setBalance3x(nextBalance3x);
    setBalanceSpot(nextBalanceSpot);
    if (ownLiquidatedThisRound) {
      setLiquidatedOwn(true);
      setEverLiquidatedOwn(true);
    }
    if (threeXLiquidatedThisRound) setLiquidated3x(true);
    setOnlyLowLeverage((prev) => prev && leverage <= 5);

    setLogs((prev) => [
      ...prev,
      {
        round: round + 1,
        direction,
        leverage,
        priceChangePercent,
        liquidatedOwn: ownLiquidatedThisRound,
        liquidated3x: threeXLiquidatedThisRound,
        balanceAfterOwn: nextBalanceOwn,
        balanceAfter3x: nextBalance3x,
        balanceAfterSpot: nextBalanceSpot,
      },
    ]);

    setPhase("roundResult");
  }

  function startRound() {
    setRevealIndex(0);
    setLiquidatedOwn(false);
    setPhase("revealing");
  }

  function nextOrFinish() {
    const wasLiquidated = logs.at(-1)?.liquidatedOwn ?? false;
    const isLastRound = round + 1 >= TOTAL_ROUNDS;
    if (wasLiquidated || isLastRound) {
      setPhase("finished");
      return;
    }
    setRound((r) => r + 1);
    setRevealIndex(0);
    setPhase("choose");
  }

  const roundsSurvived = logs.filter((l) => !l.liquidatedOwn).length;
  const scorePercent = Math.round((roundsSurvived / TOTAL_ROUNDS) * 100);

  useEffect(() => {
    if (phase !== "finished" || reported) return;
    setReported(true);
    const wonWithLowLeverage = balanceOwn > START_BALANCE && onlyLowLeverage && !everLiquidatedOwn;
    onFinish({
      scorePercent,
      streak: roundsSurvived,
      record: Math.round(balanceOwn),
      flag: wonWithLowLeverage,
      secondaryFlag: everLiquidatedOwn,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reported]);

  if (phase === "finished") {
    return (
      <div className="panel p-6">
        <GameHeader title="La Liquidación — Resumen" onExit={onExit} />
        <div className="text-center mb-5">
          <div className={`text-3xl font-bold mb-1 ${everLiquidatedOwn ? "text-neon-red" : "text-neon-green"}`}>
            {everLiquidatedOwn ? "TE LIQUIDARON" : "SOBREVIVISTE LOS 30 DÍAS"}
          </div>
          <div className="text-sm text-slate-400">{roundsSurvived} de {TOTAL_ROUNDS} semanas sobrevividas</div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <div className="panel p-4">
            <div className="text-[10px] font-mono text-slate-500 mb-1">TU RESULTADO (apalanc. elegido)</div>
            <div className={`value-mono text-xl font-bold ${balanceOwn >= START_BALANCE ? "text-neon-green" : "text-neon-red"}`}>
              {formatUsd(balanceOwn, 2)}
            </div>
          </div>
          <div className="panel p-4">
            <div className="text-[10px] font-mono text-slate-500 mb-1">MISMAS DECISIONES A 3x</div>
            <div className={`value-mono text-xl font-bold ${balance3x >= START_BALANCE ? "text-neon-green" : "text-neon-red"}`}>
              {formatUsd(balance3x, 2)}
            </div>
          </div>
          <div className="panel p-4">
            <div className="text-[10px] font-mono text-slate-500 mb-1">MISMAS DECISIONES EN SPOT (1x)</div>
            <div className={`value-mono text-xl font-bold ${balanceSpot >= START_BALANCE ? "text-neon-green" : "text-neon-red"}`}>
              {formatUsd(balanceSpot, 2)}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-5 text-center max-w-lg mx-auto">
          {everLiquidatedOwn
            ? "El apalancamiento que elegiste te liquidó antes de completar los 30 días — mirá cómo les hubiera ido a las mismas decisiones con menos apalancamiento."
            : "Sobreviviste con el apalancamiento que elegiste. Compará el resultado contra usar menos apalancamiento en las mismas decisiones."}
        </p>

        <div className="overflow-x-auto mb-5">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-slate-500 border-b border-void-border">
                <th className="text-left py-1.5">SEM.</th>
                <th className="text-left py-1.5">DIRECCIÓN</th>
                <th className="text-right py-1.5">APALANC.</th>
                <th className="text-right py-1.5">MOVIMIENTO</th>
                <th className="text-right py-1.5">TU CUENTA</th>
                <th className="text-right py-1.5">3x</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.round} className="border-b border-void-border/50">
                  <td className="py-1.5 text-slate-500">{l.round}</td>
                  <td className={l.direction === "long" ? "text-neon-green" : "text-neon-red"}>{l.direction === "long" ? "LONG" : "SHORT"}</td>
                  <td className="py-1.5 text-right text-neon-gold">{l.leverage}x</td>
                  <td className={`py-1.5 text-right ${l.priceChangePercent >= 0 ? "text-neon-green" : "text-neon-red"}`}>
                    {(l.priceChangePercent >= 0 ? "+" : "") + l.priceChangePercent.toFixed(2)}%
                  </td>
                  <td className="py-1.5 text-right text-white">{l.liquidatedOwn ? "LIQUIDADO" : formatUsd(l.balanceAfterOwn, 0)}</td>
                  <td className="py-1.5 text-right text-slate-400">{l.liquidated3x ? "LIQUIDADO" : formatUsd(l.balanceAfter3x, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => {
              setSessionKey((k) => k + 1);
              setRound(0);
              setPhase("choose");
              setBalanceOwn(START_BALANCE);
              setBalance3x(START_BALANCE);
              setBalanceSpot(START_BALANCE);
              setLiquidatedOwn(false);
              setLiquidated3x(false);
              setEverLiquidatedOwn(false);
              setOnlyLowLeverage(true);
              setLogs([]);
              setReported(false);
            }}
            className="px-4 py-2 rounded-lg text-sm font-mono border border-void-border text-slate-300 hover:border-neon-blue/50"
          >
            Jugar de nuevo
          </button>
          <button onClick={onExit} className="px-4 py-2 rounded-lg text-sm font-mono border border-neon-green/40 text-neon-green">
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel p-5">
      <GameHeader
        title="La Liquidación"
        onExit={onExit}
        right={
          <span className="text-xs font-mono text-slate-400">
            SEMANA {round + 1}/{TOTAL_ROUNDS} · <span className="text-white">{formatUsd(balanceOwn, 2)}</span>
          </span>
        }
      />

      {loading && <div className="text-sm text-slate-500 py-16 text-center">Cargando 30 días de histórico real…</div>}
      {error && <div className="text-sm text-neon-red py-16 text-center">{error}</div>}

      {!loading && !error && (
        <>
          {round === 0 && phase === "choose" && (
            <HowToPlayBox
              steps={[
                "30 días de mercado real, divididos en 5 semanas. Cada semana elegís dirección (long/short) y apalancamiento (1x-50x) antes de que arranque.",
                "La línea roja 'LIQ' es tu precio de liquidación para esa elección — si el precio la toca en cualquier momento de la semana, perdés el 100% de tu capital.",
                "Al final de las 5 semanas (o si te liquidan antes) se compara tu resultado contra las mismas decisiones tomadas con 3x y en spot (sin apalancamiento).",
              ]}
              lesson="La lección más directa de todo el Arcade: con apalancamiento alto, el ruido normal del mercado te liquida aunque hayas acertado la dirección."
            />
          )}

          <ArcadeChart
            candles={revealedCandles}
            height={300}
            disableInteraction
            priceLines={[
              { price: entryPrice, color: "#3ba8ff", title: "ENTRADA" },
              { price: liqOwn, color: "#ef4444", title: "LIQ", style: 2 },
            ]}
          />

          {phase === "choose" && (
            <div className="mt-4">
              <p className="text-sm text-slate-300 mb-3">
                Semana {round + 1}: elegí dirección y apalancamiento. La línea roja "LIQ" es tu precio de liquidación —
                si el precio la toca en cualquier momento de la semana, perdés todo.
              </p>
              <div className="flex gap-1.5 mb-4">
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
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-slate-500">APALANCAMIENTO</span>
                <span className="value-mono text-sm font-bold text-white">{leverage}x</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full accent-neon-red mb-4"
              />
              <button onClick={startRound} className="w-full py-2.5 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green">
                Confirmar y avanzar la semana
              </button>
            </div>
          )}

          {phase === "revealing" && <div className="mt-4 text-center text-xs font-mono text-slate-500">Avanzando el mercado…</div>}

          {phase === "roundResult" && logs.length > 0 && (
            <div className="mt-4 text-center">
              {logs.at(-1)!.liquidatedOwn ? (
                <div className="text-lg font-bold text-neon-red mb-1">💥 Te liquidaron esta semana</div>
              ) : (
                <div className={`text-lg font-bold mb-1 ${logs.at(-1)!.balanceAfterOwn >= balanceOwn ? "text-neon-green" : "text-neon-red"}`}>
                  Semana cerrada: {formatUsd(logs.at(-1)!.balanceAfterOwn, 2)}
                </div>
              )}
              <button onClick={nextOrFinish} className="px-5 py-2 rounded-lg text-sm font-mono border border-neon-blue/40 text-neon-blue">
                {logs.at(-1)!.liquidatedOwn || round + 1 >= TOTAL_ROUNDS ? "Ver resumen →" : "Siguiente semana →"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
