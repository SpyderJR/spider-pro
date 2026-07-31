import { z } from "zod";

export const MovingAverageTypeSchema = z.enum(["SMA", "EMA"]);
export type MovingAverageType = z.infer<typeof MovingAverageTypeSchema>;

export const IndicatorConfigSchema = z.object({
  rsi: z.object({ enabled: z.boolean(), period: z.number().int().positive() }),
  macd: z.object({
    enabled: z.boolean(),
    fast: z.number().int().positive(),
    slow: z.number().int().positive(),
    signal: z.number().int().positive(),
  }),
  bollinger: z.object({
    enabled: z.boolean(),
    period: z.number().int().positive(),
    stdDev: z.number().positive(),
  }),
  movingAverages: z.array(
    z.object({
      type: MovingAverageTypeSchema,
      period: z.number().int().positive(),
      enabled: z.boolean(),
    }),
  ),
  stochastic: z.object({
    enabled: z.boolean(),
    kPeriod: z.number().int().positive(),
    dPeriod: z.number().int().positive(),
    smooth: z.number().int().positive(),
  }),
  williamsR: z.object({ enabled: z.boolean(), period: z.number().int().positive() }),
  cci: z.object({ enabled: z.boolean(), period: z.number().int().positive() }),
  adx: z.object({ enabled: z.boolean(), period: z.number().int().positive() }),
  obv: z.object({ enabled: z.boolean() }),
  vwap: z.object({ enabled: z.boolean() }),
  parabolicSar: z.object({
    enabled: z.boolean(),
    step: z.number().positive(),
    maxStep: z.number().positive(),
  }),
  roc: z.object({ enabled: z.boolean(), period: z.number().int().positive() }),
  mfi: z.object({ enabled: z.boolean(), period: z.number().int().positive() }),
});
export type IndicatorConfig = z.infer<typeof IndicatorConfigSchema>;

export const CrossTypeSchema = z.enum(["golden_cross", "death_cross", "none"]);
export type CrossType = z.infer<typeof CrossTypeSchema>;

export const CompositeSignalSchema = z.enum(["bullish", "neutral", "bearish"]);
export type CompositeSignal = z.infer<typeof CompositeSignalSchema>;

export const TechnicalSnapshotSchema = z.object({
  asset: z.string(),
  interval: z.string(),
  lastPrice: z.number(),
  rsi: z.number().nullable(),
  macd: z
    .object({ macd: z.number(), signal: z.number(), histogram: z.number() })
    .nullable(),
  bollinger: z
    .object({ upper: z.number(), middle: z.number(), lower: z.number() })
    .nullable(),
  cross: CrossTypeSchema,
  compositeSignal: CompositeSignalSchema,
});
export type TechnicalSnapshot = z.infer<typeof TechnicalSnapshotSchema>;
