import { useMemo } from "react";
import { PriceLineChart } from "../charts/PriceLineChart";
import type { FearGreedHistoryPoint } from "@spider/types";

const WINDOW_DAYS = 120;

export function FearGreedChart({ points }: { points: FearGreedHistoryPoint[] }) {
  const windowed = useMemo(() => points.slice(-WINDOW_DAYS), [points]);

  if (windowed.length === 0) {
    return <div className="text-center text-slate-500 text-sm py-10">Cargando historial…</div>;
  }

  return (
    <div>
      <PriceLineChart points={windowed.map((p) => ({ time: p.time, price: p.value }))} color="#ffcf4d" height={180} />
      <div className="flex justify-between text-[10px] font-mono text-slate-600 mt-1 px-1">
        <span>0 · miedo extremo</span>
        <span>50 · neutral</span>
        <span>100 · codicia extrema</span>
      </div>
    </div>
  );
}
