export type CrossType = "golden_cross" | "death_cross" | "none";

/**
 * Detects a Golden Cross (short MA crossing above long MA) or Death Cross
 * (short MA crossing below long MA) on the most recent bar only.
 */
export function detectCross(
  shortMa: (number | null)[],
  longMa: (number | null)[],
): CrossType {
  const n = shortMa.length;
  if (n < 2) return "none";

  const prevShort = shortMa[n - 2];
  const prevLong = longMa[n - 2];
  const currShort = shortMa[n - 1];
  const currLong = longMa[n - 1];

  if (
    prevShort === null ||
    prevShort === undefined ||
    prevLong === null ||
    prevLong === undefined ||
    currShort === null ||
    currShort === undefined ||
    currLong === null ||
    currLong === undefined
  ) {
    return "none";
  }

  if (prevShort <= prevLong && currShort > currLong) return "golden_cross";
  if (prevShort >= prevLong && currShort < currLong) return "death_cross";
  return "none";
}
