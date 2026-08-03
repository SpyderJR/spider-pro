export interface SimCandle {
  open: number;
  high: number;
  low: number;
  close: number;
}

/** Small seeded PRNG so simulated candle sets are stable across re-renders (no layout jitter). */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Realistic-looking simulated OHLC — a noisy random walk with variable wick length,
 * not a perfect sawtooth. Used purely for pedagogical diagrams (never shown as real
 * market data).
 */
export function makeCandles(
  count: number,
  opts: { start?: number; volatility?: number; drift?: number; seed?: number } = {},
): SimCandle[] {
  const { start = 100, volatility = 2.2, drift = 0, seed = 7 } = opts;
  const rand = mulberry32(seed);
  const candles: SimCandle[] = [];
  let price = start;

  for (let i = 0; i < count; i++) {
    const open = price;
    const bodyMove = (rand() - 0.5 + drift * 0.3) * volatility * 2;
    const close = open + bodyMove;
    const upperWick = rand() * volatility * 0.9;
    const lowerWick = rand() * volatility * 0.9;
    const high = Math.max(open, close) + upperWick;
    const low = Math.min(open, close) - lowerWick;
    candles.push({ open, high, low, close });
    price = close;
  }

  return candles;
}

/** Overrides specific candle indices after generation — used to force a textbook pattern to appear inside otherwise-noisy data. */
export function withOverrides(candles: SimCandle[], overrides: Record<number, Partial<SimCandle>>): SimCandle[] {
  return candles.map((c, i) => (overrides[i] ? { ...c, ...overrides[i] } : c));
}

export interface CandleLayout {
  cx: number;
  bodyTop: number;
  bodyBottom: number;
  highY: number;
  lowY: number;
  bodyW: number;
  isUp: boolean;
  candle: SimCandle;
}

export interface ChartLayout {
  layout: CandleLayout[];
  priceToY: (price: number) => number;
  indexToX: (index: number) => number;
  width: number;
  height: number;
  minPrice: number;
  maxPrice: number;
}

export function layoutCandles(
  candles: SimCandle[],
  width: number,
  height: number,
  paddingX = 18,
  paddingY = 22,
  priceRangeOverride?: { minPrice: number; maxPrice: number },
): ChartLayout {
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const minPrice = priceRangeOverride?.minPrice ?? Math.min(...lows);
  const maxPrice = priceRangeOverride?.maxPrice ?? Math.max(...highs);
  const range = maxPrice - minPrice || 1;
  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;
  const step = innerW / candles.length;

  const priceToY = (price: number) => paddingY + innerH - ((price - minPrice) / range) * innerH;
  const indexToX = (index: number) => paddingX + step * index + step / 2;

  const layout: CandleLayout[] = candles.map((c, i) => {
    const cx = indexToX(i);
    const isUp = c.close >= c.open;
    const bodyTop = priceToY(Math.max(c.open, c.close));
    const bodyBottom = priceToY(Math.min(c.open, c.close));
    return {
      cx,
      bodyTop,
      bodyBottom: Math.max(bodyBottom, bodyTop + 1.5),
      highY: priceToY(c.high),
      lowY: priceToY(c.low),
      bodyW: Math.max(step * 0.55, 3),
      isUp,
      candle: c,
    };
  });

  return { layout, priceToY, indexToX, width, height, minPrice, maxPrice };
}

export const CANDLE_UP = "#22c55e";
export const CANDLE_DOWN = "#ef4444";
export const CANDLE_NEUTRAL = "#3ba8ff";
