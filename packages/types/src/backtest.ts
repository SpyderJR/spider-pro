import { z } from "zod";

/** The supported condition primitives — deliberately a fixed enum rather than an open-ended
 * expression language (see ConditionGroupSchema below for why grouping took the same approach). */
export const BacktestIndicatorSchema = z.enum([
  "rsi",
  "ema",
  "macd_histogram",
  "vwap",
  "price",
  "bollinger_upper",
  "bollinger_lower",
  "atr",
  "stochastic_k",
  "adx",
  "cci",
  "williams_r",
]);
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

/** One level of AND/OR grouping over plain conditions — deliberately NOT recursive (no groups
 * of groups). Covers the realistic "A OR B, combined with C" case without the complexity/risk of
 * a fully general expression parser, which was a conscious trade-off (see Fase 4 of Bloque 15). */
export const ConditionGroupSchema = z.object({
  logic: z.enum(["and", "or"]),
  conditions: z.array(ConditionSchema).min(1),
});
export type ConditionGroup = z.infer<typeof ConditionGroupSchema>;

/** Top-level list stays AND-combined like v1 — each item can now be a single condition OR a
 * group with its own and/or logic, which is what actually adds OR support (v2). */
export const ConditionNodeSchema = z.union([ConditionSchema, ConditionGroupSchema]);
export type ConditionNode = z.infer<typeof ConditionNodeSchema>;

export const BacktestConfigSchema = z.object({
  symbol: z.string(),
  interval: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  initialBalance: z.number().positive(),
  riskPercent: z.number().positive(),
  stopLossPercent: z.number().positive(),
  takeProfitPercent: z.number().positive().nullable(),
  /** "percent" (default) sizes the stop a fixed % from entry, same on every trade regardless
   * of how calm or volatile the market is at that moment. "atr" instead places it a multiple
   * of the 14-period ATR away — the stop adapts to real volatility instead of a static number
   * picked "a ojo" (arbitrarily), the same distinction taught in the ATR risk-management lesson. */
  stopLossMode: z.enum(["percent", "atr"]).default("percent"),
  /** Only used when stopLossMode is "atr" — the ATR multiplier (e.g. 1.5x ATR). */
  atrMultiplier: z.number().positive().nullable().default(null),
  direction: z.enum(["long", "short"]),
  entryConditions: z.array(ConditionNodeSchema).min(1),
  /** Optional rule-based exit on top of the always-available SL/TP percentages. */
  exitConditions: z.array(ConditionNodeSchema).optional(),
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
