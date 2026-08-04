export interface VolumeProfileInput {
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface VolumeProfileLevel {
  priceLevel: number;
  volume: number;
}

export interface VolumeProfileResult {
  levels: VolumeProfileLevel[];
  /** Point of Control — the price bucket with the most traded volume. */
  poc: number;
  /** Value area — the smallest contiguous band around the POC covering ~70% of total volume. */
  valueAreaHigh: number;
  valueAreaLow: number;
}

/**
 * Buckets each candle's volume across the price bands its [low,high] range overlaps,
 * proportional to the overlap — the most honest simple approximation available without
 * tick-level trade data (which no free API exposes).
 */
export function volumeProfile(candles: VolumeProfileInput[], bucketCount = 24): VolumeProfileResult | null {
  if (candles.length === 0 || bucketCount <= 0) return null;

  const min = Math.min(...candles.map((c) => c.low));
  const max = Math.max(...candles.map((c) => c.high));
  if (!(max > min)) return null;

  const bucketSize = (max - min) / bucketCount;
  const volumes = new Array<number>(bucketCount).fill(0);

  for (const c of candles) {
    if (c.volume <= 0) continue;
    const lo = Math.max(c.low, min);
    const hi = Math.min(c.high, max);
    const range = hi - lo;

    if (range <= 0) {
      const idx = Math.min(bucketCount - 1, Math.max(0, Math.floor((c.close - min) / bucketSize)));
      volumes[idx]! += c.volume;
      continue;
    }

    const startIdx = Math.max(0, Math.floor((lo - min) / bucketSize));
    const endIdx = Math.min(bucketCount - 1, Math.floor((hi - min) / bucketSize));
    for (let i = startIdx; i <= endIdx; i++) {
      const bucketLo = min + i * bucketSize;
      const bucketHi = bucketLo + bucketSize;
      const overlap = Math.max(0, Math.min(hi, bucketHi) - Math.max(lo, bucketLo));
      volumes[i]! += c.volume * (overlap / range);
    }
  }

  const levels: VolumeProfileLevel[] = volumes.map((v, i) => ({ priceLevel: min + (i + 0.5) * bucketSize, volume: v }));

  let pocIndex = 0;
  for (let i = 1; i < volumes.length; i++) {
    if (volumes[i]! > volumes[pocIndex]!) pocIndex = i;
  }

  const totalVolume = volumes.reduce((a, b) => a + b, 0);
  const target = totalVolume * 0.7;
  let loIdx = pocIndex;
  let hiIdx = pocIndex;
  let covered = volumes[pocIndex]!;

  while (covered < target && (loIdx > 0 || hiIdx < volumes.length - 1)) {
    const volLo = loIdx > 0 ? volumes[loIdx - 1]! : -Infinity;
    const volHi = hiIdx < volumes.length - 1 ? volumes[hiIdx + 1]! : -Infinity;
    if (volHi >= volLo) {
      hiIdx += 1;
      covered += volumes[hiIdx]!;
    } else {
      loIdx -= 1;
      covered += volumes[loIdx]!;
    }
  }

  return {
    levels,
    poc: levels[pocIndex]!.priceLevel,
    valueAreaHigh: min + (hiIdx + 1) * bucketSize,
    valueAreaLow: min + loIdx * bucketSize,
  };
}
