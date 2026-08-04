import { useEffect, useRef } from "react";
import type { IChartApi, ISeriesApi } from "lightweight-charts";
import { volumeProfile } from "@spider/indicators";
import type { BinanceCandle } from "../../lib/binance/types";

interface Props {
  chart: IChartApi | null;
  candleSeries: ISeriesApi<"Candlestick"> | null;
  candles: BinanceCandle[];
  visible: boolean;
}

const BUCKET_COUNT = 24;
const MAX_BAR_FRACTION = 0.22; // fraction of the plot area's width the widest bar can occupy

export function VolumeProfileOverlay({ chart, candleSeries, candles, visible }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !chart || !candleSeries) return;

    function draw() {
      const container = canvas!.parentElement;
      if (!container) return;
      const ctx = canvas!.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = container.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      if (!visible || candles.length === 0) return;

      const range = chart!.timeScale().getVisibleLogicalRange();
      if (!range) return;
      const from = Math.max(0, Math.floor(range.from));
      const to = Math.min(candles.length - 1, Math.ceil(range.to));
      if (to <= from) return;

      const slice = candles.slice(from, to + 1);
      const profile = volumeProfile(slice, BUCKET_COUNT);
      if (!profile) return;

      const maxVolume = Math.max(...profile.levels.map((l) => l.volume));
      if (maxVolume <= 0) return;

      const plotWidth = chart!.timeScale().width();
      const maxBarWidth = plotWidth * MAX_BAR_FRACTION;

      const y0 = candleSeries!.priceToCoordinate(profile.levels[0]!.priceLevel);
      const y1 = candleSeries!.priceToCoordinate(profile.levels[1]?.priceLevel ?? profile.levels[0]!.priceLevel);
      const bucketPixelHeight = y0 !== null && y1 !== null ? Math.max(2, Math.abs(y1 - y0)) : 6;

      for (const level of profile.levels) {
        const y = candleSeries!.priceToCoordinate(level.priceLevel);
        if (y === null) continue;
        const barWidth = (level.volume / maxVolume) * maxBarWidth;
        const isPoc = level.priceLevel === profile.poc;
        ctx.fillStyle = isPoc ? "rgba(255, 207, 77, 0.55)" : "rgba(57, 255, 156, 0.22)";
        ctx.fillRect(plotWidth - barWidth, y - bucketPixelHeight / 2, barWidth, bucketPixelHeight * 0.86);
      }

      const pocY = candleSeries!.priceToCoordinate(profile.poc);
      if (pocY !== null) {
        ctx.strokeStyle = "rgba(255, 207, 77, 0.8)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(plotWidth - maxBarWidth, pocY);
        ctx.lineTo(plotWidth, pocY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    draw();
    const timeScale = chart.timeScale();
    timeScale.subscribeVisibleLogicalRangeChange(draw);
    window.addEventListener("resize", draw);

    return () => {
      try {
        timeScale.unsubscribeVisibleLogicalRangeChange(draw);
      } catch {
        // chart already disposed — nothing to unsubscribe from.
      }
      window.removeEventListener("resize", draw);
    };
  }, [chart, candleSeries, candles, visible]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}
