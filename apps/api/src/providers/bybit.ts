import type { Candle, Timeframe } from "@spider/types";
import { env } from "../lib/env.js";
import { fetchJson } from "../lib/http.js";

const BYBIT_INTERVAL: Record<Timeframe, string> = {
  "1m": "1",
  "3m": "3",
  "5m": "5",
  "15m": "15",
  "1h": "60",
  "2h": "120",
  "4h": "240",
  "1d": "D",
  "1w": "W",
  "1M": "M",
};

interface BybitKlineResponse {
  retCode: number;
  retMsg: string;
  result: {
    list: [string, string, string, string, string, string, string][];
  };
}

/** `symbol` is a bare ticker (e.g. "BTC", "ETH") — paired against USDT. */
export async function fetchBybitKlines(
  symbol: string,
  interval: Timeframe,
  limit: number,
): Promise<Candle[]> {
  const pair = `${symbol.toUpperCase()}USDT`;
  const bybitInterval = BYBIT_INTERVAL[interval];
  const url = `${env.BYBIT_BASE_URL}/v5/market/kline?category=spot&symbol=${pair}&interval=${bybitInterval}&limit=${limit}`;
  const raw = await fetchJson<BybitKlineResponse>("bybit", url);

  if (raw.retCode !== 0) {
    throw new Error(`bybit retCode=${raw.retCode} ${raw.retMsg}`);
  }

  // Bybit returns newest-first; normalize to oldest-first like every other provider.
  return raw.result.list
    .map((k) => ({
      time: Math.floor(Number(k[0]) / 1000),
      open: Number(k[1]),
      high: Number(k[2]),
      low: Number(k[3]),
      close: Number(k[4]),
      volume: Number(k[5]),
    }))
    .reverse();
}
