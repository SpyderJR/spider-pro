import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WatchedMemeToken {
  address: string;
  symbol: string | null;
  addedAt: number;
}

interface MemeWatchlistState {
  items: WatchedMemeToken[];
  addToWatchlist: (address: string, symbol: string | null) => void;
  removeFromWatchlist: (address: string) => void;
  isWatched: (address: string) => boolean;
}

export const useMemeWatchlistStore = create<MemeWatchlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWatchlist: (address, symbol) => {
        if (get().items.some((i) => i.address === address)) return;
        set((s) => ({ items: [{ address, symbol, addedAt: Date.now() }, ...s.items] }));
      },

      removeFromWatchlist: (address) => {
        set((s) => ({ items: s.items.filter((i) => i.address !== address) }));
      },

      isWatched: (address) => get().items.some((i) => i.address === address),
    }),
    { name: "spider-meme-watchlist" },
  ),
);
