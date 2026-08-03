import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ARCADE_GAMES, type ArcadeGameId } from "../data/arcadeGames";
import { ACHIEVEMENTS, evaluateNewAchievements, type Achievement, type ArcadeStats } from "../data/achievements";
import { pickDailyGame, todayKey, yesterdayKey } from "../lib/arcade/dailyChallenge";
import { computeLevelProgress } from "../lib/arcade/xp";

interface GameStat {
  plays: number;
  bestScorePercent: number;
  bestStreak: number;
  record: number;
  /** Generic counters for game-specific special conditions (e.g. "won using only low leverage"). */
  flagCount: number;
  secondaryFlagCount: number;
}

interface DailyChallengeState {
  date: string;
  gameId: ArcadeGameId;
  completed: boolean;
}

interface ArcadeState {
  xp: number;
  gameStats: Record<ArcadeGameId, GameStat>;
  achievementsUnlocked: string[];
  dailyChallenge: DailyChallengeState | null;
  dailyStreak: number;
  lastCompletedChallengeDate: string | null;

  ensureDailyChallenge: () => void;
  recordGameResult: (
    gameId: ArcadeGameId,
    result: { scorePercent: number; streak: number; record?: number; flag?: boolean; secondaryFlag?: boolean },
  ) => { xpGained: number; newAchievements: Achievement[]; dailyChallengeCompleted: boolean };
  weakestSkill: () => { skill: string; skillPage: string; gameId: ArcadeGameId } | null;
  levelProgress: () => ReturnType<typeof computeLevelProgress>;
}

function emptyGameStats(): Record<ArcadeGameId, GameStat> {
  const entries = ARCADE_GAMES.map((g) => [g.id, { plays: 0, bestScorePercent: 0, bestStreak: 0, record: 0, flagCount: 0, secondaryFlagCount: 0 }] as const);
  return Object.fromEntries(entries) as Record<ArcadeGameId, GameStat>;
}

export const useArcadeStore = create<ArcadeState>()(
  persist(
    (set, get) => ({
      xp: 0,
      gameStats: emptyGameStats(),
      achievementsUnlocked: [],
      dailyChallenge: null,
      dailyStreak: 0,
      lastCompletedChallengeDate: null,

      ensureDailyChallenge: () => {
        const today = todayKey();
        const s = get();
        if (s.dailyChallenge?.date === today) return;

        // Streak breaks if yesterday's challenge existed but wasn't completed.
        const yesterday = yesterdayKey();
        const brokeStreak = s.dailyChallenge?.date === yesterday && !s.dailyChallenge.completed;
        set({
          dailyChallenge: { date: today, gameId: pickDailyGame(today), completed: false },
          dailyStreak: brokeStreak ? 0 : s.dailyStreak,
        });
      },

      recordGameResult: (gameId, result) => {
        const s = get();
        const prevStat = s.gameStats[gameId];
        const isDailyChallenge = s.dailyChallenge?.date === todayKey() && s.dailyChallenge.gameId === gameId && !s.dailyChallenge.completed;

        const baseXp = Math.round(result.scorePercent * 2);
        const xpGained = isDailyChallenge ? baseXp * 2 : baseXp;

        const nextGameStats: Record<ArcadeGameId, GameStat> = {
          ...s.gameStats,
          [gameId]: {
            plays: prevStat.plays + 1,
            bestScorePercent: Math.max(prevStat.bestScorePercent, result.scorePercent),
            bestStreak: Math.max(prevStat.bestStreak, result.streak),
            record: Math.max(prevStat.record, result.record ?? 0),
            flagCount: (prevStat.flagCount ?? 0) + (result.flag ? 1 : 0),
            secondaryFlagCount: (prevStat.secondaryFlagCount ?? 0) + (result.secondaryFlag ? 1 : 0),
          },
        };

        const nextXp = s.xp + xpGained;
        const wasStreakDay = s.lastCompletedChallengeDate === todayKey();
        const nextDailyStreak = isDailyChallenge && !wasStreakDay ? s.dailyStreak + 1 : s.dailyStreak;

        const stats: ArcadeStats = {
          totalGamesPlayed: Object.values(nextGameStats).reduce((sum, g) => sum + g.plays, 0),
          totalXp: nextXp,
          dailyStreak: nextDailyStreak,
          gameStats: nextGameStats,
        };
        const newAchievements = evaluateNewAchievements(stats, s.achievementsUnlocked);

        set({
          xp: nextXp,
          gameStats: nextGameStats,
          achievementsUnlocked: [...s.achievementsUnlocked, ...newAchievements.map((a) => a.id)],
          dailyChallenge: isDailyChallenge && s.dailyChallenge ? { ...s.dailyChallenge, completed: true } : s.dailyChallenge,
          dailyStreak: nextDailyStreak,
          lastCompletedChallengeDate: isDailyChallenge ? todayKey() : s.lastCompletedChallengeDate,
        });

        return { xpGained, newAchievements, dailyChallengeCompleted: isDailyChallenge };
      },

      weakestSkill: () => {
        const s = get();
        const played = ARCADE_GAMES.filter((g) => s.gameStats[g.id].plays > 0);
        if (played.length === 0) return null;
        const weakest = played.reduce((worst, g) =>
          s.gameStats[g.id].bestScorePercent < s.gameStats[worst.id].bestScorePercent ? g : worst,
        );
        return { skill: weakest.skill, skillPage: weakest.skillPage, gameId: weakest.id };
      },

      levelProgress: () => computeLevelProgress(get().xp),
    }),
    {
      name: "spider-arcade-progress",
      // Games added after a browser already has persisted progress (e.g. this one) must
      // not wholesale-replace `gameStats` on rehydration — merge per-key so older saves
      // still get a valid default entry for any game they never played.
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<ArcadeState>;
        return {
          ...currentState,
          ...persisted,
          gameStats: { ...currentState.gameStats, ...persisted.gameStats },
        };
      },
    },
  ),
);

export { ACHIEVEMENTS };
