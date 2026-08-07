import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PriceAlert {
  id: string;
  pair: string;
  targetPrice: number;
  direction: "above" | "below";
  triggered: boolean;
  createdAt: number;
}

function makeId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

interface PriceAlertsState {
  alerts: PriceAlert[];
  addAlert: (pair: string, targetPrice: number, direction: "above" | "below") => void;
  removeAlert: (id: string) => void;
  markTriggered: (id: string) => void;
}

export const usePriceAlertsStore = create<PriceAlertsState>()(
  persist(
    (set) => ({
      alerts: [],

      addAlert: (pair, targetPrice, direction) => {
        set((s) => ({
          alerts: [{ id: makeId(), pair, targetPrice, direction, triggered: false, createdAt: Date.now() }, ...s.alerts],
        }));
      },

      removeAlert: (id) => {
        set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) }));
      },

      markTriggered: (id) => {
        set((s) => ({ alerts: s.alerts.map((a) => (a.id === id ? { ...a, triggered: true } : a)) }));
      },
    }),
    { name: "spider-price-alerts" },
  ),
);
