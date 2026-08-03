import type { ReactNode } from "react";

interface Props {
  whatItMeasures: ReactNode;
  howToRead: ReactNode;
  example: ReactNode;
  whenToUse: ReactNode;
}

/** Consistent "professional teaching" explainer shown above each Radar de Trading tool. */
export function ToolExplainer({ whatItMeasures, howToRead, example, whenToUse }: Props) {
  return (
    <div className="panel p-5 mb-4">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-neon-blue mb-1.5">QUÉ MIDE</div>
            <div className="text-sm text-slate-300 leading-relaxed">{whatItMeasures}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-neon-gold mb-1.5">CÓMO LEERLO</div>
            <div className="text-sm text-slate-300 leading-relaxed">{howToRead}</div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-neon-green mb-1.5">EJEMPLO CONCRETO</div>
            <div className="text-sm text-slate-300 leading-relaxed">{example}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 mb-1.5">CUÁNDO USARLO (Y CUÁNDO NO)</div>
            <div className="text-sm text-slate-300 leading-relaxed">{whenToUse}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
