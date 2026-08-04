import { DAY_LABELS, MIN_SAMPLE, SESSION_LABELS, overallWinRate, sessionOf } from "./analysis";
import type { DiaryEntry } from "./types";

/** Chronological (oldest→newest) list of decided trades — everything below walks trade order. */
function decidedChronological(entries: DiaryEntry[]): DiaryEntry[] {
  return entries
    .filter((e) => e.result === "win" || e.result === "loss")
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt);
}

export interface LosingStreakStat {
  streakLength: number;
  winRateAfterStreak: number;
  baselineWinRate: number;
  sampleSize: number;
}

/**
 * Win rate of trades immediately following a run of `streakLength`+ consecutive losses,
 * compared against the trader's overall win rate. Returns null below MIN_SAMPLE — a thin
 * sample here would be noise dressed up as a pattern, not a real behavioral finding.
 */
export function winRateAfterLosingStreak(entries: DiaryEntry[], streakLength: number): LosingStreakStat | null {
  const decided = decidedChronological(entries);
  let consecutiveLosses = 0;
  let wins = 0;
  let count = 0;

  for (const e of decided) {
    if (consecutiveLosses >= streakLength) {
      count += 1;
      if (e.result === "win") wins += 1;
    }
    consecutiveLosses = e.result === "loss" ? consecutiveLosses + 1 : 0;
  }

  if (count < MIN_SAMPLE) return null;

  return {
    streakLength,
    winRateAfterStreak: Math.round((wins / count) * 100),
    baselineWinRate: overallWinRate(entries),
    sampleSize: count,
  };
}

/**
 * Tries the strongest signal first (longer losing streak = more specific revenge-trading
 * pattern) and falls back to a shorter streak only if there isn't enough data for the longer
 * one — never fabricates a streak length that didn't clear the sample-size bar.
 */
export function strongestLosingStreakPattern(entries: DiaryEntry[]): LosingStreakStat | null {
  for (const streakLength of [3, 2, 1]) {
    const stat = winRateAfterLosingStreak(entries, streakLength);
    if (stat) return stat;
  }
  return null;
}

export interface DayAndSessionAfterLossBucket {
  key: string;
  label: string;
  winRate: number;
  sampleSize: number;
}

/**
 * Win rate broken down by day-of-week + session, restricted to trades that came right after
 * a loss (chronologically) — the "revenge trading" slice specifically, not the trader's
 * overall day/session performance (that's already covered by analysis.ts's existing buckets).
 */
export function winRateByDayAndSessionAfterLoss(entries: DiaryEntry[]): DayAndSessionAfterLossBucket[] {
  const decided = decidedChronological(entries);
  const map = new Map<string, { count: number; wins: number; label: string }>();

  for (let i = 1; i < decided.length; i++) {
    const prev = decided[i - 1]!;
    if (prev.result !== "loss") continue;
    const cur = decided[i]!;
    const date = new Date(cur.createdAt);
    const dayKey = String(date.getDay());
    const session = sessionOf(date.getHours());
    const key = `${dayKey}-${session}`;
    const label = `${DAY_LABELS[dayKey]} / ${SESSION_LABELS[session]}`;
    const bucket = map.get(key) ?? { count: 0, wins: 0, label };
    bucket.count += 1;
    if (cur.result === "win") bucket.wins += 1;
    map.set(key, bucket);
  }

  return [...map.entries()]
    .filter(([, v]) => v.count >= MIN_SAMPLE)
    .map(([key, v]) => ({ key, label: v.label, winRate: Math.round((v.wins / v.count) * 100), sampleSize: v.count }))
    .sort((a, b) => a.winRate - b.winRate);
}

/**
 * Aggregates every rule-computed behavioral stat into one verified-facts block, the same role
 * `buildMarketContextSnapshot()` plays for market data — the AI is only allowed to narrate
 * numbers that appear in here, never invent its own from the raw entry text. Returns null when
 * nothing clears the sample-size bar, so the caller can honestly say "not enough data yet"
 * instead of shipping an empty/misleading block.
 */
export function buildDiaryBehavioralStatsBlock(entries: DiaryEntry[]): Record<string, unknown> | null {
  const losingStreak = strongestLosingStreakPattern(entries);
  const dayAndSessionAfterLoss = winRateByDayAndSessionAfterLoss(entries);

  if (!losingStreak && dayAndSessionAfterLoss.length === 0) return null;

  return {
    ...(losingStreak ? { rachaDePerdidas: losingStreak } : {}),
    ...(dayAndSessionAfterLoss.length > 0 ? { diaYHorarioTrasPerdida: dayAndSessionAfterLoss } : {}),
  };
}
