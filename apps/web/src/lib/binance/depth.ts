import type { OrderBookSnapshot } from "./types";

// Same client-direct pattern as fetchBinanceKlines — sidesteps datacenter-IP geo-blocking
// by calling Binance from the visitor's own browser instead of through our backend.
const BASE = "https://api.binance.com";

/**
 * A wider order book snapshot than the WS `depth20` stream — used for the depth heatmap,
 * which needs a meaningfully broader price range than the top-of-book list does.
 */
export async function fetchBinanceDepthSnapshot(symbol: string, limit = 1000): Promise<OrderBookSnapshot> {
  const res = await fetch(`${BASE}/api/v3/depth?symbol=${symbol}&limit=${limit}`);
  if (!res.ok) throw new Error(`binance depth HTTP ${res.status}`);
  const raw = (await res.json()) as { bids: [string, string][]; asks: [string, string][] };
  return {
    bids: raw.bids.map(([price, qty]) => ({ price: Number(price), qty: Number(qty) })).filter((l) => l.qty > 0),
    asks: raw.asks.map(([price, qty]) => ({ price: Number(price), qty: Number(qty) })).filter((l) => l.qty > 0),
  };
}
