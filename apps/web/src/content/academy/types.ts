import type { Timeframe } from "@spider/types";
import type { QuizQuestion } from "../../data/quizzes";

export type DestacadoVariant = "info" | "exito" | "advertencia";
export type ListaVariant = "buenas" | "errores" | "neutral";

export interface OpcionMultipleOption {
  texto: string;
  correcta: boolean;
  explicacion: string;
}

export interface CampoCalculadora {
  id: string;
  label: string;
  placeholder?: string;
  sufijo?: string;
}

export type Exercise =
  | { kind: "opcionMultiple"; id: string; pregunta: string; opciones: OpcionMultipleOption[] }
  | { kind: "verdaderoFalso"; id: string; enunciado: string; respuesta: boolean; explicacion: string }
  | { kind: "ordenar"; id: string; instruccion: string; items: { id: string; texto: string }[]; ordenCorrecto: string[] }
  | { kind: "emparejar"; id: string; instruccion: string; pares: { izquierda: string; derecha: string }[] }
  | {
      kind: "marcaGrafico";
      id: string;
      instruccion: string;
      symbol: string;
      interval: Timeframe;
      limit?: number;
      target: "fractalAlcista" | "fractalBajista";
    }
  | { kind: "completaEspacio"; id: string; plantilla: string; opciones: string[]; correcta: string }
  | {
      kind: "calculadoraGuiada";
      id: string;
      instruccion: string;
      campos: CampoCalculadora[];
      calcular: (valores: Record<string, number>) => number;
      unidad: string;
      tolerancia: number;
    }
  | { kind: "retoTerminal"; id: string; instruccion: string; challengeId: string }
  | { kind: "retoArcade"; id: string; instruccion: string; challengeId: string; gameId: string; gameLabel: string };

export type ContentBlock =
  | { type: "parrafo"; texto: string }
  | { type: "titulo"; texto: string }
  | { type: "subtitulo"; texto: string }
  | { type: "destacado"; variante: DestacadoVariant; titulo?: string; texto: string }
  | { type: "analogia"; texto: string }
  | { type: "lista"; variante: ListaVariant; items: string[] }
  | { type: "diagramaSVG"; diagrama: string; caption?: string }
  | { type: "graficoEjemplo"; symbol: string; interval: Timeframe; limit?: number; anotacion?: string }
  | { type: "tabla"; headers: string[]; filas: string[][] }
  | { type: "tip"; texto: string }
  | { type: "errorComun"; texto: string }
  | { type: "conecta"; label: string; to: string; descripcion: string }
  | { type: "ejercicio"; ejercicio: Exercise };

export interface Lesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  blocks: ContentBlock[];
}

export interface AcademyLevelContent {
  id: string;
  order: number;
  title: string;
  description: string;
  difficulty: "principiante" | "intermedio" | "avanzado";
  icon: string;
  recommendedBeforeId?: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

/** Ids de todos los ejercicios de una lección — usado para saber cuándo está 100% completa. */
export function exerciseIdsInLesson(lesson: Lesson): string[] {
  return lesson.blocks.filter((b) => b.type === "ejercicio").map((b) => (b as { ejercicio: Exercise }).ejercicio.id);
}
