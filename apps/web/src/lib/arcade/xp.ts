export interface ArcadeLevelDef {
  name: string;
  minXp: number;
}

export const ARCADE_LEVELS: ArcadeLevelDef[] = [
  { name: "Novato", minXp: 0 },
  { name: "Aprendiz", minXp: 400 },
  { name: "Trader en Formación", minXp: 1200 },
  { name: "Trader", minXp: 3000 },
  { name: "Trader Avanzado", minXp: 6000 },
  { name: "Spider Trader", minXp: 11000 },
];

export interface LevelProgress {
  levelIndex: number;
  name: string;
  xpIntoLevel: number;
  xpForNextLevel: number | null;
  progressPercent: number;
}

export function computeLevelProgress(xp: number): LevelProgress {
  let levelIndex = 0;
  for (let i = ARCADE_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= ARCADE_LEVELS[i]!.minXp) {
      levelIndex = i;
      break;
    }
  }
  const current = ARCADE_LEVELS[levelIndex]!;
  const next = ARCADE_LEVELS[levelIndex + 1] ?? null;
  const xpIntoLevel = xp - current.minXp;
  const xpForNextLevel = next ? next.minXp - current.minXp : null;
  const progressPercent = xpForNextLevel ? Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100)) : 100;
  return { levelIndex, name: current.name, xpIntoLevel, xpForNextLevel, progressPercent };
}
