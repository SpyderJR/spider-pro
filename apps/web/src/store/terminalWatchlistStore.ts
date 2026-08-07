import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TerminalWatchlistState {
  pairs: string[];
  toggle: (symbol: string) => void;
  isWatched: (symbol: string) => boolean;
}

export const useTerminalWatchlistStore = create<TerminalWatchlistState>()(
  persist(
    (set, get) => ({
      pairs: [],

      toggle: (symbol) => {
        set((s) => (s.pairs.includes(symbol) ? { pairs: s.pairs.filter((p) => p !== symbol) } : { pairs: [...s.pairs, symbol] }));
      },

      isWatched: (symbol) => get().pairs.includes(symbol),
    }),
    { name: "spider-terminal-watchlist" },
  ),
);
