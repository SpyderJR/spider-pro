import { useEffect, useRef } from "react";
import type { OrderBookSnapshot } from "../../lib/binance/types";
import { pricePrecision } from "../../lib/format";

interface Props {
  orderBook: OrderBookSnapshot | null;
  /** Price band around the mid price to show, as a percentage each side. */
  bandPercent?: number;
  height?: number;
}

const BUCKET_COUNT = 48;

/**
 * Real order book depth from Binance, bucketed by price and rendered as a color-intensity
 * heatmap — not an aggregated cross-exchange liquidation map (that data doesn't exist free
 * anywhere). This is literally the depth of one exchange's book, nothing inferred.
 */
export function DepthHeatmap({ orderBook, bandPercent = 3, height = 260 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    if (!orderBook || orderBook.bids.length === 0 || orderBook.asks.length === 0) return;

    const bestBid = orderBook.bids[0]!.price;
    const bestAsk = orderBook.asks[0]!.price;
    const mid = (bestBid + bestAsk) / 2;
    const bandWidth = mid * (bandPercent / 100);
    const min = mid - bandWidth;
    const max = mid + bandWidth;
    const bucketSize = (max - min) / BUCKET_COUNT;

    const bidVolumes = new Array<number>(BUCKET_COUNT).fill(0);
    const askVolumes = new Array<number>(BUCKET_COUNT).fill(0);

    for (const level of orderBook.bids) {
      if (level.price < min || level.price > max) continue;
      const idx = Math.min(BUCKET_COUNT - 1, Math.max(0, Math.floor((level.price - min) / bucketSize)));
      bidVolumes[idx]! += level.qty;
    }
    for (const level of orderBook.asks) {
      if (level.price < min || level.price > max) continue;
      const idx = Math.min(BUCKET_COUNT - 1, Math.max(0, Math.floor((level.price - min) / bucketSize)));
      askVolumes[idx]! += level.qty;
    }

    const maxVolume = Math.max(...bidVolumes, ...askVolumes, 1e-9);
    const bucketPixelHeight = height / BUCKET_COUNT;

    for (let i = 0; i < BUCKET_COUNT; i++) {
      const y = height - (i + 1) * bucketPixelHeight;
      const bidVol = bidVolumes[i]!;
      const askVol = askVolumes[i]!;

      if (bidVol > 0) {
        const alpha = 0.15 + 0.65 * (bidVol / maxVolume);
        const barWidth = (bidVol / maxVolume) * width * 0.92;
        ctx.fillStyle = `rgba(57, 255, 156, ${alpha})`;
        ctx.fillRect(0, y, barWidth, Math.max(1, bucketPixelHeight - 1));
      }
      if (askVol > 0) {
        const alpha = 0.15 + 0.65 * (askVol / maxVolume);
        const barWidth = (askVol / maxVolume) * width * 0.92;
        ctx.fillStyle = `rgba(255, 59, 92, ${alpha})`;
        ctx.fillRect(width - barWidth, y, barWidth, Math.max(1, bucketPixelHeight - 1));
      }
    }

    const midY = height - ((mid - min) / (max - min)) * height;
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    const precision = pricePrecision(mid);
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
    ctx.textBaseline = "middle";
    ctx.fillText(mid.toFixed(precision), 4, midY - 8);
    ctx.textBaseline = "top";
    ctx.fillText(max.toFixed(precision), 4, 2);
    ctx.textBaseline = "bottom";
    ctx.fillText(min.toFixed(precision), 4, height - 2);
  }, [orderBook, bandPercent, height]);

  if (!orderBook) {
    return <div className="text-xs text-slate-500 text-center py-8">Cargando profundidad…</div>;
  }

  return <canvas ref={canvasRef} className="w-full block" style={{ height }} />;
}
