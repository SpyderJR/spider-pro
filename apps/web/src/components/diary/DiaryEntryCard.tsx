import { EMOTION_LABELS, SIGNAL_LABELS, type DiaryEmotion, type DiaryEntry, type DiarySignal } from "../../lib/diary/types";
import { useDiaryStore } from "../../store/diaryStore";

const EMOTIONS = Object.keys(EMOTION_LABELS) as DiaryEmotion[];
const SIGNALS = Object.keys(SIGNAL_LABELS) as DiarySignal[];

const RESULT_LABEL: Record<string, string> = { win: "GANADA", loss: "PERDIDA", breakeven: "NEUTRA" };
const RESULT_COLOR: Record<string, string> = {
  win: "text-neon-green border-neon-green/30",
  loss: "text-neon-red border-neon-red/30",
  breakeven: "text-slate-400 border-void-border",
};

export function DiaryEntryCard({ entry }: { entry: DiaryEntry }) {
  const updateEntry = useDiaryStore((s) => s.updateEntry);
  const deleteEntry = useDiaryStore((s) => s.deleteEntry);

  function toggleSignal(signal: DiarySignal) {
    const has = entry.signals.includes(signal);
    updateEntry(entry.id, { signals: has ? entry.signals.filter((s) => s !== signal) : [...entry.signals, signal] });
  }

  return (
    <div className="panel p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-white">{entry.pair}</span>
          <span className={`badge text-[10px] ${entry.direction === "buy" ? "text-neon-green border-neon-green/30" : "text-neon-red border-neon-red/30"}`}>
            {entry.direction === "buy" ? "COMPRA" : "VENTA"}
          </span>
          {entry.result && <span className={`badge text-[10px] ${RESULT_COLOR[entry.result]}`}>{RESULT_LABEL[entry.result]}</span>}
          <span className={`badge text-[10px] ${entry.market === "futures" ? "text-neon-gold border-neon-gold/30" : "text-slate-400 border-void-border"}`}>
            {entry.market === "futures" ? `FUTUROS ${entry.leverage ?? ""}x` : "SPOT"}
          </span>
          {!entry.sourceTradeId && <span className="badge text-[10px] text-neon-blue border-neon-blue/30">MANUAL</span>}
          {entry.pnlPercent !== null && (
            <span className={`text-xs font-mono ${entry.pnlPercent >= 0 ? "text-neon-green" : "text-neon-red"}`}>
              {entry.pnlPercent >= 0 ? "+" : ""}
              {entry.pnlPercent.toFixed(2)}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500">{new Date(entry.createdAt).toLocaleString("es-AR")}</span>
          <button onClick={() => deleteEntry(entry.id)} className="text-slate-600 hover:text-neon-red text-xs" title="Eliminar entrada">
            ✕
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[10px] font-mono text-slate-500 block mb-1">RAZÓN DE ENTRADA</label>
          <textarea
            value={entry.entryReasonText}
            onChange={(e) => updateEntry(entry.id, { entryReasonText: e.target.value })}
            placeholder="¿Por qué entraste a esta operación?"
            rows={2}
            className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-neon-green/50 resize-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-mono text-slate-500 block mb-1">LECCIÓN</label>
          <textarea
            value={entry.lesson}
            onChange={(e) => updateEntry(entry.id, { lesson: e.target.value })}
            placeholder="¿Qué aprendiste de esta operación?"
            rows={2}
            className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-neon-green/50 resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-slate-500 mr-1">SEÑALES:</span>
          {SIGNALS.map((s) => (
            <button
              key={s}
              onClick={() => toggleSignal(s)}
              className={`text-[11px] font-mono px-2 py-1 rounded-md border transition-colors ${
                entry.signals.includes(s) ? "border-neon-blue/50 text-neon-blue bg-neon-blue/10" : "border-void-border text-slate-500"
              }`}
            >
              {SIGNAL_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-slate-500 mr-1">EMOCIÓN:</span>
          {EMOTIONS.map((em) => (
            <button
              key={em}
              onClick={() => updateEntry(entry.id, { emotion: entry.emotion === em ? null : em })}
              className={`text-[11px] font-mono px-2 py-1 rounded-md border transition-colors ${
                entry.emotion === em ? "border-neon-gold/50 text-neon-gold bg-neon-gold/10" : "border-void-border text-slate-500"
              }`}
            >
              {EMOTION_LABELS[em]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
