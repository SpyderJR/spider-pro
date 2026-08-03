import { layoutCandles, makeCandles, type SimCandle } from "../../../lib/svgCandles";
import { CandleLayer } from "../CandleLayer";

function buildSwings(): SimCandle[] {
  const seg1 = makeCandles(5, { start: 106, volatility: 1.1, drift: -0.7, seed: 21 });
  const seg2 = makeCandles(5, { start: seg1.at(-1)!.close, volatility: 1.1, drift: 1.0, seed: 22 });
  const seg3 = makeCandles(4, { start: seg2.at(-1)!.close, volatility: 1.1, drift: -0.6, seed: 23 });
  const seg4 = makeCandles(4, { start: seg3.at(-1)!.close, volatility: 1.1, drift: 0.85, seed: 24 });
  return [...seg1, ...seg2, ...seg3, ...seg4];
}

const CANDLES = buildSwings();

function extremeIndex(candles: SimCandle[], start: number, end: number, mode: "low" | "high"): number {
  let bestIdx = start;
  let bestVal = mode === "low" ? Infinity : -Infinity;
  for (let i = start; i <= end; i++) {
    const v = mode === "low" ? candles[i]!.low : candles[i]!.high;
    if (mode === "low" ? v < bestVal : v > bestVal) {
      bestVal = v;
      bestIdx = i;
    }
  }
  return bestIdx;
}

const SWING_INDICES = [
  extremeIndex(CANDLES, 0, 1, "high"),
  extremeIndex(CANDLES, 2, 6, "low"),
  extremeIndex(CANDLES, 7, 10, "high"),
  extremeIndex(CANDLES, 11, 14, "low"),
  extremeIndex(CANDLES, 15, 17, "high"),
];

export function ZigzagDiagram() {
  const width = 620;
  const height = 200;
  const { layout, priceToY, indexToX } = layoutCandles(CANDLES, width, height, 20, 24);

  const points = SWING_INDICES.map((idx, i) => {
    const isHigh = i % 2 === 0;
    const price = isHigh ? CANDLES[idx]!.high : CANDLES[idx]!.low;
    return { x: indexToX(idx), y: priceToY(price) };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img">
      <text x={width / 2} y={16} textAnchor="middle" fill="#94a3b8" fontSize={11} fontFamily="monospace">
        ZIGZAG — CONECTA SOLO LOS GIROS MAYORES
      </text>
      <CandleLayer layout={layout} dim={CANDLES.map((_, i) => i).filter((i) => !SWING_INDICES.includes(i))} />
      <path d={pathD} fill="none" stroke="#3ba8ff" strokeWidth={2} strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#0e121b" stroke="#3ba8ff" strokeWidth={2} />
      ))}
    </svg>
  );
}
