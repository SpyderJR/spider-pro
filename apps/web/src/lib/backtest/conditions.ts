import { ema, macd, rsi, vwap } from "@spider/indicators";
import type { BacktestCondition, ConditionOperand } from "@spider/types";
import type { BinanceCandle } from "../binance/types";

export interface IndicatorSeriesMap {
  price: number[];
  rsi: Map<number, (number | null)[]>;
  ema: Map<number, (number | null)[]>;
  macdHistogram: (number | null)[];
  vwap: number[];
}

function collectOperand(
  operand: ConditionOperand,
  rsiPeriods: Set<number>,
  emaPeriods: Set<number>,
  needs: { macd: boolean; vwap: boolean },
): void {
  if (!("indicator" in operand)) return;
  if (operand.indicator === "rsi") rsiPeriods.add(operand.period ?? 14);
  if (operand.indicator === "ema") emaPeriods.add(operand.period ?? 20);
  if (operand.indicator === "macd_histogram") needs.macd = true;
  if (operand.indicator === "vwap") needs.vwap = true;
}

/** Computes only the indicator series a given rule set actually references — nothing extra. */
export function computeIndicatorSeries(candles: BinanceCandle[], conditions: BacktestCondition[]): IndicatorSeriesMap {
  const closes = candles.map((c) => c.close);
  const rsiPeriods = new Set<number>();
  const emaPeriods = new Set<number>();
  const needs = { macd: false, vwap: false };

  for (const c of conditions) {
    collectOperand(c.left, rsiPeriods, emaPeriods, needs);
    collectOperand(c.right, rsiPeriods, emaPeriods, needs);
  }

  const rsiMap = new Map<number, (number | null)[]>();
  for (const p of rsiPeriods) rsiMap.set(p, rsi(closes, p));

  const emaMap = new Map<number, (number | null)[]>();
  for (const p of emaPeriods) emaMap.set(p, ema(closes, p));

  return {
    price: closes,
    rsi: rsiMap,
    ema: emaMap,
    macdHistogram: needs.macd ? macd(closes, 12, 26, 9).map((m) => m.histogram) : [],
    vwap: needs.vwap ? vwap(candles) : [],
  };
}

function resolveOperand(operand: ConditionOperand, series: IndicatorSeriesMap, index: number): number | null {
  if ("value" in operand) return operand.value;
  switch (operand.indicator) {
    case "price":
      return series.price[index] ?? null;
    case "rsi":
      return series.rsi.get(operand.period ?? 14)?.[index] ?? null;
    case "ema":
      return series.ema.get(operand.period ?? 20)?.[index] ?? null;
    case "macd_histogram":
      return series.macdHistogram[index] ?? null;
    case "vwap":
      return series.vwap[index] ?? null;
    default:
      return null;
  }
}

export function evaluateCondition(condition: BacktestCondition, series: IndicatorSeriesMap, index: number): boolean {
  const { left, operator, right } = condition;

  if (operator === "gt" || operator === "lt") {
    const l = resolveOperand(left, series, index);
    const r = resolveOperand(right, series, index);
    if (l === null || r === null) return false;
    return operator === "gt" ? l > r : l < r;
  }

  if (index < 1) return false;
  const lPrev = resolveOperand(left, series, index - 1);
  const rPrev = resolveOperand(right, series, index - 1);
  const lCur = resolveOperand(left, series, index);
  const rCur = resolveOperand(right, series, index);
  if (lPrev === null || rPrev === null || lCur === null || rCur === null) return false;

  return operator === "crosses_above" ? lPrev <= rPrev && lCur > rCur : lPrev >= rPrev && lCur < rCur;
}

/** All conditions AND-combined — v1 has no OR logic. */
export function evaluateConditions(conditions: BacktestCondition[], series: IndicatorSeriesMap, index: number): boolean {
  return conditions.every((c) => evaluateCondition(c, series, index));
}
