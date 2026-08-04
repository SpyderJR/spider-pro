import { useState } from "react";
import type { DiaryEntry } from "../../lib/diary/types";
import { EMOTION_LABELS, SIGNAL_LABELS } from "../../lib/diary/types";
import { useChatRateLimitStore, DAILY_CHAT_LIMIT } from "../../store/chatRateLimitStore";
import { postChat } from "../../lib/api";

function summarizeEntry(e: DiaryEntry): string {
  const parts = [
    e.pair,
    e.direction === "buy" ? "compra" : "venta",
    e.result ? `resultado ${e.result}` : "sin resultado",
    e.pnlPercent !== null ? `${e.pnlPercent >= 0 ? "+" : ""}${e.pnlPercent.toFixed(2)}%` : "",
    e.emotion ? `emoción: ${EMOTION_LABELS[e.emotion]}` : "",
    e.signals.length > 0 ? `señales: ${e.signals.map((s) => SIGNAL_LABELS[s]).join(", ")}` : "",
    e.lesson ? `lección anotada: "${e.lesson}"` : "",
  ].filter(Boolean);
  return `- ${parts.join(" · ")}`;
}

export function DiaryAiAnalysis({ entries }: { entries: DiaryEntry[] }) {
  const { canSend, remaining, recordMessage, syncFromServer } = useChatRateLimitStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const last20 = entries.slice(0, 20);

  async function analyze() {
    if (last20.length === 0 || loading) return;
    if (!canSend()) {
      setError(`Ya usaste tus ${DAILY_CHAT_LIMIT} mensajes de hoy. El límite se reinicia en 24 horas.`);
      return;
    }
    setLoading(true);
    setError(null);
    recordMessage();
    try {
      const prompt =
        `Analiza mis últimas ${last20.length} operaciones de mi diario de trading y dame un resumen breve (máximo 5 líneas) ` +
        `de patrones de comportamiento — no de análisis de mercado. Enfócate en emociones, señales usadas y horarios. ` +
        `No des ninguna recomendación de compra o venta, esto es un análisis de mi propio comportamiento como trader.\n\n` +
        last20.map(summarizeEntry).join("\n");
      const res = await postChat(prompt, "diario", undefined, []);
      setResult(res.reply);
      if (res.remaining !== undefined) syncFromServer(res.remaining);
    } catch {
      setError("No se pudo conectar con el asistente. Prueba de nuevo en unos segundos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel p-5 mb-6">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h2 className="text-lg font-bold text-white">Análisis con Spider AI</h2>
        <span className="text-[10px] font-mono text-slate-500">{remaining()}/{DAILY_CHAT_LIMIT} mensajes hoy</span>
      </div>
      <p className="text-xs text-slate-500 mb-3">
        Le pide a Spider que lea tus últimas {last20.length} entradas y busque patrones de comportamiento. Consume 1 mensaje de tu límite diario del chat.
      </p>
      <button
        onClick={analyze}
        disabled={loading || last20.length === 0}
        className="px-4 py-2 rounded-lg text-sm font-bold bg-neon-blue/10 border border-neon-blue/40 text-neon-blue disabled:opacity-40"
      >
        {loading ? "Analizando…" : "Analizar últimas entradas con IA"}
      </button>

      {error && <p className="text-xs text-neon-red mt-3">{error}</p>}
      {result && <div className="mt-4 bg-void-soft rounded-lg px-4 py-3 text-sm text-slate-200 whitespace-pre-line">{result}</div>}
    </div>
  );
}
