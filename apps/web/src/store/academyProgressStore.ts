import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACADEMY_LEVELS } from "../data/academyLevels";

interface LevelProgress {
  bestScorePercent: number;
  completed: boolean;
}

interface AcademyProgressState {
  progress: Record<string, LevelProgress>;
  lastVisitDate: string | null;
  streakDays: number;
  recordQuizResult: (levelId: string, scorePercent: number) => void;
  touchVisit: () => void;
  overallPercent: () => number;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useAcademyProgressStore = create<AcademyProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      lastVisitDate: null,
      streakDays: 0,

      recordQuizResult: (levelId, scorePercent) => {
        set((s) => {
          const prev = s.progress[levelId];
          const bestScorePercent = Math.max(prev?.bestScorePercent ?? 0, scorePercent);
          return {
            progress: {
              ...s.progress,
              [levelId]: { bestScorePercent, completed: bestScorePercent >= 80 },
            },
          };
        });
      },

      touchVisit: () => {
        const today = todayKey();
        const s = get();
        if (s.lastVisitDate === today) return;

        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const continuesStreak = s.lastVisitDate === yesterday;
        set({
          lastVisitDate: today,
          streakDays: continuesStreak ? s.streakDays + 1 : 1,
        });
      },

      overallPercent: () => {
        const s = get();
        const completedCount = ACADEMY_LEVELS.filter((l) => s.progress[l.id]?.completed).length;
        return Math.round((completedCount / ACADEMY_LEVELS.length) * 100);
      },
    }),
    { name: "spider-academy-progress" },
  ),
);
