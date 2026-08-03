export type DiaryEmotion = "confiado" | "ansioso" | "fomo" | "aburrido" | "vengativo";
export type DiarySignal = "fractal" | "pivote" | "bos" | "rsi";
export type DiaryResult = "win" | "loss" | "breakeven";

export interface DiaryEntry {
  id: string;
  sourceTradeId: string | null;
  createdAt: number;
  market: "spot" | "futures";
  leverage: number | null;
  pair: string;
  direction: "buy" | "sell";
  entryReasonText: string;
  signals: DiarySignal[];
  emotion: DiaryEmotion | null;
  result: DiaryResult | null;
  pnl: number | null;
  pnlPercent: number | null;
  lesson: string;
}

export const EMOTION_LABELS: Record<DiaryEmotion, string> = {
  confiado: "Confiado",
  ansioso: "Ansioso",
  fomo: "FOMO",
  aburrido: "Aburrido",
  vengativo: "Venganza",
};

export const SIGNAL_LABELS: Record<DiarySignal, string> = {
  fractal: "Fractal",
  pivote: "Pivote",
  bos: "BOS",
  rsi: "RSI",
};
