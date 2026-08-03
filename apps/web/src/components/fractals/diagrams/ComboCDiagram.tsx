import { layoutCandles, makeCandles, type SimCandle } from "../../../lib/svgCandles";
import { CandleLayer } from "../CandleLayer";
import { NumberBadge } from "../NumberBadge";

function extremeIndex(candles: SimCandle[], start: number, end: number, mode: "low" | "high"): number {
  let bestIdx = start;
  let bestVal = mode === "low" ? Infinity : -Infinity;
  for (let i = start; i <= end && i < candles.length; i++) {
    const v = mode === "low" ? candles[i]!.low : candles[i]!.high;
    if (mode === "low" ? v < bestVal : v > bestVal) {
      bestVal = v;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function buildStructure(): SimCandle[] {
  const up1 = makeCandles(5, { start: 100, volatility: 0.9, drift: 0.75, seed: 81 });
  const pull1 = makeCandles(3, { start: up1.at(-1)!.close, volatility: 0.8, drift: -0.5, seed: 82 });
  const up2 = makeCandles(4, { start: pull1.at(-1)!.close, volatility: 0.9, drift: 0.8, seed: 83 });
  const choch = makeCandles(4, { start: up2.at(-1)!.close, volatility: 1.0, drift: -1.0, seed: 84 });
  const retrace = makeCandles(3, { start: choch.at(-1)!.close, volatility: 0.7, drift: 0.4, seed: 85 });
  return [...up1, ...pull1, ...up2, ...choch, ...retrace];
}

const CANDLES = buildStructure();
const HL1 = extremeIndex(CANDLES, 0, 2, "low");
const HH1 = extremeIndex(CANDLES, 3, 6, "high");
const HL2 = extremeIndex(CANDLES, 5, 8, "low");
const HH2 = extremeIndex(CANDLES, 8, 11, "high");
const CHOCH_IDX = extremeIndex(CANDLES, 12, 15, "low");
const ENTRY_IDX = CANDLES.length - 1;

const SWINGS = [HL1, HH1, HL2, HH2, CHOCH_IDX];

export function ComboCDiagram() {
  const width = 660;
  const height = 260;
  const { layout, priceToY, indexToX } = layoutCandles(CANDLES, width, height, 20, 40);

  const zigzagPath = SWINGS.map((idx, i) => {
    const isHigh = i % 2 === 1;
    const price = isHigh ? CANDLES[idx]!.high : CANDLES[idx]!.low;
    return `${i === 0 ? "M" : "L"} ${indexToX(idx)} ${priceToY(price)}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img">
      <text x={width / 2} y={16} textAnchor="middle" fill="#94a3b8" fontSize={11} fontFamily="monospace">
        COMBO C — ESTRUCTURA MODERNA
      </text>

      <path d={zigzagPath} fill="none" stroke="#3ba8ff" strokeWidth={1.5} strokeDasharray="5 3" opacity={0.7} />
      <CandleLayer layout={layout} highlight={[...SWINGS, ENTRY_IDX]} />

      {SWINGS.map((idx, i) => {
        const isHigh = i % 2 === 1;
        const price = isHigh ? CANDLES[idx]!.high : CANDLES[idx]!.low;
        return <circle key={i} cx={indexToX(idx)} cy={priceToY(price)} r={4} fill="#0e121b" stroke="#3ba8ff" strokeWidth={2} />;
      })}

      <text x={indexToX(CHOCH_IDX)} y={priceToY(CANDLES[CHOCH_IDX]!.low) + 30} textAnchor="middle" fill="#ffcf4d" fontSize={11} fontFamily="monospace" fontWeight="bold">
        CHoCH ⚠
      </text>
      <text x={indexToX(HH2)} y={priceToY(CANDLES[HH2]!.high) - 14} textAnchor="middle" fill="#22c55e" fontSize={11} fontFamily="monospace" fontWeight="bold">
        BOS ✓
      </text>

      <NumberBadge n={1} x={indexToX(HL1) - 6} y={priceToY(CANDLES[HL1]!.low) + 20} label="ZigZag = swings" />
      <NumberBadge n={2} x={indexToX(HH2) + 8} y={priceToY(CANDLES[HH2]!.high) - 30} label="Fractales" />
      <NumberBadge n={3} x={indexToX(CHOCH_IDX)} y={priceToY(CANDLES[CHOCH_IDX]!.low) + 44} label="CHoCH avisa" />
      <NumberBadge n={4} x={indexToX(ENTRY_IDX)} y={priceToY(CANDLES[ENTRY_IDX]!.close) - 16} label="Entrada" />
    </svg>
  );
}
