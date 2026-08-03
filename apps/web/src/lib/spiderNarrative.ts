import type { SpiderZone } from "./spiderScore";

interface NarrativeParams {
  zone: SpiderZone;
  bullishLabels: string[];
  bearishLabels: string[];
  totalSignals: number;
  fearGreedValue: number | null;
  athDistancePercent: number | null;
}

/**
 * Arma la explicación de la lectura actual 100% a partir de reglas fijas y los datos ya
 * calculados en la página — no hay llamada a IA. Se recalcula solo cuando cambian los datos.
 */
export function buildSpiderNarrative(params: NarrativeParams): string {
  const { zone, bullishLabels, bearishLabels, totalSignals, fearGreedValue, athDistancePercent } = params;

  const leadIn =
    zone === "compra"
      ? `${bullishLabels.length} de ${totalSignals} señales apuntan hacia una posible zona de acumulación histórica: ${bullishLabels.join(", ")}.`
      : zone === "venta"
        ? `${bearishLabels.length} de ${totalSignals} señales apuntan hacia una zona de mayor cautela: ${bearishLabels.join(", ")}.`
        : `Las señales están mixtas — ${bullishLabels.length} a favor de acumulación, ${bearishLabels.length} a favor de cautela — sin una mayoría clara todavía.`;

  if (zone === "neutral") {
    return `${leadIn} Hace falta más confluencia de señales, en cualquier dirección, para que la balanza se incline.`;
  }

  const parts: string[] = [];
  if (fearGreedValue !== null) {
    parts.push(
      zone === "compra"
        ? `el Fear & Greed tendría que subir de ${fearGreedValue.toFixed(0)} a más de 70 (codicia)`
        : `el Fear & Greed tendría que bajar de ${fearGreedValue.toFixed(0)} a menos de 30 (miedo)`,
    );
  }
  if (athDistancePercent !== null) {
    parts.push(
      zone === "compra"
        ? `el precio acercarse a menos del 12% de su máximo histórico (hoy está ${Math.abs(athDistancePercent).toFixed(0)}% por debajo)`
        : `el precio alejarse a más del 35% de su máximo histórico (hoy está ${Math.abs(athDistancePercent).toFixed(0)}% por debajo)`,
    );
  }

  const changeText = parts.length > 0 ? `Para que la zona cambie, ${parts.join(", o ")}.` : "";
  return `${leadIn} ${changeText}`.trim();
}
