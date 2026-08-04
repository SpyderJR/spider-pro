export interface SectionMeta {
  path: string;
  label: string;
  icon: string;
}

export const SECTIONS: SectionMeta[] = [
  { path: "/app", label: "Spider Intelligence", icon: "◈" },
  { path: "/app/academia", label: "Academia", icon: "🎓" },
  { path: "/app/arcade", label: "Arcade", icon: "🕹" },
  { path: "/app/bitcoin", label: "Bitcoin", icon: "₿" },
  { path: "/app/tron", label: "TRON", icon: "◎" },
  { path: "/app/analisis-tecnico", label: "Análisis Técnico", icon: "📈" },
  { path: "/app/radar-de-trading", label: "Radar de Trading", icon: "📡" },
  { path: "/app/terminal", label: "Terminal", icon: "💹" },
  { path: "/app/backtester", label: "Backtester", icon: "🧪" },
  { path: "/app/gestion-de-riesgo", label: "Gestión de Riesgo", icon: "🛡" },
  { path: "/app/diario", label: "Diario de Trading", icon: "📔" },
  { path: "/app/velas-japonesas", label: "Velas Japonesas", icon: "🕯" },
  { path: "/app/fractales-estructura", label: "Fractales & Estructura", icon: "〽" },
  { path: "/app/estrategias", label: "Estrategias & Cómo Invertir", icon: "🧭" },
  { path: "/app/contratos", label: "Contratos", icon: "⚖️" },
  { path: "/app/halvings", label: "Halvings BTC", icon: "⏳" },
  { path: "/app/analisis-macro", label: "Análisis Macro", icon: "🏦" },
  { path: "/app/stablecoins", label: "Stablecoins TRON", icon: "💵" },
  { path: "/app/crashes", label: "Crashes Históricos", icon: "📉" },
  { path: "/app/roadmap", label: "TRON Roadmap", icon: "🗺" },
  { path: "/app/justin-sun", label: "Justin Sun", icon: "👤" },
  { path: "/app/calculadora", label: "Calculadora", icon: "🧮" },
  { path: "/app/glosario", label: "Glosario", icon: "📖" },
];

/**
 * Rutas planas donde vivía el dashboard antes de moverse a /app (Bloque 11.1) —
 * se mantienen como redirects 302 en App.tsx para no romper enlaces existentes
 * (bookmarks, links compartidos, etc.). No incluye "/" — esa ruta ahora es la landing pública.
 */
export const LEGACY_DASHBOARD_PATHS: string[] = SECTIONS.filter((s) => s.path !== "/app").map((s) =>
  s.path.replace(/^\/app/, ""),
);
