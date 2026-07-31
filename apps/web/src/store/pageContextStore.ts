import { create } from "zustand";

interface PageContextState {
  page: string;
  data: Record<string, unknown>;
  updatedAt: number;
  publish: (page: string, data: Record<string, unknown>) => void;
}

/**
 * Each section calls `publish` with a snapshot of what's on screen (price,
 * RSI, signal, etc.). The chat assistant reads this store as the only
 * source of truth it's allowed to cite numbers from.
 */
export const usePageContextStore = create<PageContextState>((set) => ({
  page: "",
  data: {},
  updatedAt: 0,
  publish: (page, data) => set({ page, data, updatedAt: Date.now() }),
}));
