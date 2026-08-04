import { useEffect, useRef } from "react";
import { createChart, ColorType, type IChartApi, type ISeriesApi, type Time } from "lightweight-charts";
import type { BinanceCandle } from "../../../lib/binance/types";
import { pricePrecision } from "../../../lib/format";

interface Props {
  candles: BinanceCandle[];
  label: string;
  height?: number;
  onChartReady?: (chart: IChartApi, series: ISeriesApi<"Candlestick">) => void;
}

/**
 * A minimal, read-only candlestick chart for the second asset in a synced Replay
 * comparison — no indicators, no order lines, no order panel. Just candles, so it stays
 * lightweight next to the full TerminalChart it's synced against.
 */
export function SecondaryReplayChart({ candles, label, height = 260, onChartReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

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
      grid: { vertLines: { color: "#1b2230" }, horzLines: { color: "#1b2230" } },
      rightPriceScale: { borderColor: "#1b2230" },
      timeScale: { borderColor: "#1b2230", timeVisible: true, secondsVisible: false },
      crosshair: { mode: 0 },
    });
    chartRef.current = chart;

    const series = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });
    seriesRef.current = series;
    onChartReady?.(chart, series);

    const resize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      requestAnimationFrame(() => {
        try {
          chart.remove();
        } catch {
          // already disposed
        }
      });
      chartRef.current = null;
      seriesRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series || candles.length === 0) return;
    const lastClose = candles.at(-1)?.close ?? 1;
    const precision = pricePrecision(lastClose);
    series.applyOptions({ priceFormat: { type: "price", precision, minMove: 1 / 10 ** precision } });
    series.setData(candles.map((c) => ({ time: c.time as Time, open: c.open, high: c.high, low: c.low, close: c.close })));
  }, [candles]);

  return (
    <div className="panel p-3">
      <div className="text-[10px] font-mono text-slate-500 mb-2">{label}</div>
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
