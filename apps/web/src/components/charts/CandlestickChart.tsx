import { useEffect, useRef } from "react";
import { createChart, ColorType, type IChartApi, type ISeriesApi, type Time } from "lightweight-charts";
import type { Candle } from "@spider/types";
import type { WorkerMaResult } from "../../workers/indicators.worker";
import type { SarPoint } from "@spider/indicators";
import { pricePrecision } from "../../lib/format";

interface CandlestickChartProps {
  candles: Candle[];
  movingAverages?: WorkerMaResult[];
  bollinger?: { upper: number | null; middle: number | null; lower: number | null }[] | null;
  vwap?: number[] | null;
  parabolicSar?: (SarPoint | null)[] | null;
  height?: number;
  onTimeRangeChange?: (chart: IChartApi) => void;
}

const MA_COLORS = ["#3ba8ff", "#ffcf4d", "#a78bfa", "#f472b6"];

export function CandlestickChart({
  candles,
  movingAverages = [],
  bollinger,
  vwap,
  parabolicSar,
  height = 380,
}: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94a3b8",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#1b2230" },
        horzLines: { color: "#1b2230" },
      },
      rightPriceScale: { borderColor: "#1b2230" },
      timeScale: { borderColor: "#1b2230", timeVisible: true, secondsVisible: false },
    });
    chartRef.current = chart;

    // Micro-priced tokens (e.g. $0.000413) need more than the library's default
    // 2-decimal formatting, or every overlay label collapses to "0.00".
    const lastClose = candles.at(-1)?.close ?? 1;
    const precision = pricePrecision(lastClose);
    const priceFormat = { type: "price" as const, precision, minMove: 1 / 10 ** precision };

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#39ff9c",
      downColor: "#ff3b5c",
      borderVisible: false,
      wickUpColor: "#39ff9c",
      wickDownColor: "#ff3b5c",
      priceFormat,
    });
    candleSeries.setData(
      candles.map((c) => ({
        time: c.time as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })),
    );

    const maSeries: ISeriesApi<"Line">[] = movingAverages.map((ma, i) => {
      const series = chart.addLineSeries({
        color: MA_COLORS[i % MA_COLORS.length],
        lineWidth: 1,
        title: `${ma.type}${ma.period}`,
        priceFormat,
      });
      series.setData(
        candles
          .map((c, idx) => ({ time: c.time as Time, value: ma.values[idx] }))
          .filter((p): p is { time: Time; value: number } => p.value !== null && p.value !== undefined),
      );
      return series;
    });

    let bollingerSeries: ISeriesApi<"Line">[] = [];
    if (bollinger) {
      const upper = chart.addLineSeries({ color: "#64748b", lineWidth: 1, title: "BB Upper", priceFormat });
      const lower = chart.addLineSeries({ color: "#64748b", lineWidth: 1, title: "BB Lower", priceFormat });
      upper.setData(
        candles
          .map((c, idx) => ({ time: c.time as Time, value: bollinger[idx]?.upper }))
          .filter((p): p is { time: Time; value: number } => p.value !== null && p.value !== undefined),
      );
      lower.setData(
        candles
          .map((c, idx) => ({ time: c.time as Time, value: bollinger[idx]?.lower }))
          .filter((p): p is { time: Time; value: number } => p.value !== null && p.value !== undefined),
      );
      bollingerSeries = [upper, lower];
    }

    let vwapSeries: ISeriesApi<"Line"> | null = null;
    if (vwap) {
      vwapSeries = chart.addLineSeries({ color: "#ffcf4d", lineWidth: 2, title: "VWAP", lineStyle: 3, priceFormat });
      vwapSeries.setData(
        candles
          .map((c, idx) => ({ time: c.time as Time, value: vwap[idx] }))
          .filter((p): p is { time: Time; value: number } => p.value !== null && p.value !== undefined),
      );
    }

    let sarSeries: ISeriesApi<"Line"> | null = null;
    if (parabolicSar) {
      sarSeries = chart.addLineSeries({
        color: "#a78bfa",
        lineWidth: 1,
        lineStyle: 0,
        title: "PSAR",
        lineVisible: false,
        pointMarkersVisible: true,
        pointMarkersRadius: 2,
        priceFormat,
      });
      sarSeries.setData(
        candles
          .map((c, idx) => ({ time: c.time as Time, value: parabolicSar[idx]?.value }))
          .filter((p): p is { time: Time; value: number } => p.value !== null && p.value !== undefined),
      );
    }

    chart.timeScale().fitContent();

    const resize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
      void maSeries;
      void bollingerSeries;
      void vwapSeries;
      void sarSeries;
    };
  }, [candles, movingAverages, bollinger, vwap, parabolicSar, height]);

  return <div ref={containerRef} className="w-full" />;
}
