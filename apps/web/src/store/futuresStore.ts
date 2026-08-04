import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FuturesClosedTrade, FuturesExitReason, FuturesPendingOrder, FuturesPosition, MarginMode } from "../lib/futures/types";
import type { FuturesSide } from "../lib/futures/liquidation";
import { computeLiquidationPrice, computeRequiredMargin, isLiquidated } from "../lib/futures/liquidation";
import { checkFuturesPositionExit, computeFundingPayment, computeFuturesPnl, computeFuturesPnlPercent, shouldFillFuturesLimitOrder } from "../lib/futures/engine";
import { playOrderFillSound } from "../lib/sound";
import { useTerminalPreferencesStore } from "./terminalPreferencesStore";

const INITIAL_FUTURES_BALANCE = 10_000;
const FUNDING_INTERVAL_MS = 8 * 60 * 60 * 1000;

type FeedbackGenerator = (trade: Omit<FuturesClosedTrade, "feedback">, balanceBeforeTrade: number) => string[];

interface FuturesState {
  balance: number;
  positions: FuturesPosition[];
  orders: FuturesPendingOrder[];
  history: FuturesClosedTrade[];

  openMarketPosition: (params: {
    pair: string;
    side: FuturesSide;
    leverage: number;
    marginMode: MarginMode;
    margin: number;
    quantity: number;
    price: number;
    stopLoss: number | null;
    takeProfit: number | null;
  }) => void;
  placeLimitOrder: (params: {
    pair: string;
    side: FuturesSide;
    leverage: number;
    marginMode: MarginMode;
    quantity: number;
    limitPrice: number;
    stopLoss: number | null;
    takeProfit: number | null;
  }) => void;
  cancelOrder: (id: string) => void;
  updatePositionSlTp: (id: string, stopLoss: number | null, takeProfit: number | null) => void;
  closePosition: (id: string, exitPrice: number, reason: FuturesExitReason, generateFeedback: FeedbackGenerator) => void;
  processTick: (pair: string, price: number, fundingRate: number, generateFeedback: FeedbackGenerator) => void;
  resetAccount: () => void;
}

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useFuturesStore = create<FuturesState>()(
  persist(
    (set, get) => ({
      balance: INITIAL_FUTURES_BALANCE,
      positions: [],
      orders: [],
      history: [],

      openMarketPosition: ({ pair, side, leverage, marginMode, margin, quantity, price, stopLoss, takeProfit }) => {
        const position: FuturesPosition = {
          id: makeId(),
          pair,
          side,
          entryPrice: price,
          quantity,
          leverage,
          marginMode,
          margin,
          liquidationPrice: computeLiquidationPrice(price, leverage, side),
          stopLoss,
          takeProfit,
          openedAt: Date.now(),
          lastFundingAt: Date.now(),
          fundingPaid: 0,
        };
        set((s) => ({ positions: [...s.positions, position] }));
        if (useTerminalPreferencesStore.getState().orderSoundEnabled) playOrderFillSound();
      },

      placeLimitOrder: ({ pair, side, leverage, marginMode, quantity, limitPrice, stopLoss, takeProfit }) => {
        const order: FuturesPendingOrder = {
          id: makeId(),
          pair,
          side,
          limitPrice,
          quantity,
          leverage,
          marginMode,
          stopLoss,
          takeProfit,
          createdAt: Date.now(),
        };
        set((s) => ({ orders: [...s.orders, order] }));
      },

      cancelOrder: (id) => set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),

      updatePositionSlTp: (id, stopLoss, takeProfit) =>
        set((s) => ({ positions: s.positions.map((p) => (p.id === id ? { ...p, stopLoss, takeProfit } : p)) })),

      closePosition: (id, exitPrice, reason, generateFeedback) => {
        const position = get().positions.find((p) => p.id === id);
        if (!position) return;

        const pnl = computeFuturesPnl(position.side, position.entryPrice, exitPrice, position.quantity);
        const pnlPercent = computeFuturesPnlPercent(position.side, position.entryPrice, exitPrice, position.leverage);

        // On liquidation the whole margin is lost, not just the notional P&L (which would
        // already be roughly -margin at that price, but we clamp explicitly for honesty).
        // pnlPercent is clamped the same way so it never contradicts "lost the full margin".
        const realizedPnl = reason === "liquidation" ? -position.margin : pnl;
        const realizedPnlPercent = reason === "liquidation" ? -100 : pnlPercent;

        const tradeWithoutFeedback: Omit<FuturesClosedTrade, "feedback"> = {
          id: position.id,
          pair: position.pair,
          side: position.side,
          entryPrice: position.entryPrice,
          exitPrice,
          quantity: position.quantity,
          leverage: position.leverage,
          marginMode: position.marginMode,
          margin: position.margin,
          liquidationPrice: position.liquidationPrice,
          pnl: realizedPnl,
          pnlPercent: realizedPnlPercent,
          fundingPaid: position.fundingPaid,
          openedAt: position.openedAt,
          closedAt: Date.now(),
          exitReason: reason,
          stopLoss: position.stopLoss,
          takeProfit: position.takeProfit,
        };

        const feedback = generateFeedback(tradeWithoutFeedback, get().balance);
        const trade: FuturesClosedTrade = { ...tradeWithoutFeedback, feedback };

        set((s) => ({
          positions: s.positions.filter((p) => p.id !== id),
          history: [trade, ...s.history],
          balance: s.balance + realizedPnl,
        }));
      },

      processTick: (pair, price, fundingRate, generateFeedback) => {
        const state = get();

        for (const order of state.orders.filter((o) => o.pair === pair)) {
          if (shouldFillFuturesLimitOrder(order, price)) {
            set((s) => ({ orders: s.orders.filter((o) => o.id !== order.id) }));
            const margin = computeRequiredMargin(order.limitPrice * order.quantity, order.leverage);
            get().openMarketPosition({
              pair: order.pair,
              side: order.side,
              leverage: order.leverage,
              marginMode: order.marginMode,
              margin,
              quantity: order.quantity,
              price,
              stopLoss: order.stopLoss,
              takeProfit: order.takeProfit,
            });
          }
        }

        for (const position of state.positions.filter((p) => p.pair === pair)) {
          if (isLiquidated(position.side, price, position.liquidationPrice)) {
            get().closePosition(position.id, position.liquidationPrice, "liquidation", generateFeedback);
            continue;
          }
          const exit = checkFuturesPositionExit(position, price);
          if (exit) {
            const exitPrice = exit === "stop_loss" ? position.stopLoss! : position.takeProfit!;
            get().closePosition(position.id, exitPrice, exit, generateFeedback);
            continue;
          }
          if (Date.now() - position.lastFundingAt >= FUNDING_INTERVAL_MS) {
            const payment = computeFundingPayment(position, fundingRate);
            set((s) => ({
              positions: s.positions.map((p) =>
                p.id === position.id ? { ...p, lastFundingAt: Date.now(), fundingPaid: p.fundingPaid + payment } : p,
              ),
              balance: s.balance - payment,
            }));
          }
        }
      },

      resetAccount: () => set({ balance: INITIAL_FUTURES_BALANCE, positions: [], orders: [], history: [] }),
    }),
    { name: "spider-futures-trading" },
  ),
);

export { INITIAL_FUTURES_BALANCE, FUNDING_INTERVAL_MS };
