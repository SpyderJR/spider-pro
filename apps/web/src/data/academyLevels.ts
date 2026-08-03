export interface AcademyLevel {
  id: string;
  order: number;
  title: string;
  icon: string;
  description: string;
  topics: string[];
  relatedPages: { path: string; label: string }[];
  advanced?: boolean;
  /** Overrides the default "complete the previous level first" suggestion with a specific level id. */
  recommendedBeforeId?: string;
}

export const ACADEMY_LEVELS: AcademyLevel[] = [
  {
    id: "fundamentos",
    order: 1,
    title: "Fundamentos",
    icon: "🌱",
    description: "Qué es Bitcoin y TRON, cómo leer un precio, y el vocabulario básico que vas a necesitar en el resto de la Academia.",
    topics: [
      "Qué es una criptomoneda y por qué Bitcoin no depende de un banco central",
      "Qué es TRON y en qué se diferencia de Bitcoin",
      "Cómo leer un precio: cambio %, market cap, ATH",
      "Exchanges y wallets — dónde vive tu cripto",
    ],
    relatedPages: [
      { path: "/bitcoin", label: "Bitcoin" },
      { path: "/tron", label: "TRON" },
      { path: "/calculadora", label: "Calculadora" },
    ],
  },
  {
    id: "leer-grafico",
    order: 2,
    title: "Leer el Gráfico",
    icon: "🕯",
    description: "Velas japonesas, soportes y resistencias, y cómo identificar una tendencia a simple vista.",
    topics: [
      "Anatomía de una vela japonesa: cuerpo y mechas",
      "Qué son soporte y resistencia",
      "Tendencias alcistas, bajistas y rangos laterales",
      "Patrones de velas más comunes",
    ],
    relatedPages: [
      { path: "/velas-japonesas", label: "Velas Japonesas" },
      { path: "/analisis-tecnico", label: "Análisis Técnico" },
    ],
  },
  {
    id: "indicadores",
    order: 3,
    title: "Indicadores",
    icon: "📊",
    description: "RSI, medias móviles y fractales — las herramientas que traducen el precio a señales legibles.",
    topics: [
      "RSI: sobrecompra y sobreventa",
      "Medias móviles y cruces (Golden/Death Cross)",
      "Fractales de Bill Williams",
      "MACD y Awesome Oscillator",
    ],
    relatedPages: [
      { path: "/analisis-tecnico", label: "Análisis Técnico" },
      { path: "/fractales-estructura", label: "Fractales & Estructura" },
    ],
  },
  {
    id: "gestion-riesgo",
    order: 4,
    title: "Gestión de Riesgo",
    icon: "🛡",
    description: "La decisión que más importa en cada trade: cuánto arriesgar, y cómo tu cabeza puede sabotear ese plan.",
    topics: [
      "Tamaño de posición y % de riesgo por trade",
      "Ratio riesgo/beneficio y win rate mínimo",
      "Por qué una racha de pérdidas con riesgo alto quiebra cuentas",
      "Psicología: FOMO, revenge trading y aversión a la pérdida",
    ],
    relatedPages: [{ path: "/gestion-de-riesgo", label: "Gestión de Riesgo" }],
  },
  {
    id: "estrategias",
    order: 5,
    title: "Estrategias Completas",
    icon: "🎯",
    description: "Cómo combinar todo lo anterior en un sistema real — y practicarlo sin arriesgar dinero de verdad.",
    topics: [
      "El principio de las 3 capas: contexto, señal y confirmación",
      "Los 3 combos completos de Fractales & Estructura",
      "Practicar el sistema en la Terminal de paper trading",
      "Leer el feedback de cada trade cerrado",
    ],
    relatedPages: [
      { path: "/fractales-estructura#combinaciones", label: "Cómo combinarlos" },
      { path: "/terminal", label: "Terminal" },
    ],
  },
  {
    id: "contratos-apalancamiento",
    order: 6,
    title: "Contratos y Apalancamiento",
    icon: "⚖️",
    description: "Futuros, apalancamiento, margen y liquidación — con el riesgo siempre al frente. Nivel avanzado.",
    advanced: true,
    recommendedBeforeId: "gestion-riesgo",
    topics: [
      "Qué son los contratos y en qué se diferencian del spot",
      "Apalancamiento y margen: la tabla de multiplicación del riesgo",
      "Liquidación y cómo evitarla",
      "Funding, long/short en la práctica, y cuándo NO usar contratos",
    ],
    relatedPages: [
      { path: "/contratos", label: "Contratos" },
      { path: "/terminal", label: "Terminal (modo Futuros)" },
    ],
  },
];
