import { layoutCandles, makeCandles } from "../../../lib/svgCandles";
import { CandleLayer } from "../CandleLayer";

const RANGE_PART = makeCandles(8, { start: 100, volatility: 1.3, drift: 0, seed: 11 });
const TREND_PART = makeCandles(16, {
  start: RANGE_PART[RANGE_PART.length - 1]!.close,
  volatility: 1.6,
  drift: 0.9,
  seed: 12,
});
const CANDLES = [...RANGE_PART, ...TREND_PART];

const JAW = [99, 99.3, 99.1, 99.6, 99.4, 99.8, 99.6, 100.0, 100.3, 100.6, 100.9, 101.1, 101.3, 101.5, 101.8, 102.2, 102.6, 103.0, 103.5, 104.0, 104.5, 105.0, 105.6, 106.2];
const TEETH = [99.2, 99.0, 99.4, 99.2, 99.7, 99.5, 99.9, 100.2, 100.7, 101.2, 101.6, 102.0, 102.4, 102.8, 103.3, 103.9, 104.5, 105.1, 105.8, 106.5, 107.2, 107.9, 108.6, 109.3];
const LIPS = [99.4, 99.6, 99.2, 99.5, 99.3, 99.7, 100.1, 100.5, 101.3, 102.1, 102.8, 103.4, 104.0, 104.6, 105.4, 106.3, 107.2, 108.1, 109.0, 109.9, 110.8, 111.6, 112.4, 113.2];

function pathFor(values: number[], indexToX: (i: number) => number, priceToY: (p: number) => number) {
  return values.map((v, i) => `${i === 0 ? "M" : "L"} ${indexToX(i)} ${priceToY(v)}`).join(" ");
}

export function AlligatorDiagram() {
  const width = 620;
  const height = 220;
  const allLinePrices = [...JAW, ...TEETH, ...LIPS];
  const minPrice = Math.min(...CANDLES.map((c) => c.low), ...allLinePrices) - 1;
  const maxPrice = Math.max(...CANDLES.map((c) => c.high), ...allLinePrices) + 1;
  const { layout, priceToY, indexToX } = layoutCandles(CANDLES, width, height, 20, 26, { minPrice, maxPrice });

  const zoneX1 = (indexToX(7) + indexToX(8)) / 2;
  const zoneX2 = (indexToX(13) + indexToX(14)) / 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img">
      <line x1={zoneX1} x2={zoneX1} y1={20} y2={height - 24} stroke="#1b2230" strokeWidth={1} strokeDasharray="3 3" />
      <line x1={zoneX2} x2={zoneX2} y1={20} y2={height - 24} stroke="#1b2230" strokeWidth={1} strokeDasharray="3 3" />

      <text x={zoneX1 / 2} y={16} textAnchor="middle" fill="#94a3b8" fontSize={10} fontFamily="monospace">DORMIDO</text>
      <text x={(zoneX1 + zoneX2) / 2} y={16} textAnchor="middle" fill="#ffcf4d" fontSize={10} fontFamily="monospace">DESPERTANDO</text>
      <text x={(zoneX2 + width) / 2} y={16} textAnchor="middle" fill="#22c55e" fontSize={10} fontFamily="monospace">COMIENDO</text>

      <CandleLayer layout={layout} />

      <path d={pathFor(JAW, indexToX, priceToY)} fill="none" stroke="#3ba8ff" strokeWidth={1.75} />
      <path d={pathFor(TEETH, indexToX, priceToY)} fill="none" stroke="#ef4444" strokeWidth={1.75} />
      <path d={pathFor(LIPS, indexToX, priceToY)} fill="none" stroke="#22c55e" strokeWidth={1.75} />

      <g transform={`translate(${width - 130}, ${height - 46})`} fontFamily="monospace" fontSize={10}>
        <rect x={-8} y={-14} width={140} height={54} fill="#0e121b" opacity={0.85} rx={6} />
        <line x1={0} y1={0} x2={16} y2={0} stroke="#3ba8ff" strokeWidth={2} />
        <text x={20} y={3} fill="#94a3b8">Mandíbula (13)</text>
        <line x1={0} y1={16} x2={16} y2={16} stroke="#ef4444" strokeWidth={2} />
        <text x={20} y={19} fill="#94a3b8">Dientes (8)</text>
        <line x1={0} y1={32} x2={16} y2={32} stroke="#22c55e" strokeWidth={2} />
        <text x={20} y={35} fill="#94a3b8">Labios (5)</text>
      </g>
    </svg>
  );
}
