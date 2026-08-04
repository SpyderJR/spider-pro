import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_TOGGLES, type TerminalIndicatorToggles } from "../hooks/useTerminalIndicators";

interface TerminalPreferencesState {
  toggles: TerminalIndicatorToggles;
  toggle: (key: keyof TerminalIndicatorToggles) => void;
  /** Opt-in, default off — unlike the app's global click sound, an order-fill chime is
   * loud enough / frequent enough that it shouldn't surprise anyone who didn't ask for it. */
  orderSoundEnabled: boolean;
  toggleOrderSound: () => void;
  /** Right-column Terminal panel order (order book, order panel, trades feed, etc.) — see
   * `TerminalPage.tsx` for the ids in use. Reorder via buttons, not drag-and-drop, matching
   * the same reliability-over-native-DnD choice already made for Academia's "Ordenar" exercise. */
  panelOrder: string[];
  movePanel: (id: string, direction: "up" | "down") => void;
}

export const useTerminalPreferencesStore = create<TerminalPreferencesState>()(
  persist(
    (set) => ({
      toggles: DEFAULT_TOGGLES,
      toggle: (key) => set((s) => ({ toggles: { ...s.toggles, [key]: !s.toggles[key] } })),
      orderSoundEnabled: false,
      toggleOrderSound: () => set((s) => ({ orderSoundEnabled: !s.orderSoundEnabled })),
      panelOrder: ["order", "orderbook", "trades"],
      movePanel: (id, direction) =>
        set((s) => {
          const order = [...s.panelOrder];
          const index = order.indexOf(id);
          if (index === -1) return s;
          const swapWith = direction === "up" ? index - 1 : index + 1;
          if (swapWith < 0 || swapWith >= order.length) return s;
          [order[index], order[swapWith]] = [order[swapWith]!, order[index]!];
          return { panelOrder: order };
        }),
    }),
    { name: "spider-terminal-preferences" },
  ),
);
