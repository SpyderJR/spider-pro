import { useMemo, useState } from "react";
import type { Exercise } from "../../../content/academy/types";
import { useKlines } from "../../../hooks/useMarketData";
import { layoutCandles, CANDLE_UP, CANDLE_DOWN } from "../../../lib/svgCandles";
import { detectFractals } from "../../../lib/fractals";

type Data = Extract<Exercise, { kind: "marcaGrafico" }>;

export function MarcaGrafico({ data, onSolved }: { data: Data; onSolved: () => void }) {
  const klines = useKlines(data.symbol, data.interval, data.limit ?? 60);
  const candles = klines.data?.candles;
  const [clicked, setClicked] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  const fractals = useMemo(() => (candles ? detectFractals(candles, 2) : []), [candles]);
  const targetType = data.target === "fractalAlcista" ? "bullish" : "bearish";
  const validIndices = useMemo(() => new Set(fractals.filter((f) => f.type === targetType).map((f) => f.index)), [fractals, targetType]);

  if (klines.isLoading || !candles || candles.length === 0) {
    return (
      <div className="bg-void-soft rounded-xl p-4 border border-void-border text-sm text-slate-500">
        Cargando gráfico real…
      </div>
    );
  }

  const width = 700;
  const height = 220;
  const { layout } = layoutCandles(candles, width, height, 16, 20);

  function handleClick(index: number) {
    if (solved) return;
    setClicked(index);
    if (validIndices.has(index)) {
      setSolved(true);
      onSolved();
    }
  }

  return (
    <div className="bg-void-soft rounded-xl p-4 border border-void-border">
      <div className="text-[10px] font-mono font-bold tracking-widest text-neon-blue mb-2">MARCA EN EL GRÁFICO</div>
      <p className="text-sm text-white font-medium mb-3">{data.instruccion}</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img">
        {layout.map((c, i) => {
          const isValid = solved && validIndices.has(i);
          const isWrongClick = clicked === i && !validIndices.has(i);
          const color = isValid ? "#39ff9c" : isWrongClick ? "#ff3b5c" : c.isUp ? CANDLE_UP : CANDLE_DOWN;
          return (
            <g key={i} onClick={() => handleClick(i)} className="cursor-pointer">
              <rect x={c.cx - 9} y={0} width={18} height={height} fill="transparent" />
              <line x1={c.cx} y1={c.highY} x2={c.cx} y2={c.lowY} stroke={color} strokeWidth={1.5} />
              <rect x={c.cx - c.bodyW / 2} y={c.bodyTop} width={c.bodyW} height={c.bodyBottom - c.bodyTop} fill={color} />
              {isValid && <circle cx={c.cx} cy={c.highY - 8} r={4} fill="#39ff9c" />}
            </g>
          );
        })}
      </svg>
      {clicked !== null && (
        <div className="bg-void-panel rounded-lg p-3 mt-3 text-xs">
          {solved ? (
            <span className="text-neon-green font-semibold">¡Ahí está! Esa vela cumple la definición del fractal.</span>
          ) : (
            <span className="text-neon-red font-semibold">Esa no es — mira 2 velas antes y 2 después del punto que elegiste.</span>
          )}
        </div>
      )}
    </div>
  );
}
