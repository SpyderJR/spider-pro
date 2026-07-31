import { useEffect, useRef } from "react";
import { createChart, ColorType, type Time } from "lightweight-charts";
import type { Candle } from "@spider/types";

interface LinePane {
  kind: "line";
  candles: Candle[];
  values: (number | null)[];
  color: string;
  refLines?: number[];
}

interface HistogramPane {
  kind: "histogram";
  candles: Candle[];
  macd: { macd: number | null; signal: number | null; histogram: number | null }[];
}

interface MultiLinePane {
  kind: "multi";
  candles: Candle[];
  lines: Array<{ label: string; color: string; values: (number | null)[] }>;
  refLines?: number[];
}

type IndicatorPaneProps = (LinePane | HistogramPane | MultiLinePane) & { height?: number };

export function IndicatorPaneChart(props: IndicatorPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      height: props.height ?? 120,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94a3b8",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
      },
      grid: { vertLines: { color: "#1b2230" }, horzLines: { color: "#1b2230" } },
      rightPriceScale: { borderColor: "#1b2230" },
      timeScale: { borderColor: "#1b2230", timeVisible: true, secondsVisible: false },
    });

    if (props.kind === "line") {
      const series = chart.addLineSeries({ color: props.color, lineWidth: 2 });
      series.setData(
        props.candles
          .map((c, i) => ({ time: c.time as Time, value: props.values[i] }))
          .filter((p): p is { time: Time; value: number } => p.value !== null && p.value !== undefined),
      );
      for (const ref of props.refLines ?? []) {
        series.createPriceLine({
          price: ref,
          color: "#334155",
          lineWidth: 1,
          lineStyle: 2,
          axisLabelVisible: true,
        });
      }
    } else if (props.kind === "multi") {
      for (const line of props.lines) {
        const series = chart.addLineSeries({ color: line.color, lineWidth: 2, title: line.label });
        series.setData(
          props.candles
            .map((c, i) => ({ time: c.time as Time, value: line.values[i] }))
            .filter((p): p is { time: Time; value: number } => p.value !== null && p.value !== undefined),
        );
      }
      if (props.lines[0]) {
        const refSeries = chart.addLineSeries({ color: "transparent", lastValueVisible: false });
        for (const ref of props.refLines ?? []) {
          refSeries.createPriceLine({
            price: ref,
            color: "#334155",
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: true,
          });
        }
      }
    } else {
      const macdLine = chart.addLineSeries({ color: "#3ba8ff", lineWidth: 1 });
      const signalLine = chart.addLineSeries({ color: "#ffcf4d", lineWidth: 1 });
      const histSeries = chart.addHistogramSeries({ color: "#39ff9c" });

      macdLine.setData(
        props.candles
          .map((c, i) => ({ time: c.time as Time, value: props.macd[i]?.macd }))
          .filter((p): p is { time: Time; value: number } => p.value !== null && p.value !== undefined),
      );
      signalLine.setData(
        props.candles
          .map((c, i) => ({ time: c.time as Time, value: props.macd[i]?.signal }))
          .filter((p): p is { time: Time; value: number } => p.value !== null && p.value !== undefined),
      );
      histSeries.setData(
        props.candles
          .map((c, i) => {
            const h = props.macd[i]?.histogram;
            return h === null || h === undefined
              ? null
              : { time: c.time as Time, value: h, color: h >= 0 ? "#39ff9c" : "#ff3b5c" };
          })
          .filter((p): p is { time: Time; value: number; color: string } => p !== null),
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.candles, props.kind]);

  return <div ref={containerRef} className="w-full" />;
}
