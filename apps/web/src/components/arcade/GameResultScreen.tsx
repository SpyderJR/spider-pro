interface Props {
  scorePercent: number;
  headline: string;
  detail: string;
  onRetry: () => void;
  onExit: () => void;
}

export function GameResultScreen({ scorePercent, headline, detail, onRetry, onExit }: Props) {
  const good = scorePercent >= 70;
  return (
    <div className="panel p-6 text-center">
      <div className={`text-3xl font-bold mb-2 ${good ? "text-neon-green" : "text-neon-gold"}`}>{scorePercent}%</div>
      <div className="text-sm text-white font-medium mb-1">{headline}</div>
      <div className="text-sm text-slate-400 mb-5">{detail}</div>
      <div className="flex gap-2 justify-center">
        <button onClick={onRetry} className="px-4 py-2 rounded-lg text-sm font-mono border border-void-border text-slate-300 hover:border-neon-blue/50">
          Jugar de nuevo
        </button>
        <button onClick={onExit} className="px-4 py-2 rounded-lg text-sm font-mono border border-neon-green/40 text-neon-green">
          Volver al menú
        </button>
      </div>
    </div>
  );
}
