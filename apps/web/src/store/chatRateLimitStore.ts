import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DAILY_CHAT_LIMIT = 15;
const DAY_MS = 24 * 60 * 60 * 1000;

interface ChatRateLimitState {
  count: number;
  resetAt: number;
  remaining: () => number;
  canSend: () => boolean;
  recordMessage: () => void;
  syncFromServer: (remaining: number) => void;
}

function freshWindow() {
  return { count: 0, resetAt: Date.now() + DAY_MS };
}

export const useChatRateLimitStore = create<ChatRateLimitState>()(
  persist(
    (set, get) => ({
      ...freshWindow(),

      remaining: () => {
        const s = get();
        if (Date.now() > s.resetAt) return DAILY_CHAT_LIMIT;
        return Math.max(0, DAILY_CHAT_LIMIT - s.count);
      },

      canSend: () => get().remaining() > 0,

      recordMessage: () => {
        const s = get();
        if (Date.now() > s.resetAt) {
          set({ count: 1, resetAt: Date.now() + DAY_MS });
        } else {
          set({ count: s.count + 1 });
        }
      },

      // Lets the server's per-IP count correct client drift (e.g. same IP, different browser).
      syncFromServer: (remaining) => {
        const s = get();
        const clientRemaining = Date.now() > s.resetAt ? DAILY_CHAT_LIMIT : DAILY_CHAT_LIMIT - s.count;
        if (remaining < clientRemaining) {
          set({ count: DAILY_CHAT_LIMIT - remaining, resetAt: Date.now() > s.resetAt ? Date.now() + DAY_MS : s.resetAt });
        }
      },
    }),
    { name: "spider-chat-rate-limit" },
  ),
);
