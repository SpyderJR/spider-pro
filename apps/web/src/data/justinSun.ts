export interface TimelineEvent {
  year: string;
  event: string;
}

export interface RelationshipEntry {
  name: string;
  icon: string;
  summary: string;
}

export const JUSTIN_SUN_PROFILE = {
  name: "Justin Sun (孙宇晨)",
  born: "30 de julio de 1990, Qingyuan, provincia de Guangdong, China",
  education: "Licenciatura en Historia — Universidad de Pekín (2011); Máster en Estudios de Asia Oriental — Universidad de Pensilvania (2013)",
  role: "Fundador de la Fundación TRON, ex-Chief Representative de Ripple para la Gran China, inversor y asesor en múltiples proyectos cripto",

  origins: {
    title: "Los orígenes",
    paragraphs: [
      "Sun nació en 1990 en Qingyuan, una ciudad de la provincia de Guangdong, en el sur de China — la misma región que vio nacer a una generación de emprendedores tecnológicos chinos que llegarían a la adultez junto con el boom de internet del país.",
      "Es un dato de dominio público, repetido por el propio Sun en entrevistas, que durante sus años universitarios en Pekín cursó Historia — no Ingeniería ni Finanzas — antes de reorientar su carrera hacia la tecnología y las criptomonedas. Sun ha citado en varias ocasiones a Jack Ma (fundador de Alibaba) como una influencia temprana en su decisión de emprender.",
      "Ya en la Universidad de Pensilvania, mientras cursaba su máster, empezó a acercarse al mundo blockchain — un giro poco convencional para alguien formado en humanidades, y que él mismo ha usado como parte de su narrativa pública de 'outsider que se abrió camino' en un sector dominado por perfiles técnicos.",
    ],
    note: "Los detalles biográficos más personales de la infancia y la familia de Sun no están verificados de forma independiente más allá de lo que él mismo ha compartido públicamente — se presentan aquí con esa salvedad.",
  },

  timeline: [
    { year: "2011", event: "Se gradúa en Historia en la Universidad de Pekín." },
    { year: "2013", event: "Completa un máster en Estudios de Asia Oriental en la Universidad de Pensilvania." },
    { year: "2014", event: "Funda Peiwo, una aplicación social china que llegó a tener millones de usuarios." },
    { year: "Mediados de la década de 2010", event: "Se une a Ripple como Chief Representative para la Gran China, su primer gran rol dentro del ecosistema cripto." },
    { year: "2017", event: "Funda la Fundación TRON y lanza el whitepaper de TRON; la ICO de TRX recauda decenas de millones de dólares." },
    { year: "2018", event: "TRON lanza su mainnet independiente, migrando desde token ERC-20 a blockchain propia." },
    { year: "2018", event: "Adquiere BitTorrent Inc. (incluyendo µTorrent) por un monto reportado cercano a los $140 millones, integrándolo al ecosistema TRON." },
    { year: "2019", event: "Gana una subasta benéfica por un almuerzo con Warren Buffett, pagando cerca de $4.57 millones; el almuerzo original se pospone citando motivos de salud y finalmente se realiza en 2020." },
    { year: "2021", event: "Es designado embajador de Granada ante la Organización Mundial del Comercio (OMC) — un nombramiento ampliamente cubierto y cuestionado por la prensa." },
    { year: "2021", event: "Fricción pública con Binance (CZ) durante una corrida de liquidez sobre TRX, con acusaciones cruzadas en redes sociales." },
    { year: "2022", event: "TRON DAO lanza la stablecoin USDD sobre la red TRON." },
    { year: "Marzo de 2023", event: "La SEC de EE. UU. presenta cargos civiles contra Sun y sus entidades (Tron Foundation, BitTorrent Foundation, Rainberry) por venta no registrada de valores y presunta manipulación de mercado (wash trading) de TRX y BTT — cargos que Sun disputa públicamente." },
    { year: "Noviembre de 2024", event: "Compra 'Comedian', la obra de Maurizio Cattelan (una banana pegada a la pared con cinta adhesiva), por $6.2 millones en una subasta de Sotheby's — y luego se la come en una conferencia de prensa transmitida en vivo." },
    { year: "2024-2025", event: "Se convierte en uno de los mayores inversores públicos de World Liberty Financial (WLFI), un proyecto DeFi vinculado a la familia Trump — noticia ampliamente cubierta que generó debate sobre su relación con el litigio abierto de la SEC." },
  ],

  relationships: [
    {
      name: "Changpeng Zhao (CZ) — Binance",
      icon: "🔶",
      summary:
        "La relación pública entre Sun y CZ combina colaboración comercial (TRX cotiza en Binance desde hace años) con momentos de fricción visible — el más citado ocurrió en 2021, durante una corrida de liquidez sobre TRX en la que ambos intercambiaron señalamientos públicos en redes sociales. No es una relación descrita de forma consistente como amistosa ni como hostil por fuentes independientes; varía según el momento.",
    },
    {
      name: "Vitalik Buterin — Ethereum",
      icon: "⟠",
      summary:
        "Sun y Buterin se cruzaron en el circuito de conferencias blockchain desde mediados de la década de 2010, cuando ambos eran figuras jóvenes emergentes del espacio cripto. Sun se ha referido públicamente a Buterin en términos amistosos en distintas ocasiones. Como con cualquier relación entre figuras públicas, la naturaleza exacta y profundidad de esa amistad fuera del ámbito profesional no es algo verificable de forma independiente — se presenta aquí tal como se conoce públicamente, sin exagerar su alcance.",
    },
  ] as RelationshipEntry[],

  art: {
    title: "Arte, NFTs y gestos mediáticos",
    paragraphs: [
      "Sun es un coleccionista de arte declarado y ha usado compras de alto perfil como estrategia de visibilidad mediática. El caso más comentado es la compra en noviembre de 2024 de 'Comedian' — la obra conceptual de Maurizio Cattelan consistente en una banana pegada a una pared con cinta adhesiva — por $6.2 millones en una subasta de Sotheby's. Sun transmitió en vivo el momento en que se comió la banana en una conferencia de prensa, generando cobertura masiva en medios tradicionales y cripto por igual.",
      "También ha sido comprador activo en el espacio NFT y de arte digital en distintos momentos del ciclo cripto, una práctica habitual entre figuras de alto patrimonio del sector que buscan asociar su marca personal con el mundo del arte y la cultura.",
    ],
  },

  legalSituation: {
    title: "El caso de la SEC y la conexión con World Liberty Financial",
    paragraphs: [
      "En marzo de 2023, la SEC de Estados Unidos presentó cargos civiles contra Justin Sun y varias de sus entidades, alegando venta no registrada de valores y manipulación de mercado (wash trading) relacionada con TRX y BTT. Sun ha disputado públicamente estos cargos y el caso ha seguido un proceso legal extendido.",
      "Entre 2024 y 2025, Sun se convirtió en uno de los inversores más visibles de World Liberty Financial (WLFI), un proyecto de finanzas descentralizadas vinculado públicamente a la familia Trump. Esta inversión generó amplia cobertura periodística y debate sobre una posible relación entre ese respaldo financiero y la evolución del litigio de la SEC en su contra — un tema politizado sobre el que existen interpretaciones encontradas según la fuente.",
    ],
    caveat:
      "Esta es una situación legal y política en desarrollo. La información aquí refleja lo reportado públicamente hasta el corte de conocimiento de este asistente — para el estado actual exacto del litigio y de la relación con WLFI, consulta fuentes de noticias actualizadas antes de sacar conclusiones.",
  },

  intelligence: {
    title: "Su forma de operar",
    paragraphs: [
      "Independientemente de la valoración que cada uno haga de sus movimientos, la trayectoria de Sun muestra una lectura constante de dónde está la atención mediática y cómo capturarla: desde asegurar un rol temprano en Ripple siendo todavía muy joven, pasando por la adquisición de BitTorrent (una marca con reconocimiento masivo fuera del mundo cripto) para sumar utilidad real a TRON, hasta el nombramiento como embajador de Granada ante la OMC — un movimiento que le dio inmunidad diplomática limitada y cobertura de prensa simultáneamente.",
      "Esa misma lógica se repite en sus gestos mediáticos (la subasta con Buffett, la banana de Cattelan): son decisiones que generan titulares mucho más allá del círculo cripto, algo que pocas figuras del sector logran de forma sostenida.",
    ],
  },

  vision: {
    title: "Visión declarada para TRON",
    paragraphs: [
      "Sun ha descrito públicamente su ambición para TRON en términos de convertirla en infraestructura de pagos globales de bajo costo, especialmente para stablecoins (USDT circula en volúmenes muy altos sobre la red TRON) y para mercados con acceso limitado a banca tradicional. Es una visión que prioriza adopción masiva y bajo costo de transacción por sobre la descentralización máxima — un trade-off explícito que él mismo reconoce y que sus críticos señalan como el punto más cuestionado del diseño de gobernanza de TRON.",
    ],
  },

  controversies: [
    "Cargos civiles de la SEC de EE. UU. (2023) por venta no registrada de valores y presunta manipulación de mercado — disputados públicamente por Sun.",
    "Críticas persistentes sobre el grado real de descentralización del mecanismo de gobernanza DPoS de TRON, especialmente en sus etapas iniciales.",
    "Cuestionamientos por su nombramiento como embajador de Granada ante la OMC, visto por parte de la prensa como una estrategia para obtener protecciones diplomáticas.",
    "Debate público sobre su inversión en World Liberty Financial (vinculado a la familia Trump) en paralelo a su litigio abierto con la SEC — ver sección legal arriba.",
    "Estilo de autopromoción y marketing agresivo, señalado reiteradamente por medios cripto como parte central (y a veces polémica) de su estrategia de construcción de marca personal.",
  ],
  figures: [
    { label: "Patrimonio estimado", value: "Variable según fuente y ciclo de mercado — no verificable en tiempo real" },
    { label: "Rol actual", value: "Asesor y figura pública de TRON, HTX (Huobi) y otros proyectos afiliados" },
    { label: "Compra de arte más notoria", value: "'Comedian' (Maurizio Cattelan) — $6.2 millones, noviembre de 2024" },
    { label: "Caso legal abierto", value: "SEC vs. Justin Sun et al. (presentado marzo de 2023, disputado)" },
  ],
};
