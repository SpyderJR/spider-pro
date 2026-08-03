import { useEffect, useRef } from "react";
import { createChart, ColorType, type IChartApi, type ISeriesApi, type IPriceLine, type Time } from "lightweight-charts";
import type { BinanceCandle } from "../../lib/binance/types";
import { pricePrecision } from "../../lib/format";

export interface ArcadeMarker {
  index: number;
  color: string;
  shape: "arrowUp" | "arrowDown" | "circle" | "square";
  position: "aboveBar" | "belowBar" | "inBar";
  text?: string;
}

export interface ArcadePriceLine {
  price: number;
  color: string;
  title: string;
  style?: 0 | 1 | 2 | 3 | 4;
}

interface Props {
  candles: BinanceCandle[];
  markers?: ArcadeMarker[];
  priceLines?: ArcadePriceLine[];
  onCandleClick?: (index: number) => void;
  height?: number;
  hideScales?: boolean;
  disableInteraction?: boolean;
}

export function ArcadeChart({ candles, markers = [], priceLines = [], onCandleClick, height = 320, hideScales = false, disableInteraction = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const onClickRef = useRef(onCandleClick);
  onClickRef.current = onCandleClick;

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
      rightPriceScale: { borderColor: "#1b2230", visible: !hideScales },
      timeScale: { borderColor: "#1b2230", timeVisible: true, secondsVisible: false, visible: !hideScales },
      handleScroll: !disableInteraction,
      handleScale: !disableInteraction,
    });
    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });
    candleSeriesRef.current = candleSeries;

    chart.subscribeClick((param) => {
      if (!onClickRef.current || !param.time) return;
      const idx = candlesRef.current.findIndex((c) => c.time === param.time);
      if (idx >= 0) onClickRef.current(idx);
    });

    const resize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      // Deferred one frame: lightweight-charts can have an internal repaint already
      // scheduled (rAF) when we unmount; disposing synchronously here means that
      // repaint fires against a torn-down canvas a moment later ("Object is
      // disposed"). Letting it run once more against the still-live chart first
      // avoids the race — Arcade mounts/unmounts many short-lived chart instances
      // as games switch, which is what surfaces this far more than the Terminal's
      // single long-lived chart.
      requestAnimationFrame(() => {
        try {
          chart.remove();
        } catch {
          // already disposed
        }
      });
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, hideScales, disableInteraction]);

  const candlesRef = useRef(candles);
  candlesRef.current = candles;

  useEffect(() => {
    const chart = chartRef.current;
    const series = candleSeriesRef.current;
    if (!chart || !series || candles.length === 0) return;

    const lastClose = candles.at(-1)?.close ?? 1;
    const precision = pricePrecision(lastClose);
    try {
      series.applyOptions({ priceFormat: { type: "price", precision, minMove: 1 / 10 ** precision } });
      series.setData(candles.map((c) => ({ time: c.time as Time, open: c.open, high: c.high, low: c.low, close: c.close })));
      chart.timeScale().fitContent();
    } catch {
      // chart already disposed (React StrictMode double-invoke race)
    }
  }, [candles]);

  useEffect(() => {
    const series = candleSeriesRef.current;
    if (!series || candles.length === 0) return;
    try {
      series.setMarkers(
        markers
          .filter((m) => m.index >= 0 && m.index < candles.length)
          .map((m) => ({
            time: candles[m.index]!.time as Time,
            position: m.position,
            color: m.color,
            shape: m.shape,
            text: m.text ?? "",
          }))
          .sort((a, b) => (a.time as number) - (b.time as number)),
      );
    } catch {
      // chart torn down between renders
    }
  }, [markers, candles]);

  useEffect(() => {
    const series = candleSeriesRef.current;
    if (!series) return;
    const lines: IPriceLine[] = priceLines.map((l) =>
      series.createPriceLine({
        price: l.price,
        color: l.color,
        lineWidth: 1,
        lineStyle: l.style ?? 2,
        axisLabelVisible: true,
        title: l.title,
      }),
    );
    return () => {
      try {
        for (const l of lines) series.removePriceLine(l);
      } catch {
        // chart torn down between renders
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceLines]);

  return <div ref={containerRef} className="w-full" />;
}
