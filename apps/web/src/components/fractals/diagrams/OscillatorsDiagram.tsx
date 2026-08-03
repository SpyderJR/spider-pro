import { layoutCandles, makeCandles, withOverrides } from "../../../lib/svgCandles";
import { CandleLayer } from "../CandleLayer";

const DOWN_LEG = withOverrides(makeCandles(8, { start: 104, volatility: 0.9, drift: -0.55, seed: 41 }), {
  7: { open: 99.8, high: 100.0, low: 97.8, close: 99.6 },
});
const UP_LEG = makeCandles(8, { start: DOWN_LEG.at(-1)!.close, volatility: 0.9, drift: 0.6, seed: 42 });
const CANDLES = [...DOWN_LEG, ...UP_LEG];

const WILLIAMS_R = [-30, -45, -58, -68, -75, -84, -90, -93, -88, -78, -65, -50, -38, -28, -20, -15];
const AO = [-1.2, -1.8, -2.4, -2.9, -3.1, -3.4, -3.0, -2.2, -0.8, 0.6, 1.4, 2.0, 2.5, 2.8, 3.0, 3.1];

export function OscillatorsDiagram() {
  const width = 620;
  const height = 250;
  const candleBandTop = 26;
  const candleBandBottom = 116;
  const wrBandTop = 128;
  const wrBandBottom = 176;
  const aoBandTop = 186;
  const aoBandBottom = 234;

  const { layout, indexToX } = layoutCandles(CANDLES, width, candleBandBottom - candleBandTop, 20, 0);
  const shiftedLayout = layout.map((c) => ({
    ...c,
    bodyTop: c.bodyTop + candleBandTop,
    bodyBottom: c.bodyBottom + candleBandTop,
    highY: c.highY + candleBandTop,
    lowY: c.lowY + candleBandTop,
  }));

  const wrToY = (v: number) => wrBandTop + ((0 - v) / 100) * (wrBandBottom - wrBandTop);
  const aoToY = (v: number) => aoBandTop + ((4 - v) / 8) * (aoBandBottom - aoBandTop);

  const wrPath = WILLIAMS_R.map((v, i) => `${i === 0 ? "M" : "L"} ${indexToX(i)} ${wrToY(v)}`).join(" ");
  const confluenceX = indexToX(8);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img">
      <text x={20} y={16} fill="#94a3b8" fontSize={10} fontFamily="monospace">VELAS</text>
      <CandleLayer layout={shiftedLayout} highlight={[7]} />

      <text x={20} y={wrBandTop - 4} fill="#94a3b8" fontSize={10} fontFamily="monospace">WILLIAMS %R</text>
      <rect x={20} y={wrBandTop} width={width - 40} height={(wrBandBottom - wrBandTop) * 0.2} fill="#ef4444" opacity={0.08} />
      <rect x={20} y={wrToY(-80)} width={width - 40} height={wrBandBottom - wrToY(-80)} fill="#22c55e" opacity={0.08} />
      <path d={wrPath} fill="none" stroke="#3ba8ff" strokeWidth={1.75} />
      <text x={width - 20} y={wrBandTop + 8} textAnchor="end" fill="#ef4444" fontSize={8} fontFamily="monospace">-20 sobrecompra</text>
      <text x={width - 20} y={wrBandBottom - 2} textAnchor="end" fill="#22c55e" fontSize={8} fontFamily="monospace">-80 sobreventa</text>

      <text x={20} y={aoBandTop - 4} fill="#94a3b8" fontSize={10} fontFamily="monospace">AWESOME OSCILLATOR</text>
      <line x1={20} x2={width - 20} y1={aoToY(0)} y2={aoToY(0)} stroke="#475569" strokeWidth={1} />
      {AO.map((v, i) => {
        const x = indexToX(i);
        const y0 = aoToY(0);
        const y1 = aoToY(v);
        return (
          <rect
            key={i}
            x={x - 6}
            y={Math.min(y0, y1)}
            width={12}
            height={Math.max(Math.abs(y1 - y0), 1)}
            fill={v >= 0 ? "#22c55e" : "#ef4444"}
          />
        );
      })}

      <line x1={confluenceX} x2={confluenceX} y1={candleBandTop} y2={aoBandBottom} stroke="#ffcf4d" strokeWidth={1} strokeDasharray="4 3" />
      <text x={confluenceX + 6} y={candleBandTop + 10} fill="#ffcf4d" fontSize={9} fontFamily="monospace">CONFLUENCIA</text>
    </svg>
  );
}
