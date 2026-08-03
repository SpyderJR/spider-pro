import type { AlligatorPoint } from "@spider/indicators";

export type AlligatorTrend = "up" | "down" | "flat";

/** Same heuristic used by lib/marketContext.ts's Spanish summary, as a plain enum for rule checks. */
export function deriveAlligatorTrend(points: (AlligatorPoint | null)[], lastPrice: number): AlligatorTrend | null {
  const last = points.at(-1);
  if (!last || last.jaw === null || last.teeth === null || last.lips === null || lastPrice <= 0) return null;

  const spread = (Math.max(last.jaw, last.teeth, last.lips) - Math.min(last.jaw, last.teeth, last.lips)) / lastPrice;
  if (spread < 0.003) return "flat";

  const bullishOrder = last.lips > last.teeth && last.teeth > last.jaw;
  const bearishOrder = last.lips < last.teeth && last.teeth < last.jaw;
  if (bullishOrder && spread > 0.008) return "up";
  if (bearishOrder && spread > 0.008) return "down";
  return "flat";
}
