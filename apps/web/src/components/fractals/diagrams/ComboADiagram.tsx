import { layoutCandles, makeCandles, withOverrides } from "../../../lib/svgCandles";
import { CandleLayer } from "../CandleLayer";
import { NumberBadge } from "../NumberBadge";

const BASE = withOverrides(makeCandles(13, { start: 100, volatility: 1.0, drift: 0.55, seed: 61 }), {
  4: { open: 101.5, high: 102.6, low: 100.4, close: 101.2 },
  5: { open: 101.2, high: 101.8, low: 100.0, close: 100.6 },
  6: { open: 100.6, high: 101.0, low: 99.6, close: 100.3 },
  9: { open: 103.0, high: 104.6, low: 102.6, close: 104.2 },
});
const CANDLES = BASE;

const FRACTAL_IDX = 5;
const BREAKOUT_IDX = 9;
const AO = [-0.4, -0.2, 0.1, 0.5, 0.3, -0.1, 0.4, 0.9, 1.3, 1.8, 2.2, 2.6, 3.0];

export function ComboADiagram() {
  const width = 640;
  const height = 300;
  const candleTop = 40;
  const candleBottom = 190;
  const aoTop = 210;
  const aoBottom = 270;

  const { layout, priceToY, indexToX } = layoutCandles(CANDLES, width, candleBottom - candleTop, 20, 0);
  const shifted = layout.map((c) => ({
    ...c,
    bodyTop: c.bodyTop + candleTop,
    bodyBottom: c.bodyBottom + candleTop,
    highY: c.highY + candleTop,
    lowY: c.lowY + candleTop,
  }));
  const shiftedPriceToY = (p: number) => priceToY(p) + candleTop;

  const jaw = CANDLES.map((_, i) => 99.2 + i * 0.42);
  const teeth = CANDLES.map((_, i) => 99.5 + i * 0.5);
  const lips = CANDLES.map((_, i) => 99.8 + i * 0.6);
  const linePath = (vals: number[]) => vals.map((v, i) => `${i === 0 ? "M" : "L"} ${indexToX(i)} ${shiftedPriceToY(v)}`).join(" ");

  const aoToY = (v: number) => aoTop + ((3.5 - v) / 7) * (aoBottom - aoTop);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img">
      <text x={width / 2} y={16} textAnchor="middle" fill="#94a3b8" fontSize={11} fontFamily="monospace">
        COMBO A — SISTEMA BILL WILLIAMS ORIGINAL
      </text>

      <path d={linePath(jaw)} fill="none" stroke="#3ba8ff" strokeWidth={1.5} />
      <path d={linePath(teeth)} fill="none" stroke="#ef4444" strokeWidth={1.5} />
      <path d={linePath(lips)} fill="none" stroke="#22c55e" strokeWidth={1.5} />
      <CandleLayer layout={shifted} highlight={[FRACTAL_IDX, BREAKOUT_IDX]} />

      <circle cx={indexToX(FRACTAL_IDX)} cy={shiftedPriceToY(CANDLES[FRACTAL_IDX]!.high)} r={10} fill="none" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="3 3" />
      <line
        x1={indexToX(BREAKOUT_IDX)}
        y1={shiftedPriceToY(CANDLES[BREAKOUT_IDX]!.high) - 4}
        x2={indexToX(BREAKOUT_IDX)}
        y2={shiftedPriceToY(CANDLES[FRACTAL_IDX]!.high)}
        stroke="#22c55e"
        strokeWidth={1}
        strokeDasharray="3 2"
      />

      <line x1={20} x2={width - 20} y1={aoToY(0)} y2={aoToY(0)} stroke="#475569" strokeWidth={1} />
      {AO.map((v, i) => {
        const x = indexToX(i);
        const y0 = aoToY(0);
        const y1 = aoToY(v);
        return <rect key={i} x={x - 6} y={Math.min(y0, y1)} width={12} height={Math.max(Math.abs(y1 - y0), 1)} fill={v >= 0 ? "#22c55e" : "#ef4444"} />;
      })}
      <text x={20} y={aoTop - 6} fill="#94a3b8" fontSize={9} fontFamily="monospace">AO</text>

      <NumberBadge n={1} x={indexToX(1)} y={shiftedPriceToY(jaw[1]!) + 18} label="Boca abierta" />
      <NumberBadge n={2} x={indexToX(FRACTAL_IDX) - 24} y={shiftedPriceToY(CANDLES[FRACTAL_IDX]!.high) - 18} label="Fractal" />
      <NumberBadge n={3} x={indexToX(BREAKOUT_IDX)} y={shiftedPriceToY(CANDLES[BREAKOUT_IDX]!.high) - 16} label="Ruptura" />
      <NumberBadge n={4} x={indexToX(11)} y={aoToY(AO[11]!) - 10} label="AO+" />
    </svg>
  );
}
