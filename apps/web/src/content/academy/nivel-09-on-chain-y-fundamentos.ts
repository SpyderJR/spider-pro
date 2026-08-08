import type { AcademyLevelContent, Lesson } from "./types";

const ONCHAIN_HALVINGS_M2_STABLECOINS_NOTICIAS: Lesson = {
  id: "onchain-halvings-m2-stablecoins-noticias",
  title: "Análisis on-chain, halvings, liquidez global (M2), stablecoins y cómo leer noticias",
  estimatedMinutes: 15,
  blocks: [
    {
      type: "parrafo",
      texto:
        "Todo lo anterior en la Academia analiza el precio desde AFUERA: velas, indicadores, estructura. Este nivel mira hacia ADENTRO y hacia ARRIBA — adentro de la blockchain misma (on-chain), y arriba, al contexto macroeconómico que mueve todo el mercado cripto a la vez, sin importar qué diga ningún indicador técnico individual.",
    },

    { type: "titulo", texto: "1. Análisis on-chain — leer la blockchain directamente" },
    {
      type: "analogia",
      texto:
        "Un mercado de acciones tradicional es como un edificio con las cortinas cerradas: sabes el precio, pero no quién compró ni cuánto tiene cada quien. La blockchain es el mismo edificio con paredes de vidrio — cada transacción, cada balance de cada dirección, es público y permanente. El análisis on-chain es aprender a leer lo que ese vidrio deja ver.",
    },
    {
      type: "parrafo",
      texto:
        "Con datos on-chain puedes ver, por ejemplo, cuánto suministro de un token se mueve hacia o desde exchanges (más hacia exchanges suele preceder ventas; más hacia wallets propias suele indicar intención de guardar a largo plazo), qué tan concentrada está la propiedad entre pocas direcciones (riesgo de manipulación), o el flujo de fondos entre entidades etiquetadas (ballenas, exchanges, protocolos).",
    },
    {
      type: "conecta",
      label: "On-Chain",
      to: "/app/on-chain",
      descripcion: "Aprende a leer direcciones, grafos de flujos de fondos y entidades etiquetadas con ejemplos reales de la red TRON.",
    },
    {
      type: "conecta",
      label: "Whale Watcher",
      to: "/app/whale-watcher",
      descripcion: "Balances públicos verificados de las ballenas y entidades más conocidas de cripto — análisis on-chain aplicado directamente.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n9-l1-e1",
        enunciado: "Las transacciones en una blockchain pública son privadas y no pueden ser vistas por nadie más que el emisor.",
        respuesta: false,
        explicacion: "Falso — la característica central de una blockchain pública es justamente que cada transacción es visible y permanente para cualquiera; eso es lo que hace posible el análisis on-chain.",
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n9-l1-e2",
        pregunta: "Un análisis on-chain muestra que un volumen inusualmente grande de un token se está moviendo HACIA exchanges. ¿Qué se suele interpretar de esto?",
        opciones: [
          { texto: "Que los holders están acumulando a largo plazo", correcta: false, explicacion: "Mover fondos HACIA exchanges suele interpretarse como preparación para vender, no para guardar a largo plazo." },
          { texto: "Que podría estar preparándose una presión vendedora, ya que los exchanges son donde se ejecutan las ventas", correcta: true, explicacion: "Correcto — los tokens generalmente se mueven a exchanges cuando el poseedor planea venderlos ahí." },
          { texto: "No significa absolutamente nada", correcta: false, explicacion: "Es una de las señales on-chain más vigiladas, aunque como toda señal, no es una garantía por sí sola." },
          { texto: "Que la red dejó de funcionar", correcta: false, explicacion: "El movimiento de fondos entre direcciones es actividad normal de la red, no una falla." },
        ],
      },
    },

    { type: "titulo", texto: "2. Halvings — la reducción programada de la oferta de Bitcoin" },
    {
      type: "parrafo",
      texto:
        "Un halving es un evento programado en el código de Bitcoin que reduce a la mitad la recompensa que reciben los mineros por cada bloque, aproximadamente cada 4 años. Menos recompensa por bloque significa menos Bitcoin nuevo entrando en circulación cada día — una reducción de oferta programada de antemano, conocida por todos con años de anticipación.",
    },
    {
      type: "destacado",
      variante: "advertencia",
      titulo: "CORRELACIÓN NO ES GARANTÍA FUTURA",
      texto:
        "Los 3 halvings anteriores fueron seguidos, con el tiempo, por subidas fuertes en el precio de Bitcoin — pero eso es una muestra de solo 3 eventos, no una ley física. Cada ciclo tuvo un contexto macroeconómico distinto. Tratar el halving como un botón mágico de \"ahora sí sube seguro\" ignora que el mercado de hoy es más grande, más maduro y más influenciado por factores macro que el de ciclos anteriores.",
    },
    {
      type: "conecta",
      label: "Halvings BTC",
      to: "/app/halvings",
      descripcion: "Compara los 4 ciclos anteriores lado a lado y una proyección de dónde estaría el pico de este ciclo si repitiera el patrón histórico — con toda la incertidumbre que eso implica.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "completaEspacio",
        id: "n9-l1-e3",
        plantilla: "Un halving reduce a la ___ la recompensa por bloque de los mineros, aproximadamente cada ___ años.",
        opciones: ["mitad / 4", "tercera parte / 2", "mitad / 10", "cuarta parte / 4"],
        correcta: "mitad / 4",
      },
    },

    { type: "titulo", texto: "3. Liquidez global (M2) — el contexto que mueve TODO a la vez" },
    {
      type: "analogia",
      texto:
        "Piensa en la liquidez global como la marea del océano: cuando sube, levanta prácticamente todos los barcos del puerto a la vez, sin importar qué tan bien construido esté cada uno individualmente. Cuando baja, todos bajan juntos también. Ningún indicador técnico de un solo activo puede predecir ni explicar ese movimiento de fondo — viene de afuera del gráfico por completo.",
    },
    {
      type: "parrafo",
      texto:
        "M2 es una medida de la cantidad total de dinero en circulación en una economía (efectivo, depósitos, cuentas de ahorro). Cuando los bancos centrales expanden M2 (imprimen o facilitan más dinero/crédito), típicamente hay más liquidez buscando dónde invertirse — históricamente, activos de riesgo como cripto y acciones se han beneficiado de esos periodos de expansión, y sufrido en los de contracción.",
    },
    {
      type: "conecta",
      label: "Análisis Macro",
      to: "/app/analisis-macro",
      descripcion: "Compara M2, el índice del dólar (DXY), la tasa de la Fed y el S&P 500 contra el precio de BTC/TRX — para ver si cripto se mueve aislado o dentro del contexto financiero amplio.",
    },
    {
      type: "tip",
      texto: "Cuando el precio de BTC se mueve mucho pero M2/DXY se mantienen estables, la explicación probablemente es específica de cripto. Cuando TODOS los activos de riesgo se mueven juntos, casi siempre es el contexto macro, no una noticia particular de cripto.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n9-l1-e4",
        pregunta: "¿Por qué se compara el precio de BTC/TRX contra M2, DXY y la tasa de la Fed?",
        opciones: [
          { texto: "Para predecir el precio exacto de mañana", correcta: false, explicacion: "El análisis macro no predice precios exactos — da contexto sobre el entorno financiero general." },
          { texto: "Para entender si el mercado cripto se mueve por su propio contexto o dentro de una tendencia financiera más amplia que afecta a todos los activos de riesgo", correcta: true, explicacion: "Correcto — permite distinguir movimientos específicos de cripto de movimientos de contexto macro que afectan a todo el mercado de riesgo a la vez." },
          { texto: "Porque M2 y DXY son indicadores técnicos como el RSI", correcta: false, explicacion: "Son datos macroeconómicos, de naturaleza distinta a los indicadores técnicos calculados sobre el precio." },
          { texto: "No tiene ninguna utilidad real compararlos", correcta: false, explicacion: "Es precisamente lo opuesto a la idea central de esta sección." },
        ],
      },
    },

    { type: "titulo", texto: "4. Stablecoins — el puente entre cripto y dólares" },
    {
      type: "parrafo",
      texto:
        "Una stablecoin es un token diseñado para mantener su valor fijo, típicamente 1:1 con el dólar (USDT, USDC son las más grandes). Funcionan como el \"efectivo\" del mundo cripto: permiten mover valor rápido entre exchanges, salir de una posición sin convertir a moneda fiduciaria tradicional, y sirven como referencia estable dentro de un mercado altamente volátil.",
    },
    {
      type: "destacado",
      variante: "info",
      titulo: "SUPPLY DE STABLECOINS COMO INDICADOR INDIRECTO",
      texto:
        "Cuando el supply total de stablecoins en circulación crece, suele significar que está entrando dinero nuevo al ecosistema cripto (a la espera de comprarse otros activos). Cuando se contrae, suele indicar salida de capital. No es una señal de timing exacto, pero es un termómetro razonable de la liquidez disponible dentro del propio ecosistema.",
    },
    {
      type: "conecta",
      label: "Stablecoins TRON",
      to: "/app/stablecoins",
      descripcion: "Supply, holders y participación de mercado en vivo de las principales stablecoins emitidas sobre TRON.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n9-l1-e5",
        enunciado: "Un crecimiento sostenido en el supply total de stablecoins suele interpretarse como salida de capital del ecosistema cripto.",
        respuesta: false,
        explicacion: "Falso — es lo contrario: un crecimiento del supply de stablecoins suele indicar ENTRADA de capital nuevo al ecosistema, a la espera de comprarse otros activos.",
      },
    },

    { type: "titulo", texto: "5. Cómo leer noticias de cripto sin dejarte manipular" },
    {
      type: "parrafo",
      texto:
        "El mercado cripto se mueve tan rápido con titulares que aprender a filtrarlos es una habilidad fundamental, casi tan importante como leer un gráfico. Tres preguntas simples filtran la mayoría del ruido: ¿la fuente tiene un interés directo en que yo actúe (compre/venda) tras leer esto? ¿El titular describe un hecho verificable, o una opinión/especulación disfrazada de hecho? ¿Esta noticia ya está reflejada en el precio (el mercado suele anticipar noticias esperadas), o es genuinamente nueva información?",
    },
    {
      type: "errorComun",
      texto: "Operar inmediatamente después de leer un titular llamativo, sin verificar la fuente original. Muchas noticias de cripto se difunden distorsionadas o directamente falsas por cuentas con interés en mover el precio a su favor — el mismo mecanismo que el FOMO del Nivel 7, pero disparado por una noticia en vez de por el gráfico.",
    },
    {
      type: "conecta",
      label: "Spider Intelligence",
      to: "/app",
      descripcion: "El Spider Score combina sentimiento, distancia al máximo histórico, momentum técnico y liquidez macro en una sola lectura — basada en reglas fijas, no en un titular aislado.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "ordenar",
        id: "n9-l1-e6",
        instruccion: "Ordena estas preguntas de filtro antes de reaccionar a una noticia de cripto, del primero al último paso lógico.",
        items: [
          { id: "a", texto: "¿La fuente tiene un interés directo en que yo actúe después de leer esto?" },
          { id: "b", texto: "¿Es un hecho verificable, o una opinión/especulación disfrazada de hecho?" },
          { id: "c", texto: "¿Esta información ya está reflejada en el precio, o es genuinamente nueva?" },
          { id: "d", texto: "Solo entonces, decidir si la noticia realmente cambia algo en tu análisis" },
        ],
        ordenCorrecto: ["a", "b", "c", "d"],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n9-l1-e7",
        pregunta: "¿Por qué el mercado a veces no reacciona a una noticia que 'debería' mover el precio con fuerza?",
        opciones: [
          { texto: "Porque el mercado nunca reacciona a ninguna noticia", correcta: false, explicacion: "El mercado sí reacciona a noticias — la pregunta es si esa noticia ya estaba anticipada o no." },
          { texto: "Porque esa información ya podría estar reflejada en el precio de antemano, si era ampliamente esperada", correcta: true, explicacion: "Correcto — los mercados suelen anticipar eventos muy esperados, por lo que el 'hecho consumado' a veces genera poco movimiento adicional." },
          { texto: "Porque los exchanges bloquean las noticias importantes", correcta: false, explicacion: "No hay ningún mecanismo así — la explicación tiene que ver con expectativas ya incorporadas al precio." },
          { texto: "Porque las noticias solo afectan a Bitcoin, nunca a otros activos", correcta: false, explicacion: "Las noticias relevantes pueden afectar a cualquier activo, no exclusivamente a Bitcoin." },
        ],
      },
    },

    { type: "titulo", texto: "Resumen" },
    {
      type: "lista",
      variante: "buenas",
      items: [
        "El análisis on-chain lee directamente la blockchain: flujos hacia/desde exchanges, concentración de holders, movimientos de ballenas.",
        "Un halving reduce a la mitad la oferta nueva de BTC cada ~4 años — correlacionó con subidas en los 3 ciclos anteriores, sin ser garantía del próximo.",
        "La liquidez global (M2) es la 'marea' que mueve a todos los activos de riesgo juntos, más allá de cualquier indicador técnico individual de un solo activo.",
        "El supply de stablecoins es un termómetro indirecto de cuánto capital nuevo está entrando o saliendo del ecosistema cripto.",
        "Filtrar noticias exige preguntar: ¿interés de la fuente?, ¿hecho o especulación?, ¿ya está reflejado en el precio?",
      ],
    },
    {
      type: "conecta",
      label: "Explora On-Chain y Análisis Macro",
      to: "/app/on-chain",
      descripcion: "Aplica lo aprendido revisando datos on-chain y macro reales, en vez de solo indicadores técnicos del precio.",
    },
  ],
};

export const NIVEL_09_ON_CHAIN_Y_FUNDAMENTOS: AcademyLevelContent = {
  id: "on-chain-y-fundamentos",
  order: 9,
  title: "On-chain y fundamentos",
  description: "Análisis on-chain simple, halvings, M2 y liquidez global, stablecoins y cómo leer noticias.",
  difficulty: "intermedio",
  icon: "⛓",
  lessons: [ONCHAIN_HALVINGS_M2_STABLECOINS_NOTICIAS],
  quiz: [
    {
      question: "¿Qué hace posible el análisis on-chain?",
      options: [
        "Que las transacciones en una blockchain pública son visibles y permanentes para cualquiera",
        "Que los exchanges publican reportes mensuales voluntarios",
        "Que los indicadores técnicos calculan el sentimiento del mercado",
        "Que las stablecoins tienen un precio fijo",
      ],
      correctIndex: 0,
      explanation: "La transparencia inherente de una blockchain pública (cada transacción visible y permanente) es lo que permite todo el análisis on-chain.",
    },
    {
      question: "Un volumen inusual de tokens se mueve HACIA exchanges. ¿Qué suele sugerir esto?",
      options: [
        "Acumulación a largo plazo",
        "Posible presión vendedora próxima, ya que los exchanges son donde se ejecutan las ventas",
        "Que la red dejó de funcionar",
        "No sugiere absolutamente nada",
      ],
      correctIndex: 1,
      explanation: "Mover fondos hacia exchanges es una señal on-chain clásica de preparación para vender, aunque no es una garantía por sí sola.",
    },
    {
      question: "¿Qué es un halving de Bitcoin?",
      options: [
        "Una duplicación del precio programada en el código",
        "Un evento programado que reduce a la mitad la recompensa por bloque de los mineros, aproximadamente cada 4 años",
        "Un tipo de orden límite exclusivo de Bitcoin",
        "Una fork de la red que crea una nueva moneda",
      ],
      correctIndex: 1,
      explanation: "El halving reduce la emisión de nuevos BTC a la mitad, un evento programado y conocido de antemano por todos los participantes del mercado.",
    },
    {
      question: "¿Por qué no se debe tratar el halving como garantía de una subida futura?",
      options: [
        "Porque los halvings nunca coincidieron con subidas históricamente",
        "Porque la muestra histórica es de solo 3 eventos anteriores, cada uno con un contexto macroeconómico distinto",
        "Porque los halvings dejaron de ocurrir",
        "Porque solo afecta el precio de otras criptomonedas, no de Bitcoin",
      ],
      correctIndex: 1,
      explanation: "Con solo 3 ciclos previos y contextos macro distintos cada vez, la correlación histórica no es una ley garantizada para el futuro.",
    },
    {
      question: "¿Qué mide M2 y por qué importa para cripto?",
      options: [
        "El número de wallets activas en una blockchain",
        "La cantidad total de dinero en circulación en una economía — su expansión o contracción suele mover a todos los activos de riesgo, incluida cripto, en la misma dirección",
        "El precio exacto de Bitcoin en cada momento",
        "El volumen de trading diario en Binance",
      ],
      correctIndex: 1,
      explanation: "M2 es liquidez monetaria general — su expansión/contracción actúa como una 'marea' que afecta a todos los activos de riesgo a la vez, más allá de cualquier análisis técnico individual.",
    },
    {
      question: "¿Qué es una stablecoin?",
      options: [
        "Un token diseñado para mantener su valor fijo, típicamente 1:1 con el dólar",
        "La criptomoneda más volátil del mercado",
        "Un tipo de contrato de futuros",
        "Un indicador técnico de tendencia",
      ],
      correctIndex: 0,
      explanation: "Las stablecoins (como USDT/USDC) funcionan como el 'efectivo' del mundo cripto, manteniendo un valor estable frente al dólar.",
    },
    {
      question: "¿Qué suele indicar un crecimiento sostenido en el supply total de stablecoins?",
      options: [
        "Salida masiva de capital del ecosistema cripto",
        "Entrada de capital nuevo al ecosistema, a la espera de comprarse otros activos",
        "Que el dólar perdió valor",
        "No tiene relación con el capital dentro de cripto",
      ],
      correctIndex: 1,
      explanation: "Más stablecoins en circulación suele significar más capital disponible dentro del ecosistema, esperando desplegarse en otros activos.",
    },
    {
      question: "Antes de reaccionar a un titular de cripto, ¿qué pregunta es más útil hacerse primero?",
      options: [
        "¿Cuántas veces se compartió en redes sociales?",
        "¿La fuente tiene un interés directo en que yo actúe (compre/venda) después de leer esto?",
        "¿El titular tiene muchas mayúsculas?",
        "¿Fue publicado en fin de semana?",
      ],
      correctIndex: 1,
      explanation: "Evaluar el interés de la fuente es el primer filtro contra noticias diseñadas para provocar una reacción impulsiva, el mismo mecanismo que el FOMO.",
    },
    {
      question: "¿Por qué a veces el mercado no se mueve mucho ante una noticia que 'debería' ser importante?",
      options: [
        "Porque el mercado nunca reacciona a nada",
        "Porque esa información ya podía estar reflejada en el precio de antemano, si era ampliamente esperada",
        "Porque los exchanges censuran las noticias",
        "Porque las noticias no afectan a ningún activo",
      ],
      correctIndex: 1,
      explanation: "Eventos ampliamente anticipados suelen ya estar 'descontados' en el precio, por lo que el hecho consumado genera menos movimiento del esperado.",
    },
    {
      question: "¿En qué se diferencia este nivel de los niveles anteriores de análisis técnico (indicadores, estructura)?",
      options: [
        "En que usa exactamente las mismas herramientas, solo con otro nombre",
        "En que mira factores fuera del gráfico de precio puro: la blockchain misma (on-chain) y el contexto macroeconómico que mueve a todo el mercado a la vez",
        "En que no tiene ninguna aplicación práctica",
        "En que solo aplica a Bitcoin, nunca a otros activos",
      ],
      correctIndex: 1,
      explanation: "Mientras el análisis técnico mira el precio desde afuera, este nivel mira hacia adentro (blockchain) y hacia arriba (macroeconomía) — fuentes de información distintas y complementarias.",
    },
  ],
};
