import { useState } from "react";
import { EMOTION_LABELS, SIGNAL_LABELS, type DiaryEmotion, type DiaryResult, type DiarySignal } from "../../lib/diary/types";
import { useDiaryStore } from "../../store/diaryStore";

const EMOTIONS = Object.keys(EMOTION_LABELS) as DiaryEmotion[];
const SIGNALS = Object.keys(SIGNAL_LABELS) as DiarySignal[];

export function NewManualEntryForm({ onDone }: { onDone: () => void }) {
  const addManualEntry = useDiaryStore((s) => s.addManualEntry);
  const [market, setMarket] = useState<"spot" | "futures">("spot");
  const [leverage, setLeverage] = useState("5");
  const [pair, setPair] = useState("BTCUSDT");
  const [direction, setDirection] = useState<"buy" | "sell">("buy");
  const [result, setResult] = useState<DiaryResult>("win");
  const [entryReasonText, setEntryReasonText] = useState("");
  const [signals, setSignals] = useState<DiarySignal[]>([]);
  const [emotion, setEmotion] = useState<DiaryEmotion | null>(null);
  const [lesson, setLesson] = useState("");

  function toggleSignal(s: DiarySignal) {
    setSignals((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function submit() {
    addManualEntry({
      market,
      leverage: market === "futures" ? Number(leverage) || 1 : null,
      pair: pair.trim() || "BTCUSDT",
      direction,
      result,
      entryReasonText,
      signals,
      emotion,
      lesson,
      pnl: null,
      pnlPercent: null,
    });
    onDone();
  }

  return (
    <div className="panel p-4 border border-neon-blue/30 mb-4">
      <h3 className="text-sm font-bold text-white mb-3">Nueva entrada manual</h3>
      <div className="grid sm:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="text-[10px] font-mono text-slate-500 block mb-1">MERCADO</label>
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value as "spot" | "futures")}
            className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-neon-green/50"
          >
            <option value="spot">Spot</option>
            <option value="futures">Futuros</option>
          </select>
        </div>
        {market === "futures" && (
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">APALANCAMIENTO</label>
            <input
              type="number"
              min={1}
              max={125}
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-neon-green/50"
            />
          </div>
        )}
        <div>
          <label className="text-[10px] font-mono text-slate-500 block mb-1">PAR</label>
          <input
            value={pair}
            onChange={(e) => setPair(e.target.value.toUpperCase())}
            className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-neon-green/50"
          />
        </div>
        <div>
          <label className="text-[10px] font-mono text-slate-500 block mb-1">DIRECCIÓN</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as "buy" | "sell")}
            className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-neon-green/50"
          >
            <option value="buy">Compra</option>
            <option value="sell">Venta</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono text-slate-500 block mb-1">RESULTADO</label>
          <select
            value={result}
            onChange={(e) => setResult(e.target.value as DiaryResult)}
            className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-neon-green/50"
          >
            <option value="win">Ganada</option>
            <option value="loss">Perdida</option>
            <option value="breakeven">Neutra</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[10px] font-mono text-slate-500 block mb-1">RAZÓN DE ENTRADA</label>
          <textarea
            value={entryReasonText}
            onChange={(e) => setEntryReasonText(e.target.value)}
            rows={2}
            className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-neon-green/50 resize-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-mono text-slate-500 block mb-1">LECCIÓN</label>
          <textarea
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            rows={2}
            className="w-full bg-void-soft border border-void-border rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-neon-green/50 resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-slate-500 mr-1">SEÑALES:</span>
          {SIGNALS.map((s) => (
            <button
              key={s}
              onClick={() => toggleSignal(s)}
              className={`text-[11px] font-mono px-2 py-1 rounded-md border transition-colors ${
                signals.includes(s) ? "border-neon-blue/50 text-neon-blue bg-neon-blue/10" : "border-void-border text-slate-500"
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
              onClick={() => setEmotion(emotion === em ? null : em)}
              className={`text-[11px] font-mono px-2 py-1 rounded-md border transition-colors ${
                emotion === em ? "border-neon-gold/50 text-neon-gold bg-neon-gold/10" : "border-void-border text-slate-500"
              }`}
            >
              {EMOTION_LABELS[em]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button onClick={onDone} className="px-4 py-2 rounded-lg text-sm font-mono border border-void-border text-slate-400">
          Cancelar
        </button>
        <button onClick={submit} className="px-4 py-2 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green">
          Guardar entrada
        </button>
      </div>
    </div>
  );
}
