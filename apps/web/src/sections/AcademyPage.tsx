import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { ACADEMY_LEVELS_V2 } from "../content/academy/levels";
import { useAcademyProgressStore } from "../store/academyProgressStore";
import { usePublishContext } from "../hooks/usePublishContext";

const DIFFICULTY_LABEL: Record<string, { text: string; cls: string }> = {
  principiante: { text: "PRINCIPIANTE", cls: "text-neon-green border-neon-green/30" },
  intermedio: { text: "INTERMEDIO", cls: "text-neon-gold border-neon-gold/30" },
  avanzado: { text: "AVANZADO", cls: "text-neon-red border-neon-red/30" },
};

export function AcademyPage() {
  const { progress, streakDays, touchVisit, overallPercent } = useAcademyProgressStore();

  useEffect(() => {
    touchVisit();
  }, [touchVisit]);

  usePublishContext("academia", {
    nivelesCompletados: ACADEMY_LEVELS_V2.filter((l) => progress[l.id]?.completed).length,
    totalNiveles: ACADEMY_LEVELS_V2.length,
    rachaDias: streakDays,
  });

  return (
    <div>
      <SectionHeader
        title="Academia"
        subtitle={`Un curso real de ${ACADEMY_LEVELS_V2.length} niveles — teoría, ejemplos y ejercicios que aplicás vos mismo, de cero a poder combinar estrategias completas en la Terminal.`}
      />

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <div className="panel p-4 flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <div className="text-[10px] font-mono text-slate-500">RACHA DE DÍAS</div>
            <div className="value-mono text-lg font-bold text-neon-gold">
              {streakDays} {streakDays === 1 ? "día" : "días"}
            </div>
          </div>
        </div>
        <div className="panel p-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-slate-500">PROGRESO GENERAL (NIVELES APROBADOS)</span>
            <span className="value-mono text-xs text-neon-green">{overallPercent()}%</span>
          </div>
          <div className="h-2 bg-void-soft rounded-full overflow-hidden">
            <div className="h-full bg-neon-green transition-all" style={{ width: `${overallPercent()}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {ACADEMY_LEVELS_V2.map((level, i) => {
          const lp = progress[level.id];
          const isCompleted = lp?.completed ?? false;
          const lessonsDone = lp?.lessonsCompleted.length ?? 0;
          const totalLessons = level.lessons.length;
          const hasContent = totalLessons > 0;
          const prevLevel = level.recommendedBeforeId
            ? ACADEMY_LEVELS_V2.find((l) => l.id === level.recommendedBeforeId)
            : ACADEMY_LEVELS_V2[i - 1];
          const prevDone = !prevLevel || (progress[prevLevel.id]?.completed ?? false);
          const diff = DIFFICULTY_LABEL[level.difficulty]!;

          const card = (
            <div
              className={`panel p-5 transition-colors ${
                isCompleted ? "border border-neon-green/30" : hasContent ? "hover:border-neon-blue/30" : "opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-void-soft border border-void-border flex items-center justify-center text-xl">
                  {level.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-mono text-slate-600">NIVEL {level.order}</span>
                    <span className={`badge text-[10px] ${diff.cls}`}>{diff.text}</span>
                    {isCompleted && <span className="badge text-neon-green border-neon-green/30 text-[10px]">✓ APROBADO</span>}
                    {!hasContent && <span className="badge text-slate-500 border-void-border text-[10px]">PRÓXIMAMENTE</span>}
                  </div>
                  <h2 className="text-lg font-bold text-white">{level.title}</h2>
                  <p className="text-sm text-slate-400 mt-1">{level.description}</p>
                  {hasContent && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="h-1.5 flex-1 max-w-[160px] bg-void-soft rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neon-blue transition-all"
                          style={{ width: `${totalLessons > 0 ? (lessonsDone / totalLessons) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {lessonsDone}/{totalLessons} lecciones
                      </span>
                      {lp && (
                        <span className={`text-[11px] font-mono ${isCompleted ? "text-neon-green" : "text-neon-gold"}`}>
                          · quiz {lp.bestScorePercent}%
                        </span>
                      )}
                    </div>
                  )}
                  {hasContent && !prevDone && (
                    <p className="text-[11px] text-neon-gold mt-2">
                      Sugerencia: completá "{prevLevel!.title}" primero — no es obligatorio, pero el orden ayuda.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );

          return hasContent ? (
            <Link key={level.id} to={`/app/academia/${level.id}`}>
              {card}
            </Link>
          ) : (
            <div key={level.id}>{card}</div>
          );
        })}
      </div>

      <Disclaimer text="Esta información es contexto educativo, no asesoría financiera (NFA — Not Financial Advice). Ninguna señal técnica es una recomendación de compra o venta." />
    </div>
  );
}
