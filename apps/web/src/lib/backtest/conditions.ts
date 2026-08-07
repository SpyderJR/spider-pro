import { adx, atr, bollinger, cci, ema, macd, rsi, stochastic, vwap, williamsR } from "@spider/indicators";
import type { BacktestCondition, ConditionNode, ConditionOperand } from "@spider/types";
import type { BinanceCandle } from "../binance/types";

export interface IndicatorSeriesMap {
  price: number[];
  rsi: Map<number, (number | null)[]>;
  ema: Map<number, (number | null)[]>;
  macdHistogram: (number | null)[];
  vwap: number[];
  bollingerUpper: Map<number, (number | null)[]>;
  bollingerLower: Map<number, (number | null)[]>;
  atr: Map<number, (number | null)[]>;
  stochasticK: Map<number, (number | null)[]>;
  adx: Map<number, (number | null)[]>;
  cci: Map<number, (number | null)[]>;
  williamsR: Map<number, (number | null)[]>;
}

const DEFAULT_PERIODS: Record<string, number> = {
  rsi: 14,
  ema: 20,
  bollinger_upper: 20,
  bollinger_lower: 20,
  atr: 14,
  stochastic_k: 14,
  adx: 14,
  cci: 20,
  williams_r: 14,
};

interface NeedsMap {
  macd: boolean;
  vwap: boolean;
  rsiPeriods: Set<number>;
  emaPeriods: Set<number>;
  bollingerPeriods: Set<number>;
  atrPeriods: Set<number>;
  stochasticPeriods: Set<number>;
  adxPeriods: Set<number>;
  cciPeriods: Set<number>;
  williamsRPeriods: Set<number>;
}

function emptyNeeds(): NeedsMap {
  return {
    macd: false,
    vwap: false,
    rsiPeriods: new Set(),
    emaPeriods: new Set(),
    bollingerPeriods: new Set(),
    atrPeriods: new Set(),
    stochasticPeriods: new Set(),
    adxPeriods: new Set(),
    cciPeriods: new Set(),
    williamsRPeriods: new Set(),
  };
}

function collectOperand(operand: ConditionOperand, needs: NeedsMap): void {
  if (!("indicator" in operand)) return;
  const period = operand.period ?? DEFAULT_PERIODS[operand.indicator];
  switch (operand.indicator) {
    case "rsi":
      needs.rsiPeriods.add(period ?? 14);
      break;
    case "ema":
      needs.emaPeriods.add(period ?? 20);
      break;
    case "macd_histogram":
      needs.macd = true;
      break;
    case "vwap":
      needs.vwap = true;
      break;
    case "bollinger_upper":
    case "bollinger_lower":
      needs.bollingerPeriods.add(period ?? 20);
      break;
    case "atr":
      needs.atrPeriods.add(period ?? 14);
      break;
    case "stochastic_k":
      needs.stochasticPeriods.add(period ?? 14);
      break;
    case "adx":
      needs.adxPeriods.add(period ?? 14);
      break;
    case "cci":
      needs.cciPeriods.add(period ?? 20);
      break;
    case "williams_r":
      needs.williamsRPeriods.add(period ?? 14);
      break;
  }
}

function collectConditionNode(node: ConditionNode, needs: NeedsMap): void {
  if ("logic" in node) {
    for (const c of node.conditions) collectConditionNode(c, needs);
    return;
  }
  collectOperand(node.left, needs);
  collectOperand(node.right, needs);
}

/** Computes only the indicator series a given rule set actually references — nothing extra. */
export function computeIndicatorSeries(candles: BinanceCandle[], nodes: ConditionNode[]): IndicatorSeriesMap {
  const closes = candles.map((c) => c.close);
  const needs = emptyNeeds();
  for (const n of nodes) collectConditionNode(n, needs);

  const rsiMap = new Map<number, (number | null)[]>();
  for (const p of needs.rsiPeriods) rsiMap.set(p, rsi(closes, p));

  const emaMap = new Map<number, (number | null)[]>();
  for (const p of needs.emaPeriods) emaMap.set(p, ema(closes, p));

  const bollingerUpper = new Map<number, (number | null)[]>();
  const bollingerLower = new Map<number, (number | null)[]>();
  for (const p of needs.bollingerPeriods) {
    const bands = bollinger(closes, p);
    bollingerUpper.set(p, bands.map((b) => b.upper));
    bollingerLower.set(p, bands.map((b) => b.lower));
  }

  const atrMap = new Map<number, (number | null)[]>();
  for (const p of needs.atrPeriods) atrMap.set(p, atr(candles, p));

  const stochasticKMap = new Map<number, (number | null)[]>();
  for (const p of needs.stochasticPeriods) stochasticKMap.set(p, stochastic(candles, p).map((s) => s.k));

  const adxMap = new Map<number, (number | null)[]>();
  for (const p of needs.adxPeriods) adxMap.set(p, adx(candles, p).map((a) => a.adx));

  const cciMap = new Map<number, (number | null)[]>();
  for (const p of needs.cciPeriods) cciMap.set(p, cci(candles, p));

  const williamsRMap = new Map<number, (number | null)[]>();
  for (const p of needs.williamsRPeriods) williamsRMap.set(p, williamsR(candles, p));

  return {
    price: closes,
    rsi: rsiMap,
    ema: emaMap,
    macdHistogram: needs.macd ? macd(closes, 12, 26, 9).map((m) => m.histogram) : [],
    vwap: needs.vwap ? vwap(candles) : [],
    bollingerUpper,
    bollingerLower,
    atr: atrMap,
    stochasticK: stochasticKMap,
    adx: adxMap,
    cci: cciMap,
    williamsR: williamsRMap,
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
    case "bollinger_upper":
      return series.bollingerUpper.get(operand.period ?? 20)?.[index] ?? null;
    case "bollinger_lower":
      return series.bollingerLower.get(operand.period ?? 20)?.[index] ?? null;
    case "atr":
      return series.atr.get(operand.period ?? 14)?.[index] ?? null;
    case "stochastic_k":
      return series.stochasticK.get(operand.period ?? 14)?.[index] ?? null;
    case "adx":
      return series.adx.get(operand.period ?? 14)?.[index] ?? null;
    case "cci":
      return series.cci.get(operand.period ?? 20)?.[index] ?? null;
    case "williams_r":
      return series.williamsR.get(operand.period ?? 14)?.[index] ?? null;
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

/** A group with "and" requires every condition; "or" requires at least one. A bare condition
 * (no `logic` field) behaves exactly as it always has. */
export function evaluateConditionNode(node: ConditionNode, series: IndicatorSeriesMap, index: number): boolean {
  if ("logic" in node) {
    return node.logic === "and"
      ? node.conditions.every((c) => evaluateCondition(c, series, index))
      : node.conditions.some((c) => evaluateCondition(c, series, index));
  }
  return evaluateCondition(node, series, index);
}

/** Top-level nodes are always AND-combined — same as v1's flat list, except each node can now
 * itself be an OR group. */
export function evaluateConditions(nodes: ConditionNode[], series: IndicatorSeriesMap, index: number): boolean {
  return nodes.every((n) => evaluateConditionNode(n, series, index));
}
