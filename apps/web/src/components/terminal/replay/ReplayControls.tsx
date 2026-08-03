import { useEffect } from "react";
import { REPLAY_SPEEDS, type ReplaySpeed } from "../../../lib/replay/periods";
import { useReplayStore } from "../../../store/replayStore";

const TICK_MS = 700;

export function ReplayControls() {
  const { status, candles, currentIndex, startIndex, isPlaying, speed, setPlaying, setSpeed, advanceOne, finishReplay } = useReplayStore();

  useEffect(() => {
    if (!isPlaying || status !== "active") return;
    const id = window.setInterval(() => {
      for (let i = 0; i < speed; i++) useReplayStore.getState().advanceOne();
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [isPlaying, speed, status]);

  const total = candles.length - 1;
  const progressPercent = total > 0 ? (currentIndex / total) * 100 : 0;
  const current = candles[currentIndex];

  return (
    <div className="panel p-4 mb-4">
      <div className="flex items-center justify-between mb-2 text-xs font-mono text-slate-500">
        <span>
          Vela {currentIndex - startIndex + 1} de {candles.length - startIndex}
        </span>
        <span>{current ? new Date(current.time * 1000).toLocaleString("es-AR") : "—"}</span>
      </div>
      <div className="h-1.5 bg-void-soft rounded-full overflow-hidden mb-3">
        <div className="h-full bg-neon-blue transition-all" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setPlaying(!isPlaying)}
          disabled={status !== "active"}
          className="px-4 py-2 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green disabled:opacity-40"
        >
          {isPlaying ? "⏸ Pausar" : "▶ Reproducir"}
        </button>
        <button
          onClick={advanceOne}
          disabled={status !== "active" || isPlaying}
          className="px-3 py-2 rounded-lg text-sm font-mono border border-void-border text-slate-300 disabled:opacity-30"
        >
          ⏭ Avanzar 1 vela
        </button>
        <div className="flex gap-1">
          {REPLAY_SPEEDS.map((sp) => (
            <button
              key={sp}
              onClick={() => setSpeed(sp as ReplaySpeed)}
              className={`px-2.5 py-2 rounded-lg text-xs font-mono border ${
                speed === sp ? "border-neon-blue/50 text-neon-blue bg-neon-blue/5" : "border-void-border text-slate-500"
              }`}
            >
              {sp}x
            </button>
          ))}
        </div>
        <button
          onClick={finishReplay}
          className="ml-auto px-3 py-2 rounded-lg text-xs font-mono border border-neon-gold/40 text-neon-gold"
        >
          Finalizar Replay
        </button>
      </div>
    </div>
  );
}
