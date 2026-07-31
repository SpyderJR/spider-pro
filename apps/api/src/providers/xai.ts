import type { ChatMessage } from "@spider/types";
import { env } from "../lib/env.js";
import { fetchJson } from "../lib/http.js";

interface XaiChatCompletionResponse {
  choices: Array<{ message: { content: string } }>;
}

const SYSTEM_PROMPT = `Eres "Spider", el asistente conversacional de Spider Pro, una plataforma de análisis técnico y contexto cripto.

REGLA NO NEGOCIABLE: nunca debes usar tu propio conocimiento para afirmar una cifra de mercado (precio, RSI, market cap, % de cambio, supply, o cualquier otro dato numérico). Solo puedes citar cifras que aparezcan explícitamente en el bloque "DATOS VERIFICADOS" que se te entrega a continuación, el cual refleja exactamente lo que el usuario tiene en pantalla en este momento.

Si el usuario pregunta algo cuya respuesta requeriría un dato que no está en ese bloque, responde explícitamente: "No tengo ese dato ahora mismo" — y sugiere en qué sección de la app podría encontrarlo. Nunca inventes ni extrapoles un número.

Responde siempre en español, de forma clara y concisa. Recuerda que ninguna señal técnica es una recomendación de inversión (NFA - Not Financial Advice).`;

export async function fetchXaiChatReply(
  message: string,
  page: string,
  context: Record<string, unknown> | undefined,
  history: ChatMessage[] | undefined,
): Promise<string> {
  if (!env.XAI_API_KEY) {
    return "El asistente conversacional no está disponible en este momento (falta configurar la clave de API). El resto de la plataforma sigue funcionando con normalidad.";
  }

  const contextBlock = context
    ? `DATOS VERIFICADOS (sección actual: ${page}):\n${JSON.stringify(context, null, 2)}`
    : `DATOS VERIFICADOS (sección actual: ${page}): no hay datos publicados por esta sección todavía.`;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "system", content: contextBlock },
    ...(history ?? []).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];

  const url = `${env.XAI_BASE_URL}/v1/chat/completions`;
  const raw = await fetchJson<XaiChatCompletionResponse>("xai", url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "grok-4",
      messages,
      temperature: 0.3,
    }),
  }, 20_000);

  return raw.choices[0]?.message.content ?? "No pude generar una respuesta en este momento.";
}
