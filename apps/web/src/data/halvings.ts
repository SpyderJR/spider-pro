export interface HalvingEvent {
  number: number;
  date: string; // ISO date
  blockHeight: number;
  rewardBefore: number;
  rewardAfter: number;
  priceAtHalving: number | null;
  athFollowing: number | null;
  daysToAth: number | null;
}

export const HALVINGS: HalvingEvent[] = [
  {
    number: 1,
    date: "2012-11-28",
    blockHeight: 210_000,
    rewardBefore: 50,
    rewardAfter: 25,
    priceAtHalving: 12.35,
    athFollowing: 1_163,
    daysToAth: 371,
  },
  {
    number: 2,
    date: "2016-07-09",
    blockHeight: 420_000,
    rewardBefore: 25,
    rewardAfter: 12.5,
    priceAtHalving: 650.63,
    athFollowing: 19_665,
    daysToAth: 526,
  },
  {
    number: 3,
    date: "2020-05-11",
    blockHeight: 630_000,
    rewardBefore: 12.5,
    rewardAfter: 6.25,
    priceAtHalving: 8_821,
    athFollowing: 69_000,
    daysToAth: 549,
  },
  {
    number: 4,
    date: "2024-04-20",
    blockHeight: 840_000,
    rewardBefore: 6.25,
    rewardAfter: 3.125,
    priceAtHalving: 63_907,
    athFollowing: null,
    daysToAth: null,
  },
];

/** Next projected halving — block height based, ~10 min/block average. */
export const NEXT_HALVING = {
  number: 5,
  estimatedBlockHeight: 1_050_000,
  estimatedDate: "2028-04",
  rewardAfter: 1.5625,
};

/** % gain from the halving-day price to the cycle's subsequent ATH — derived, not a new hardcoded fact. */
export function gainToAthPercent(h: HalvingEvent): number | null {
  if (h.priceAtHalving === null || h.athFollowing === null) return null;
  return ((h.athFollowing - h.priceAtHalving) / h.priceAtHalving) * 100;
}

/** Calendar days between two halvings — derived from their ISO dates. */
export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / (1000 * 60 * 60 * 24));
}

export interface CyclePhaseGuide {
  phase: string;
  monthsFromHalving: string;
  description: string;
  historicalBehavior: string;
}

export const CYCLE_PHASES: CyclePhaseGuide[] = [
  {
    phase: "Acumulación",
    monthsFromHalving: "0–6 meses",
    description: "Periodo posterior inmediato al halving. El nuevo suministro se reduce a la mitad, pero el mercado tarda en reaccionar.",
    historicalBehavior: "Históricamente lateral a moderadamente alcista, con baja volatilidad relativa.",
  },
  {
    phase: "Expansión",
    monthsFromHalving: "6–14 meses",
    description: "La reducción de oferta empieza a reflejarse en precio de forma más visible, con entrada de nuevos participantes.",
    historicalBehavior: "Tendencia alcista sostenida en los 3 ciclos anteriores.",
  },
  {
    phase: "Euforia / Distribución",
    monthsFromHalving: "14–18 meses",
    description: "Fase de mayor volatilidad y atención mediática, históricamente donde se alcanzan los máximos del ciclo.",
    historicalBehavior: "Picos parabólicos seguidos de correcciones abruptas en los 3 ciclos anteriores.",
  },
  {
    phase: "Corrección / Invierno",
    monthsFromHalving: "18+ meses",
    description: "Fase de retroceso prolongado tras el máximo del ciclo, con caídas históricas del 70–85% desde el ATH.",
    historicalBehavior: "Mercado bajista extendido antes del siguiente halving y su fase de acumulación.",
  },
];
