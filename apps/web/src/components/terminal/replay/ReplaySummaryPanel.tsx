import { buildReplaySummary } from "../../../lib/replay/summary";
import { useReplayStore } from "../../../store/replayStore";
import { formatUsd } from "../../../lib/format";
import { INITIAL_REPLAY_BALANCE } from "../../../store/replayStore";

export function ReplaySummaryPanel() {
  const { candles, startIndex, currentIndex, balance, history, periodLabel, interval, resetToSetup } = useReplayStore();

  const summary = buildReplaySummary(candles, startIndex, currentIndex, INITIAL_REPLAY_BALANCE, balance, history);

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-bold text-white">Resumen del Replay</h3>
          <p className="text-xs text-slate-500">{periodLabel} · {interval}</p>
        </div>
        <button onClick={resetToSetup} className="px-4 py-2 rounded-lg text-sm font-mono border border-neon-blue/40 text-neon-blue">
          Nuevo Replay
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-void-soft rounded-lg p-4">
          <div className="text-[10px] font-mono text-slate-500 mb-1">TU RESULTADO</div>
          <div className={`value-mono text-xl font-bold ${summary.returnPercent >= 0 ? "text-neon-green" : "text-neon-red"}`}>
            {summary.returnPercent >= 0 ? "+" : ""}
            {summary.returnPercent.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">{formatUsd(summary.finalBalance, 2)}</div>
        </div>
        <div className="bg-void-soft rounded-lg p-4">
          <div className="text-[10px] font-mono text-slate-500 mb-1">HOLDEAR TODO EL PERÍODO</div>
          <div className={`value-mono text-xl font-bold ${summary.holdReturnPercent >= 0 ? "text-neon-green" : "text-neon-red"}`}>
            {summary.holdReturnPercent >= 0 ? "+" : ""}
            {summary.holdReturnPercent.toFixed(1)}%
          </div>
        </div>
        <div className="bg-void-soft rounded-lg p-4">
          <div className="text-[10px] font-mono text-slate-500 mb-1">OPERACIONES</div>
          <div className="value-mono text-xl font-bold text-slate-200">{summary.stats.totalTrades}</div>
          <div className="text-xs text-slate-500 mt-1">{summary.stats.winRate.toFixed(0)}% win rate</div>
        </div>
      </div>

      <div className="mb-2">
        <h4 className="text-xs font-mono text-slate-500 mb-2">🧠 FEEDBACK</h4>
        <ul className="space-y-1.5">
          {summary.feedback.map((f, i) => (
            <li key={i} className="text-sm text-slate-300 bg-void-soft rounded-lg px-3 py-2">
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
