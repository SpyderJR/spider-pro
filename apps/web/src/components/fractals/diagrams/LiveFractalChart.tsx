import { useMemo } from "react";
import { useKlines } from "../../../hooks/useMarketData";
import { layoutCandles } from "../../../lib/svgCandles";
import { detectFractals } from "../../../lib/fractals";
import { CandleLayer } from "../CandleLayer";
import { LiveBadge } from "../../LiveBadge";

export function LiveFractalChart() {
  const klines = useKlines("BTC", "4h", 60);
  const candles = klines.data?.candles;

  const fractals = useMemo(() => (candles ? detectFractals(candles, 2) : []), [candles]);

  if (klines.isLoading) {
    return <div className="text-center text-slate-500 text-sm py-10">Cargando velas reales de BTC 4h…</div>;
  }
  if (!candles || candles.length === 0) {
    return <div className="text-center text-slate-500 text-sm py-10">No se pudieron cargar velas en vivo ahora mismo.</div>;
  }

  const width = 900;
  const height = 260;
  const { layout, priceToY } = layoutCandles(candles, width, height, 20, 24);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-mono text-slate-500">BTC · 4h · últimas {candles.length} velas · fuente: {klines.data?.source}</div>
        <LiveBadge live source={klines.data?.source ?? "binance"} />
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img">
        <CandleLayer layout={layout} highlight={fractals.map((f) => f.index)} />
        {fractals.map((f) => {
          const y = priceToY(f.price);
          const x = layout[f.index]!.cx;
          const isBullish = f.type === "bullish";
          return (
            <g key={`${f.type}-${f.index}`}>
              <circle cx={x} cy={y} r={9} fill="none" stroke={isBullish ? "#22c55e" : "#ef4444"} strokeWidth={1.5} strokeDasharray="3 3" />
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-slate-500 mt-2">
        {fractals.length} fractales detectados automáticamente sobre datos reales de Binance/Bybit — el mismo
        algoritmo de 5 velas explicado abajo, corriendo en vivo sobre el gráfico de Bitcoin.
      </p>
    </div>
  );
}
