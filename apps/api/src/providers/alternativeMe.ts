import type { FearGreedClassification, FearGreedHistoryResponse, FearGreedResponse } from "@spider/types";
import { env } from "../lib/env.js";
import { fetchJson } from "../lib/http.js";

interface AlternativeMeResponse {
  data: Array<{ value: string; value_classification: string; timestamp: string }>;
}

function classify(value: number): FearGreedClassification {
  if (value <= 24) return "extreme_fear";
  if (value <= 44) return "fear";
  if (value <= 55) return "neutral";
  if (value <= 75) return "greed";
  return "extreme_greed";
}

export async function fetchFearGreed(): Promise<FearGreedResponse> {
  const url = `${env.ALTERNATIVE_ME_BASE_URL}/fng/?limit=1`;
  const raw = await fetchJson<AlternativeMeResponse>("alternative.me", url);
  const point = raw.data[0];
  if (!point) throw new Error("empty response");

  const value = Number(point.value);
  return {
    value,
    classification: classify(value),
    updatedAt: Number(point.timestamp) * 1000,
    source: "alternative.me",
  };
}

/**
 * Full public history of the index (available since Feb 2018, one point per day) —
 * used for "when did we last see this?" historical-analog comparisons. limit=0 means
 * "return everything" per alternative.me's own docs.
 */
export async function fetchFearGreedHistory(): Promise<FearGreedHistoryResponse> {
  const url = `${env.ALTERNATIVE_ME_BASE_URL}/fng/?limit=0&format=json`;
  const raw = await fetchJson<AlternativeMeResponse>("alternative.me", url);
  const points = raw.data
    .map((p) => {
      const value = Number(p.value);
      return { value, classification: classify(value), time: Number(p.timestamp) };
    })
    .sort((a, b) => a.time - b.time);
  return { points, source: "alternative.me" };
}
