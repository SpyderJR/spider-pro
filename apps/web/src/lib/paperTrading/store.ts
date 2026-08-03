import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ClosedTrade, ExitReason, OrderSide, PendingOrder, Position } from "./types";
import { checkPositionExit, computePnl, computePnlPercent, shouldFillLimitOrder } from "./engine";

const INITIAL_BALANCE = 10_000;

type FeedbackGenerator = (trade: Omit<ClosedTrade, "feedback">, balanceBeforeTrade: number) => string[];

interface PaperTradingState {
  balance: number;
  positions: Position[];
  orders: PendingOrder[];
  history: ClosedTrade[];

  openMarketPosition: (params: {
    pair: string;
    side: OrderSide;
    usdAmount: number;
    quantity: number;
    price: number;
    stopLoss: number | null;
    takeProfit: number | null;
  }) => void;
  placeLimitOrder: (params: {
    pair: string;
    side: OrderSide;
    quantity: number;
    limitPrice: number;
    stopLoss: number | null;
    takeProfit: number | null;
  }) => void;
  cancelOrder: (id: string) => void;
  updatePositionSlTp: (id: string, stopLoss: number | null, takeProfit: number | null) => void;
  closePosition: (id: string, exitPrice: number, reason: ExitReason, generateFeedback: FeedbackGenerator) => void;
  processTick: (pair: string, price: number, generateFeedback: FeedbackGenerator) => void;
  resetAccount: () => void;
}

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const usePaperTradingStore = create<PaperTradingState>()(
  persist(
    (set, get) => ({
      balance: INITIAL_BALANCE,
      positions: [],
      orders: [],
      history: [],

      openMarketPosition: ({ pair, side, quantity, price, stopLoss, takeProfit }) => {
        const position: Position = {
          id: makeId(),
          pair,
          side,
          entryPrice: price,
          quantity,
          stopLoss,
          takeProfit,
          openedAt: Date.now(),
        };
        set((s) => ({ positions: [...s.positions, position] }));
      },

      placeLimitOrder: ({ pair, side, quantity, limitPrice, stopLoss, takeProfit }) => {
        const order: PendingOrder = {
          id: makeId(),
          pair,
          side,
          limitPrice,
          quantity,
          stopLoss,
          takeProfit,
          createdAt: Date.now(),
        };
        set((s) => ({ orders: [...s.orders, order] }));
      },

      cancelOrder: (id) => {
        set((s) => ({ orders: s.orders.filter((o) => o.id !== id) }));
      },

      updatePositionSlTp: (id, stopLoss, takeProfit) => {
        set((s) => ({
          positions: s.positions.map((p) => (p.id === id ? { ...p, stopLoss, takeProfit } : p)),
        }));
      },

      closePosition: (id, exitPrice, reason, generateFeedback) => {
        const position = get().positions.find((p) => p.id === id);
        if (!position) return;

        const pnl = computePnl(position.side, position.entryPrice, exitPrice, position.quantity);
        const pnlPercent = computePnlPercent(position.side, position.entryPrice, exitPrice);

        const tradeWithoutFeedback: Omit<ClosedTrade, "feedback"> = {
          id: position.id,
          pair: position.pair,
          side: position.side,
          entryPrice: position.entryPrice,
          exitPrice,
          quantity: position.quantity,
          pnl,
          pnlPercent,
          openedAt: position.openedAt,
          closedAt: Date.now(),
          exitReason: reason,
          stopLoss: position.stopLoss,
          takeProfit: position.takeProfit,
        };

        const feedback = generateFeedback(tradeWithoutFeedback, get().balance);
        const trade: ClosedTrade = { ...tradeWithoutFeedback, feedback };

        set((s) => ({
          positions: s.positions.filter((p) => p.id !== id),
          history: [trade, ...s.history],
          balance: s.balance + pnl,
        }));
      },

      // Called on every live price tick — fills pending limit orders and evaluates
      // SL/TP against open positions for the given pair. Kept idempotent/cheap so it
      // can run on every websocket message.
      processTick: (pair, price, generateFeedback) => {
        const state = get();

        for (const order of state.orders.filter((o) => o.pair === pair)) {
          if (shouldFillLimitOrder(order, price)) {
            set((s) => ({ orders: s.orders.filter((o) => o.id !== order.id) }));
            get().openMarketPosition({
              pair: order.pair,
              side: order.side,
              usdAmount: order.quantity * price,
              quantity: order.quantity,
              price,
              stopLoss: order.stopLoss,
              takeProfit: order.takeProfit,
            });
          }
        }

        for (const position of state.positions.filter((p) => p.pair === pair)) {
          const exit = checkPositionExit(position, price);
          if (exit) {
            const exitPrice = exit === "stop_loss" ? position.stopLoss! : position.takeProfit!;
            get().closePosition(position.id, exitPrice, exit, generateFeedback);
          }
        }
      },

      resetAccount: () => {
        set({ balance: INITIAL_BALANCE, positions: [], orders: [], history: [] });
      },
    }),
    { name: "spider-paper-trading" },
  ),
);

export { INITIAL_BALANCE };
