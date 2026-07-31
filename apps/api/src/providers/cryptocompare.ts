import type { Candle, PricePoint, Timeframe } from "@spider/types";
import { env } from "../lib/env.js";
import { fetchJson } from "../lib/http.js";

interface CryptoCompareHistoResponse {
  Response: string;
  Message?: string;
  Data: {
    Data: Array<{
      time: number;
      open: number;
      high: number;
      low: number;
      close: number;
      volumefrom: number;
    }>;
  };
}

/**
 * CryptoCompare exposes three separate endpoints by granularity, each combinable
 * with `aggregate` to reach our exact timeframes — unlike Binance/Bybit, CryptoCompare
 * isn't geo-blocked for US-based cloud IPs, so this is a genuine fallback for every
 * timeframe, not just daily, if Binance/Bybit are unreachable from where the API runs
 * (e.g. Netlify/AWS Lambda IPs, which Binance blocks with HTTP 451).
 */
const CRYPTOCOMPARE_ENDPOINT: Record<Timeframe, { path: string; aggregate: number }> = {
  "1m": { path: "histominute", aggregate: 1 },
  "3m": { path: "histominute", aggregate: 3 },
  "5m": { path: "histominute", aggregate: 5 },
  "15m": { path: "histominute", aggregate: 15 },
  "1h": { path: "histohour", aggregate: 1 },
  "2h": { path: "histohour", aggregate: 2 },
  "4h": { path: "histohour", aggregate: 4 },
  "1d": { path: "histoday", aggregate: 1 },
  "1w": { path: "histoday", aggregate: 7 },
  "1M": { path: "histoday", aggregate: 30 },
};

export async function fetchCryptoCompareKlines(
  symbol: string,
  interval: Timeframe,
  limit: number,
): Promise<Candle[]> {
  if (!env.CRYPTOCOMPARE_API_KEY) {
    throw new Error("no API key configured — layer skipped");
  }
  const { path, aggregate } = CRYPTOCOMPARE_ENDPOINT[interval];
  const url =
    `${env.CRYPTOCOMPARE_BASE_URL}/data/v2/${path}?fsym=${symbol.toUpperCase()}&tsym=USD` +
    `&limit=${limit}&aggregate=${aggregate}&api_key=${env.CRYPTOCOMPARE_API_KEY}`;
  const raw = await fetchJson<CryptoCompareHistoResponse>("cryptocompare", url);

  if (raw.Response !== "Success") {
    throw new Error(`cryptocompare error: ${raw.Message ?? "unknown"}`);
  }

  return raw.Data.Data.filter((d) => d.open || d.close || d.volumefrom).map((d) => ({
    time: d.time,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
    volume: d.volumefrom,
  }));
}

/** Fallback for `/api/market/history` (e.g. M2 vs Mercado) if CoinGecko is unreachable — daily closes only. */
export async function fetchCryptoCompareDailyHistory(symbol: string, days: number): Promise<PricePoint[]> {
  const candles = await fetchCryptoCompareKlines(symbol, "1d", days);
  return candles.map((c) => ({ time: c.time, price: c.close }));
}
