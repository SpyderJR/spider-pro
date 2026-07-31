import { create } from "zustand";
import type { ChatMessage } from "@spider/types";

interface ChatState {
  isOpen: boolean;
  isSending: boolean;
  messages: ChatMessage[];
  toggle: () => void;
  open: () => void;
  close: () => void;
  addMessage: (message: ChatMessage) => void;
  setSending: (sending: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  isSending: false,
  messages: [
    {
      role: "assistant",
      content:
        "Hola, soy Spider. Puedo responder preguntas sobre lo que estás viendo en pantalla ahora mismo — precio, indicadores, señales — usando solo datos verificados. Si algo no está en pantalla, te lo voy a decir en vez de inventarlo.",
    },
  ],
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  setSending: (isSending) => set({ isSending }),
}));
