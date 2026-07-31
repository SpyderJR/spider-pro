import type { OhlcInput } from "./stochastic.js";

export interface AdxPoint {
  adx: number | null;
  plusDI: number | null;
  minusDI: number | null;
}

/** ADX with +DI/-DI — measures trend strength (ADX) and direction (which DI leads). */
export function adx(candles: OhlcInput[], period = 14): AdxPoint[] {
  const n = candles.length;
  const out: AdxPoint[] = new Array(n).fill(null).map(() => ({ adx: null, plusDI: null, minusDI: null }));
  if (n <= period * 2) return out;

  const trueRanges: number[] = [];
  const plusDMs: number[] = [];
  const minusDMs: number[] = [];

  for (let i = 1; i < n; i++) {
    const curr = candles[i]!;
    const prev = candles[i - 1]!;
    const tr = Math.max(curr.high - curr.low, Math.abs(curr.high - prev.close), Math.abs(curr.low - prev.close));
    const upMove = curr.high - prev.high;
    const downMove = prev.low - curr.low;
    const plusDM = upMove > downMove && upMove > 0 ? upMove : 0;
    const minusDM = downMove > upMove && downMove > 0 ? downMove : 0;
    trueRanges.push(tr);
    plusDMs.push(plusDM);
    minusDMs.push(minusDM);
  }

  // Wilder smoothing, seeded with a simple sum over the first `period` values.
  let smoothedTR = trueRanges.slice(0, period).reduce((a, b) => a + b, 0);
  let smoothedPlusDM = plusDMs.slice(0, period).reduce((a, b) => a + b, 0);
  let smoothedMinusDM = minusDMs.slice(0, period).reduce((a, b) => a + b, 0);

  const dxValues: number[] = [];
  const diIndexOffset = period; // index into `out` (which is offset by 1 from trueRanges/plusDMs)

  function diFrom(smTR: number, smPlusDM: number, smMinusDM: number) {
    const plusDI = smTR === 0 ? 0 : (smPlusDM / smTR) * 100;
    const minusDI = smTR === 0 ? 0 : (smMinusDM / smTR) * 100;
    return { plusDI, minusDI };
  }

  let { plusDI, minusDI } = diFrom(smoothedTR, smoothedPlusDM, smoothedMinusDM);
  out[diIndexOffset] = { adx: null, plusDI, minusDI };
  dxValues.push(diSum(plusDI, minusDI));

  for (let i = period; i < trueRanges.length; i++) {
    smoothedTR = smoothedTR - smoothedTR / period + trueRanges[i]!;
    smoothedPlusDM = smoothedPlusDM - smoothedPlusDM / period + plusDMs[i]!;
    smoothedMinusDM = smoothedMinusDM - smoothedMinusDM / period + minusDMs[i]!;
    ({ plusDI, minusDI } = diFrom(smoothedTR, smoothedPlusDM, smoothedMinusDM));
    const dx = diSum(plusDI, minusDI);
    dxValues.push(dx);
    out[i + 1] = { adx: null, plusDI, minusDI };
  }

  // ADX is a smoothed average of DX, itself only available after another `period` bars.
  let adxSeed: number | null = null;
  for (let i = 0; i < dxValues.length; i++) {
    const outIndex = diIndexOffset + i;
    if (i === period - 1) {
      adxSeed = dxValues.slice(0, period).reduce((a, b) => a + b, 0) / period;
      out[outIndex]!.adx = adxSeed;
    } else if (i >= period && adxSeed !== null) {
      adxSeed = (adxSeed * (period - 1) + dxValues[i]!) / period;
      out[outIndex]!.adx = adxSeed;
    }
  }

  return out;
}

function diSum(plusDI: number, minusDI: number): number {
  const sum = plusDI + minusDI;
  return sum === 0 ? 0 : (Math.abs(plusDI - minusDI) / sum) * 100;
}
