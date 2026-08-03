import { create } from "zustand";

interface UiState {
  backupModalOpen: boolean;
  openBackupModal: () => void;
  closeBackupModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  backupModalOpen: false,
  openBackupModal: () => set({ backupModalOpen: true }),
  closeBackupModal: () => set({ backupModalOpen: false }),
}));
