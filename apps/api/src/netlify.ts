import type { Handler, HandlerEvent } from "@netlify/functions";
import { buildApp } from "./app.js";

// Reused across warm invocations of the same function instance.
const appPromise = buildApp();

function normalizeHeaders(headers: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined || value === null) continue;
    out[key] = Array.isArray(value) ? value.join(", ") : String(value);
  }
  return out;
}

export const handler: Handler = async (event: HandlerEvent) => {
  try {
    const app = await appPromise;
    await app.ready();

    const path = event.path.replace(/^\/\.netlify\/functions\/api/, "") || "/";
    const queryEntries = Object.entries(event.queryStringParameters ?? {}).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    );
    const query = queryEntries.length > 0 ? "?" + new URLSearchParams(queryEntries).toString() : "";

    const response = await app.inject({
      method: event.httpMethod as "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
      url: path + query,
      headers: event.headers as Record<string, string>,
      payload: event.body ?? undefined,
    });

    return {
      statusCode: response.statusCode,
      headers: normalizeHeaders(response.headers),
      body: response.body,
    };
  } catch (err) {
    // Surface the real failure in Netlify's function logs instead of letting
    // Lambda return an opaque 502 with no context — this is the first place
    // to look if the deployed API "just doesn't work" with no clear reason.
    console.error("[netlify function] unhandled error:", err);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        error: "internal function error",
        message: err instanceof Error ? err.message : String(err),
      }),
    };
  }
};
