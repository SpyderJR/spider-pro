import type { AcademyLevelContent } from "./types";
import { NIVEL_01_FUNDAMENTOS } from "./nivel-01-fundamentos";
import { NIVEL_06_GESTION_DE_RIESGO } from "./nivel-06-gestion-de-riesgo";

/** Niveles sin contenido de lecciones todavía — quedan visibles en la ruta como "próximamente" (Bloque 12.5). */
function stub(
  id: string,
  order: number,
  title: string,
  description: string,
  difficulty: AcademyLevelContent["difficulty"],
  icon: string,
  recommendedBeforeId?: string,
): AcademyLevelContent {
  return { id, order, title, description, difficulty, icon, recommendedBeforeId, lessons: [], quiz: [] };
}

export const ACADEMY_LEVELS_V2: AcademyLevelContent[] = [
  NIVEL_01_FUNDAMENTOS,
  stub(
    "leer-el-grafico",
    2,
    "Leer el gráfico",
    "Anatomía de una vela japonesa, soporte y resistencia, tendencias y volumen.",
    "principiante",
    "🕯",
  ),
  stub(
    "patrones-de-velas",
    3,
    "Patrones de velas",
    "Velas de fuerza, indecisión, martillo/estrella fugaz y patrones de reversión — sin sobre-interpretarlos.",
    "principiante",
    "🎴",
  ),
  stub(
    "indicadores-tecnicos",
    4,
    "Indicadores técnicos",
    "Medias móviles, RSI, MACD, fractales — y la regla de oro de la confluencia.",
    "intermedio",
    "📊",
  ),
  stub(
    "estructura-y-fractales",
    5,
    "Estructura de mercado y fractales",
    "Higher highs/lower lows, BOS y CHoCH, el sistema Bill Williams completo.",
    "intermedio",
    "〽",
  ),
  NIVEL_06_GESTION_DE_RIESGO,
  stub(
    "psicologia-del-trading",
    7,
    "Psicología del trading",
    "FOMO, revenge trading, sesgos cognitivos, disciplina y por qué el diario es clave.",
    "intermedio",
    "🧠",
  ),
  stub(
    "contratos-y-apalancamiento",
    8,
    "Contratos y apalancamiento",
    "Spot vs futuros, long/short, margen, liquidación y funding — con el riesgo siempre al frente.",
    "avanzado",
    "⚖️",
    "gestion-de-riesgo",
  ),
  stub(
    "on-chain-y-fundamentos",
    9,
    "On-chain y fundamentos",
    "Análisis on-chain simple, halvings, M2 y liquidez global, stablecoins y cómo leer noticias.",
    "intermedio",
    "⛓",
  ),
  stub(
    "estrategias-completas",
    10,
    "Estrategias completas y tu plan",
    "Cómo se ve una operación de principio a fin — y cómo construir tu propio plan de trading.",
    "avanzado",
    "🎓",
  ),
];
