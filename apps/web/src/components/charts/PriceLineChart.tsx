import { useEffect, useRef } from "react";
import { createChart, ColorType, LineStyle, type IChartApi } from "lightweight-charts";
import type { PricePoint } from "@spider/types";

interface PriceLineChartProps {
  points: PricePoint[];
  color?: string;
  height?: number;
}

export function PriceLineChart({ points, color = "#39ff9c", height = 260 }: PriceLineChartProps) {
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
      timeScale: { borderColor: "#1b2230" },
      crosshair: { vertLine: { style: LineStyle.Dashed }, horzLine: { style: LineStyle.Dashed } },
    });

    const series = chart.addAreaSeries({
      lineColor: color,
      topColor: `${color}33`,
      bottomColor: `${color}00`,
      lineWidth: 2,
    });

    series.setData(points.map((p) => ({ time: p.time as never, value: p.price })));
    chart.timeScale().fitContent();
    chartRef.current = chart;

    const resize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
    };
  }, [points, color, height]);

  return <div ref={containerRef} className="w-full" />;
}
