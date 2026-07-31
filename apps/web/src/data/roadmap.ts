export interface RoadmapPhase {
  phase: number;
  name: string;
  period: string;
  description: string;
  milestones: string[];
  active: boolean;
  progress: number;
}

export const TRON_ROADMAP: RoadmapPhase[] = [
  {
    phase: 1,
    name: "Exodus",
    period: "2018",
    description: "Establecimiento de la infraestructura descentralizada base y migración desde el token ERC-20 original.",
    milestones: ["Lanzamiento de la mainnet", "Migración de token ERC-20 a TRC-20", "Primeros super representantes (SR)"],
    active: false,
    progress: 100,
  },
  {
    phase: 2,
    name: "Odyssey",
    period: "2019",
    description: "Optimización del modelo de incentivos económicos y mejoras al mecanismo de consenso DPoS.",
    milestones: ["Ajustes al modelo de recompensas", "Mejoras de rendimiento de la red", "Expansión del ecosistema DApp"],
    active: false,
    progress: 100,
  },
  {
    phase: 3,
    name: "Great Voyage",
    period: "2020–2021",
    description: "Integración profunda con el ecosistema de stablecoins, en especial USDT-TRC20.",
    milestones: ["Crecimiento explosivo de USDT en TRON", "TRON se convierte en la red líder en transferencias de stablecoins", "Adquisición de BitTorrent"],
    active: false,
    progress: 100,
  },
  {
    phase: 4,
    name: "Apollo",
    period: "2022–2023",
    description: "Expansión de la infraestructura DeFi y contratos inteligentes con TVL creciente.",
    milestones: ["Crecimiento de JustLend y SUN.io", "Mejoras de escalabilidad", "Integración con más exchanges y wallets"],
    active: false,
    progress: 100,
  },
  {
    phase: 5,
    name: "Star Trek",
    period: "2024–2025",
    description: "Consolidación como la red dominante para stablecoins a nivel global y expansión institucional.",
    milestones: ["Dominancia global en volumen de transferencias USDT", "Mayor adopción institucional", "Mejoras continuas de gobernanza descentralizada"],
    active: true,
    progress: 55,
  },
  {
    phase: 6,
    name: "Eternity",
    period: "2026+",
    description: "Visión de largo plazo: TRON como infraestructura financiera descentralizada de referencia mundial.",
    milestones: ["Interoperabilidad cross-chain avanzada", "Escalado de capa 2", "Expansión de casos de uso más allá de pagos"],
    active: false,
    progress: 0,
  },
];
