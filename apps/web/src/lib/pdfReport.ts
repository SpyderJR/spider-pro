import { jsPDF } from "jspdf";

/** Human labels for the page slugs published via usePublishContext, used as the PDF report title. */
const PAGE_TITLES: Record<string, string> = {
  "spider-intelligence": "Spider Intelligence",
  bitcoin: "Bitcoin",
  tron: "TRON",
  "analisis-tecnico": "Análisis Técnico",
  "trading-tools": "Radar de Trading",
  "velas-japonesas": "Velas Japonesas",
  estrategias: "Estrategias & Cómo Invertir",
  halvings: "Halvings BTC",
  "m2-vs-mercado": "M2 vs Mercado",
  stablecoins: "Stablecoins TRON",
  crashes: "Crashes Históricos",
  roadmap: "TRON Roadmap",
  "justin-sun": "Justin Sun",
  calculadora: "Calculadora",
};

function humanizeLabel(path: string): string {
  const last = path.split(".").pop() ?? path;
  return last
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "—";
    const abs = Math.abs(value);
    const decimals = abs !== 0 && abs < 1 ? Math.min(8, Math.max(2, -Math.floor(Math.log10(abs)) + 2)) : 2;
    return value.toLocaleString("en-US", { maximumFractionDigits: decimals });
  }
  if (typeof value === "boolean") return value ? "Sí" : "No";
  return String(value);
}

/** Flattens a nested data snapshot into label/value rows, e.g. `{ macd: { histogram: 1 } }` → `"macd.histogram" → "1"`. */
function flatten(obj: unknown, prefix = ""): Array<[string, string]> {
  if (obj === null || obj === undefined) return prefix ? [[prefix, "—"]] : [];
  if (typeof obj !== "object") return [[prefix || "valor", formatValue(obj)]];
  if (Array.isArray(obj)) {
    if (obj.length === 0) return [[prefix, "—"]];
    if (obj.every((v) => typeof v !== "object" || v === null)) {
      return [[prefix, obj.map(formatValue).join(", ")]];
    }
    return obj.flatMap((item, i) => flatten(item, prefix ? `${prefix}[${i}]` : `[${i}]`));
  }
  const entries = Object.entries(obj as Record<string, unknown>);
  if (entries.length === 0) return prefix ? [[prefix, "—"]] : [];
  return entries.flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k));
}

export function generatePdfReport(page: string, data: Record<string, unknown>): void {
  const title = PAGE_TITLES[page] ?? page;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;

  function drawHeader() {
    doc.setFillColor(6, 7, 12);
    doc.rect(0, 0, pageWidth, 78, "F");
    doc.setFillColor(57, 255, 156);
    doc.circle(margin + 6, 32, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("courier", "bold");
    doc.setFontSize(16);
    doc.text("SPIDER PRO", margin + 20, 37);
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Reporte de datos verificados en tiempo real", margin + 20, 52);
    doc.setTextColor(255, 207, 77);
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.text(new Date().toLocaleString("es-ES"), pageWidth - margin, 37, { align: "right" });
  }

  drawHeader();

  let y = 110;
  doc.setTextColor(15, 20, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, margin, y);
  y += 28;

  const rows = flatten(data);

  if (rows.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Esta sección todavía no publicó datos verificados para exportar.", margin, y);
    y += 20;
  }

  doc.setFontSize(10);
  rows.forEach(([label, value], i) => {
    if (y > pageHeight - 90) {
      doc.addPage();
      drawHeader();
      y = 110;
    }
    if (i % 2 === 0) {
      doc.setFillColor(245, 246, 248);
      doc.rect(margin - 6, y - 13, pageWidth - margin * 2 + 12, 20, "F");
    }
    doc.setFont("courier", "normal");
    doc.setTextColor(90, 100, 115);
    doc.text(humanizeLabel(label), margin, y, { maxWidth: 260 });
    doc.setFont("courier", "bold");
    doc.setTextColor(15, 20, 30);
    doc.text(value, pageWidth - margin, y, { align: "right", maxWidth: 220 });
    y += 20;
  });

  y += 18;
  if (y > pageHeight - 70) {
    doc.addPage();
    drawHeader();
    y = 130;
  }
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(
    "Spider Pro — Contexto de mercado, no asesoría financiera (NFA — Not Financial Advice). " +
      "Datos verificados al momento de generar este reporte; los precios y señales cambian en vivo.",
    margin,
    y,
    { maxWidth: pageWidth - margin * 2 },
  );

  const dateSlug = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  doc.save(`spider-pro-${page}-${dateSlug}.pdf`);
}
