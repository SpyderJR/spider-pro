export type ArcadeGameId =
  | "sube-o-baja"
  | "caza-el-fractal"
  | "el-impostor"
  | "stop-loss-perfecto"
  | "que-crash-es"
  | "sobrevive-los-20"
  | "la-liquidacion";

export interface ArcadeGameMeta {
  id: ArcadeGameId;
  name: string;
  description: string;
  icon: string;
  duration: string;
  skill: string;
  skillPage: string;
}

export const ARCADE_GAMES: ArcadeGameMeta[] = [
  {
    id: "sube-o-baja",
    name: "Sube o Baja",
    description: "Mirá el gráfico y predecí si la próxima vela cierra arriba o abajo. 3 vidas, 20 rondas, racha multiplica puntos.",
    icon: "📈",
    duration: "2 min",
    skill: "Lectura de velas",
    skillPage: "/velas-japonesas",
  },
  {
    id: "caza-el-fractal",
    name: "Caza el Fractal",
    description: "Encontrá la vela que forma un fractal confirmado antes de que se acabe el tiempo. Cuidado con las trampas.",
    icon: "〽",
    duration: "2 min",
    skill: "Fractales y estructura",
    skillPage: "/fractales-estructura",
  },
  {
    id: "el-impostor",
    name: "El Impostor",
    description: "3 gráficos, uno es puro ruido aleatorio. Encontrá al impostor antes de que se acabe el tiempo.",
    icon: "🎭",
    duration: "1 min",
    skill: "Análisis técnico",
    skillPage: "/analisis-tecnico",
  },
  {
    id: "stop-loss-perfecto",
    name: "Stop Loss Perfecto",
    description: "Te damos una entrada. Colocá el SL donde corresponde y mirá qué pasa en las próximas 20 velas.",
    icon: "🛡",
    duration: "2 min",
    skill: "Gestión de riesgo",
    skillPage: "/gestion-de-riesgo",
  },
  {
    id: "que-crash-es",
    name: "¿Qué Crash Es?",
    description: "Un gráfico real, sin fechas ni precios. ¿Podés identificar qué crash histórico de cripto es?",
    icon: "📉",
    duration: "2 min",
    skill: "Contexto histórico",
    skillPage: "/crashes",
  },
  {
    id: "sobrevive-los-20",
    name: "Sobrevive los 20",
    description: "Arrancás con $1000. 20 escenarios históricos reales. Comprá, vendé o esperá — y no llegues a $0.",
    icon: "💀",
    duration: "3 min",
    skill: "Psicología y disciplina",
    skillPage: "/gestion-de-riesgo",
  },
  {
    id: "la-liquidacion",
    name: "La Liquidación",
    description: "30 días de mercado real. Elegí dirección y apalancamiento cada semana — y mirá si el ruido normal te liquida.",
    icon: "💥",
    duration: "2 min",
    skill: "Apalancamiento y liquidación",
    skillPage: "/contratos",
  },
];
