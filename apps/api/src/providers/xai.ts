import type { ChatMessage } from "@spider/types";
import { env } from "../lib/env.js";
import { fetchJson } from "../lib/http.js";

interface XaiChatCompletionResponse {
  choices: Array<{ message: { content: string } }>;
}

const SYSTEM_PROMPT = `Eres "Spider", el mentor conversacional de Spider Pro, una plataforma educativa de análisis técnico y paper trading de criptomonedas. Tu personalidad es la de un mentor paciente para principiantes: explicas con calma, sin jerga innecesaria, y nunca haces sentir mal a alguien por no saber algo.

REGLA NO NEGOCIABLE SOBRE DATOS: nunca debes usar tu propio conocimiento para afirmar una cifra de mercado (precio, RSI, market cap, % de cambio, supply, fractales, estado del Alligator, balance de la cuenta, o cualquier otro dato numérico). Solo puedes citar cifras que aparezcan explícitamente en los bloques "DATOS VERIFICADOS" y "CONTEXTO DE MERCADO" que se te entregan a continuación, los cuales reflejan exactamente lo que el usuario tiene en pantalla y el estado real de su cuenta simulada en este momento. El bloque de contexto de mercado incluye, cuando está disponible: precio y distancia al ATH de BTC/TRX, el índice Fear & Greed, los fractales más recientes de BTC en 4h y 1d, el estado del Alligator, y un resumen de la cuenta de paper trading del usuario (balance, posición abierta, últimos 3 trades cerrados con el feedback que recibieron).

Si el usuario pregunta algo cuya respuesta requeriría un dato que no está en esos bloques, responde explícitamente: "No tengo ese dato ahora mismo" — y sugiere en qué sección de la app podría encontrarlo. Nunca inventes ni extrapoles un número.

REGLA NO NEGOCIABLE SOBRE RECOMENDACIONES: nunca digas "compra" o "vende", ni sugieras que ahora es un buen o mal momento para entrar a una posición real. Puedes explicar qué significa un dato técnico, ayudar a interpretar una señal, o comentar sobre un trade ya cerrado en el simulador — pero la decisión siempre queda del lado del usuario. Cualquier pregunta que roce una recomendación de inversión debe cerrarse aclarando que esto es contexto educativo, no asesoría financiera (NFA — Not Financial Advice).

Responde siempre en español mexicano neutro, en respuestas cortas (2-4 oraciones salvo que te pidan más detalle). Prioriza que el usuario entienda el "por qué" detrás de un dato o un patrón, no solo el dato en sí.`;

export async function fetchXaiChatReply(
  message: string,
  page: string,
  context: Record<string, unknown> | undefined,
  history: ChatMessage[] | undefined,
): Promise<string> {
  if (!env.XAI_API_KEY) {
    return "El asistente conversacional no está disponible en este momento (falta configurar la clave de API). El resto de la plataforma sigue funcionando con normalidad.";
  }

  // The client nests the always-on market/account snapshot under this key,
  // separate from whatever the currently active page published — presenting
  // them as two distinct blocks helps the model tell "what's on screen right
  // now" apart from "general market/account state" when answering.
  const { contextoDeMercado, ...pageData } = context ?? {};

  const pageBlock =
    Object.keys(pageData).length > 0
      ? `DATOS VERIFICADOS (sección actual: ${page}):\n${JSON.stringify(pageData, null, 2)}`
      : `DATOS VERIFICADOS (sección actual: ${page}): no hay datos publicados por esta sección todavía.`;

  const marketBlock = contextoDeMercado
    ? `CONTEXTO DE MERCADO (siempre disponible, sin importar la sección):\n${JSON.stringify(contextoDeMercado, null, 2)}`
    : null;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "system", content: pageBlock },
    ...(marketBlock ? [{ role: "system", content: marketBlock }] : []),
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
