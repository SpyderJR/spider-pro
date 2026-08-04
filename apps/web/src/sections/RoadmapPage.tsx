import { useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { usePublishContext } from "../hooks/usePublishContext";
import { TRON_ROADMAP } from "../data/roadmap";

export function RoadmapPage() {
  const activePhase = TRON_ROADMAP.find((p) => p.active);
  const [expanded, setExpanded] = useState<number | null>(activePhase?.phase ?? null);

  usePublishContext("roadmap", { activePhase: activePhase?.name ?? null, progress: activePhase?.progress ?? null });

  const overallProgress = Math.round(TRON_ROADMAP.reduce((sum, p) => sum + p.progress, 0) / TRON_ROADMAP.length);

  return (
    <div>
      <SectionHeader
        title="TRON Roadmap"
        subtitle="Las 6 fases declaradas del proyecto — de fundar la red a que pueda sostenerse sola — con la fase activa expandida por defecto."
      />

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-2">Qué es un roadmap y cómo leer este</div>
        <p className="text-sm text-slate-400 leading-relaxed mb-3">
          Un roadmap es el plan de fases con el que un proyecto de blockchain comunica hacia dónde va y en qué
          orden. No es una promesa contractual ni un cronograma con fechas fijas garantizadas — es una dirección
          declarada por el equipo, y la forma correcta de leerlo es como contexto histórico y estratégico, no
          como una certeza sobre el futuro. Las primeras 4 fases de TRON (Exodus a Apollo) ya ocurrieron y se
          pueden verificar con hechos on-chain concretos; la fase activa (Star Trek) tiene evidencia parcial
          verificable hoy mismo — puedes comprobar el volumen real de stablecoins en la pestaña{" "}
          <span className="text-neon-green">Stablecoins TRON</span> de esta app; la última fase (Eternity) es
          todavía una visión declarada, sin hitos verificables en cadena.
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-void-soft rounded-full overflow-hidden">
            <div className="h-full bg-neon-green rounded-full" style={{ width: `${overallProgress}%` }} />
          </div>
          <span className="text-xs font-mono text-slate-400 shrink-0">{overallProgress}% del roadmap declarado como completo</span>
        </div>
      </div>

      <div className="space-y-3">
        {TRON_ROADMAP.map((phase) => {
          const isOpen = expanded === phase.phase;
          return (
            <div
              key={phase.phase}
              className={`panel border overflow-hidden ${phase.active ? "border-neon-green/40" : "border-void-border"}`}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : phase.phase)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs text-slate-500">FASE {phase.phase}</span>
                  <span className="font-semibold text-white">{phase.name}</span>
                  <span className="text-xs text-slate-500 italic">{phase.theme}</span>
                  <span className="text-xs text-slate-500">{phase.period}</span>
                  {phase.active && (
                    <span className="badge border-neon-green/40 text-neon-green">ACTIVA</span>
                  )}
                </div>
                <span className="text-slate-500">{isOpen ? "▲" : "▼"}</span>
              </button>

              <div className="px-5 pb-2">
                <div className="w-full h-1.5 bg-void-soft rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neon-green rounded-full"
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
              </div>

              {isOpen && (
                <div className="px-5 pb-5 pt-2">
                  <p className="text-sm text-slate-400 mb-3 leading-relaxed">{phase.description}</p>

                  <div className="bg-void-soft rounded-lg p-3 mb-3">
                    <div className="text-[10px] font-mono font-bold tracking-widest text-neon-gold mb-1.5">POR QUÉ IMPORTÓ</div>
                    <p className="text-sm text-slate-300 leading-relaxed">{phase.whyItMatters}</p>
                  </div>

                  <div className="text-[10px] font-mono font-bold tracking-widest text-neon-blue mb-1.5">HITOS DE ESTA FASE</div>
                  <ul className="text-sm text-slate-300 space-y-1.5 list-disc list-inside">
                    {phase.milestones.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Disclaimer text="El roadmap refleja el estado público conocido del proyecto, con fechas y fases declaradas por el equipo — puede cambiar sin aviso y las fases futuras no son promesas garantizadas. No constituye asesoría de inversión (NFA)." />
    </div>
  );
}
