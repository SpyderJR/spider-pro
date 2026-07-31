import type { FastifyBaseLogger, FastifyInstance } from "fastify";
import { TimeframeSchema, type Candle, type KlinesResponse, type KlineSource } from "@spider/types";
import { z } from "zod";
import { cache, TTL } from "../lib/cache.js";
import { fetchBinanceKlines } from "../providers/binance.js";
import { fetchBybitKlines } from "../providers/bybit.js";
import { fetchCryptoCompareKlines } from "../providers/cryptocompare.js";
import { fetchCoinGeckoDailyKlinesById } from "../providers/coingecko.js";

const QuerySchema = z.object({
  symbol: z
    .string()
    .min(1)
    .max(20)
    .regex(/^[A-Za-z0-9]+$/, "symbol must be a bare ticker, e.g. BTC"),
  interval: TimeframeSchema,
  limit: z.coerce.number().int().min(10).max(1000).default(300),
  // Required to unlock the CoinGecko fallback layer for tokens outside BTC/TRX —
  // Binance/Bybit only need the bare ticker, but CoinGecko indexes by its own id.
  coingeckoId: z.string().min(1).max(60).optional(),
});

export function registerKlinesRoute(app: FastifyInstance) {
  app.get("/api/klines", async (request, reply) => {
    const parsed = QuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({ error: "invalid query", details: parsed.error.flatten() });
    }
    const { symbol, interval, limit, coingeckoId } = parsed.data;
    const cacheKey = `klines:${symbol}:${interval}:${limit}:${coingeckoId ?? ""}`;

    try {
      const result = await cache.wrap<KlinesResponse>(cacheKey, TTL.klines, async () => {
        const { candles, source } = await fetchWithFallback(symbol, interval, limit, coingeckoId, request.log);
        return { symbol, interval, source, candles };
      });
      return reply.send(result);
    } catch (err) {
      request.log.error({ err, symbol, interval }, "klines: all providers failed");
      return reply.status(502).send({ error: "no provider available for these candles" });
    }
  });
}

async function fetchWithFallback(
  symbol: string,
  interval: z.infer<typeof TimeframeSchema>,
  limit: number,
  coingeckoId: string | undefined,
  log: FastifyBaseLogger,
): Promise<{ candles: Candle[]; source: KlineSource }> {
  // Binance and (occasionally) Bybit block requests from cloud/datacenter IP
  // ranges — including AWS Lambda, which is what Netlify Functions run on —
  // so CryptoCompare is a real fallback for every timeframe here, not just
  // daily, to keep Análisis Técnico working in production even if the primary
  // two sources are unreachable from wherever this API is deployed.
  const attempts: Array<{ source: KlineSource; run: () => Promise<Candle[]> }> = [
    { source: "binance", run: () => fetchBinanceKlines(symbol, interval, limit) },
    { source: "bybit", run: () => fetchBybitKlines(symbol, interval, limit) },
    { source: "cryptocompare", run: () => fetchCryptoCompareKlines(symbol, interval, limit) },
  ];

  if (interval === "1d" && coingeckoId) {
    attempts.push({
      source: "coingecko",
      run: () => fetchCoinGeckoDailyKlinesById(coingeckoId, Math.min(limit, 365)),
    });
  }

  const errors: unknown[] = [];
  for (const attempt of attempts) {
    try {
      const candles = await attempt.run();
      if (candles.length > 0) return { candles, source: attempt.source };
      log.warn({ source: attempt.source, symbol, interval }, "klines: provider returned no candles");
    } catch (err) {
      log.warn(
        { err: err instanceof Error ? err.message : err, source: attempt.source, symbol, interval },
        "klines: provider attempt failed, trying next fallback",
      );
      errors.push(err);
    }
  }
  throw new AggregateError(errors, "all kline providers failed");
}
