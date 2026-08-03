import { useEffect, useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { DiaryEntryCard } from "../components/diary/DiaryEntryCard";
import { NewManualEntryForm } from "../components/diary/NewManualEntryForm";
import { DiaryAnalysisPanel } from "../components/diary/DiaryAnalysisPanel";
import { DiaryAiAnalysis } from "../components/diary/DiaryAiAnalysis";
import { useDiaryStore } from "../store/diaryStore";
import { usePaperTradingStore } from "../lib/paperTrading/store";
import { useFuturesStore } from "../store/futuresStore";
import { usePublishContext } from "../hooks/usePublishContext";

const MARKET_FILTERS = [
  { id: "all", label: "Todos" },
  { id: "spot", label: "Spot" },
  { id: "futures", label: "Futuros" },
] as const;

export function DiarioPage() {
  const allEntries = useDiaryStore((s) => s.entries);
  const syncFromTrades = useDiaryStore((s) => s.syncFromTrades);
  const syncFromFuturesTrades = useDiaryStore((s) => s.syncFromFuturesTrades);
  const history = usePaperTradingStore((s) => s.history);
  const futuresHistory = useFuturesStore((s) => s.history);
  const [showForm, setShowForm] = useState(false);
  const [marketFilter, setMarketFilter] = useState<"all" | "spot" | "futures">("all");

  useEffect(() => {
    syncFromTrades(history);
  }, [history, syncFromTrades]);

  useEffect(() => {
    syncFromFuturesTrades(futuresHistory);
  }, [futuresHistory, syncFromFuturesTrades]);

  const entries = marketFilter === "all" ? allEntries : allEntries.filter((e) => e.market === marketFilter);

  usePublishContext("diario", {
    totalEntradas: allEntries.length,
    entradasSpot: allEntries.filter((e) => e.market === "spot").length,
    entradasFuturos: allEntries.filter((e) => e.market === "futures").length,
    entradasConLeccion: allEntries.filter((e) => e.lesson.trim().length > 0).length,
  });

  return (
    <div>
      <SectionHeader
        title="Diario de Trading"
        subtitle="Cada trade cerrado en la Terminal aparece acá automáticamente. Completá la razón, la emoción y la lección para que el análisis tenga sentido."
      />

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-1.5">
          {MARKET_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setMarketFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border ${
                marketFilter === f.id ? "border-neon-blue/50 text-neon-blue bg-neon-blue/5" : "border-void-border text-slate-500"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg text-sm font-mono border border-neon-blue/40 text-neon-blue"
          >
            + Nueva entrada manual
          </button>
        )}
      </div>

      {showForm && <NewManualEntryForm onDone={() => setShowForm(false)} />}

      {entries.length === 0 ? (
        <div className="panel p-8 text-center text-slate-500 text-sm mb-6">
          {allEntries.length === 0
            ? "Todavía no hay entradas. Cerrá un trade en la Terminal (Spot o Futuros) o agregá una entrada manual para empezar."
            : "No hay entradas para este filtro."}
        </div>
      ) : (
        <>
          <DiaryAnalysisPanel entries={entries} />
          <DiaryAiAnalysis entries={entries} />
          <div className="space-y-3 mb-6">
            {entries.map((e) => (
              <DiaryEntryCard key={e.id} entry={e} />
            ))}
          </div>
        </>
      )}

      <Disclaimer text="El Diario de Trading es una herramienta de autoanálisis educativa. Los patrones detectados reflejan tu propio historial, no son asesoría financiera (NFA)." />
    </div>
  );
}
