import { layoutCandles, makeCandles, withOverrides } from "../../../lib/svgCandles";
import { CandleLayer } from "../CandleLayer";
import { NumberBadge } from "../NumberBadge";

const S1 = 98;
const S2 = 96;
const PP = 100;

const DOWN_LEG = withOverrides(makeCandles(8, { start: 101, volatility: 0.85, drift: -0.5, seed: 71 }), {
  6: { open: 99.4, high: 99.6, low: 98.2, close: 99.0 },
  7: { open: 99.0, high: 99.3, low: 97.6, close: 98.9 },
});
const UP_LEG = makeCandles(5, { start: DOWN_LEG.at(-1)!.close, volatility: 0.85, drift: 0.7, seed: 72 });
const CANDLES = [...DOWN_LEG, ...UP_LEG];

const FRACTAL_IDX = 7;
const WILLIAMS_R = [-25, -40, -55, -68, -78, -86, -90, -94, -85, -70, -55, -40, -25];

export function ComboBDiagram() {
  const width = 620;
  const height = 290;
  const candleTop = 26;
  const candleBottom = 180;
  const wrTop = 200;
  const wrBottom = 260;

  const minPrice = S2 - 1;
  const maxPrice = PP + 3;
  const { layout, priceToY, indexToX } = layoutCandles(CANDLES, width, candleBottom - candleTop, 20, 0, { minPrice, maxPrice });
  const shifted = layout.map((c) => ({
    ...c,
    bodyTop: c.bodyTop + candleTop,
    bodyBottom: c.bodyBottom + candleTop,
    highY: c.highY + candleTop,
    lowY: c.lowY + candleTop,
  }));
  const shiftedPriceToY = (p: number) => priceToY(p) + candleTop;

  const wrToY = (v: number) => wrTop + ((0 - v) / 100) * (wrBottom - wrTop);
  const wrPath = WILLIAMS_R.map((v, i) => `${i === 0 ? "M" : "L"} ${indexToX(i)} ${wrToY(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img">
      <text x={width / 2} y={16} textAnchor="middle" fill="#94a3b8" fontSize={11} fontFamily="monospace">
        COMBO B — CONFLUENCIA DE NIVELES
      </text>

      {[
        { label: "PP", value: PP, color: "#ffcf4d" },
        { label: "S1", value: S1, color: "#22c55e" },
        { label: "S2", value: S2, color: "#22c55e" },
      ].map((lvl) => (
        <g key={lvl.label}>
          <line x1={20} x2={width - 20} y1={shiftedPriceToY(lvl.value)} y2={shiftedPriceToY(lvl.value)} stroke={lvl.color} strokeWidth={1} strokeDasharray="4 3" opacity={0.6} />
          <text x={width - 16} y={shiftedPriceToY(lvl.value) - 3} fill={lvl.color} fontSize={9} fontFamily="monospace">{lvl.label}</text>
        </g>
      ))}

      <CandleLayer layout={shifted} highlight={[FRACTAL_IDX]} />
      <circle cx={indexToX(FRACTAL_IDX)} cy={shiftedPriceToY(CANDLES[FRACTAL_IDX]!.low)} r={10} fill="none" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="3 3" />

      <text x={20} y={wrTop - 6} fill="#94a3b8" fontSize={9} fontFamily="monospace">WILLIAMS %R</text>
      <rect x={20} y={wrToY(-80)} width={width - 40} height={wrBottom - wrToY(-80)} fill="#22c55e" opacity={0.08} />
      <path d={wrPath} fill="none" stroke="#3ba8ff" strokeWidth={1.5} />

      <line x1={indexToX(FRACTAL_IDX)} x2={indexToX(FRACTAL_IDX)} y1={candleTop} y2={wrBottom} stroke="#ffcf4d" strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />

      <NumberBadge n={1} x={indexToX(2)} y={shiftedPriceToY(PP) - 10} label="Cae a S1" />
      <NumberBadge n={2} x={indexToX(FRACTAL_IDX) + 16} y={shiftedPriceToY(CANDLES[FRACTAL_IDX]!.low) + 18} label="Fractal en S1" />
      <NumberBadge n={3} x={indexToX(9)} y={wrToY(WILLIAMS_R[9]!) - 12} label="%R cruza -80" />
      <NumberBadge n={4} x={indexToX(12)} y={shiftedPriceToY(CANDLES.at(-1)!.close) - 14} label="Entrada" />
    </svg>
  );
}
