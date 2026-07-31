import type { Candle, Timeframe } from "@spider/types";
import { env } from "../lib/env.js";
import { fetchJson } from "../lib/http.js";

// Binance's interval codes line up 1:1 with our internal timeframe strings.
type BinanceKline = [
  number, // open time
  string, // open
  string, // high
  string, // low
  string, // close
  string, // volume
  ...unknown[],
];

/** `symbol` is a bare ticker (e.g. "BTC", "ETH") — paired against USDT, Binance's deepest quote asset. */
export async function fetchBinanceKlines(
  symbol: string,
  interval: Timeframe,
  limit: number,
): Promise<Candle[]> {
  const pair = `${symbol.toUpperCase()}USDT`;
  const url = `${env.BINANCE_BASE_URL}/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`;
  const raw = await fetchJson<BinanceKline[]>("binance", url);
  return raw.map((k) => ({
    time: Math.floor(k[0] / 1000),
    open: Number(k[1]),
    high: Number(k[2]),
    low: Number(k[3]),
    close: Number(k[4]),
    volume: Number(k[5]),
  }));
}
