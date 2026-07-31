import { useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { usePublishContext } from "../hooks/usePublishContext";
import { TRON_ROADMAP } from "../data/roadmap";

export function RoadmapPage() {
  const activePhase = TRON_ROADMAP.find((p) => p.active);
  const [expanded, setExpanded] = useState<number | null>(activePhase?.phase ?? null);

  usePublishContext("roadmap", { activePhase: activePhase?.name ?? null, progress: activePhase?.progress ?? null });

  return (
    <div>
      <SectionHeader
        title="TRON Roadmap"
        subtitle="Las 6 fases del roadmap del proyecto, con la fase activa expandida por defecto."
      />

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
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-500">FASE {phase.phase}</span>
                  <span className="font-semibold text-white">{phase.name}</span>
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
                  <p className="text-sm text-slate-400 mb-3">{phase.description}</p>
                  <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
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

      <Disclaimer text="El roadmap refleja el estado público conocido del proyecto y puede cambiar. No constituye asesoría de inversión (NFA)." />
    </div>
  );
}
