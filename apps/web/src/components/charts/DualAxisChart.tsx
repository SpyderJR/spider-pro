import { useEffect, useRef } from "react";
import { createChart, ColorType, PriceScaleMode, type Time } from "lightweight-charts";

interface DualAxisChartProps {
  leftSeries: { time: number; value: number }[];
  rightSeries: { time: number; value: number }[];
  leftLabel: string;
  rightLabel: string;
  height?: number;
}

export function DualAxisChart({
  leftSeries,
  rightSeries,
  leftLabel,
  rightLabel,
  height = 320,
}: DualAxisChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94a3b8",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
      },
      grid: { vertLines: { color: "#1b2230" }, horzLines: { color: "#1b2230" } },
      rightPriceScale: { borderColor: "#1b2230", mode: PriceScaleMode.Logarithmic },
      leftPriceScale: { visible: true, borderColor: "#1b2230" },
      timeScale: { borderColor: "#1b2230" },
    });

    const right = chart.addLineSeries({
      color: "#f7931a",
      lineWidth: 2,
      priceScaleId: "right",
      title: rightLabel,
    });
    right.setData(rightSeries.map((p) => ({ time: p.time as Time, value: p.value })));

    const left = chart.addLineSeries({
      color: "#3ba8ff",
      lineWidth: 2,
      priceScaleId: "left",
      title: leftLabel,
    });
    left.setData(leftSeries.map((p) => ({ time: p.time as Time, value: p.value })));

    chart.timeScale().fitContent();
    const resize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
    };
  }, [leftSeries, rightSeries, leftLabel, rightLabel, height]);

  return <div ref={containerRef} className="w-full" />;
}
