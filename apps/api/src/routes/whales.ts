import type { FastifyInstance } from "fastify";
import type { WhaleDetailResponse, WhaleListResponse } from "@spider/types";
import { cache, TTL } from "../lib/cache.js";
import { fetchWhaleDetail, fetchWhaleList } from "../providers/whales.js";

export function registerWhaleRoutes(app: FastifyInstance) {
  app.get("/api/whales", async (request, reply) => {
    try {
      const result = await cache.wrap<WhaleListResponse>("whale:list", TTL.whaleList, async () => {
        const entities = await fetchWhaleList();
        return { entities, updatedAt: Date.now() };
      });
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "whales/list failed");
      return reply.status(502).send({ error: "whale list unavailable" });
    }
  });

  app.get<{ Params: { id: string } }>("/api/whales/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await cache.wrap<WhaleDetailResponse | null>(`whale:detail:${id}`, TTL.whaleDetail, async () => {
        const entity = await fetchWhaleDetail(id);
        return entity ? { entity } : null;
      });
      if (!result) return reply.status(404).send({ error: "unknown whale entity" });
      return reply.send(result);
    } catch (err) {
      request.log.error({ err }, "whales/detail failed");
      return reply.status(502).send({ error: "whale detail unavailable" });
    }
  });
}
