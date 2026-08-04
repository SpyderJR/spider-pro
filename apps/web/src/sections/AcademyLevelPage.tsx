import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { Quiz } from "../components/academy/Quiz";
import { LessonRenderer } from "../components/academy/LessonRenderer";
import { ACADEMY_LEVELS_V2 } from "../content/academy/levels";
import { useAcademyProgressStore } from "../store/academyProgressStore";
import { usePublishContext } from "../hooks/usePublishContext";

export function AcademyLevelPage() {
  const { levelId } = useParams<{ levelId: string }>();
  const level = ACADEMY_LEVELS_V2.find((l) => l.id === levelId);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const { progress, completeLesson, isLessonCompleted } = useAcademyProgressStore();

  usePublishContext("academia-nivel", { nivel: level?.id ?? null });

  if (!level) return <Navigate to="/app/academia" replace />;

  const lp = progress[level.id];
  const activeIndex = level.lessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson = activeIndex >= 0 ? level.lessons[activeIndex] : null;
  const nextLesson = activeIndex >= 0 ? level.lessons[activeIndex + 1] : null;
  const allLessonsDone = level.lessons.length > 0 && level.lessons.every((l) => isLessonCompleted(level.id, l.id));

  if (showQuiz) {
    return (
      <div>
        <SectionHeader title={`Quiz — ${level.title}`} subtitle="Necesitas 80% o más para aprobar el nivel. Puedes reintentar las veces que quieras." />
        <Quiz quiz={{ levelId: level.id, questions: level.quiz }} onClose={() => setShowQuiz(false)} />
        <Disclaimer />
      </div>
    );
  }

  if (activeLesson) {
    return (
      <div>
        <button onClick={() => setActiveLessonId(null)} className="text-xs font-mono text-slate-500 hover:text-neon-blue mb-4">
          ← Volver a {level.title}
        </button>
        <LessonRenderer
          lesson={activeLesson}
          isComplete={isLessonCompleted(level.id, activeLesson.id)}
          onComplete={() => completeLesson(level.id, activeLesson.id)}
        />
        <div className="max-w-2xl mx-auto mt-6 flex justify-between">
          <button onClick={() => setActiveLessonId(null)} className="text-sm font-mono text-slate-400 hover:text-white">
            ← Todas las lecciones
          </button>
          {nextLesson && (
            <button
              onClick={() => setActiveLessonId(nextLesson.id)}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green"
            >
              Siguiente lección →
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link to="/app/academia" className="text-xs font-mono text-slate-500 hover:text-neon-blue mb-4 inline-block">
        ← Todos los niveles
      </Link>
      <SectionHeader title={level.title} subtitle={level.description} />

      <div className="space-y-2 mb-6">
        {level.lessons.map((lesson, i) => {
          const done = isLessonCompleted(level.id, lesson.id);
          return (
            <button
              key={lesson.id}
              onClick={() => setActiveLessonId(lesson.id)}
              className={`w-full text-left panel p-4 flex items-center gap-3 hover:border-neon-blue/30 transition-colors ${
                done ? "border border-neon-green/30" : ""
              }`}
            >
              <span
                className={`w-7 h-7 shrink-0 rounded-full border flex items-center justify-center text-xs font-mono ${
                  done ? "border-neon-green/50 bg-neon-green/10 text-neon-green" : "border-void-border text-slate-500"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <div className="flex-1">
                <div className="text-sm text-white font-medium">{lesson.title}</div>
                <div className="text-[11px] text-slate-500">{lesson.estimatedMinutes} min</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="panel p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-sm font-semibold text-white mb-1">Quiz final del nivel</div>
            <p className="text-xs text-slate-500">
              {level.quiz.length} preguntas · necesitas 80% para aprobar
              {!allLessonsDone && " — se recomienda terminar todas las lecciones primero"}
            </p>
            {lp && (
              <p className="text-xs text-slate-500 mt-1">
                Mejor puntaje: <span className={lp.completed ? "text-neon-green" : "text-neon-gold"}>{lp.bestScorePercent}%</span>
              </p>
            )}
          </div>
          <button
            onClick={() => setShowQuiz(true)}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green"
          >
            {lp ? "Reintentar quiz" : "Empezar quiz"}
          </button>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
