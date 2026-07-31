import type { FearGreedClassification, FearGreedResponse } from "@spider/types";
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
