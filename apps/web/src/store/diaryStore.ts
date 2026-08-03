import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ClosedTrade } from "../lib/paperTrading/types";
import type { FuturesClosedTrade } from "../lib/futures/types";
import type { DiaryEmotion, DiaryEntry, DiarySignal } from "../lib/diary/types";

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface DiaryState {
  entries: DiaryEntry[];
  syncFromTrades: (trades: ClosedTrade[]) => void;
  syncFromFuturesTrades: (trades: FuturesClosedTrade[]) => void;
  addManualEntry: (entry: Omit<DiaryEntry, "id" | "createdAt" | "sourceTradeId">) => void;
  updateEntry: (id: string, patch: Partial<Pick<DiaryEntry, "entryReasonText" | "signals" | "emotion" | "lesson">>) => void;
  deleteEntry: (id: string) => void;
}

export const useDiaryStore = create<DiaryState>()(
  persist(
    (set, get) => ({
      entries: [],

      syncFromTrades: (trades) => {
        const existingTradeIds = new Set(get().entries.map((e) => e.sourceTradeId).filter(Boolean));
        const newEntries: DiaryEntry[] = trades
          .filter((t) => !existingTradeIds.has(t.id))
          .map((t) => ({
            id: makeId(),
            sourceTradeId: t.id,
            createdAt: t.closedAt,
            market: "spot",
            leverage: null,
            pair: t.pair,
            direction: t.side,
            entryReasonText: "",
            signals: [],
            emotion: null,
            result: t.pnl > 0 ? "win" : t.pnl < 0 ? "loss" : "breakeven",
            pnl: t.pnl,
            pnlPercent: t.pnlPercent,
            lesson: "",
          }));
        if (newEntries.length > 0) {
          set((s) => ({ entries: [...newEntries, ...s.entries].sort((a, b) => b.createdAt - a.createdAt) }));
        }
      },

      syncFromFuturesTrades: (trades) => {
        const existingTradeIds = new Set(get().entries.map((e) => e.sourceTradeId).filter(Boolean));
        const newEntries: DiaryEntry[] = trades
          .filter((t) => !existingTradeIds.has(t.id))
          .map((t) => ({
            id: makeId(),
            sourceTradeId: t.id,
            createdAt: t.closedAt,
            market: "futures",
            leverage: t.leverage,
            pair: t.pair,
            direction: t.side === "long" ? "buy" : "sell",
            entryReasonText: "",
            signals: [],
            emotion: null,
            result: t.pnl > 0 ? "win" : t.pnl < 0 ? "loss" : "breakeven",
            pnl: t.pnl,
            pnlPercent: t.pnlPercent,
            lesson: t.exitReason === "liquidation" ? "Liquidado — revisar apalancamiento y tamaño de posición." : "",
          }));
        if (newEntries.length > 0) {
          set((s) => ({ entries: [...newEntries, ...s.entries].sort((a, b) => b.createdAt - a.createdAt) }));
        }
      },

      addManualEntry: (entry) => {
        const newEntry: DiaryEntry = { ...entry, id: makeId(), createdAt: Date.now(), sourceTradeId: null };
        set((s) => ({ entries: [newEntry, ...s.entries].sort((a, b) => b.createdAt - a.createdAt) }));
      },

      updateEntry: (id, patch) => {
        set((s) => ({ entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
      },

      deleteEntry: (id) => {
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
      },
    }),
    { name: "spider-diary" },
  ),
);

export type { DiaryEmotion, DiarySignal };
