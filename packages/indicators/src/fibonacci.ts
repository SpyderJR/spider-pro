export interface FibonacciLevel {
  ratio: number;
  price: number;
  label: string;
}

// Standard Fibonacci retracement ratios, plus the two extension ratios traders watch most
// for projecting a target beyond the original swing (127.2% and 161.8%).
const RETRACEMENT_RATIOS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
const EXTENSION_RATIOS = [1.272, 1.618];

/**
 * Retracement levels between a swing low and swing high. `direction: "up"` treats `high` as
 * the most recent extreme (an uptrend pulling back down through the levels); `"down"` treats
 * `low` as the most recent extreme (a downtrend bouncing up through the levels) — this only
 * flips which end is ratio 0 vs ratio 1, the level prices are the same set either way.
 */
export function fibonacciRetracement(high: number, low: number, direction: "up" | "down" = "up"): FibonacciLevel[] {
  const range = high - low;
  return RETRACEMENT_RATIOS.map((ratio) => ({
    ratio,
    price: direction === "up" ? high - range * ratio : low + range * ratio,
    label: `${(ratio * 100).toFixed(1)}%`,
  }));
}

/** Extension levels projected beyond the swing — used as potential take-profit targets. */
export function fibonacciExtension(high: number, low: number, direction: "up" | "down" = "up"): FibonacciLevel[] {
  const range = high - low;
  return EXTENSION_RATIOS.map((ratio) => ({
    ratio,
    price: direction === "up" ? high - range * ratio : low + range * ratio,
    label: `${(ratio * 100).toFixed(1)}%`,
  }));
}
