import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { Quiz } from "../components/academy/Quiz";
import { TermifiedText } from "../components/TermifiedText";
import { ACADEMY_LEVELS } from "../data/academyLevels";
import { QUIZZES } from "../data/quizzes";
import { useAcademyProgressStore } from "../store/academyProgressStore";
import { usePublishContext } from "../hooks/usePublishContext";

export function AcademyPage() {
  const { progress, streakDays, touchVisit, overallPercent } = useAcademyProgressStore();
  const [activeQuizLevel, setActiveQuizLevel] = useState<string | null>(null);

  useEffect(() => {
    touchVisit();
  }, [touchVisit]);

  usePublishContext("academia", {
    nivelesCompletados: ACADEMY_LEVELS.filter((l) => progress[l.id]?.completed).length,
    totalNiveles: ACADEMY_LEVELS.length,
    rachaDias: streakDays,
  });

  const activeQuiz = activeQuizLevel ? QUIZZES.find((q) => q.levelId === activeQuizLevel) : null;

  return (
    <div>
      <SectionHeader
        title="Academia"
        subtitle={`Una ruta de aprendizaje de ${ACADEMY_LEVELS.length} niveles, de cero a poder combinar estrategias completas en la Terminal.`}
      />

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <div className="panel p-4 flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <div className="text-[10px] font-mono text-slate-500">RACHA DE DÍAS</div>
            <div className="value-mono text-lg font-bold text-neon-gold">{streakDays} {streakDays === 1 ? "día" : "días"}</div>
          </div>
        </div>
        <div className="panel p-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-slate-500">PROGRESO GENERAL</span>
            <span className="value-mono text-xs text-neon-green">{overallPercent()}%</span>
          </div>
          <div className="h-2 bg-void-soft rounded-full overflow-hidden">
            <div className="h-full bg-neon-green transition-all" style={{ width: `${overallPercent()}%` }} />
          </div>
        </div>
      </div>

      {activeQuiz ? (
        <div className="mb-6">
          <Quiz quiz={activeQuiz} onClose={() => setActiveQuizLevel(null)} />
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {ACADEMY_LEVELS.map((level) => {
            const levelProgress = progress[level.id];
            const isCompleted = levelProgress?.completed ?? false;
            const previousLevel = level.recommendedBeforeId
              ? ACADEMY_LEVELS.find((l) => l.id === level.recommendedBeforeId)
              : ACADEMY_LEVELS.find((l) => l.order === level.order - 1);
            const previousCompleted = !previousLevel || (progress[previousLevel.id]?.completed ?? false);

            return (
              <div key={level.id} className={`panel p-5 ${isCompleted ? "border border-neon-green/30" : level.advanced ? "border border-neon-red/20" : ""}`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-void-soft border border-void-border flex items-center justify-center text-xl">
                      {level.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-600">NIVEL {level.order}</span>
                        {level.advanced && <span className="badge text-neon-red border-neon-red/30 text-[10px]">AVANZADO</span>}
                        {isCompleted && <span className="badge text-neon-green border-neon-green/30 text-[10px]">✓ COMPLETADO</span>}
                      </div>
                      <h2 className="text-lg font-bold text-white">{level.title}</h2>
                      <p className="text-sm text-slate-400 mt-1 max-w-xl">
                        <TermifiedText text={level.description} />
                      </p>
                    </div>
                  </div>
                  {levelProgress && (
                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-mono text-slate-500">MEJOR PUNTAJE</div>
                      <div className={`value-mono text-lg font-bold ${isCompleted ? "text-neon-green" : "text-neon-gold"}`}>
                        {levelProgress.bestScorePercent}%
                      </div>
                    </div>
                  )}
                </div>

                {!previousCompleted && (
                  <p className="text-[11px] text-neon-gold mt-3">
                    Sugerencia: completá "{previousLevel!.title}" primero — no es obligatorio, pero el orden ayuda.
                  </p>
                )}

                <ul className="text-sm text-slate-400 list-disc list-inside mt-3 space-y-1">
                  {level.topics.map((t) => (
                    <li key={t}>
                      <TermifiedText text={t} />
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="text-[10px] font-mono text-slate-600">MATERIAL:</span>
                  {level.relatedPages.map((p) => (
                    <Link
                      key={p.path}
                      to={p.path}
                      className="text-xs font-mono px-2.5 py-1 rounded-md border border-void-border text-neon-blue hover:border-neon-blue/50"
                    >
                      {p.label} →
                    </Link>
                  ))}
                </div>

                <button
                  onClick={() => setActiveQuizLevel(level.id)}
                  className="mt-4 px-4 py-2 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green"
                >
                  {levelProgress ? "Reintentar quiz" : "Empezar quiz"} ({QUIZZES.find((q) => q.levelId === level.id)?.questions.length} preguntas)
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Disclaimer text="Esta información es contexto educativo, no asesoría financiera (NFA — Not Financial Advice). Ninguna señal técnica es una recomendación de compra o venta." />
    </div>
  );
}
