import { useState } from "react";
import { REPLAY_PERIODS, REPLAY_INTERVALS, type ReplayInterval } from "../../../lib/replay/periods";
import { fetchCachedCandles, BINANCE_HISTORY_START } from "../../../lib/arcade/historicalCandles";
import { useReplayStore } from "../../../store/replayStore";

const VISIBLE_START_CANDLES = 50;

export function ReplaySetup() {
  const startReplay = useReplayStore((s) => s.startReplay);
  const [periodId, setPeriodId] = useState(REPLAY_PERIODS[0]!.id);
  const [interval, setInterval] = useState<ReplayInterval>("1h");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function begin() {
    const period = REPLAY_PERIODS.find((p) => p.id === periodId)!;
    setLoading(true);
    setError(null);
    try {
      const startTime = period.startDate
        ? new Date(`${period.startDate}T00:00:00Z`).getTime()
        : BINANCE_HISTORY_START + Math.random() * (Date.now() - 90 * 24 * 60 * 60 * 1000 - BINANCE_HISTORY_START);
      const endTime = startTime + period.days * 24 * 60 * 60 * 1000;

      const candles = await fetchCachedCandles(period.symbol, interval, startTime, endTime);
      if (candles.length < VISIBLE_START_CANDLES + 10) {
        setError("No hay suficiente histórico para este período y temporalidad. Prueba con otra combinación.");
        setLoading(false);
        return;
      }

      startReplay({
        periodId: period.id,
        periodLabel: period.label,
        symbol: period.symbol,
        interval,
        candles,
        startIndex: VISIBLE_START_CANDLES,
      });
    } catch {
      setError("No se pudo cargar el histórico de Binance. Prueba de nuevo en unos segundos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel p-6">
      <h3 className="text-lg font-bold text-white mb-1">Configurar Replay</h3>
      <p className="text-sm text-slate-400 mb-5">
        Elige un período histórico real y opera contra él vela por vela, con una cuenta simulada separada de tu cuenta en vivo.
      </p>

      <div className="mb-4">
        <label className="text-[10px] font-mono text-slate-500 block mb-2">PERÍODO</label>
        <div className="grid sm:grid-cols-2 gap-2">
          {REPLAY_PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriodId(p.id)}
              className={`text-left px-3 py-2.5 rounded-lg text-sm border transition-colors ${
                periodId === p.id ? "border-neon-green/50 text-neon-green bg-neon-green/5" : "border-void-border text-slate-300 hover:border-slate-600"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="text-[10px] font-mono text-slate-500 block mb-2">TEMPORALIDAD</label>
        <div className="flex gap-2">
          {REPLAY_INTERVALS.map((tf) => (
            <button
              key={tf}
              onClick={() => setInterval(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-mono border ${
                interval === tf ? "border-neon-blue/50 text-neon-blue bg-neon-blue/5" : "border-void-border text-slate-500"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-neon-red mb-4">{error}</p>}

      <button
        onClick={begin}
        disabled={loading}
        className="px-5 py-2.5 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green disabled:opacity-40"
      >
        {loading ? "Cargando histórico…" : "Iniciar Replay"}
      </button>
    </div>
  );
}
