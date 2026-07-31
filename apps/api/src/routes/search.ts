import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { TokenSearchResponse } from "@spider/types";
import { cache } from "../lib/cache.js";
import { searchCoinGeckoTokens } from "../providers/coingecko.js";

const QuerySchema = z.object({
  query: z.string().min(1).max(50),
});

export function registerSearchRoute(app: FastifyInstance) {
  app.get("/api/market/search", async (request, reply) => {
    const parsed = QuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({ error: "invalid query" });
    }
    const { query } = parsed.data;
    const cacheKey = `search:${query.toLowerCase()}`;

    try {
      const result = await cache.wrap<TokenSearchResponse>(cacheKey, 60_000, async () => ({
        results: await searchCoinGeckoTokens(query),
      }));
      return reply.send(result);
    } catch (err) {
      request.log.error({ err, query }, "market/search failed");
      return reply.status(502).send({ error: "token search provider unavailable" });
    }
  });
}
