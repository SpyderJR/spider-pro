interface Props {
  steps: string[];
  lesson: string;
}

/** Compact "how to play + what you learn" box shown before a game session starts. */
export function HowToPlayBox({ steps, lesson }: Props) {
  return (
    <div className="bg-void-soft rounded-lg p-4 mb-4 border border-neon-blue/20">
      <div className="text-[10px] font-mono font-bold tracking-widest text-neon-blue mb-2">CÓMO SE JUEGA</div>
      <ul className="text-sm text-slate-300 list-disc list-inside space-y-1 mb-3">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
      <div className="text-[10px] font-mono font-bold tracking-widest text-neon-gold mb-1">QUÉ VAS A APRENDER</div>
      <p className="text-sm text-slate-400">{lesson}</p>
    </div>
  );
}
