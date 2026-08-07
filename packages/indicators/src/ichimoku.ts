export interface IchimokuInput {
  high: number;
  low: number;
  close: number;
}

export interface IchimokuPoint {
  tenkanSen: number | null;
  kijunSen: number | null;
  /** Senkou Span A — plotted 26 bars ahead of the current bar (the "cloud"'s near edge). */
  senkouSpanA: number | null;
  /** Senkou Span B — plotted 26 bars ahead (the "cloud"'s far edge). */
  senkouSpanB: number | null;
  /** Chikou Span — current close plotted 26 bars *behind*. */
  chikouSpan: number | null;
}

function midpoint(candles: IchimokuInput[], endIndex: number, period: number): number | null {
  if (endIndex - period + 1 < 0) return null;
  const window = candles.slice(endIndex - period + 1, endIndex + 1);
  const high = Math.max(...window.map((c) => c.high));
  const low = Math.min(...window.map((c) => c.low));
  return (high + low) / 2;
}

/**
 * Ichimoku Kinko Hyo (standard 9/26/52 periods, 26-bar displacement). Senkou spans are shifted
 * *forward* into future bars (returned at their displaced index, matching how charting
 * platforms plot the cloud ahead of price) and Chikou is shifted *backward*, so the arrays
 * returned here are longer in effect than the input — index i still corresponds to input
 * candle i for tenkan/kijun, but a caller plotting the cloud needs to read spanA/B at i+26.
 */
export function ichimoku(candles: IchimokuInput[]): IchimokuPoint[] {
  const n = candles.length;
  const out: IchimokuPoint[] = new Array(n).fill(null).map(() => ({
    tenkanSen: null,
    kijunSen: null,
    senkouSpanA: null,
    senkouSpanB: null,
    chikouSpan: null,
  }));

  for (let i = 0; i < n; i++) {
    out[i]!.tenkanSen = midpoint(candles, i, 9);
    out[i]!.kijunSen = midpoint(candles, i, 26);
    out[i]!.chikouSpan = i - 26 >= 0 ? candles[i]!.close : null;
    if (i - 26 >= 0) out[i - 26]!.chikouSpan = candles[i]!.close;
  }

  for (let i = 0; i < n; i++) {
    const tenkan = out[i]!.tenkanSen;
    const kijun = out[i]!.kijunSen;
    const spanA = tenkan !== null && kijun !== null ? (tenkan + kijun) / 2 : null;
    const spanB = midpoint(candles, i, 52);
    const targetIdx = i + 26;
    if (targetIdx < n) {
      out[targetIdx]!.senkouSpanA = spanA;
      out[targetIdx]!.senkouSpanB = spanB;
    }
  }

  return out;
}
