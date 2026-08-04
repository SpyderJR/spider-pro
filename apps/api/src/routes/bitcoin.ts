import type { FastifyInstance } from "fastify";
import type { BitcoinStatsResponse } from "@spider/types";
import { cache, TTL } from "../lib/cache.js";
import { fetchBitcoinOnChainStats } from "../providers/mempool.js";
import { BITCOIN_STATIC_FALLBACK } from "../lib/staticFallback.js";

export function registerBitcoinRoutes(app: FastifyInstance) {
  app.get("/api/bitcoin/stats", async (request, reply) => {
    try {
      const result = await cache.wrap<BitcoinStatsResponse>("bitcoin:stats", TTL.bitcoinStats, async () => {
        try {
          const stats = await fetchBitcoinOnChainStats();
          return { ...stats, source: "mempool.space" as const, live: true, updatedAt: Date.now() };
        } catch (err) {
          request.log.warn({ err }, "bitcoin/stats: mempool.space unavailable, using static reference dataset");
          return { ...BITCOIN_STATIC_FALLBACK, source: "mempool.space" as const, live: false, updatedAt: Date.now() };
        }
      });
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "bitcoin/stats failed unexpectedly");
      return reply.status(502).send({ error: "bitcoin stats unavailable" });
    }
  });
}
