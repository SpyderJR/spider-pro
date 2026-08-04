export interface RoadmapPhase {
  phase: number;
  name: string;
  period: string;
  /** El lema original de la fase, tal como TRON lo presentó en su whitepaper. */
  theme: string;
  description: string;
  /** Por qué esta fase importó para lo que TRON terminó siendo — no solo qué pasó, sino qué cambió. */
  whyItMatters: string;
  milestones: string[];
  active: boolean;
  progress: number;
}

export const TRON_ROADMAP: RoadmapPhase[] = [
  {
    phase: 1,
    name: "Exodus",
    period: "2018",
    theme: '"Liberar el contenido"',
    description:
      "La fase fundacional: TRON pasó de ser un proyecto de token ERC-20 sobre Ethereum a tener su propia blockchain independiente, con su propio mecanismo de consenso y su propio conjunto de validadores. El pitch original del whitepaper era ambicioso — descentralizar la distribución de contenido digital (video, juegos, redes sociales) para que los creadores no dependieran de plataformas centralizadas que se quedan con la mayor parte del valor.",
    whyItMatters:
      "Sin esta fase no existiría nada de lo que vino después: mudarse de Ethereum a una cadena propia significaba controlar por completo la velocidad y el costo de las transacciones — la base técnica que, años después, haría posible mover stablecoins casi gratis.",
    milestones: [
      "Lanzamiento de la mainnet de TRON, independiente de Ethereum",
      "Migración del token de ERC-20 a TRC-20 (nativo de la nueva cadena)",
      "Elección de los primeros 27 Super Representantes (SR) por votación DPoS",
      "Adquisición de BitTorrent Inc. — la primera gran jugada para sumar una base de usuarios masiva ya existente al ecosistema",
    ],
    active: false,
    progress: 100,
  },
  {
    phase: 2,
    name: "Odyssey",
    period: "2019",
    theme: '"Incentivar el contenido"',
    description:
      "Con la red ya funcionando, esta fase se enfocó en afinar el modelo económico: cómo se reparten las recompensas entre validadores y desarrolladores, y cómo se le cobra a un usuario por usar la red sin que sea una fricción constante. TRON adoptó un modelo de recursos (Bandwidth y Energy) en vez del \"gas\" tradicional — la mayoría de las transacciones simples terminan siendo gratis para el usuario si tiene suficiente Bandwidth disponible.",
    whyItMatters:
      "Este modelo de recursos, poco visible desde afuera, es la razón técnica por la que enviar USDT en TRON puede sentirse casi gratis comparado con pagar gas en Ethereum — una diferencia que terminaría siendo la ventaja competitiva más importante de la red.",
    milestones: [
      "Introducción del modelo de recursos Bandwidth/Energy en vez de gas por transacción",
      "Ajustes al esquema de recompensas para Super Representantes y votantes",
      "Mejoras de rendimiento y throughput de la red",
      "Crecimiento del ecosistema de DApps — juegos y aplicaciones de entretenimiento on-chain",
    ],
    active: false,
    progress: 100,
  },
  {
    phase: 3,
    name: "Great Voyage",
    period: "2020–2021",
    theme: '"Tokenizar el contenido"',
    description:
      "El punto de quiebre real de TRON como proyecto. Durante el boom de DeFi de 2020-2021, los usuarios buscaban desesperadamente alternativas a las comisiones de gas de Ethereum (que llegaron a costar más de $50 por transacción en los picos de congestión). TRON, con transferencias casi gratis, se convirtió en el destino natural para mover USDT — y el volumen de stablecoins en la red se disparó.",
    whyItMatters:
      "Es la fase donde TRON dejó de ser \"un proyecto más de contenido descentralizado\" y encontró su verdadero producto-mercado: no competir con Ethereum por contratos inteligentes complejos, sino ser la autopista más barata para mover dólares digitales.",
    milestones: [
      "Crecimiento explosivo de USDT-TRC20 emitido sobre TRON",
      "TRON se posiciona entre las redes líderes en volumen de transferencias de stablecoins a nivel global",
      "Lanzamiento de SUN.io, el exchange descentralizado (DEX) nativo del ecosistema",
      "Primeros pasos del ecosistema JUST (stablecoin USDJ, protocolos de préstamo)",
    ],
    active: false,
    progress: 100,
  },
  {
    phase: 4,
    name: "Apollo",
    period: "2022–2023",
    theme: '"Descentralizar el contenido"',
    description:
      "Con la base de usuarios de stablecoins ya establecida, TRON invirtió en construir una capa de finanzas descentralizadas (DeFi) real encima: mercados de préstamo, más liquidez en su DEX, y mejoras de escalabilidad para sostener el volumen creciente sin degradar la experiencia del usuario.",
    whyItMatters:
      "Esta fase transformó a TRON de \"solo un riel de transferencias\" a una red con infraestructura financiera on-chain propia — el TVL (valor total bloqueado) en sus protocolos DeFi dejó de ser marginal.",
    milestones: [
      "Crecimiento de JustLend como mercado de préstamos (lending/borrowing) sobre TRON",
      "Expansión de liquidez y pares de trading en SUN.io",
      "Mejoras de escalabilidad y estabilidad de la red bajo mayor carga de transacciones",
      "Más exchanges centralizados y wallets integran soporte nativo para TRC-20",
    ],
    active: false,
    progress: 100,
  },
  {
    phase: 5,
    name: "Star Trek",
    period: "2024–2025",
    theme: '"Autonomía del contenido"',
    description:
      "La fase actual. TRON consolidó su posición como una de las redes con mayor volumen de transferencias de stablecoins del mundo, compitiendo directamente con Ethereum por ese título pese a tener un enfoque de producto mucho más angosto. El foco pasó a la adopción institucional y a seguir profundizando la descentralización de la gobernanza de la red.",
    whyItMatters:
      "Es la fase donde \"funciona a gran escala\" deja de ser una promesa y se vuelve un hecho verificable en cadena todos los días — cientos de millones de cuentas y miles de millones de dólares en stablecoins circulando sobre la red, algo que puedes comprobar tú mismo en la pestaña Stablecoins TRON de esta app con datos reales de TronScan.",
    milestones: [
      "Consolidación como una de las redes líderes en volumen global de transferencias de USDT",
      "Mayor adopción institucional y de exchanges como riel de liquidación de stablecoins",
      "Continuidad del desarrollo de USDD, la stablecoin sobrecolateralizada nativa del ecosistema",
      "Mejoras continuas de gobernanza descentralizada vía el sistema de Super Representantes",
    ],
    active: true,
    progress: 55,
  },
  {
    phase: 6,
    name: "Eternity",
    period: "2026+",
    theme: '"Permanencia del contenido"',
    description:
      "La visión de largo plazo declarada por el proyecto: una infraestructura financiera descentralizada madura, interoperable con otras cadenas, y con casos de uso que van más allá de mover stablecoins — sin depender de ningún equipo central para seguir funcionando.",
    whyItMatters:
      "Es la prueba de fuego final de cualquier proyecto de blockchain: ¿puede la red seguir operando, gobernándose y evolucionando de forma sostenible sin que un solo equipo o fundador sea indispensable? Esta fase todavía no tiene hitos verificables en cadena — es una dirección declarada, no un hecho consumado.",
    milestones: [
      "Interoperabilidad cross-chain más profunda con otras blockchains principales",
      "Exploración de soluciones de escalado de capa 2",
      "Expansión de casos de uso reales más allá de pagos y transferencias de stablecoins",
      "Mayor autonomía de la gobernanza descentralizada frente al equipo fundador",
    ],
    active: false,
    progress: 0,
  },
];
