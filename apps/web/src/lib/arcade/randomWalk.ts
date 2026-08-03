import type { BinanceCandle } from "../binance/types";

/** Synthetic OHLC series that mimics a real candle set's scale/volatility but has no real structure. */
export function generateRandomWalkCandles(reference: BinanceCandle[]): BinanceCandle[] {
  if (reference.length === 0) return [];
  const avgRangePercent =
    reference.reduce((sum, c) => sum + (c.high - c.low) / c.close, 0) / reference.length;

  let price = reference[0]!.open;
  const out: BinanceCandle[] = [];
  for (const ref of reference) {
    const open = price;
    const drift = (Math.random() - 0.5) * 2 * avgRangePercent * open;
    const close = Math.max(open * 0.5, open + drift);
    const wickUp = Math.random() * avgRangePercent * open * 0.6;
    const wickDown = Math.random() * avgRangePercent * open * 0.6;
    const high = Math.max(open, close) + wickUp;
    const low = Math.max(0.0000001, Math.min(open, close) - wickDown);
    out.push({ time: ref.time, open, high, low, close, volume: ref.volume });
    price = close;
  }
  return out;
}
