import { identiconParams } from "../../lib/meme/identicon";

interface Props {
  seed: string;
  size?: number;
  className?: string;
}

export function IdenticonAvatar({ seed, size = 40, className = "" }: Props) {
  const { hueA, hueB, angle, label } = identiconParams(seed);
  const gradientId = `meme-avatar-${seed.slice(0, 12)}-${size}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`rounded-lg shrink-0 ${className}`}
      role="img"
      aria-label="Avatar generado para este token"
    >
      <defs>
        <linearGradient id={gradientId} gradientTransform={`rotate(${angle})`}>
          <stop offset="0%" stopColor={`hsl(${hueA}, 70%, 45%)`} />
          <stop offset="100%" stopColor={`hsl(${hueB}, 70%, 32%)`} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="18" fill={`url(#${gradientId})`} />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontFamily="monospace"
        fontWeight="bold"
        fontSize="34"
        fill="rgba(255,255,255,0.85)"
      >
        {label}
      </text>
    </svg>
  );
}
