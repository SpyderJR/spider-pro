import type { CandleLayout } from "../../lib/svgCandles";
import { CANDLE_UP, CANDLE_DOWN } from "../../lib/svgCandles";

export function CandleLayer({
  layout,
  highlight,
  dim,
}: {
  layout: CandleLayout[];
  /** Indices to draw at full opacity + slightly wider body, e.g. the fractal's central candle. */
  highlight?: number[];
  /** Indices to fade out, to make the highlighted candles stand out more. */
  dim?: number[];
}) {
  return (
    <>
      {layout.map((c, i) => {
        const color = c.isUp ? CANDLE_UP : CANDLE_DOWN;
        const isHighlighted = highlight?.includes(i);
        const isDimmed = dim?.includes(i);
        const opacity = isDimmed ? 0.35 : 1;
        const widthMultiplier = isHighlighted ? 1.35 : 1;
        return (
          <g key={i} opacity={opacity}>
            <line x1={c.cx} x2={c.cx} y1={c.highY} y2={c.lowY} stroke={color} strokeWidth={1.5} />
            <rect
              x={c.cx - (c.bodyW * widthMultiplier) / 2}
              y={c.bodyTop}
              width={c.bodyW * widthMultiplier}
              height={c.bodyBottom - c.bodyTop}
              fill={color}
              rx={1}
              stroke={isHighlighted ? "#ffffff" : "none"}
              strokeWidth={isHighlighted ? 1 : 0}
            />
          </g>
        );
      })}
    </>
  );
}
