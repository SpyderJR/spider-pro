import { useEffect, useState } from "react";
import type { BinanceCandle } from "../lib/binance/types";
import { fetchCachedCandles, randomHistoricalWindow } from "../lib/arcade/historicalCandles";

interface Options {
  symbol?: string;
  interval?: string;
  spanMs: number;
  minCandles?: number;
  /** Bump to force a fresh random window (e.g. per round/session). */
  refreshKey?: number | string;
}

export function useRandomHistoricalCandles({ symbol = "BTCUSDT", interval = "1h", spanMs, minCandles = 40, refreshKey }: Options) {
  const [candles, setCandles] = useState<BinanceCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      for (let attempt = 0; attempt < 5; attempt++) {
        const { startTime, endTime } = randomHistoricalWindow(spanMs);
        try {
          const result = await fetchCachedCandles(symbol, interval, startTime, endTime);
          if (result.length >= minCandles) {
            if (!cancelled) {
              setCandles(result);
              setLoading(false);
            }
            return;
          }
        } catch {
          // try another random window
        }
      }
      if (!cancelled) {
        setError("No se pudo cargar el histórico de mercado. Prueba de nuevo.");
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, interval, spanMs, minCandles, refreshKey]);

  return { candles, loading, error };
}
