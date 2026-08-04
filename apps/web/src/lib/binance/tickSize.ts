// Real tick sizes verified directly against Binance's exchangeInfo endpoint (2026-08-04) —
// BTCUSDT: $0.01, TRXUSDT: $0.0001. Hardcoded for the app's fixed pair list (BINANCE_PAIRS)
// to avoid an extra network round-trip inside the order panel's hot path; `fetchTickSize`
// below covers any symbol not in this map so it's never a guess for a future pair.
const KNOWN_TICK_SIZES: Record<string, number> = {
  BTCUSDT: 0.01,
  TRXUSDT: 0.0001,
};

interface BinanceExchangeInfoFilter {
  filterType: string;
  tickSize?: string;
}

export async function fetchTickSize(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.binance.com/api/v3/exchangeInfo?symbol=${symbol}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { symbols?: Array<{ filters?: BinanceExchangeInfoFilter[] }> };
    const filter = data.symbols?.[0]?.filters?.find((f) => f.filterType === "PRICE_FILTER");
    return filter?.tickSize ? Number(filter.tickSize) : null;
  } catch {
    return null;
  }
}

/** Synchronous lookup for the app's known pairs — falls back to `null` for anything else
 * (callers needing an unknown pair's tick size should use `fetchTickSize` instead). */
export function getKnownTickSize(symbol: string): number | null {
  return KNOWN_TICK_SIZES[symbol] ?? null;
}
