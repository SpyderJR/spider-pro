import { ARCADE_GAMES, type ArcadeGameId } from "../../data/arcadeGames";

function hashDate(dateKey: string): number {
  let h = 0;
  for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) >>> 0;
  return h;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Deterministic pick so every player gets the same daily challenge on a given date. */
export function pickDailyGame(dateKey: string): ArcadeGameId {
  const idx = hashDate(dateKey) % ARCADE_GAMES.length;
  return ARCADE_GAMES[idx]!.id;
}
