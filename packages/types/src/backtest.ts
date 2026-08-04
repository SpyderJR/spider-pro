import { z } from "zod";

/** The 5 supported condition primitives for v1 — deliberately small and well-understood
 * rather than an open-ended expression language. */
export const BacktestIndicatorSchema = z.enum(["rsi", "ema", "macd_histogram", "vwap", "price"]);
export type BacktestIndicator = z.infer<typeof BacktestIndicatorSchema>;

export const ConditionOperandSchema = z.union([
  z.object({ indicator: BacktestIndicatorSchema, period: z.number().int().positive().optional() }),
  z.object({ value: z.number() }),
]);
export type ConditionOperand = z.infer<typeof ConditionOperandSchema>;

export const ConditionOperatorSchema = z.enum(["gt", "lt", "crosses_above", "crosses_below"]);
export type ConditionOperator = z.infer<typeof ConditionOperatorSchema>;

export const ConditionSchema = z.object({
  left: ConditionOperandSchema,
  operator: ConditionOperatorSchema,
  right: ConditionOperandSchema,
});
export type BacktestCondition = z.infer<typeof ConditionSchema>;

export const BacktestConfigSchema = z.object({
  symbol: z.string(),
  interval: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  initialBalance: z.number().positive(),
  riskPercent: z.number().positive(),
  stopLossPercent: z.number().positive(),
  takeProfitPercent: z.number().positive().nullable(),
  direction: z.enum(["long", "short"]),
  /** All conditions AND-combined — v1 has no OR logic. */
  entryConditions: z.array(ConditionSchema).min(1),
  /** Optional rule-based exit on top of the always-available SL/TP percentages. */
  exitConditions: z.array(ConditionSchema).optional(),
});
export type BacktestConfig = z.infer<typeof BacktestConfigSchema>;

export const BacktestTradeSchema = z.object({
  entryTime: z.number(),
  exitTime: z.number(),
  entryPrice: z.number(),
  exitPrice: z.number(),
  side: z.enum(["long", "short"]),
  pnl: z.number(),
  pnlPercent: z.number(),
  exitReason: z.enum(["stop_loss", "take_profit", "exit_signal", "end_of_data"]),
});
export type BacktestTrade = z.infer<typeof BacktestTradeSchema>;

export const BacktestMetricsSchema = z.object({
  totalTrades: z.number(),
  winRate: z.number(),
  profitFactor: z.number(),
  maxDrawdownPercent: z.number(),
  expectancy: z.number(),
  finalBalance: z.number(),
  totalReturnPercent: z.number(),
});
export type BacktestMetrics = z.infer<typeof BacktestMetricsSchema>;

export const EquityPointSchema = z.object({ time: z.number(), value: z.number() });
export type EquityPoint = z.infer<typeof EquityPointSchema>;

export const BacktestResultSchema = z.object({
  trades: z.array(BacktestTradeSchema),
  equityCurve: z.array(EquityPointSchema),
  metrics: BacktestMetricsSchema,
});
export type BacktestResult = z.infer<typeof BacktestResultSchema>;
