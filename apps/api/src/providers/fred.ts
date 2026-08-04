import { env } from "../lib/env.js";
import { ProviderError } from "../lib/http.js";

export interface FredPoint {
  time: number; // unix seconds, first of month
  value: number;
}

/**
 * FRED publishes most public series as a CSV with no API key required, via
 * fredgraph.csv — the JSON API at api.stlouisfed.org needs a key, so we
 * deliberately avoid it here per the "no auth required" design in the PRD.
 */
export async function fetchFredSeries(seriesId: string): Promise<FredPoint[]> {
  const url = `${env.FRED_BASE_URL}/graph/fredgraph.csv?id=${seriesId}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  let text: string;
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new ProviderError("fred", `HTTP ${res.status}`);
    text = await res.text();
  } catch (err) {
    if (err instanceof ProviderError) throw err;
    throw new ProviderError("fred", `request failed: ${(err as Error).message}`, err);
  } finally {
    clearTimeout(timeout);
  }

  const lines = text.trim().split("\n").slice(1); // skip header
  const points: FredPoint[] = [];
  for (const line of lines) {
    const [dateStr, valueStr] = line.split(",");
    if (!dateStr || !valueStr || valueStr === ".") continue;
    const time = Math.floor(new Date(dateStr).getTime() / 1000);
    const value = Number(valueStr);
    if (Number.isFinite(value)) points.push({ time, value });
  }
  return points;
}

export const fetchM2Series = () => fetchFredSeries("M2SL");
