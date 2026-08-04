import { useEffect, useMemo, useRef, useState } from "react";
import type { ContentBlock, Lesson } from "../../content/academy/types";
import { exerciseIdsInLesson } from "../../content/academy/types";
import { TermifiedText } from "../TermifiedText";
import { Destacado } from "./blocks/Destacado";
import { Analogia } from "./blocks/Analogia";
import { Lista } from "./blocks/Lista";
import { Tabla } from "./blocks/Tabla";
import { Conecta } from "./blocks/Conecta";
import { GraficoEjemplo } from "./blocks/GraficoEjemplo";
import { DiagramaSVG } from "./blocks/DiagramaSVG";
import { OpcionMultiple } from "./exercises/OpcionMultiple";
import { VerdaderoFalso } from "./exercises/VerdaderoFalso";
import { Ordenar } from "./exercises/Ordenar";
import { Emparejar } from "./exercises/Emparejar";
import { CompletaEspacio } from "./exercises/CompletaEspacio";
import { CalculadoraGuiada } from "./exercises/CalculadoraGuiada";
import { MarcaGrafico } from "./exercises/MarcaGrafico";
import { RetoTerminal } from "./exercises/RetoTerminal";
import { RetoArcade } from "./exercises/RetoArcade";

function Block({ block, onExerciseSolved }: { block: ContentBlock; onExerciseSolved: (id: string) => void }) {
  switch (block.type) {
    case "titulo":
      return <h2 className="text-xl font-bold text-white mt-2">{block.texto}</h2>;
    case "subtitulo":
      return <h3 className="text-base font-bold text-white mt-1">{block.texto}</h3>;
    case "parrafo":
      return (
        <p className="text-sm text-slate-300 leading-relaxed">
          <TermifiedText text={block.texto} />
        </p>
      );
    case "destacado":
      return <Destacado data={block} />;
    case "analogia":
      return <Analogia data={block} />;
    case "lista":
      return <Lista data={block} />;
    case "diagramaSVG":
      return <DiagramaSVG data={block} />;
    case "graficoEjemplo":
      return <GraficoEjemplo data={block} />;
    case "tabla":
      return <Tabla data={block} />;
    case "tip":
      return (
        <div className="rounded-lg border border-neon-blue/20 bg-neon-blue/5 px-3.5 py-2.5 text-xs text-slate-300 flex gap-2">
          <span className="text-neon-blue">💡</span>
          <TermifiedText text={block.texto} />
        </div>
      );
    case "errorComun":
      return (
        <div className="rounded-lg border border-neon-red/20 bg-neon-red/5 px-3.5 py-2.5 text-xs text-slate-300 flex gap-2">
          <span className="text-neon-red">⚠</span>
          <span>
            <strong className="text-neon-red">Error común: </strong>
            <TermifiedText text={block.texto} />
          </span>
        </div>
      );
    case "conecta":
      return <Conecta data={block} />;
    case "ejercicio": {
      const ex = block.ejercicio;
      const onSolved = () => onExerciseSolved(ex.id);
      switch (ex.kind) {
        case "opcionMultiple":
          return <OpcionMultiple data={ex} onSolved={onSolved} />;
        case "verdaderoFalso":
          return <VerdaderoFalso data={ex} onSolved={onSolved} />;
        case "ordenar":
          return <Ordenar data={ex} onSolved={onSolved} />;
        case "emparejar":
          return <Emparejar data={ex} onSolved={onSolved} />;
        case "completaEspacio":
          return <CompletaEspacio data={ex} onSolved={onSolved} />;
        case "calculadoraGuiada":
          return <CalculadoraGuiada data={ex} onSolved={onSolved} />;
        case "marcaGrafico":
          return <MarcaGrafico data={ex} onSolved={onSolved} />;
        case "retoTerminal":
          return <RetoTerminal data={ex} onSolved={onSolved} />;
        case "retoArcade":
          return <RetoArcade data={ex} onSolved={onSolved} />;
        default:
          return null;
      }
    }
    default:
      return null;
  }
}

export function LessonRenderer({
  lesson,
  onComplete,
  isComplete,
}: {
  lesson: Lesson;
  onComplete: () => void;
  isComplete: boolean;
}) {
  const exerciseIds = useMemo(() => exerciseIdsInLesson(lesson), [lesson]);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const completedCalled = useRef(isComplete);

  // `onComplete` ultimately triggers a Zustand `set()` in academyProgressStore — calling it
  // from inside the `setSolved` functional updater would be "setState during another
  // component's state update", the same unsafe pattern fixed earlier in LaLiquidacion.tsx.
  // Keeping the updater pure and reacting to the resulting `solved` set in an effect avoids it.
  function handleExerciseSolved(id: string) {
    setSolved((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  useEffect(() => {
    if (exerciseIds.length > 0 && solved.size === exerciseIds.length && !completedCalled.current) {
      completedCalled.current = true;
      onComplete();
    }
  }, [solved, exerciseIds, onComplete]);

  const progressPercent = exerciseIds.length > 0 ? Math.round((solved.size / exerciseIds.length) * 100) : isComplete ? 100 : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono text-slate-500">
          {lesson.estimatedMinutes} min de lectura · {exerciseIds.length} ejercicio{exerciseIds.length === 1 ? "" : "s"}
        </span>
        <span className="text-[11px] font-mono text-neon-green">{isComplete ? 100 : progressPercent}%</span>
      </div>
      <div className="h-1.5 bg-void-soft rounded-full overflow-hidden mb-6">
        <div className="h-full bg-neon-green transition-all" style={{ width: `${isComplete ? 100 : progressPercent}%` }} />
      </div>

      <h1 className="text-2xl font-bold text-white mb-6">{lesson.title}</h1>

      <div className="space-y-5">
        {lesson.blocks.map((block, i) => (
          <Block key={i} block={block} onExerciseSolved={handleExerciseSolved} />
        ))}
      </div>

      {exerciseIds.length === 0 && !isComplete && (
        <button
          onClick={() => {
            completedCalled.current = true;
            onComplete();
          }}
          className="mt-8 w-full py-3 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green"
        >
          Marcar lección como leída
        </button>
      )}

      {isComplete && (
        <div className="mt-8 rounded-xl border border-neon-green/40 bg-neon-green/5 p-4 text-center text-sm text-neon-green font-semibold">
          ✓ Lección completada
        </div>
      )}
    </div>
  );
}
