import type { DiaryEntry } from "../../lib/diary/types";
import { generateInsights, overallWinRate, winRateByDayOfWeek, winRateByEmotion, winRateBySession, winRateBySignal, type RateBucket } from "../../lib/diary/analysis";

function BucketBar({ bucket }: { bucket: RateBucket }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-32 shrink-0 text-slate-400 truncate">{bucket.label}</span>
      <div className="flex-1 h-2 bg-void-soft rounded-full overflow-hidden">
        <div
          className={`h-full ${bucket.winRate >= 50 ? "bg-neon-green" : "bg-neon-red"}`}
          style={{ width: `${bucket.winRate}%` }}
        />
      </div>
      <span className="w-16 shrink-0 text-right font-mono text-slate-500">
        {bucket.winRate}% ({bucket.count})
      </span>
    </div>
  );
}

export function DiaryAnalysisPanel({ entries }: { entries: DiaryEntry[] }) {
  const overall = overallWinRate(entries);
  const insights = generateInsights(entries);

  return (
    <div className="panel p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Análisis por reglas</h2>
        <span className="text-xs font-mono text-slate-500">
          Win rate general: <span className={overall >= 50 ? "text-neon-green" : "text-neon-red"}>{overall}%</span>
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-xs font-mono text-slate-500 mb-2">🧠 INSIGHTS</h3>
        <ul className="space-y-1.5">
          {insights.map((text, i) => (
            <li key={i} className="text-sm text-slate-300 bg-void-soft rounded-lg px-3 py-2">
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-mono text-slate-500 mb-2">POR EMOCIÓN</h3>
          <div className="space-y-1.5">
            {winRateByEmotion(entries).length === 0 ? (
              <p className="text-xs text-slate-600">Sin datos suficientes.</p>
            ) : (
              winRateByEmotion(entries).map((b) => <BucketBar key={b.key} bucket={b} />)
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-mono text-slate-500 mb-2">POR SEÑAL</h3>
          <div className="space-y-1.5">
            {winRateBySignal(entries).length === 0 ? (
              <p className="text-xs text-slate-600">Sin datos suficientes.</p>
            ) : (
              winRateBySignal(entries).map((b) => <BucketBar key={b.key} bucket={b} />)
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-mono text-slate-500 mb-2">POR DÍA DE LA SEMANA</h3>
          <div className="space-y-1.5">
            {winRateByDayOfWeek(entries).length === 0 ? (
              <p className="text-xs text-slate-600">Sin datos suficientes.</p>
            ) : (
              winRateByDayOfWeek(entries).map((b) => <BucketBar key={b.key} bucket={b} />)
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-mono text-slate-500 mb-2">POR HORARIO</h3>
          <div className="space-y-1.5">
            {winRateBySession(entries).length === 0 ? (
              <p className="text-xs text-slate-600">Sin datos suficientes.</p>
            ) : (
              winRateBySession(entries).map((b) => <BucketBar key={b.key} bucket={b} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
