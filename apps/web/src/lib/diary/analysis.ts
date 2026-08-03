import { EMOTION_LABELS, SIGNAL_LABELS, type DiaryEmotion, type DiaryEntry, type DiarySignal } from "./types";

export interface RateBucket {
  key: string;
  label: string;
  count: number;
  wins: number;
  winRate: number;
}

const MIN_SAMPLE = 3;

function toBuckets<K extends string>(
  entries: DiaryEntry[],
  keyOf: (e: DiaryEntry) => K[],
  labels: Record<K, string>,
): RateBucket[] {
  const decided = entries.filter((e) => e.result === "win" || e.result === "loss");
  const map = new Map<K, { count: number; wins: number }>();
  for (const e of decided) {
    for (const k of keyOf(e)) {
      const cur = map.get(k) ?? { count: 0, wins: 0 };
      cur.count += 1;
      if (e.result === "win") cur.wins += 1;
      map.set(k, cur);
    }
  }
  return [...map.entries()]
    .map(([key, v]) => ({ key, label: labels[key], count: v.count, wins: v.wins, winRate: Math.round((v.wins / v.count) * 100) }))
    .sort((a, b) => b.count - a.count);
}

export function winRateByEmotion(entries: DiaryEntry[]): RateBucket[] {
  return toBuckets(entries, (e) => (e.emotion ? [e.emotion] : []), EMOTION_LABELS);
}

export function winRateBySignal(entries: DiaryEntry[]): RateBucket[] {
  return toBuckets(entries, (e) => e.signals, SIGNAL_LABELS);
}

const DAY_LABELS: Record<string, string> = {
  "0": "Domingo",
  "1": "Lunes",
  "2": "Martes",
  "3": "Miércoles",
  "4": "Jueves",
  "5": "Viernes",
  "6": "Sábado",
};

export function winRateByDayOfWeek(entries: DiaryEntry[]): RateBucket[] {
  return toBuckets(entries, (e) => [String(new Date(e.createdAt).getDay())], DAY_LABELS);
}

const SESSION_LABELS: Record<string, string> = {
  madrugada: "Madrugada (00-06h)",
  manana: "Mañana (06-12h)",
  tarde: "Tarde (12-18h)",
  noche: "Noche (18-24h)",
};

function sessionOf(hour: number): keyof typeof SESSION_LABELS {
  if (hour < 6) return "madrugada";
  if (hour < 12) return "manana";
  if (hour < 18) return "tarde";
  return "noche";
}

export function winRateBySession(entries: DiaryEntry[]): RateBucket[] {
  return toBuckets(entries, (e) => [sessionOf(new Date(e.createdAt).getHours())], SESSION_LABELS);
}

export function overallWinRate(entries: DiaryEntry[]): number {
  const decided = entries.filter((e) => e.result === "win" || e.result === "loss");
  if (decided.length === 0) return 0;
  return Math.round((decided.filter((e) => e.result === "win").length / decided.length) * 100);
}

export function generateInsights(entries: DiaryEntry[]): string[] {
  const decided = entries.filter((e) => e.result === "win" || e.result === "loss");
  if (decided.length < 5) {
    return ["Registrá al menos 5 operaciones con emoción y resultado para desbloquear insights confiables."];
  }

  const overall = overallWinRate(entries);
  const insights: string[] = [];

  for (const bucket of winRateByEmotion(entries)) {
    if (bucket.count < MIN_SAMPLE) continue;
    if (bucket.winRate <= overall - 15) {
      insights.push(
        `Cuando operás sintiéndote "${bucket.label}" tu win rate cae a ${bucket.winRate}% (vs ${overall}% general, en ${bucket.count} operaciones). Vale la pena pensarlo dos veces antes de entrar en ese estado.`,
      );
    } else if (bucket.winRate >= overall + 15) {
      insights.push(
        `Tus mejores resultados llegan cuando te sentís "${bucket.label}": ${bucket.winRate}% de win rate en ${bucket.count} operaciones.`,
      );
    }
  }

  for (const bucket of winRateBySignal(entries)) {
    if (bucket.count < MIN_SAMPLE) continue;
    if (bucket.winRate >= overall + 15) {
      insights.push(`Las operaciones basadas en ${bucket.label} tienen ${bucket.winRate}% de win rate — tu señal más confiable hasta ahora.`);
    } else if (bucket.winRate <= overall - 15) {
      insights.push(`Las operaciones basadas en ${bucket.label} tienen solo ${bucket.winRate}% de win rate — revisá cómo la estás usando.`);
    }
  }

  for (const bucket of winRateBySession(entries)) {
    if (bucket.count < MIN_SAMPLE) continue;
    if (bucket.winRate <= overall - 15) {
      insights.push(`Operar en la ${bucket.label.toLowerCase()} te da ${bucket.winRate}% de win rate, por debajo de tu promedio. Podría ser cansancio o menor liquidez del mercado en ese horario.`);
    }
  }

  if (insights.length === 0) {
    insights.push(`No hay patrones fuertes todavía (${overall}% de win rate general) — seguí registrando para afinar el análisis.`);
  }

  return insights;
}

export type { DiaryEmotion, DiarySignal };
