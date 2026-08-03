export type SignalVote = -1 | 0 | 1;

export interface SpiderSignal {
  id: string;
  label: string;
  reading: string;
  vote: SignalVote;
  explanation: string;
  link?: string;
}

export type SpiderZone = "compra" | "neutral" | "venta";

export interface SpiderScoreResult {
  score: number; // 0-100, 50 = punto medio sin sesgo
  zone: SpiderZone;
  bullishCount: number;
  bearishCount: number;
  neutralCount: number;
}

/**
 * Cuenta votos de N señales independientes (cada una ya evaluada por su propia regla fija,
 * sin IA) y los normaliza a un score 0-100. Todas las señales pesan igual — sin caja negra,
 * el desglose completo se muestra siempre junto al score.
 */
export function computeSpiderScore(signals: SpiderSignal[]): SpiderScoreResult {
  if (signals.length === 0) {
    return { score: 50, zone: "neutral", bullishCount: 0, bearishCount: 0, neutralCount: 0 };
  }
  const bullishCount = signals.filter((s) => s.vote === 1).length;
  const bearishCount = signals.filter((s) => s.vote === -1).length;
  const neutralCount = signals.length - bullishCount - bearishCount;
  const sumVotes = signals.reduce((sum, s) => sum + s.vote, 0);
  const score = ((sumVotes / signals.length + 1) / 2) * 100;
  const zone: SpiderZone = score >= 65 ? "compra" : score <= 35 ? "venta" : "neutral";
  return { score, zone, bullishCount, bearishCount, neutralCount };
}
