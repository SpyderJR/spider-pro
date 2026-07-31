export type CompositeSignal = "bullish" | "neutral" | "bearish";

export interface CompositeSignalInput {
  rsi: number | null;
  macdHistogram: number | null;
  price: number | null;
  bollingerUpper: number | null;
  bollingerLower: number | null;
}

/**
 * Requires confluence of at least 2 of 3 indicators before calling a
 * direction, to reduce false positives from single-indicator noise.
 */
export function compositeSignal(input: CompositeSignalInput): CompositeSignal {
  let bullishVotes = 0;
  let bearishVotes = 0;

  if (input.rsi !== null) {
    if (input.rsi < 30) bullishVotes++;
    else if (input.rsi > 70) bearishVotes++;
  }

  if (input.macdHistogram !== null) {
    if (input.macdHistogram > 0) bullishVotes++;
    else if (input.macdHistogram < 0) bearishVotes++;
  }

  if (
    input.price !== null &&
    input.bollingerUpper !== null &&
    input.bollingerLower !== null
  ) {
    if (input.price <= input.bollingerLower) bullishVotes++;
    else if (input.price >= input.bollingerUpper) bearishVotes++;
  }

  if (bullishVotes >= 2) return "bullish";
  if (bearishVotes >= 2) return "bearish";
  return "neutral";
}
