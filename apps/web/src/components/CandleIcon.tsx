import type { CandleOhlc } from "../data/candlePatterns";

/** Renders each pattern's actual OHLC values as SVG candles — no generic emoji stand-ins. */
export function CandleIcon({ candles, size = 64 }: { candles: CandleOhlc[]; size?: number }) {
  const allValues = candles.flatMap((c) => [c.high, c.low]);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;

  const width = size;
  const height = size;
  const padding = 6;
  const candleWidth = (width - padding * 2) / candles.length;

  const scaleY = (value: number) => height - padding - ((value - min) / range) * (height - padding * 2);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {candles.map((c, i) => {
        const cx = padding + candleWidth * i + candleWidth / 2;
        const isUp = c.close >= c.open;
        const color = isUp ? "#39ff9c" : "#ff3b5c";
        const bodyTop = scaleY(Math.max(c.open, c.close));
        const bodyBottom = scaleY(Math.min(c.open, c.close));
        const bodyHeight = Math.max(bodyBottom - bodyTop, 1.5);
        const bodyW = candleWidth * 0.5;

        return (
          <g key={i}>
            <line x1={cx} x2={cx} y1={scaleY(c.high)} y2={scaleY(c.low)} stroke={color} strokeWidth={1.5} />
            <rect
              x={cx - bodyW / 2}
              y={bodyTop}
              width={bodyW}
              height={bodyHeight}
              fill={color}
              rx={1}
            />
          </g>
        );
      })}
    </svg>
  );
}
