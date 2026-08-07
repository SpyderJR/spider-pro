import type { WhaleCategory, WhaleChain, WhaleConfidence } from "@spider/types";

export const CATEGORY_LABELS: Record<WhaleCategory, string> = {
  exchange: "Exchanges",
  institution: "Instituciones",
  political: "Políticos / Figuras públicas",
  founder: "Fundadores",
  historical: "Histórico",
};

export const CATEGORY_COLORS: Record<WhaleCategory, string> = {
  exchange: "#ffcf4d",
  institution: "#3ba8ff",
  political: "#ff3b5c",
  founder: "#39ff9c",
  historical: "#94a3b8",
};

export const CHAIN_COLORS: Record<WhaleChain, string> = {
  BTC: "#f7931a",
  ETH: "#627eea",
  TRON: "#ff3b5c",
  SOL: "#a78bfa",
};

export const CONFIDENCE_LABELS: Record<WhaleConfidence, string> = {
  verified: "VERIFICADO · autodivulgado",
  "widely-reported": "REPORTADO · múltiples fuentes",
  declared: "DECLARADO · no on-chain",
};

export const CONFIDENCE_COLORS: Record<WhaleConfidence, string> = {
  verified: "#39ff9c",
  "widely-reported": "#ffcf4d",
  declared: "#94a3b8",
};
