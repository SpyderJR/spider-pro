import * as Comlink from "comlink";
import {
  sma,
  ema,
  rsi,
  macd,
  bollinger,
  detectCross,
  compositeSignal,
  stochastic,
  williamsR,
  cci,
  adx,
  obv,
  vwap,
  roc,
  mfi,
  parabolicSar,
  type StochasticPoint,
  type AdxPoint,
  type SarPoint,
} from "@spider/indicators";
import type { Candle, IndicatorConfig } from "@spider/types";

export interface WorkerMaResult {
  type: "SMA" | "EMA";
  period: number;
  values: (number | null)[];
}

export interface IndicatorResult {
  rsi: (number | null)[] | null;
  macd: { macd: number | null; signal: number | null; histogram: number | null }[] | null;
  bollinger: { upper: number | null; middle: number | null; lower: number | null }[] | null;
  movingAverages: WorkerMaResult[];
  stochastic: StochasticPoint[] | null;
  williamsR: (number | null)[] | null;
  cci: (number | null)[] | null;
  adx: AdxPoint[] | null;
  obv: number[] | null;
  vwap: number[] | null;
  parabolicSar: (SarPoint | null)[] | null;
  roc: (number | null)[] | null;
  mfi: (number | null)[] | null;
  cross: "golden_cross" | "death_cross" | "none";
  compositeSignal: "bullish" | "neutral" | "bearish";
}

function computeIndicators(candles: Candle[], config: IndicatorConfig): IndicatorResult {
  const closes = candles.map((c) => c.close);

  const rsiValues = config.rsi.enabled ? rsi(closes, config.rsi.period) : null;
  const macdValues = config.macd.enabled
    ? macd(closes, config.macd.fast, config.macd.slow, config.macd.signal)
    : null;
  const bollingerValues = config.bollinger.enabled
    ? bollinger(closes, config.bollinger.period, config.bollinger.stdDev)
    : null;

  const movingAverages: WorkerMaResult[] = config.movingAverages
    .filter((ma) => ma.enabled)
    .map((ma) => ({
      type: ma.type,
      period: ma.period,
      values: ma.type === "SMA" ? sma(closes, ma.period) : ema(closes, ma.period),
    }));

  const stochasticValues = config.stochastic.enabled
    ? stochastic(candles, config.stochastic.kPeriod, config.stochastic.dPeriod, config.stochastic.smooth)
    : null;
  const williamsRValues = config.williamsR.enabled ? williamsR(candles, config.williamsR.period) : null;
  const cciValues = config.cci.enabled ? cci(candles, config.cci.period) : null;
  const adxValues = config.adx.enabled ? adx(candles, config.adx.period) : null;
  const obvValues = config.obv.enabled ? obv(candles) : null;
  const vwapValues = config.vwap.enabled ? vwap(candles) : null;
  const sarValues = config.parabolicSar.enabled
    ? parabolicSar(candles, config.parabolicSar.step, config.parabolicSar.maxStep)
    : null;
  const rocValues = config.roc.enabled ? roc(closes, config.roc.period) : null;
  const mfiValues = config.mfi.enabled ? mfi(candles, config.mfi.period) : null;

  // Cross detection uses the two shortest enabled moving averages, if at least two exist.
  let cross: "golden_cross" | "death_cross" | "none" = "none";
  const sorted = [...movingAverages].sort((a, b) => a.period - b.period);
  if (sorted.length >= 2) {
    cross = detectCross(sorted[0]!.values, sorted[1]!.values);
  }

  const lastRsi = rsiValues ? rsiValues[rsiValues.length - 1] ?? null : null;
  const lastMacd = macdValues ? macdValues[macdValues.length - 1] ?? null : null;
  const lastBollinger = bollingerValues ? bollingerValues[bollingerValues.length - 1] ?? null : null;
  const lastPrice = closes[closes.length - 1] ?? null;

  const signal = compositeSignal({
    rsi: lastRsi,
    macdHistogram: lastMacd?.histogram ?? null,
    price: lastPrice,
    bollingerUpper: lastBollinger?.upper ?? null,
    bollingerLower: lastBollinger?.lower ?? null,
  });

  return {
    rsi: rsiValues,
    macd: macdValues,
    bollinger: bollingerValues,
    movingAverages,
    stochastic: stochasticValues,
    williamsR: williamsRValues,
    cci: cciValues,
    adx: adxValues,
    obv: obvValues,
    vwap: vwapValues,
    parabolicSar: sarValues,
    roc: rocValues,
    mfi: mfiValues,
    cross,
    compositeSignal: signal,
  };
}

const api = { computeIndicators };
export type IndicatorsWorkerApi = typeof api;

Comlink.expose(api);
