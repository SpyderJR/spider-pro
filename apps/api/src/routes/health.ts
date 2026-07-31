import type { FastifyInstance } from "fastify";
import type { HealthResponse } from "@spider/types";

export function registerHealthRoute(app: FastifyInstance) {
  app.get("/health", async (_request, reply) => {
    const response: HealthResponse = {
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
    return reply.send(response);
  });
}
