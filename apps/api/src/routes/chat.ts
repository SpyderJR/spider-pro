import type { FastifyInstance, FastifyRequest } from "fastify";
import { ChatRequestSchema, type ChatResponse } from "@spider/types";
import { fetchXaiChatReply } from "../providers/xai.js";
import { env } from "../lib/env.js";
import { checkChatRateLimit } from "../lib/chatRateLimit.js";

function resolveClientIp(request: FastifyRequest): string {
  const nfIp = request.headers["x-nf-client-connection-ip"];
  if (typeof nfIp === "string" && nfIp) return nfIp;
  const forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded) return forwarded.split(",")[0]!.trim();
  return request.ip;
}

export function registerChatRoute(app: FastifyInstance) {
  app.post("/api/chat", async (request, reply) => {
    const parsed = ChatRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "invalid request", details: parsed.error.flatten() });
    }
    const { message, page, context, history } = parsed.data;

    const ip = resolveClientIp(request);
    const rateLimit = checkChatRateLimit(ip);
    if (!rateLimit.allowed) {
      return reply.status(429).send({
        reply: "Ya usaste tus 15 mensajes de hoy con Spider Chat. El límite se reinicia en 24 horas — el resto de la plataforma sigue funcionando sin restricciones.",
        degraded: true,
        remaining: 0,
      } satisfies ChatResponse);
    }

    try {
      const reply_ = await fetchXaiChatReply(message, page, context, history);
      const response: ChatResponse = { reply: reply_, degraded: !env.XAI_API_KEY, remaining: rateLimit.remaining };
      return reply.send(response);
    } catch (err) {
      request.log.error({ err }, "chat: xai provider failed");
      return reply.status(502).send({
        reply: "El asistente no pudo responder en este momento. Probá de nuevo en unos segundos.",
        degraded: true,
        remaining: rateLimit.remaining,
      } satisfies ChatResponse);
    }
  });
}
