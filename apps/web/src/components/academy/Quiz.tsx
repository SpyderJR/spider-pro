import { useState } from "react";
import type { Quiz as QuizData } from "../../data/quizzes";
import { useAcademyProgressStore } from "../../store/academyProgressStore";

export function Quiz({ quiz, onClose }: { quiz: QuizData; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const recordQuizResult = useAcademyProgressStore((s) => s.recordQuizResult);

  const question = quiz.questions[index]!;
  const isLast = index === quiz.questions.length - 1;

  function handleSelect(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) setCorrectCount((c) => c + 1);
  }

  function handleNext() {
    if (isLast) {
      const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);
      recordQuizResult(quiz.levelId, scorePercent);
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  if (finished) {
    const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = scorePercent >= 80;
    return (
      <div className="panel p-6 text-center">
        <div className={`text-3xl font-bold mb-2 ${passed ? "text-neon-green" : "text-neon-gold"}`}>
          {scorePercent}%
        </div>
        <div className="text-sm text-slate-300 mb-4">
          {correctCount} de {quiz.questions.length} correctas —{" "}
          {passed ? "¡Aprobado! Superaste el 80% necesario." : "No llegaste al 80% necesario para aprobar este nivel."}
        </div>
        {!passed && (
          <p className="text-xs text-slate-500 mb-4">
            No hay ningún bloqueo — puedes seguir explorando la app igual. Pero te recomendamos repasar el
            material de este nivel antes de avanzar al siguiente.
          </p>
        )}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => {
              setIndex(0);
              setSelected(null);
              setCorrectCount(0);
              setFinished(false);
            }}
            className="px-4 py-2 rounded-lg text-sm font-mono border border-void-border text-slate-300 hover:border-neon-blue/50"
          >
            Reintentar
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-mono border border-neon-green/40 text-neon-green">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-mono text-slate-500">
          PREGUNTA {index + 1} DE {quiz.questions.length}
        </span>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm">
          ✕
        </button>
      </div>
      <div className="h-1 bg-void-soft rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-neon-green transition-all" style={{ width: `${(index / quiz.questions.length) * 100}%` }} />
      </div>

      <p className="text-white font-medium mb-4">{question.question}</p>

      <div className="space-y-2 mb-4">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctIndex;
          const isSelected = i === selected;
          let cls = "border-void-border text-slate-300 hover:border-slate-600";
          if (selected !== null) {
            if (isCorrect) cls = "border-neon-green/60 bg-neon-green/10 text-neon-green";
            else if (isSelected) cls = "border-neon-red/60 bg-neon-red/10 text-neon-red";
            else cls = "border-void-border text-slate-500";
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm border transition-colors ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="bg-void-soft rounded-lg p-3 mb-4 text-sm text-slate-400">{question.explanation}</div>
      )}

      <button
        onClick={handleNext}
        disabled={selected === null}
        className="w-full py-2.5 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green disabled:opacity-30"
      >
        {isLast ? "Ver resultado" : "Siguiente"}
      </button>
    </div>
  );
}
