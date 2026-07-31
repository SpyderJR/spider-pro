export interface InvestorPhilosophy {
  name: string;
  apodo: string;
  filosofia: string;
}

export const INVESTOR_PHILOSOPHIES: InvestorPhilosophy[] = [
  {
    name: "Warren Buffett",
    apodo: "El Oráculo de Omaha",
    filosofia:
      "Invertir solo en lo que se entiende a fondo, con un margen de seguridad amplio, y pensar en décadas, no en días. Aunque históricamente escéptico de cripto, su principio de 'no perder dinero' aplica a cualquier activo.",
  },
  {
    name: "Michael Saylor",
    apodo: "MicroStrategy",
    filosofia:
      "Bitcoin como reserva de valor superior al efectivo a largo plazo. Convicción de acumulación estructural (DCA institucional) sin importar la volatilidad de corto plazo.",
  },
  {
    name: "Cathie Wood",
    apodo: "ARK Invest",
    filosofia:
      "Invertir en tecnologías disruptivas con horizontes de 5+ años, aceptando volatilidad extrema a cambio de exposición a un crecimiento exponencial potencial.",
  },
  {
    name: "Peter Lynch",
    apodo: "Fidelity Magellan",
    filosofia:
      "Invertir en lo que uno entiende y puede explicar en una frase simple. Aplicado a cripto: entender el caso de uso real detrás del token antes de comprarlo.",
  },
  {
    name: "Ray Dalio",
    apodo: "Bridgewater",
    filosofia:
      "Diversificación radical y gestión de riesgo por encima de la búsqueda de rendimiento. Cripto como una porción pequeña y calculada de un portafolio diversificado, nunca concentrado.",
  },
  {
    name: "Benjamin Graham",
    apodo: "El padre del value investing",
    filosofia:
      "Separar el precio del valor. El mercado es un 'mecanismo de votación' a corto plazo pero una 'balanza' a largo plazo — la disciplina y la paciencia superan la especulación.",
  },
];

export interface InvestmentStep {
  step: number;
  title: string;
  description: string;
}

export const INVESTMENT_GUIDE: InvestmentStep[] = [
  {
    step: 1,
    title: "Seguridad primero",
    description:
      "Usá autenticación de dos factores (2FA) en todos tus exchanges, contraseñas únicas por servicio y, para montos relevantes, una wallet fría (hardware wallet) fuera de línea.",
  },
  {
    step: 2,
    title: "DCA (Dollar-Cost Averaging)",
    description:
      "Comprar montos fijos a intervalos regulares en lugar de intentar acertar el mínimo del mercado — reduce el impacto de la volatilidad y el riesgo de mal timing.",
  },
  {
    step: 3,
    title: "Gestión de riesgo",
    description:
      "Nunca invertir más de lo que estás dispuesto a perder. Definí de antemano qué porcentaje de tu portafolio total destinás a cripto según tu tolerancia al riesgo.",
  },
  {
    step: 4,
    title: "Dónde comprar",
    description:
      "Preferí exchanges regulados y con buen historial de seguridad. Para montos grandes, considerá retirar a una wallet propia — 'not your keys, not your coins'.",
  },
  {
    step: 5,
    title: "DYOR (Do Your Own Research)",
    description:
      "Antes de invertir en cualquier activo, entendé su propuesta de valor, su equipo, su tokenomics y su competencia. No inviertas solo por hype de redes sociales.",
  },
  {
    step: 6,
    title: "Fiscalidad",
    description:
      "Las ganancias de cripto suelen estar sujetas a impuestos en la mayoría de las jurisdicciones. Llevá registro de tus operaciones y consultá a un contador especializado.",
  },
];
