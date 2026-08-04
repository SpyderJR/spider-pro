import type { ContentBlock } from "../../../content/academy/types";
import { useKlines } from "../../../hooks/useMarketData";
import { layoutCandles, CANDLE_UP, CANDLE_DOWN } from "../../../lib/svgCandles";

type Data = Extract<ContentBlock, { type: "graficoEjemplo" }>;

export function GraficoEjemplo({ data }: { data: Data }) {
  const klines = useKlines(data.symbol, data.interval, data.limit ?? 50);
  const candles = klines.data?.candles;

  if (klines.isLoading || !candles || candles.length === 0) {
    return <div className="text-center text-slate-500 text-sm py-8 bg-void-soft rounded-xl">Cargando gráfico real…</div>;
  }

  const width = 700;
  const height = 200;
  const { layout } = layoutCandles(candles, width, height, 14, 18);

  return (
    <div className="bg-void-soft rounded-xl p-4 border border-void-border">
      <div className="text-[10px] font-mono text-slate-500 mb-2">
        {data.symbol} · {data.interval} · datos reales
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img">
        {layout.map((c, i) => (
          <g key={i}>
            <line x1={c.cx} y1={c.highY} x2={c.cx} y2={c.lowY} stroke={c.isUp ? CANDLE_UP : CANDLE_DOWN} strokeWidth={1.5} />
            <rect x={c.cx - c.bodyW / 2} y={c.bodyTop} width={c.bodyW} height={c.bodyBottom - c.bodyTop} fill={c.isUp ? CANDLE_UP : CANDLE_DOWN} />
          </g>
        ))}
      </svg>
      {data.anotacion && <p className="text-xs text-slate-400 mt-2 leading-relaxed">{data.anotacion}</p>}
    </div>
  );
}
