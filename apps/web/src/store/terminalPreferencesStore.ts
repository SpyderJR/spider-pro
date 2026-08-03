import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_TOGGLES, type TerminalIndicatorToggles } from "../hooks/useTerminalIndicators";

interface TerminalPreferencesState {
  toggles: TerminalIndicatorToggles;
  toggle: (key: keyof TerminalIndicatorToggles) => void;
}

export const useTerminalPreferencesStore = create<TerminalPreferencesState>()(
  persist(
    (set) => ({
      toggles: DEFAULT_TOGGLES,
      toggle: (key) => set((s) => ({ toggles: { ...s.toggles, [key]: !s.toggles[key] } })),
    }),
    { name: "spider-terminal-preferences" },
  ),
);
