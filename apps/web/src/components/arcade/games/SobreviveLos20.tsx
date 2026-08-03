import { useMemo, useState } from "react";
import { ArcadeChart } from "../ArcadeChart";
import { GameHeader } from "../GameHeader";
import { useRandomHistoricalCandles } from "../../../hooks/useRandomHistoricalCandles";
import { HowToPlayBox } from "../HowToPlayBox";

const TOTAL_ROUNDS = 20;
const VISIBLE_PER_ROUND = 10;
const REVEAL_PER_ROUND = 5;
const CANDLES_PER_ROUND = VISIBLE_PER_ROUND + REVEAL_PER_ROUND;
const START_BALANCE = 1000;
const COMPARISON_RISK_PERCENT = 1;

type Action = "buy" | "sell" | "wait";

interface RoundLog {
  round: number;
  action: Action;
  riskPercent: number;
  priceChangePercent: number;
  pnl: number;
  balanceAfter: number;
  comparisonPnl: number;
  comparisonBalanceAfter: number;
}

interface Props {
  onExit: () => void;
  onFinish: (result: { scorePercent: number; streak: number; record: number }) => void;
}

export function SobreviveLos20({ onExit, onFinish }: Props) {
  const [sessionKey, setSessionKey] = useState(0);
  const { candles, loading, error } = useRandomHistoricalCandles({
    interval: "4h",
    spanMs: TOTAL_ROUNDS * CANDLES_PER_ROUND * 4 * 60 * 60 * 1000,
    minCandles: TOTAL_ROUNDS * CANDLES_PER_ROUND,
    refreshKey: sessionKey,
  });

  const [round, setRound] = useState(0);
  const [riskPercent, setRiskPercent] = useState(2);
  const [balance, setBalance] = useState(START_BALANCE);
  const [comparisonBalance, setComparisonBalance] = useState(START_BALANCE);
  const [logs, setLogs] = useState<RoundLog[]>([]);
  const [lastPnl, setLastPnl] = useState<number | null>(null);
  const [bustedOut, setBustedOut] = useState(false);
  const [finished, setFinished] = useState(false);
  const [reported, setReported] = useState(false);

  const roundCandles = useMemo(() => {
    const start = round * CANDLES_PER_ROUND;
    return candles.slice(start, start + CANDLES_PER_ROUND);
  }, [candles, round]);
  const visible = roundCandles.slice(0, VISIBLE_PER_ROUND);

  function act(action: Action) {
    if (roundCandles.length < CANDLES_PER_ROUND || balance <= 0) return;
    const entry = visible.at(-1)?.close ?? 0;
    const exit = roundCandles.at(-1)?.close ?? entry;
    const priceChangePercent = entry > 0 ? (exit - entry) / entry : 0;
    const direction = action === "buy" ? 1 : action === "sell" ? -1 : 0;

    const positionSize = balance * (riskPercent / 100);
    const pnl = positionSize * priceChangePercent * direction;
    const nextBalance = Math.max(0, balance + pnl);

    const compPositionSize = comparisonBalance * (COMPARISON_RISK_PERCENT / 100);
    const comparisonPnl = compPositionSize * priceChangePercent * direction;
    const nextComparisonBalance = Math.max(0, comparisonBalance + comparisonPnl);

    setLogs((l) => [
      ...l,
      { round: round + 1, action, riskPercent, priceChangePercent, pnl, balanceAfter: nextBalance, comparisonPnl, comparisonBalanceAfter: nextComparisonBalance },
    ]);
    setBalance(nextBalance);
    setComparisonBalance(nextComparisonBalance);
    setLastPnl(pnl);

    if (nextBalance <= 0) {
      setBustedOut(true);
      setFinished(true);
    } else if (round + 1 >= TOTAL_ROUNDS) {
      setFinished(true);
    }
  }

  function next() {
    setLastPnl(null);
    setRound((r) => r + 1);
  }

  const roundsSurvived = logs.length;
  const scorePercent = Math.round((roundsSurvived / TOTAL_ROUNDS) * 100);

  if (finished) {
    if (!reported) {
      setReported(true);
      onFinish({ scorePercent, streak: roundsSurvived, record: Math.round(balance) });
    }
    const beatComparison = balance > comparisonBalance;
    return (
      <div className="panel p-6">
        <GameHeader title="Sobrevive los 20 — Autopsia" onExit={onExit} />
        <div className="text-center mb-5">
          <div className={`text-3xl font-bold mb-1 ${bustedOut ? "text-neon-red" : "text-neon-green"}`}>
            {bustedOut ? "QUEBRASTE" : "SOBREVIVISTE"}
          </div>
          <div className="text-sm text-slate-400">{roundsSurvived} de {TOTAL_ROUNDS} escenarios jugados</div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          <div className="panel p-4">
            <div className="text-[10px] font-mono text-slate-500 mb-1">TU ESTRATEGIA (riesgo variable)</div>
            <div className={`value-mono text-xl font-bold ${balance >= START_BALANCE ? "text-neon-green" : "text-neon-red"}`}>
              ${balance.toFixed(2)}
            </div>
          </div>
          <div className="panel p-4">
            <div className="text-[10px] font-mono text-slate-500 mb-1">CON 1% DE RIESGO FIJO</div>
            <div className={`value-mono text-xl font-bold ${comparisonBalance >= START_BALANCE ? "text-neon-green" : "text-neon-red"}`}>
              ${comparisonBalance.toFixed(2)}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-5 text-center max-w-lg mx-auto">
          {beatComparison
            ? "Tu tamaño de posición te ganó a la estrategia de 1% fijo en este recorrido — pero con más riesgo también hay más varianza y más chances de quebrar."
            : "Arriesgar más de 1% por operación no te ganó a la estrategia conservadora — y multiplicó el riesgo de quebrar la cuenta. Esa es la lección central de la gestión de riesgo."}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-slate-500 border-b border-void-border">
                <th className="text-left py-1.5">#</th>
                <th className="text-left py-1.5">ACCIÓN</th>
                <th className="text-right py-1.5">RIESGO</th>
                <th className="text-right py-1.5">MOVIMIENTO</th>
                <th className="text-right py-1.5">P&L</th>
                <th className="text-right py-1.5">BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.round} className="border-b border-void-border/50">
                  <td className="py-1.5 text-slate-500">{l.round}</td>
                  <td className="py-1.5 text-slate-300">{l.action === "buy" ? "COMPRA" : l.action === "sell" ? "VENTA" : "ESPERAR"}</td>
                  <td className="py-1.5 text-right text-slate-400">{l.riskPercent}%</td>
                  <td className={`py-1.5 text-right ${l.priceChangePercent >= 0 ? "text-neon-green" : "text-neon-red"}`}>
                    {(l.priceChangePercent * 100).toFixed(2)}%
                  </td>
                  <td className={`py-1.5 text-right ${l.pnl >= 0 ? "text-neon-green" : "text-neon-red"}`}>
                    {l.pnl >= 0 ? "+" : ""}${l.pnl.toFixed(2)}
                  </td>
                  <td className="py-1.5 text-right text-white">${l.balanceAfter.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2 justify-center mt-5">
          <button
            onClick={() => {
              setSessionKey((k) => k + 1);
              setRound(0);
              setRiskPercent(2);
              setBalance(START_BALANCE);
              setComparisonBalance(START_BALANCE);
              setLogs([]);
              setLastPnl(null);
              setBustedOut(false);
              setFinished(false);
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
        title="Sobrevive los 20"
        onExit={onExit}
        right={
          <span className="text-xs font-mono text-slate-400">
            ESCENARIO {round + 1}/{TOTAL_ROUNDS} · BALANCE <span className="text-white">${balance.toFixed(2)}</span>
          </span>
        }
      />

      {round === 0 && lastPnl === null && (
        <HowToPlayBox
          steps={[
            "Arrancás con $1000. En cada uno de los 20 escenarios históricos reales elegís Comprar, Vender o Esperar.",
            "Antes de decidir, ajustá el slider de % de riesgo — define qué porción de tu balance ponés en juego en esa jugada.",
            "El objetivo es simple: no llegar a $0. El juego termina antes si te quedás sin capital.",
          ]}
          lesson="Demuestra en carne propia por qué el tamaño de posición importa más que acertar la dirección — al final se compara tu resultado contra una estrategia de 1% de riesgo fijo."
        />
      )}

      {loading && <div className="text-sm text-slate-500 py-16 text-center">Cargando escenarios históricos…</div>}
      {error && <div className="text-sm text-neon-red py-16 text-center">{error}</div>}

      {!loading && !error && (
        <>
          <ArcadeChart candles={lastPnl !== null ? roundCandles : visible} height={300} disableInteraction />

          {lastPnl === null ? (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400">RIESGO: {riskPercent}%</span>
                <span className="text-xs font-mono text-slate-500">
                  Posición: ${(balance * (riskPercent / 100)).toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={riskPercent}
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className="w-full mb-4"
              />
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => act("sell")} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-neon-red/10 border border-neon-red/40 text-neon-red">
                  ▼ Vender
                </button>
                <button onClick={() => act("wait")} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-void-soft border border-void-border text-slate-300">
                  ⏸ Esperar
                </button>
                <button onClick={() => act("buy")} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green">
                  ▲ Comprar
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-center">
              <div className={`text-lg font-bold mb-1 ${lastPnl >= 0 ? "text-neon-green" : "text-neon-red"}`}>
                {lastPnl >= 0 ? "+" : ""}${lastPnl.toFixed(2)}
              </div>
              <button onClick={next} className="px-5 py-2 rounded-lg text-sm font-mono border border-neon-blue/40 text-neon-blue">
                Siguiente escenario →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
