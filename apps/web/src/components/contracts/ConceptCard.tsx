import type { ReactNode } from "react";

interface Props {
  icon: string;
  title: string;
  kidIllustration: ReactNode;
  kidText: string;
  seriousContent: ReactNode;
  numbersContent: ReactNode;
  large?: boolean;
}

export function ConceptCard({ icon, title, kidIllustration, kidText, seriousContent, numbersContent, large }: Props) {
  return (
    <div className={`panel p-6 mb-6 ${large ? "border-2 border-neon-red/40" : ""}`}>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-void-soft rounded-xl p-4">
          <div className="text-[10px] font-mono font-bold tracking-widest text-neon-gold mb-2">
            LA IDEA EN SIMPLE
          </div>
          {kidIllustration}
          <p className="text-sm text-slate-300 mt-3 leading-relaxed">{kidText}</p>
        </div>

        <div className="bg-void-soft rounded-xl p-4">
          <div className="text-[10px] font-mono font-bold tracking-widest text-neon-blue mb-2">AHORA EN SERIO</div>
          <div className="text-sm text-slate-300 leading-relaxed space-y-2">{seriousContent}</div>
        </div>

        <div className="bg-void-soft rounded-xl p-4">
          <div className="text-[10px] font-mono font-bold tracking-widest text-neon-green mb-2">LOS NÚMEROS</div>
          <div className="text-sm text-slate-300 leading-relaxed">{numbersContent}</div>
        </div>
      </div>
    </div>
  );
}
