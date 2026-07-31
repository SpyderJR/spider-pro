interface LiveBadgeProps {
  live: boolean;
  source?: string;
}

export function LiveBadge({ live, source }: LiveBadgeProps) {
  if (live) {
    return (
      <span className="badge border-neon-green/40 text-neon-green">
        <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
        EN VIVO{source ? ` · ${source}` : ""}
      </span>
    );
  }
  return (
    <span className="badge border-neon-gold/40 text-neon-gold">
      <span className="w-1.5 h-1.5 rounded-full bg-neon-gold" />
      DATO DE REFERENCIA{source ? ` · ${source}` : ""}
    </span>
  );
}
