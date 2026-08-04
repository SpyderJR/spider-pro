import { useAcademyProgressStore } from "../../store/academyProgressStore";
import { useArcadeStore } from "../../store/arcadeStore";
import { useDiaryStore } from "../../store/diaryStore";
import { usePaperTradingStore } from "../paperTrading/store";
import { useFuturesStore } from "../../store/futuresStore";
import { useTerminalPreferencesStore } from "../../store/terminalPreferencesStore";
import type { BlobSyncTarget, SetSyncTarget } from "./types";
import type { DiaryEntry } from "../diary/types";
import type { ClosedTrade, PendingOrder, Position } from "../paperTrading/types";
import type { FuturesClosedTrade, FuturesPendingOrder, FuturesPosition } from "../futures/types";
import type { TerminalIndicatorToggles } from "../../hooks/useTerminalIndicators";

function latestWins<T>(local: T, remote: T | null, localAt: string | null, remoteAt: string | null): T {
  if (!remote) return local;
  if (!localAt) return remote;
  if (!remoteAt) return local;
  return localAt >= remoteAt ? local : remote;
}

// --- academy_progress: unión por nivel, nunca se pierde un nivel aprobado NI una lección --
interface AcademyBlob {
  progress: Record<string, { bestScorePercent: number; completed: boolean; lessonsCompleted: string[] }>;
  lastVisitDate: string | null;
  streakDays: number;
}

export const academyTarget: BlobSyncTarget<AcademyBlob> = {
  table: "academy_progress",
  getLocal: () => {
    const s = useAcademyProgressStore.getState();
    return { progress: s.progress, lastVisitDate: s.lastVisitDate, streakDays: s.streakDays };
  },
  setLocal: (value) => useAcademyProgressStore.setState(value),
  subscribeLocal: (cb) => useAcademyProgressStore.subscribe(cb),
  merge: (local, remote) => {
    if (!remote) return local;
    const progress: AcademyBlob["progress"] = { ...remote.progress };
    for (const [id, lp] of Object.entries(local.progress)) {
      const r = progress[id];
      progress[id] = {
        bestScorePercent: Math.max(lp.bestScorePercent, r?.bestScorePercent ?? 0),
        completed: lp.completed || (r?.completed ?? false),
        lessonsCompleted: [...new Set([...(r?.lessonsCompleted ?? []), ...(lp.lessonsCompleted ?? [])])],
      };
    }
    const localMoreRecent = !remote.lastVisitDate || (!!local.lastVisitDate && local.lastVisitDate >= remote.lastVisitDate);
    return {
      progress,
      lastVisitDate: localMoreRecent ? local.lastVisitDate : remote.lastVisitDate,
      streakDays: localMoreRecent ? local.streakDays : remote.streakDays,
    };
  },
};

// --- arcade_stats: blob "gana el más reciente" (los logros se sincronizan aparte, unidos) --
interface ArcadeBlob {
  xp: ReturnType<typeof useArcadeStore.getState>["xp"];
  gameStats: ReturnType<typeof useArcadeStore.getState>["gameStats"];
  dailyChallenge: ReturnType<typeof useArcadeStore.getState>["dailyChallenge"];
  dailyStreak: number;
  lastCompletedChallengeDate: string | null;
}

export const arcadeTarget: BlobSyncTarget<ArcadeBlob> = {
  table: "arcade_stats",
  getLocal: () => {
    const s = useArcadeStore.getState();
    return {
      xp: s.xp,
      gameStats: s.gameStats,
      dailyChallenge: s.dailyChallenge,
      dailyStreak: s.dailyStreak,
      lastCompletedChallengeDate: s.lastCompletedChallengeDate,
    };
  },
  setLocal: (value) => useArcadeStore.setState(value),
  // Solo re-sincroniza cuando cambian los campos de este blob, no en cada render.
  subscribeLocal: (cb) =>
    useArcadeStore.subscribe((s, prev) => {
      if (s.xp !== prev.xp || s.gameStats !== prev.gameStats || s.dailyStreak !== prev.dailyStreak) cb();
    }),
  merge: latestWins,
};

export const achievementsTarget: SetSyncTarget<string> = {
  table: "achievements",
  idColumn: "achievement_id",
  getLocalItems: () => useArcadeStore.getState().achievementsUnlocked,
  setLocalItems: (items) => useArcadeStore.setState({ achievementsUnlocked: items }),
  subscribeLocal: (cb) =>
    useArcadeStore.subscribe((s, prev) => {
      if (s.achievementsUnlocked !== prev.achievementsUnlocked) cb();
    }),
  getId: (id) => id,
  toRow: (userId, id) => ({ user_id: userId, achievement_id: id }),
  fromRow: (row) => row.achievement_id as string,
};

// --- journal_entries: unión por id, nunca se pierde una entrada del diario -----------------
export const journalTarget: SetSyncTarget<DiaryEntry> = {
  table: "journal_entries",
  idColumn: "entry_id",
  getLocalItems: () => useDiaryStore.getState().entries,
  setLocalItems: (items) => useDiaryStore.setState({ entries: [...items].sort((a, b) => b.createdAt - a.createdAt) }),
  subscribeLocal: (cb) => useDiaryStore.subscribe(cb),
  getId: (entry) => entry.id,
  toRow: (userId, entry) => ({
    user_id: userId,
    entry_id: entry.id,
    data: entry as unknown as Record<string, unknown>,
    created_at: new Date(entry.createdAt).toISOString(),
    updated_at: new Date().toISOString(),
  }),
  fromRow: (row) => row.data as DiaryEntry,
};

// --- terminal_state: historial se une por id (nunca se pierde un trade cerrado); -----------
// balance/posiciones/órdenes "vivas" ganan el lado más reciente.
interface TerminalBlob {
  spot: { balance: number; positions: Position[]; orders: PendingOrder[]; history: ClosedTrade[] };
  futures: { balance: number; positions: FuturesPosition[]; orders: FuturesPendingOrder[]; history: FuturesClosedTrade[] };
}

function unionById<T extends { id: string }>(a: T[], b: T[]): T[] {
  const byId = new Map<string, T>();
  for (const item of b) byId.set(item.id, item);
  for (const item of a) byId.set(item.id, item);
  return [...byId.values()].sort((x: any, y: any) => (y.closedAt ?? 0) - (x.closedAt ?? 0));
}

export const terminalTarget: BlobSyncTarget<TerminalBlob> = {
  table: "terminal_state",
  getLocal: () => {
    const spot = usePaperTradingStore.getState();
    const futures = useFuturesStore.getState();
    return {
      spot: { balance: spot.balance, positions: spot.positions, orders: spot.orders, history: spot.history },
      futures: { balance: futures.balance, positions: futures.positions, orders: futures.orders, history: futures.history },
    };
  },
  setLocal: (value) => {
    usePaperTradingStore.setState(value.spot);
    useFuturesStore.setState(value.futures);
  },
  subscribeLocal: (cb) => {
    const un1 = usePaperTradingStore.subscribe(cb);
    const un2 = useFuturesStore.subscribe(cb);
    return () => {
      un1();
      un2();
    };
  },
  merge: (local, remote, localAt, remoteAt) => {
    if (!remote) return local;
    const liveSide = latestWins(local, remote, localAt, remoteAt);
    return {
      spot: { ...liveSide.spot, history: unionById(local.spot.history, remote.spot.history) },
      futures: { ...liveSide.futures, history: unionById(local.futures.history, remote.futures.history) },
    };
  },
};

// --- settings: preferencias de la Terminal, gana el más reciente ---------------------------
export const settingsTarget: BlobSyncTarget<{ toggles: TerminalIndicatorToggles }> = {
  table: "settings",
  getLocal: () => ({ toggles: useTerminalPreferencesStore.getState().toggles }),
  setLocal: (value) => useTerminalPreferencesStore.setState(value),
  subscribeLocal: (cb) => useTerminalPreferencesStore.subscribe(cb),
  merge: latestWins,
};

export const ALL_BLOB_TARGETS = [academyTarget, arcadeTarget, terminalTarget, settingsTarget] as BlobSyncTarget<unknown>[];
export const ALL_SET_TARGETS = [achievementsTarget, journalTarget] as unknown as SetSyncTarget<unknown>[];
