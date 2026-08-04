import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACADEMY_LEVELS_V2 } from "../content/academy/levels";

interface LevelProgress {
  bestScorePercent: number;
  completed: boolean;
  lessonsCompleted: string[];
}

interface AcademyProgressState {
  progress: Record<string, LevelProgress>;
  lastVisitDate: string | null;
  streakDays: number;
  recordQuizResult: (levelId: string, scorePercent: number) => void;
  completeLesson: (levelId: string, lessonId: string) => void;
  isLessonCompleted: (levelId: string, lessonId: string) => boolean;
  touchVisit: () => void;
  overallPercent: () => number;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyLevelProgress(): LevelProgress {
  return { bestScorePercent: 0, completed: false, lessonsCompleted: [] };
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
              [levelId]: {
                bestScorePercent,
                completed: bestScorePercent >= 80,
                lessonsCompleted: prev?.lessonsCompleted ?? [],
              },
            },
          };
        });
      },

      completeLesson: (levelId, lessonId) => {
        set((s) => {
          const prev = s.progress[levelId] ?? emptyLevelProgress();
          if (prev.lessonsCompleted.includes(lessonId)) return s;
          return {
            progress: {
              ...s.progress,
              [levelId]: { ...prev, lessonsCompleted: [...prev.lessonsCompleted, lessonId] },
            },
          };
        });
      },

      isLessonCompleted: (levelId, lessonId) => {
        return get().progress[levelId]?.lessonsCompleted.includes(lessonId) ?? false;
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
        const completedCount = ACADEMY_LEVELS_V2.filter((l) => s.progress[l.id]?.completed).length;
        return Math.round((completedCount / ACADEMY_LEVELS_V2.length) * 100);
      },
    }),
    {
      name: "spider-academy-progress",
      // Los saves viejos no tienen `lessonsCompleted` por nivel — se agrega vacío en vez de
      // undefined para que el resto del código no tenga que chequear presencia del campo.
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<AcademyProgressState>;
        const mergedProgress: Record<string, LevelProgress> = { ...currentState.progress };
        for (const [levelId, lp] of Object.entries(persisted.progress ?? {})) {
          mergedProgress[levelId] = {
            bestScorePercent: lp.bestScorePercent ?? 0,
            completed: lp.completed ?? false,
            lessonsCompleted: lp.lessonsCompleted ?? [],
          };
        }
        return { ...currentState, ...persisted, progress: mergedProgress };
      },
    },
  ),
);
