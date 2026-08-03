import { layoutCandles, makeCandles, withOverrides } from "../../../lib/svgCandles";
import { CandleLayer } from "../CandleLayer";

const PP = 100;
const R1 = 102;
const R2 = 104;
const S1 = 98;
const S2 = 96;

const DOWN_LEG = withOverrides(makeCandles(8, { start: 101, volatility: 0.85, drift: -0.5, seed: 31 }), {
  7: { open: 99.6, high: 99.8, low: 97.6, close: 99.3 },
});
const UP_LEG = makeCandles(6, { start: DOWN_LEG.at(-1)!.close, volatility: 0.9, drift: 0.75, seed: 32 });
const CANDLES = [...DOWN_LEG, ...UP_LEG];

const LEVELS: Array<{ label: string; value: number; color: string }> = [
  { label: "R2", value: R2, color: "#ef4444" },
  { label: "R1", value: R1, color: "#ef4444" },
  { label: "PP", value: PP, color: "#ffcf4d" },
  { label: "S1", value: S1, color: "#22c55e" },
  { label: "S2", value: S2, color: "#22c55e" },
];

export function PivotPointsDiagram() {
  const width = 620;
  const height = 230;
  const minPrice = S2 - 1;
  const maxPrice = R2 + 1;
  const { layout, priceToY, indexToX } = layoutCandles(CANDLES, width, height, 20, 20, { minPrice, maxPrice });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img">
      {LEVELS.map((lvl) => (
        <g key={lvl.label}>
          <line
            x1={20}
            x2={width - 20}
            y1={priceToY(lvl.value)}
            y2={priceToY(lvl.value)}
            stroke={lvl.color}
            strokeWidth={1}
            strokeDasharray="4 3"
            opacity={0.7}
          />
          <text x={width - 16} y={priceToY(lvl.value) + 3} fill={lvl.color} fontSize={10} fontFamily="monospace">
            {lvl.label}
          </text>
        </g>
      ))}
      <CandleLayer layout={layout} highlight={[7]} />
      <text x={indexToX(7)} y={priceToY(S1) + 34} textAnchor="middle" fill="#22c55e" fontSize={11} fontFamily="monospace" fontWeight="bold">
        REBOTE EN S1 ▲
      </text>
    </svg>
  );
}
