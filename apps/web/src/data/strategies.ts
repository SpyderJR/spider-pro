export interface StrategyDetail {
  id: string;
  name: string;
  icon: string;
  oneLine: string;
  howItWorks: string;
  example: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  horizon: "Corto plazo" | "Mediano plazo" | "Largo plazo";
  effort: "Bajo" | "Medio" | "Alto";
}

export const STRATEGIES: StrategyDetail[] = [
  {
    id: "dca",
    name: "DCA — Dollar-Cost Averaging",
    icon: "📆",
    oneLine: "Comprar un monto fijo a intervalos regulares, sin importar el precio del momento.",
    howItWorks:
      "En vez de intentar adivinar el mínimo del mercado (algo que ni los profesionales logran de forma consistente), destinás una suma fija — digamos $100 — a comprar el mismo activo cada semana o cada mes, siempre en la misma fecha, pase lo que pase con el precio. Cuando el precio está alto comprás menos unidades; cuando está bajo comprás más. Con el tiempo, tu precio promedio de compra tiende a suavizarse por debajo de los picos y por encima de los mínimos absolutos.",
    example:
      "Supongamos que invertís $100 por semana durante 10 semanas en un activo que se mueve así: $100, $90, $80, $70, $60, $70, $80, $90, $100, $110. Con DCA comprás $1000 en total y terminás con más unidades acumuladas en las semanas baratas ($60-$80) que en las caras — tu precio promedio de compra queda en $85, más bajo que el precio inicial ($100) y bastante por debajo del pico final ($110). Compará eso con invertir los $1000 de una sola vez en la semana 1: hubieras comprado todo a $100, peor precio promedio que el DCA en este escenario particular de mercado bajista-luego-recuperación.",
    pros: [
      "Elimina la presión psicológica de 'elegir el momento perfecto' — no existe timing perfecto consistente.",
      "Reduce el impacto de comprar todo justo antes de una caída fuerte.",
      "Fácil de automatizar y sostener en el tiempo, incluso para principiantes.",
    ],
    cons: [
      "En un mercado que sube de forma sostenida (alcista fuerte y prolongado), invertir todo de una vez (lump sum) históricamente rinde más que el DCA — estás pagando por reducir varianza, no por maximizar retorno esperado.",
      "Requiere disciplina para sostenerlo durante mercados bajistas prolongados, que es exactamente cuando más cuesta psicológicamente seguir comprando.",
    ],
    bestFor: "Quien no puede (o no quiere) dedicar tiempo a analizar el mercado, y prioriza reducir el riesgo de mal timing por sobre maximizar el retorno esperado.",
    horizon: "Largo plazo",
    effort: "Bajo",
  },
  {
    id: "value-averaging",
    name: "Value Averaging",
    icon: "⚖️",
    oneLine: "Variante de DCA donde ajustás el monto de cada compra según qué tan lejos esté tu portafolio de una meta de crecimiento fija.",
    howItWorks:
      "En vez de invertir siempre el mismo monto (como en DCA clásico), definís una meta de valor de portafolio que crece cada período (por ejemplo, +$100 por mes). Si el mercado cayó y tu portafolio vale menos de lo esperado, invertís más ese mes para 'ponerte al día' con la meta. Si el mercado subió y tu portafolio ya superó la meta, invertís menos (o incluso vendés el excedente). El efecto es comprar más agresivamente en las caídas y frenar en las subas, de forma sistemática y sin depender de una decisión emocional en el momento.",
    example:
      "Meta: que tu portafolio valga $100 al final del mes 1, $200 al final del mes 2, $300 al final del mes 3. Si en el mes 2 el mercado cayó y tu portafolio del mes 1 ahora vale solo $80, necesitás invertir $120 ese mes (no $100) para llegar a la meta de $200. Si en cambio el mercado subió y tu portafolio ya vale $150 antes de invertir nada, solo necesitás poner $50 para llegar a $200.",
    pros: [
      "Compra sistemáticamente más barato que el DCA clásico en promedio, porque reacciona a las caídas invirtiendo más.",
      "Sigue siendo una regla mecánica, no una decisión emocional en el momento.",
    ],
    cons: [
      "Más complejo de calcular y sostener que el DCA simple — requiere llevar registro del valor del portafolio cada período.",
      "En mercados alcistas muy fuertes puede llevar a invertir montos muy chicos (o vender), perdiendo exposición justo cuando el activo sigue subiendo.",
    ],
    bestFor: "Quien ya está cómodo con DCA y quiere una versión más activa, sin llegar a un análisis técnico completo.",
    horizon: "Largo plazo",
    effort: "Medio",
  },
  {
    id: "hodl",
    name: "HODL (Buy & Hold)",
    icon: "💎",
    oneLine: "Comprar y no vender durante años, ignorando la volatilidad de corto y mediano plazo.",
    howItWorks:
      "La estrategia más simple de todas: comprás el activo en el que tenés convicción de largo plazo y lo mantenés sin importar las caídas del 30%, 50% o incluso 80% que la historia de cripto ha mostrado repetidamente. La apuesta es que, si el activo sobrevive y crece estructuralmente en adopción a lo largo de varios años, el retorno de mantenerlo supera ampliamente el de intentar entrar y salir del mercado repetidamente.",
    example:
      "Alguien que compró BTC en el pico de diciembre de 2017 (~$19,700) vio su posición caer más del 80% en 2018. Quien vendió en pánico en ese momento cristalizó la pérdida. Quien sostuvo la posición sin vender vio el precio recuperar y superar ese máximo varios años después — el costo fue soportar años de drawdown severo sin garantía de que la recuperación fuera a ocurrir.",
    pros: [
      "Estrategia más simple de ejecutar — no requiere análisis técnico ni timing.",
      "Minimiza costos de transacción y evita el error común de vender en pánico y volver a comprar más caro.",
      "Se beneficia al máximo si la tesis de adopción de largo plazo se cumple.",
    ],
    cons: [
      "Expone a drawdowns muy profundos (históricamente 70-85% en ciclos bajistas de cripto) sin ningún mecanismo de protección.",
      "No hay garantía de que un activo específico se recupere — HODL en un proyecto que fracasa significa perder el capital sin haber tomado ninguna acción para limitarlo.",
    ],
    bestFor: "Quien tiene convicción de largo plazo fuerte sobre un activo específico y capacidad psicológica y financiera de sostener caídas profundas sin necesitar el capital en el corto plazo.",
    horizon: "Largo plazo",
    effort: "Bajo",
  },
  {
    id: "rebalanceo",
    name: "Rebalanceo de portafolio",
    icon: "🔄",
    oneLine: "Mantener porcentajes fijos entre activos (ej. 60% BTC / 30% TRX / 10% stablecoin) y ajustar periódicamente para volver a esos porcentajes.",
    howItWorks:
      "Definís de antemano qué % de tu portafolio querés en cada activo. Cada cierto tiempo (mensual, trimestral), revisás los porcentajes reales — que cambiaron porque unos activos subieron más que otros — y vendés una porción del que más creció para comprar del que se quedó atrás, volviendo a los porcentajes originales.",
    example:
      "Empezás con $1000: $600 en BTC (60%) y $400 en stablecoin (40%). Si BTC sube fuerte y tu portafolio pasa a valer $1000 en BTC + $400 en stable = $1400 total, ahora BTC es el 71% del portafolio. Rebalancear significa vender BTC por $160 (para volver al 60% = $840 de $1400) y quedarte con $560 en stablecoin (40%) — estás vendiendo parte de lo que subió y consolidando ganancia, de forma sistemática.",
    pros: [
      "Fuerza disciplina de 'vender caro, comprar barato' sin necesidad de predecir nada — es una consecuencia matemática del rebalanceo.",
      "Controla el riesgo de que un solo activo termine dominando el portafolio más de lo que originalmente querías.",
    ],
    cons: [
      "En una tendencia alcista muy fuerte y sostenida de un activo, rebalancear te hace vender ganadores demasiado pronto, reduciendo el retorno total comparado con simplemente sostener.",
      "Genera eventos fiscales (ventas) más seguido que una estrategia de comprar y mantener.",
    ],
    bestFor: "Quien tiene un portafolio con más de un activo y prioriza el control de riesgo por sobre maximizar el retorno de un solo ganador.",
    horizon: "Mediano plazo",
    effort: "Medio",
  },
  {
    id: "toma-ganancias",
    name: "Toma de ganancias escalonada",
    icon: "🪜",
    oneLine: "Vender porciones del activo en distintos niveles de precio predefinidos, en vez de intentar vender todo en el techo exacto.",
    howItWorks:
      "Definís de antemano varios niveles de precio donde vas a vender una parte de tu posición — por ejemplo, 25% de la posición en cada uno de 4 niveles de precio crecientes. Nadie puede identificar el techo exacto de un ciclo de forma consistente; escalonar la salida reduce el arrepentimiento de vender todo demasiado pronto o de no vender nada y ver la posición devolverse toda la ganancia.",
    example:
      "Compraste a $30,000 con la idea de vender en la suba. Definís vender 25% en $45,000, 25% en $60,000, 25% en $75,000 y quedarte con el 25% final como posición de largo plazo sin fecha de venta. Si el precio nunca llega a $75,000, ya realizaste ganancias en los niveles anteriores. Si sigue subiendo mucho más allá de $75,000, todavía tenés el 25% restante expuesto a esa suba.",
    pros: [
      "Reduce el riesgo de 'todo o nada' en la decisión de venta.",
      "Psicológicamente más sostenible que intentar acertar el máximo exacto del ciclo.",
    ],
    cons: [
      "Requiere definir los niveles con anticipación y respetarlos — es fácil racionalizar no vender en el nivel planeado durante la euforia de un mercado alcista.",
      "Si el precio nunca alcanza los niveles definidos, la estrategia no se ejecuta nunca (hay que revisarla periódicamente).",
    ],
    bestFor: "Quien ya tiene una posición con ganancia no realizada y quiere un plan objetivo de salida, en vez de decidir en caliente durante la euforia o el pánico del mercado.",
    horizon: "Mediano plazo",
    effort: "Medio",
  },
  {
    id: "core-satellite",
    name: "Núcleo + Satélite (Core + Satellite)",
    icon: "🛰",
    oneLine: "Separar el portafolio en una parte grande de largo plazo (núcleo) y una parte chica más activa (satélite).",
    howItWorks:
      "Destinás la mayoría del capital (por ejemplo 80-90%) a una posición de convicción de largo plazo que casi no tocás (el 'núcleo', típicamente BTC u otro activo de mayor capitalización). El resto (10-20%) lo usás para posiciones más activas, tácticas o especulativas — practicar lectura técnica, operar rangos, o apostar a proyectos con mayor riesgo/potencial. Si el satélite sale mal, el daño está limitado por diseño; si sale bien, suma retorno extra sin poner en riesgo el núcleo.",
    example:
      "Portafolio de $10,000: $8,500 en BTC como núcleo, sin fecha de venta definida. $1,500 divididos en posiciones satélite — practicar la Terminal de Spider Pro con estrategias de fractales/estructura, o mantener otros activos con mayor volatilidad. Si el satélite completo se pierde, el impacto total en el portafolio es -15%, no -100%.",
    pros: [
      "Permite explorar estrategias más activas o especulativas sin arriesgar la totalidad del capital.",
      "Combina lo mejor de la simplicidad del HODL con la posibilidad de aprender/experimentar de forma acotada.",
    ],
    cons: [
      "Requiere definir con disciplina cuál es el límite del satélite y no dejar que crezca 'porque está funcionando bien' — eso diluye el propósito de la separación.",
    ],
    bestFor: "Quien quiere aprender trading activo (por ejemplo practicando primero en la Terminal de paper trading) sin poner en riesgo la mayoría de su capital de largo plazo.",
    horizon: "Largo plazo",
    effort: "Medio",
  },
];

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
    title: "Elegí una estrategia antes de comprar",
    description:
      "Decidí de antemano si vas a hacer DCA, HODL, rebalanceo, o una combinación — antes de poner el primer dólar. Decidir en caliente, después de ver el precio moverse, es la forma más común de terminar con un plan improvisado.",
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
