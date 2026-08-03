import { layoutCandles, type SimCandle } from "../../../lib/svgCandles";
import { CandleLayer } from "../CandleLayer";

const BULLISH: SimCandle[] = [
  { open: 101, high: 102, low: 99.0, close: 100.3 },
  { open: 100.3, high: 101, low: 98.0, close: 99.0 },
  { open: 99.0, high: 99.5, low: 96.0, close: 98.7 },
  { open: 98.7, high: 100, low: 97.2, close: 99.5 },
  { open: 99.5, high: 101, low: 98.0, close: 100.2 },
];

const BEARISH: SimCandle[] = [
  { open: 99, high: 101, low: 98.5, close: 100.5 },
  { open: 100.5, high: 102, low: 100, close: 101.5 },
  { open: 101.5, high: 104.5, low: 101, close: 102 },
  { open: 102, high: 103, low: 101, close: 101.2 },
  { open: 101.2, high: 102, low: 100, close: 100.8 },
];

function MiniFractalChart({
  candles,
  type,
}: {
  candles: SimCandle[];
  type: "bullish" | "bearish";
}) {
  const width = 260;
  const height = 170;
  const { layout, priceToY } = layoutCandles(candles, width, height, 20, 46);
  const center = layout[2]!;
  const markY = type === "bullish" ? center.lowY : center.highY;
  const isBullish = type === "bullish";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img">
      <text x={width / 2} y={20} textAnchor="middle" fill="#94a3b8" fontSize={11} fontFamily="monospace">
        {isBullish ? "FRACTAL ALCISTA" : "FRACTAL BAJISTA"}
      </text>
      <CandleLayer layout={layout} highlight={[2]} />
      <circle
        cx={center.cx}
        cy={markY}
        r={12}
        fill="none"
        stroke={isBullish ? "#22c55e" : "#ef4444"}
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />
      <line
        x1={center.cx}
        y1={markY + (isBullish ? 20 : -20)}
        x2={center.cx}
        y2={markY + (isBullish ? 14 : -14)}
        stroke={isBullish ? "#22c55e" : "#ef4444"}
        strokeWidth={2}
        markerEnd={isBullish ? "url(#arrowUp)" : "url(#arrowDown)"}
      />
      <text
        x={center.cx}
        y={height - 8}
        textAnchor="middle"
        fill={isBullish ? "#22c55e" : "#ef4444"}
        fontSize={12}
        fontFamily="monospace"
        fontWeight="bold"
      >
        {isBullish ? "▲ mínimo" : "▼ máximo"}
      </text>
      {/* index labels */}
      {layout.map((c, i) => (
        <text key={i} x={c.cx} y={priceToY(Math.min(...candles.map((k) => k.low))) + 14} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">
          {i + 1}
        </text>
      ))}
    </svg>
  );
}

export function FractalDiagram() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <svg width="0" height="0">
        <defs>
          <marker id="arrowUp" markerWidth="8" markerHeight="8" refX="4" refY="0" orient="auto">
            <path d="M0,4 L4,0 L8,4" fill="none" stroke="#22c55e" strokeWidth="1.5" />
          </marker>
          <marker id="arrowDown" markerWidth="8" markerHeight="8" refX="4" refY="8" orient="auto">
            <path d="M0,4 L4,8 L8,4" fill="none" stroke="#ef4444" strokeWidth="1.5" />
          </marker>
        </defs>
      </svg>
      <MiniFractalChart candles={BULLISH} type="bullish" />
      <MiniFractalChart candles={BEARISH} type="bearish" />
    </div>
  );
}
