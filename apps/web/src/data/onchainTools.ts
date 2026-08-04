export type OnchainToolPricing = "gratis" | "freemium";

export interface OnchainTool {
  id: string;
  name: string;
  url: string;
  icon: string;
  description: string;
  chains: string[];
  pricing: OnchainToolPricing;
  /** Aclaración honesta cuando la capa gratuita es limitada — nunca se omite si aplica. */
  note?: string;
  /** Destacada primero por ser la más relevante para esta plataforma (TRON). */
  featured?: boolean;
}

/**
 * Directorio de herramientas on-chain gratuitas/freemium — estructura centralizada para
 * poder agregar más adelante sin tocar el componente. Ninguna se integra por API (todas
 * son de pago para eso); son enlaces a los sitios oficiales que el usuario abre por su cuenta.
 */
export const ONCHAIN_TOOLS: OnchainTool[] = [
  {
    id: "tronscan",
    name: "Tronscan",
    url: "https://tronscan.org",
    icon: "◎",
    description: "El explorador oficial de la red TRON: mira cualquier dirección, transacción o token TRX al detalle.",
    chains: ["TRON"],
    pricing: "gratis",
    featured: true,
  },
  {
    id: "etherscan",
    name: "Etherscan",
    url: "https://etherscan.io",
    icon: "◆",
    description: "El explorador de Ethereum — el estándar de la industria para leer transacciones y contratos inteligentes.",
    chains: ["Ethereum"],
    pricing: "gratis",
  },
  {
    id: "blockchain-explorer",
    name: "Blockchain.com Explorer",
    url: "https://www.blockchain.com/explorer",
    icon: "₿",
    description: "El explorador clásico de Bitcoin — direcciones, bloques y transacciones de la red original.",
    chains: ["Bitcoin"],
    pricing: "gratis",
  },
  {
    id: "defillama",
    name: "DeFiLlama",
    url: "https://defillama.com",
    icon: "▤",
    description: "TVL (valor total bloqueado) y datos de protocolos DeFi en decenas de cadenas — muy generoso en su capa gratuita.",
    chains: ["Multi-cadena"],
    pricing: "gratis",
  },
  {
    id: "arkham",
    name: "Arkham Intelligence",
    url: "https://intel.arkm.com",
    icon: "◈",
    description: "Visualizador de flujos de dinero y entidades etiquetadas (exchanges, fondos, ballenas conocidas) multi-cadena.",
    chains: ["BTC", "ETH", "TRON", "+más"],
    pricing: "freemium",
    note: "La visualización básica es gratis; los datos avanzados, alertas y la API requieren plan de pago.",
  },
  {
    id: "bubblemaps",
    name: "Bubblemaps",
    url: "https://bubblemaps.io",
    icon: "○",
    description: "Muestra la distribución de holders de un token como burbujas conectadas — útil para detectar concentración.",
    chains: ["ETH", "BSC", "+más"],
    pricing: "freemium",
    note: "Los mapas básicos son gratis; el análisis avanzado de conexiones requiere plan de pago.",
  },
  {
    id: "nansen",
    name: "Nansen",
    url: "https://www.nansen.ai",
    icon: "◇",
    description: "Etiquetado de carteras y seguimiento de \"smart money\" — una de las herramientas más potentes del sector.",
    chains: ["Multi-cadena"],
    pricing: "freemium",
    note: "Mayormente de pago — se incluye como referencia, la capa gratuita es muy limitada.",
  },
  {
    id: "glassnode",
    name: "Glassnode",
    url: "https://glassnode.com",
    icon: "▦",
    description: "Métricas on-chain avanzadas (flujos a exchanges, salud de red, actividad institucional) en gráficos históricos.",
    chains: ["BTC", "ETH", "+más"],
    pricing: "freemium",
    note: "Tiene gráficos gratuitos limitados; el histórico completo y las métricas avanzadas son de pago.",
  },
  {
    id: "dune",
    name: "Dune",
    url: "https://dune.com",
    icon: "▧",
    description: "Dashboards on-chain hechos por la comunidad usando SQL — miles de paneles ya armados para explorar gratis.",
    chains: ["Multi-cadena"],
    pricing: "freemium",
    note: "Explorar dashboards existentes es gratis; crear consultas propias con datos completos tiene límites en el plan gratuito.",
  },
];
