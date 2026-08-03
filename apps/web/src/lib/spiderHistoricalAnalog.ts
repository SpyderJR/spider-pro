import type { FearGreedHistoryPoint } from "@spider/types";

const MIN_SECONDS_AGO = 30 * 24 * 60 * 60;

/**
 * Busca, en el historial real de Fear & Greed, la ocurrencia pasada más parecida a la
 * lectura actual — misma clasificación, valor más cercano, al menos 30 días atrás (para
 * no "encontrarse a sí mismo" en el dato de ayer).
 */
export function findHistoricalAnalog(
  currentValue: number,
  currentClassification: string,
  history: FearGreedHistoryPoint[],
): FearGreedHistoryPoint | null {
  const nowSeconds = Date.now() / 1000;
  const candidates = history.filter(
    (p) => p.classification === currentClassification && nowSeconds - p.time >= MIN_SECONDS_AGO,
  );
  if (candidates.length === 0) return null;

  let best = candidates[0]!;
  let bestDiff = Math.abs(best.value - currentValue);
  for (const p of candidates) {
    const diff = Math.abs(p.value - currentValue);
    if (diff < bestDiff || (diff === bestDiff && p.time > best.time)) {
      best = p;
      bestDiff = diff;
    }
  }
  return best;
}
