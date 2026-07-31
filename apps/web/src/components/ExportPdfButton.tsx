import { usePageContextStore } from "../store/pageContextStore";
import { generatePdfReport } from "../lib/pdfReport";

/** Exports the exact "verified data" snapshot the current page published — the same data the chat assistant can see. */
export function ExportPdfButton() {
  const { page, data } = usePageContextStore();

  return (
    <button
      onClick={() => generatePdfReport(page, data)}
      disabled={!page}
      title="Exportar reporte PDF con los datos verificados de esta sección"
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border border-void-border text-slate-400 hover:text-neon-gold hover:border-neon-gold/40 transition-colors disabled:opacity-30 disabled:pointer-events-none"
    >
      <span>📄</span>
      <span className="hidden sm:inline">PDF</span>
    </button>
  );
}
