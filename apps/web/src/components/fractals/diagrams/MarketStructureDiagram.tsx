import { layoutCandles, makeCandles, type SimCandle } from "../../../lib/svgCandles";
import { CandleLayer } from "../CandleLayer";

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
  const up1 = makeCandles(5, { start: 100, volatility: 0.9, drift: 0.75, seed: 51 });
  const pull1 = makeCandles(3, { start: up1.at(-1)!.close, volatility: 0.8, drift: -0.5, seed: 52 });
  const up2 = makeCandles(4, { start: pull1.at(-1)!.close, volatility: 0.9, drift: 0.8, seed: 53 });
  const choch = makeCandles(4, { start: up2.at(-1)!.close, volatility: 1.0, drift: -1.0, seed: 54 });
  const bos = makeCandles(3, { start: choch.at(-1)!.close, volatility: 0.9, drift: -0.7, seed: 55 });
  return [...up1, ...pull1, ...up2, ...choch, ...bos];
}

const CANDLES = buildStructure();

const HL1 = extremeIndex(CANDLES, 0, 2, "low");
const HH1 = extremeIndex(CANDLES, 3, 6, "high");
const HL2 = extremeIndex(CANDLES, 5, 8, "low");
const HH2 = extremeIndex(CANDLES, 8, 11, "high");
const CHOCH_IDX = extremeIndex(CANDLES, 12, 15, "low");
const BOS_IDX = extremeIndex(CANDLES, 16, 18, "low");

export function MarketStructureDiagram() {
  const width = 640;
  const height = 240;
  const { layout, priceToY, indexToX } = layoutCandles(CANDLES, width, height, 20, 46);

  const swingLabel = (idx: number, text: string, isHigh: boolean, color: string) => {
    const price = isHigh ? CANDLES[idx]!.high : CANDLES[idx]!.low;
    const y = priceToY(price) + (isHigh ? -10 : 16);
    return (
      <text key={text + idx} x={indexToX(idx)} y={y} textAnchor="middle" fill={color} fontSize={10} fontFamily="monospace" fontWeight="bold">
        {text}
      </text>
    );
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img">
      <CandleLayer layout={layout} highlight={[HL1, HH1, HL2, HH2, CHOCH_IDX, BOS_IDX]} />

      {swingLabel(HL1, "HL", false, "#3ba8ff")}
      {swingLabel(HH1, "HH", true, "#3ba8ff")}
      {swingLabel(HL2, "HL", false, "#3ba8ff")}
      {swingLabel(HH2, "HH", true, "#3ba8ff")}

      <line x1={indexToX(HL2)} x2={indexToX(HL2)} y1={20} y2={height - 20} stroke="#1b2230" strokeWidth={1} strokeDasharray="2 3" />
      <line x1={indexToX(HL2)} x2={width - 20} y1={priceToY(CANDLES[HL2]!.low)} y2={priceToY(CANDLES[HL2]!.low)} stroke="#ffcf4d" strokeWidth={1} strokeDasharray="4 3" opacity={0.6} />

      <text x={indexToX(CHOCH_IDX)} y={priceToY(CANDLES[CHOCH_IDX]!.low) + 30} textAnchor="middle" fill="#ffcf4d" fontSize={11} fontFamily="monospace" fontWeight="bold">
        CHoCH ⚠
      </text>
      <text x={indexToX(BOS_IDX)} y={priceToY(CANDLES[BOS_IDX]!.low) + 16} textAnchor="middle" fill="#ef4444" fontSize={11} fontFamily="monospace" fontWeight="bold">
        BOS ✓
      </text>

      <text x={width / 2} y={16} textAnchor="middle" fill="#94a3b8" fontSize={11} fontFamily="monospace">
        HH/HL EN TENDENCIA ALCISTA → CHoCH → BOS BAJISTA
      </text>
    </svg>
  );
}
