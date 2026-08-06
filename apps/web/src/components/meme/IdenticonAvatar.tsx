import { identiconParams } from "../../lib/meme/identicon";

interface Props {
  seed: string;
  size?: number;
  className?: string;
}

export function IdenticonAvatar({ seed, size = 40, className = "" }: Props) {
  const { hue, cells } = identiconParams(seed);
  const color = `hsl(${hue}, 70%, 60%)`;
  const cell = size / 5;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={`rounded-lg shrink-0 ${className}`}
      style={{ background: `hsl(${hue}, 45%, 14%)` }}
      role="img"
      aria-label="Avatar generado para este token"
    >
      {cells.map((row, r) =>
        row.map(
          (filled, c) =>
            filled && <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={color} />,
        ),
      )}
    </svg>
  );
}
