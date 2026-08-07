interface Props {
  emoji: string;
  color: string;
  size?: number;
}

export function WhaleAvatar({ emoji, color, size = 56 }: Props) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 border border-white/10"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        background: `radial-gradient(circle at 35% 30%, ${color}55, ${color}15)`,
      }}
    >
      {emoji}
    </div>
  );
}
