import { useEffect, useRef } from "react";
import { createChart, ColorType, type IChartApi, type ISeriesApi, type Time, type IPriceLine } from "lightweight-charts";
import type { BinanceCandle, LiveKline } from "../../lib/binance/types";
import type { TerminalIndicators } from "../../hooks/useTerminalIndicators";
import type { TerminalIndicatorToggles } from "../../hooks/useTerminalIndicators";
import type { Position, PendingOrder } from "../../lib/paperTrading/types";
import { pricePrecision } from "../../lib/format";
import { VolumeProfileOverlay } from "./VolumeProfileOverlay";

const EMA_COLORS = { ema20: "#3ba8ff", ema50: "#ffcf4d", ema200: "#a78bfa" };
const VWAP_COLOR = "#ff8ad8";
const DONCHIAN_COLOR = "#22d3ee";
const KELTNER_COLOR = "#c084fc";
const ICHIMOKU_COLORS = { tenkan: "#ef4444", kijun: "#3ba8ff", spanA: "#22c55e", spanB: "#f97316", chikou: "#a3a3a3" };
const FIB_COLOR = "#ffcf4d";

export interface ExtraPriceLine {
  price: number;
  color: string;
  title: string;
  style?: 0 | 1 | 2 | 3 | 4;
}

interface Props {
  candles: BinanceCandle[];
  liveKline: LiveKline | null;
  toggles: TerminalIndicatorToggles;
  indicators: TerminalIndicators;
  position: Position | null;
  pendingOrders: PendingOrder[];
  /** Futures-mode price lines (entry/SL/TP/LIQ) — kept separate from `position` so the
   * spot paper-trading path above stays untouched. */
  extraPriceLines?: ExtraPriceLine[];
  height?: number;
  /** Fired once, right after the chart+series are created — lets a parent (e.g. the
   * multi-asset synced Replay) sync visible range and crosshair against another chart. */
  onChartReady?: (chart: IChartApi, series: ISeriesApi<"Candlestick">) => void;
}

export function TerminalChart({ candles, liveKline, toggles, indicators, position, pendingOrders, extraPriceLines = [], height = 440, onChartReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  // 1. Create chart once.
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

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });
    candleSeriesRef.current = candleSeries;

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });
    chart.priceScale("volume").applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });
    volumeSeriesRef.current = volumeSeries;

    onChartReady?.(chart, candleSeries);

    const resize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      // Deferred one frame: lightweight-charts can have an internal repaint already
      // scheduled (rAF) when we unmount; disposing synchronously means that repaint
      // fires against a torn-down canvas a moment later ("Object is disposed").
      // Letting it run once more against the still-live chart first avoids the race.
      requestAnimationFrame(() => {
        try {
          chart.remove();
        } catch {
          // already disposed
        }
      });
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  // 2. Full history + overlays — only when the finalized candle set or toggles change.
  useEffect(() => {
    const chart = chartRef.current;
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    if (!chart || !candleSeries || !volumeSeries || candles.length === 0) return;

    const lastClose = candles.at(-1)?.close ?? 1;
    const precision = pricePrecision(lastClose);
    const priceFormat = { type: "price" as const, precision, minMove: 1 / 10 ** precision };
    candleSeries.applyOptions({ priceFormat });

    const haCandles = toggles.heikinAshi ? indicators.heikinAshiCandles : null;
    candleSeries.setData(
      candles.map((c, i) => {
        const ha = haCandles?.[i];
        return ha
          ? { time: c.time as Time, open: ha.open, high: ha.high, low: ha.low, close: ha.close }
          : { time: c.time as Time, open: c.open, high: c.high, low: c.low, close: c.close };
      }),
    );

    volumeSeries.setData(
      toggles.volume
        ? candles.map((c) => ({ time: c.time as Time, value: c.volume, color: c.close >= c.open ? "#22c55e40" : "#ef444440" }))
        : [],
    );

    if (toggles.fractals) {
      candleSeries.setMarkers(
        indicators.fractals.map((f) => ({
          time: candles[f.index]!.time as Time,
          position: f.type === "bullish" ? "belowBar" : "aboveBar",
          color: f.type === "bullish" ? "#22c55e" : "#ef4444",
          shape: f.type === "bullish" ? "arrowUp" : "arrowDown",
          text: "",
        })),
      );
    } else {
      candleSeries.setMarkers([]);
    }

    const overlaySeries: ISeriesApi<"Line">[] = [];
    function addLine(values: (number | null)[] | null, color: string, title: string, style?: 0 | 1 | 2 | 3 | 4) {
      if (!values) return;
      const s = chart!.addLineSeries({
        color,
        lineWidth: 2,
        title,
        priceFormat,
        ...(style !== undefined ? { lineStyle: style } : {}),
      });
      s.setData(
        candles
          .map((c, i) => ({ time: c.time as Time, value: values[i] }))
          .filter((p): p is { time: Time; value: number } => p.value !== null && p.value !== undefined),
      );
      overlaySeries.push(s);
    }

    addLine(indicators.ema20, EMA_COLORS.ema20, "EMA20");
    addLine(indicators.ema50, EMA_COLORS.ema50, "EMA50");
    addLine(indicators.ema200, EMA_COLORS.ema200, "EMA200");
    addLine(indicators.vwapValues, VWAP_COLOR, "VWAP");

    if (toggles.alligator && indicators.alligatorData) {
      addLine(indicators.alligatorData.map((p) => p.jaw), "#3ba8ff", "Mandíbula");
      addLine(indicators.alligatorData.map((p) => p.teeth), "#ef4444", "Dientes");
      addLine(indicators.alligatorData.map((p) => p.lips), "#22c55e", "Labios");
    }

    if (toggles.donchian && indicators.donchianBands) {
      addLine(indicators.donchianBands.map((b) => b.upper), DONCHIAN_COLOR, "Donchian Sup.");
      addLine(indicators.donchianBands.map((b) => b.lower), DONCHIAN_COLOR, "Donchian Inf.");
      addLine(indicators.donchianBands.map((b) => b.middle), DONCHIAN_COLOR, "Donchian Media", 2);
    }

    if (toggles.keltner && indicators.keltnerBands) {
      addLine(indicators.keltnerBands.map((b) => b.upper), KELTNER_COLOR, "Keltner Sup.");
      addLine(indicators.keltnerBands.map((b) => b.lower), KELTNER_COLOR, "Keltner Inf.");
      addLine(indicators.keltnerBands.map((b) => b.middle), KELTNER_COLOR, "Keltner Media", 2);
    }

    if (toggles.superTrend && indicators.superTrendPoints) {
      const points = indicators.superTrendPoints;
      addLine(points.map((p) => (p.trend === "up" ? p.value : null)), "#22c55e", "SuperTrend ▲");
      addLine(points.map((p) => (p.trend === "down" ? p.value : null)), "#ef4444", "SuperTrend ▼");
    }

    if (toggles.ichimoku && indicators.ichimokuPoints) {
      const points = indicators.ichimokuPoints;
      addLine(points.map((p) => p.tenkanSen), ICHIMOKU_COLORS.tenkan, "Tenkan-sen");
      addLine(points.map((p) => p.kijunSen), ICHIMOKU_COLORS.kijun, "Kijun-sen");
      addLine(points.map((p) => p.senkouSpanA), ICHIMOKU_COLORS.spanA, "Senkou A", 2);
      addLine(points.map((p) => p.senkouSpanB), ICHIMOKU_COLORS.spanB, "Senkou B", 2);
      addLine(points.map((p) => p.chikouSpan), ICHIMOKU_COLORS.chikou, "Chikou", 1);
    }

    const pivotLines: IPriceLine[] = [];
    if (toggles.pivots && indicators.pivots) {
      const p = indicators.pivots;
      const levels: [string, number][] = [
        ["R2", p.r2],
        ["R1", p.r1],
        ["PP", p.pp],
        ["S1", p.s1],
        ["S2", p.s2],
      ];
      for (const [label, value] of levels) {
        pivotLines.push(
          candleSeries.createPriceLine({
            price: value,
            color: label === "PP" ? "#ffcf4d" : label.startsWith("R") ? "#ef4444" : "#22c55e",
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: true,
            title: label,
          }),
        );
      }
    }

    if (toggles.pivotsWeekly && indicators.pivotsWeekly) {
      const p = indicators.pivotsWeekly;
      const levels: [string, number][] = [
        ["R2(S)", p.r2],
        ["R1(S)", p.r1],
        ["PP(S)", p.pp],
        ["S1(S)", p.s1],
        ["S2(S)", p.s2],
      ];
      for (const [label, value] of levels) {
        pivotLines.push(
          candleSeries.createPriceLine({
            price: value,
            color: label.startsWith("PP") ? "#f97316" : label.startsWith("R") ? "#ef4444" : "#22c55e",
            lineWidth: 1,
            lineStyle: 3,
            axisLabelVisible: true,
            title: label,
          }),
        );
      }
    }

    if (toggles.fibonacci && indicators.fibonacciLevels) {
      for (const level of indicators.fibonacciLevels) {
        pivotLines.push(
          candleSeries.createPriceLine({
            price: level.price,
            color: FIB_COLOR,
            lineWidth: 1,
            lineStyle: level.ratio === 0 || level.ratio === 1 ? 0 : 2,
            axisLabelVisible: true,
            title: `Fib ${level.label}`,
          }),
        );
      }
    }

    return () => {
      // The chart itself may already be disposed by the time this cleanup runs
      // (e.g. React StrictMode's dev-only double-invoke) — removeSeries on a
      // torn-down chart throws, which is harmless here since there's nothing
      // left to clean up.
      try {
        for (const s of overlaySeries) chart.removeSeries(s);
        for (const l of pivotLines) candleSeries.removePriceLine(l);
      } catch {
        // chart already disposed — nothing to do.
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candles, toggles, indicators]);

  // 3. Live candle update — cheap, doesn't touch overlays.
  useEffect(() => {
    if (!liveKline || !candleSeriesRef.current || !volumeSeriesRef.current) return;
    if (toggles.heikinAshi) {
      // Recomputes just the in-progress HA candle from the last *finalized* HA close,
      // matching the same open=(prevOpen+prevClose)/2 rule `heikinAshi()` uses — avoids
      // re-running the transform over the whole history on every tick.
      const prevHA = indicators.heikinAshiCandles?.at(-1) ?? null;
      const rawClose = (liveKline.open + liveKline.high + liveKline.low + liveKline.close) / 4;
      const rawOpen = prevHA ? (prevHA.open + prevHA.close) / 2 : (liveKline.open + liveKline.close) / 2;
      candleSeriesRef.current.update({
        time: liveKline.time as Time,
        open: rawOpen,
        high: Math.max(liveKline.high, rawOpen, rawClose),
        low: Math.min(liveKline.low, rawOpen, rawClose),
        close: rawClose,
      });
    } else {
      candleSeriesRef.current.update({
        time: liveKline.time as Time,
        open: liveKline.open,
        high: liveKline.high,
        low: liveKline.low,
        close: liveKline.close,
      });
    }
    if (toggles.volume) {
      volumeSeriesRef.current.update({
        time: liveKline.time as Time,
        value: liveKline.volume,
        color: liveKline.close >= liveKline.open ? "#22c55e40" : "#ef444440",
      });
    }
  }, [liveKline, toggles.volume, toggles.heikinAshi, indicators.heikinAshiCandles]);

  // 4. Position + pending order price lines.
  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    if (!candleSeries) return;
    const lines: IPriceLine[] = [];

    if (position) {
      lines.push(
        candleSeries.createPriceLine({
          price: position.entryPrice,
          color: "#3ba8ff",
          lineWidth: 1,
          lineStyle: 0,
          axisLabelVisible: true,
          title: `ENTRADA ${position.side === "buy" ? "▲" : "▼"}`,
        }),
      );
      if (position.stopLoss !== null) {
        lines.push(
          candleSeries.createPriceLine({
            price: position.stopLoss,
            color: "#ef4444",
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: true,
            title: "SL",
          }),
        );
      }
      if (position.takeProfit !== null) {
        lines.push(
          candleSeries.createPriceLine({
            price: position.takeProfit,
            color: "#22c55e",
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: true,
            title: "TP",
          }),
        );
      }
    }

    for (const order of pendingOrders) {
      lines.push(
        candleSeries.createPriceLine({
          price: order.limitPrice,
          color: "#ffcf4d",
          lineWidth: 1,
          lineStyle: 3,
          axisLabelVisible: true,
          title: `LÍMITE ${order.side === "buy" ? "▲" : "▼"}`,
        }),
      );
    }

    for (const extra of extraPriceLines) {
      lines.push(
        candleSeries.createPriceLine({
          price: extra.price,
          color: extra.color,
          lineWidth: 1,
          lineStyle: extra.style ?? 0,
          axisLabelVisible: true,
          title: extra.title,
        }),
      );
    }

    return () => {
      try {
        for (const l of lines) candleSeries.removePriceLine(l);
      } catch {
        // chart already disposed — nothing to do.
      }
    };
  }, [position, pendingOrders, extraPriceLines]);

  return (
    <div className="relative w-full">
      <div ref={containerRef} className="w-full" />
      <VolumeProfileOverlay
        chart={chartRef.current}
        candleSeries={candleSeriesRef.current}
        candles={candles}
        visible={toggles.volumeProfile}
      />
    </div>
  );
}
