import type { FastifyInstance } from "fastify";
import { ChatRequestSchema, type ChatResponse } from "@spider/types";
import { fetchXaiChatReply } from "../providers/xai.js";
import { env } from "../lib/env.js";

export function registerChatRoute(app: FastifyInstance) {
  app.post("/api/chat", async (request, reply) => {
    const parsed = ChatRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "invalid request", details: parsed.error.flatten() });
    }
    const { message, page, context, history } = parsed.data;

    try {
      const reply_ = await fetchXaiChatReply(message, page, context, history);
      const response: ChatResponse = { reply: reply_, degraded: !env.XAI_API_KEY };
      return reply.send(response);
    } catch (err) {
      request.log.error({ err }, "chat: xai provider failed");
      return reply.status(502).send({
        reply: "El asistente no pudo responder en este momento. Probá de nuevo en unos segundos.",
        degraded: true,
      } satisfies ChatResponse);
    }
  });
}
