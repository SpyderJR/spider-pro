import { useEffect } from "react";
import type { IChartApi, ISeriesApi, LogicalRange, MouseEventParams, Time } from "lightweight-charts";
import type { BinanceCandle } from "../lib/binance/types";

export interface SyncedChartHandle {
  chart: IChartApi;
  series: ISeriesApi<"Candlestick">;
  candles: BinanceCandle[];
}

function buildCloseByTime(candles: BinanceCandle[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const c of candles) map.set(c.time, c.close);
  return map;
}

/**
 * Keeps two chart instances' visible range and crosshair in lockstep — first use of
 * lightweight-charts v4's subscribeVisibleLogicalRangeChange/setCrosshairPosition APIs in
 * this codebase (both existed unused before). Crosshair sync looks up the target chart's
 * own price at the hovered time (not the source's price), so each side always shows a
 * value on its own scale.
 */
export function useSyncedCharts(a: SyncedChartHandle | null, b: SyncedChartHandle | null): void {
  useEffect(() => {
    if (!a || !b) return;

    const aCloseByTime = buildCloseByTime(a.candles);
    const bCloseByTime = buildCloseByTime(b.candles);
    let syncingRange = false;

    function makeRangeHandler(target: SyncedChartHandle) {
      return (range: LogicalRange | null) => {
        if (syncingRange || !range) return;
        syncingRange = true;
        try {
          target.chart.timeScale().setVisibleLogicalRange(range);
        } catch {
          // target chart may already be disposed mid-transition
        }
        syncingRange = false;
      };
    }

    function makeCrosshairHandler(target: SyncedChartHandle, targetCloseByTime: Map<number, number>) {
      return (param: MouseEventParams) => {
        if (!param.time) {
          target.chart.clearCrosshairPosition();
          return;
        }
        const price = targetCloseByTime.get(param.time as unknown as number);
        if (price === undefined) {
          target.chart.clearCrosshairPosition();
          return;
        }
        target.chart.setCrosshairPosition(price, param.time as Time, target.series);
      };
    }

    const rangeAtoB = makeRangeHandler(b);
    const rangeBtoA = makeRangeHandler(a);
    a.chart.timeScale().subscribeVisibleLogicalRangeChange(rangeAtoB);
    b.chart.timeScale().subscribeVisibleLogicalRangeChange(rangeBtoA);

    const crosshairAtoB = makeCrosshairHandler(b, bCloseByTime);
    const crosshairBtoA = makeCrosshairHandler(a, aCloseByTime);
    a.chart.subscribeCrosshairMove(crosshairAtoB);
    b.chart.subscribeCrosshairMove(crosshairBtoA);

    return () => {
      try {
        a.chart.timeScale().unsubscribeVisibleLogicalRangeChange(rangeAtoB);
        b.chart.timeScale().unsubscribeVisibleLogicalRangeChange(rangeBtoA);
        a.chart.unsubscribeCrosshairMove(crosshairAtoB);
        b.chart.unsubscribeCrosshairMove(crosshairBtoA);
      } catch {
        // either chart may already be disposed
      }
    };
  }, [a, b]);
}
