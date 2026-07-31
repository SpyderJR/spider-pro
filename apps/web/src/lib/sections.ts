export interface SectionMeta {
  path: string;
  label: string;
  icon: string;
}

export const SECTIONS: SectionMeta[] = [
  { path: "/", label: "Spider Intelligence", icon: "◈" },
  { path: "/bitcoin", label: "Bitcoin", icon: "₿" },
  { path: "/tron", label: "TRON", icon: "◎" },
  { path: "/analisis-tecnico", label: "Análisis Técnico", icon: "📈" },
  { path: "/radar-de-trading", label: "Radar de Trading", icon: "📡" },
  { path: "/velas-japonesas", label: "Velas Japonesas", icon: "🕯" },
  { path: "/estrategias", label: "Estrategias & Cómo Invertir", icon: "🧭" },
  { path: "/halvings", label: "Halvings BTC", icon: "⏳" },
  { path: "/m2-vs-mercado", label: "M2 vs Mercado", icon: "🏦" },
  { path: "/stablecoins", label: "Stablecoins TRON", icon: "💵" },
  { path: "/crashes", label: "Crashes Históricos", icon: "📉" },
  { path: "/roadmap", label: "TRON Roadmap", icon: "🗺" },
  { path: "/justin-sun", label: "Justin Sun", icon: "👤" },
  { path: "/calculadora", label: "Calculadora", icon: "🧮" },
];
