import type { AcademyLevelContent, Lesson } from "./types";

const UNIDADES_MEDIDAS_Y_COSTOS: Lesson = {
  id: "unidades-medidas-y-costos",
  title: "Unidades, medidas y costos: cómo se mide de verdad tu riesgo",
  estimatedMinutes: 12,
  blocks: [
    {
      type: "parrafo",
      texto:
        "Todo activo se mueve en \"escalones\" mínimos — no en una línea perfectamente continua. Piénsalo como los milímetros de una regla: es la unidad más pequeña que puedes medir, y no existe nada más fino que eso dentro de esa regla. El precio de BTC o de TRX funciona igual: tiene un escalón mínimo de movimiento, y todo lo que hagas — tu stop loss, tu ganancia, el costo de operar — al final se mide en esos escalones, en dólares o en porcentaje.",
    },
    { type: "diagramaSVG", diagrama: "escalones-tick", caption: "El precio nunca 'flota' entre dos valores — siempre salta de un escalón mínimo al siguiente." },
    {
      type: "destacado",
      variante: "info",
      titulo: "¿Y LOS PIPS?",
      texto:
        "Si viste videos de trading en YouTube, seguro escuchaste la palabra \"pips\". Es un término de Forex (el mercado de divisas, como EUR/USD): ahí la unidad mínima de movimiento se llama pip, normalmente el 4º decimal ($0.0001). En cripto el concepto equivalente se llama tick, no pip — cada exchange y cada par tiene el suyo. Te lo mencionamos solo para que lo reconozcas si lo escuchas por ahí; de aquí en adelante trabajamos con ticks, dólares y porcentaje.",
    },

    { type: "titulo", texto: "1. Tick y tamaño de tick — el equivalente cripto del pip" },
    {
      type: "parrafo",
      texto:
        "El tick size es el incremento mínimo de precio que el exchange permite para un par — el \"escalón\" real de ese activo específico. No es el mismo número para todos los pares: depende de cuánto vale ese activo y de cómo lo configuró el exchange.",
    },
    {
      type: "tabla",
      headers: ["Par", "Precio aproximado", "Tick size real (Binance)"],
      filas: [
        ["BTC/USDT", "$63,000", "$0.01"],
        ["TRX/USDT", "$0.32", "$0.0001"],
      ],
    },
    {
      type: "tip",
      texto:
        "TRX tiene un tick mucho más chico que BTC porque su precio es mucho menor — necesita más decimales para tener escalones útiles. La Terminal de esta app usa el tick size real de cada par, tomado directo de Binance, no un número inventado.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n6-l1-e1",
        enunciado: "En cripto, los traders operan comúnmente \"en pips\", igual que en Forex.",
        respuesta: false,
        explicacion:
          "Falso — \"pip\" es un término de Forex. En cripto el concepto equivalente es el tick, y su tamaño varía según cada par (ej. $0.01 en BTC/USDT vs. $0.0001 en TRX/USDT).",
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "completaEspacio",
        id: "n6-l1-e2",
        plantilla: "El precio de BTC/USDT pasó de $63,000.05 a $63,000.12. Si el tick es de $0.01, eso son ___ ticks de movimiento.",
        opciones: ["3", "7", "10", "70"],
        correcta: "7",
      },
    },

    { type: "titulo", texto: "2. Las tres formas de medir tu Stop Loss" },
    {
      type: "parrafo",
      texto:
        "Cuando colocas un stop loss, la distancia entre tu entrada y ese stop se puede expresar de tres formas distintas — y las tres son útiles para cosas diferentes: en dólares (cuánto se movió el precio en términos absolutos), en porcentaje (qué fracción del precio representa ese movimiento) y en ticks (cuántos escalones mínimos hay entre uno y otro).",
    },
    {
      type: "analogia",
      texto:
        "Entras long en BTC a $63,000 con un stop en $62,370. La distancia es $630 — eso también son 1% del precio de entrada, y también son 63,000 ticks (si el tick es $0.01). Son tres formas de decir exactamente lo mismo, cada una útil en un contexto distinto.",
    },
    {
      type: "destacado",
      variante: "exito",
      titulo: "POR QUÉ EL PORCENTAJE MANDA EN CRIPTO",
      texto:
        "BTC vale ~$63,000 y TRX vale ~$0.32 — precios completamente distintos. Decir \"mi stop está a $10\" no dice nada por sí solo: en BTC, $10 es casi nada (0.016%); en TRX, $10 sería un movimiento absurdamente grande. En cambio, \"mi stop está a 1%\" significa exactamente lo mismo sin importar qué activo estés operando — por eso el porcentaje es la unidad que de verdad se puede comparar entre activos.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "calculadoraGuiada",
        id: "n6-l1-e3",
        instruccion: "Entraste long en BTC a $63,000 y tu stop loss está $630 más abajo. Calcula a qué porcentaje de distancia está tu stop.",
        campos: [
          { id: "entrada", label: "Precio de entrada (USD)", placeholder: "63000" },
          { id: "stopUsd", label: "Distancia del stop (USD)", placeholder: "630" },
        ],
        calcular: (v) => ((v.stopUsd ?? 0) / (v.entrada ?? 1)) * 100,
        unidad: "%",
        tolerancia: 0.05,
      },
    },

    { type: "titulo", texto: "3. Tamaño de posición, lote y tamaño de contrato" },
    {
      type: "parrafo",
      texto:
        "El tamaño de posición es cuánto activo controlas en una operación. En Forex y en futuros tradicionales existen los términos lote (una unidad estándar, como 100,000 unidades de la divisa base) y tamaño de contrato (cuánto representa un solo contrato). En cripto spot casi nadie usa esos términos — se habla directo de cantidad (ej. 0.05 BTC) o de su valor en USD, y en futuros de cripto el tamaño de contrato varía por exchange y por par.",
    },
    {
      type: "destacado",
      variante: "advertencia",
      titulo: "EL ORDEN CORRECTO",
      texto:
        "La distancia de tu stop (en %) y tu regla de riesgo (normalmente 1-2% de la cuenta por operación) son lo que DETERMINA el tamaño de posición correcto — nunca al revés. Elegir primero cuánto \"quieres invertir\" y recién después ver dónde poner el stop es el error mental más común en gestión de riesgo.",
    },
    {
      type: "conecta",
      label: "Calculadora de tamaño de posición",
      to: "/app/gestion-de-riesgo",
      descripcion: "La misma fórmula de este ejercicio, en una calculadora interactiva con tu balance real.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "calculadoraGuiada",
        id: "n6-l1-e4",
        instruccion: "Cuenta de $1,000. Decides arriesgar 1% por operación. Tu stop loss queda a 2% de distancia del precio de entrada. Calcula el tamaño de posición correcto en USD.",
        campos: [
          { id: "balance", label: "Balance de la cuenta (USD)", placeholder: "1000" },
          { id: "riesgoPercent", label: "Riesgo por operación (%)", placeholder: "1" },
          { id: "stopPercent", label: "Distancia del stop (%)", placeholder: "2" },
        ],
        calcular: (v) => ((v.balance ?? 0) * ((v.riesgoPercent ?? 0) / 100)) / ((v.stopPercent ?? 1) / 100),
        unidad: "USD",
        tolerancia: 5,
      },
    },

    { type: "titulo", texto: "4. Valor por movimiento — traducir el gráfico a tu bolsillo" },
    {
      type: "parrafo",
      texto:
        "El valor por movimiento es cuánto dinero real representa cada 1% (o cada tick, o cada $ de precio) según el tamaño de tu posición. Es el puente entre \"el gráfico se movió X\" y \"gané o perdí Y dólares reales\".",
    },
    {
      type: "analogia",
      texto:
        "Dos personas miran exactamente el mismo gráfico de BTC subir 1%. La primera tiene una posición de $500 → gana $5. La segunda tiene una posición de $5,000 → gana $50. Vieron el mismo movimiento, en el mismo activo, al mismo tiempo — pero ganaron cantidades muy distintas, porque el tamaño de la posición es lo que traduce el % en dinero real.",
    },
    {
      type: "tip",
      texto: "Esto es exactamente lo que la Terminal calcula por ti en vivo en el panel de orden — pero vale la pena poder hacerlo a mano una vez para entender de dónde sale el número.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "calculadoraGuiada",
        id: "n6-l1-e5",
        instruccion: "Tienes una posición de $500 en BTC. El precio sube 1%. Calcula cuánto ganaste en dólares.",
        campos: [
          { id: "tamanoPosicion", label: "Tamaño de la posición (USD)", placeholder: "500" },
          { id: "movimientoPercent", label: "Movimiento del precio (%)", placeholder: "1" },
        ],
        calcular: (v) => (v.tamanoPosicion ?? 0) * ((v.movimientoPercent ?? 0) / 100),
        unidad: "USD",
        tolerancia: 0.5,
      },
    },

    { type: "titulo", texto: "5. ATR — colocar el stop según la volatilidad, no a ojo" },
    {
      type: "errorComun",
      texto: "Poner el stop en un número redondo arbitrario (\"a $500\", \"donde se vea bien\") sin mirar cuánto se mueve normalmente ese activo.",
    },
    {
      type: "parrafo",
      texto:
        "El ATR (Average True Range) es un indicador que mide el rango promedio que se mueve un activo en cada vela — su \"ruido normal\". No hace falta memorizar la fórmula: lo importante es que te da un número real y objetivo de cuánto se mueve el precio normalmente, para que tu stop no quede adentro de ese vaivén habitual.",
    },
    {
      type: "parrafo",
      texto:
        "La forma más usada de aplicarlo: colocar el stop a una distancia basada en el ATR (por ejemplo, 1.5× el ATR) — lo suficientemente lejos como para no quedar dentro del ruido normal, pero sin irte tan lejos que tu ratio riesgo/beneficio deje de tener sentido.",
    },
    { type: "diagramaSVG", diagrama: "ruido-vs-atr", caption: "Mismo trade, mismo ruido de mercado — la única diferencia es dónde quedó el stop." },
    {
      type: "conecta",
      label: "Fractales & Estructura",
      to: "/app/fractales-estructura",
      descripcion: "El ATR no es la única forma de elegir dónde poner el stop — también puedes basarlo en estructura (debajo del último fractal/soporte).",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n6-l1-e6",
        pregunta: "El ATR (14) de BTC en 1h es $180. Tienes una entrada long en $63,000. ¿Cuál distancia de stop loss tiene más sentido para no quedar dentro del ruido normal?",
        opciones: [
          { texto: "$20 por debajo de la entrada", correcta: false, explicacion: "Es mucho menor que el ATR — queda claramente dentro del ruido normal, te sacaría por nada." },
          { texto: "$270 por debajo de la entrada (1.5× el ATR)", correcta: true, explicacion: "Correcto — está calculado a partir de la volatilidad real del activo, no a ojo." },
          { texto: "$5,000 por debajo de la entrada", correcta: false, explicacion: "Evita el ruido de sobra, pero es una distancia enorme que probablemente rompe tu regla de riesgo por operación." },
          { texto: "Justo en un número redondo como $62,500, sin mirar el ATR", correcta: false, explicacion: "Es exactamente el error de novato descrito arriba: elegir un stop a ojo, sin referencia real de volatilidad." },
        ],
      },
    },

    { type: "titulo", texto: "6. Spread — el primer costo invisible" },
    {
      type: "parrafo",
      texto:
        "El spread es la diferencia entre el mejor precio de compra (bid) y el mejor precio de venta (ask) en el order book. Cuando entras y sales de una operación, \"cruzas el spread\" — es un costo real que pagas aunque nunca aparezca como una línea de \"comisión\" en ningún lado.",
    },
    {
      type: "parrafo",
      texto:
        "En pares muy líquidos como BTC/USDT el spread suele ser mínimo (fracciones de un tick). En activos con poca liquidez o baja capitalización puede ser mucho más grande, y comerse por completo una operación pequeña.",
    },
    {
      type: "conecta",
      label: "Order book en vivo — Terminal",
      to: "/app/terminal",
      descripcion: "Mira el hueco real entre la mejor compra y la mejor venta en el panel de Order Book — ese hueco es el spread.",
    },

    { type: "titulo", texto: "7. Slippage — cuando el precio se te escapa" },
    {
      type: "parrafo",
      texto:
        "El slippage es la diferencia entre el precio que esperabas y el precio al que realmente se ejecutó tu orden. Pasa sobre todo con órdenes de mercado en momentos rápidos o con poca liquidez: para cuando tu orden llega al exchange, el precio ya se movió.",
    },
    {
      type: "analogia",
      texto: "Quisiste entrar a $63,000 con una orden de mercado, pero para cuando se ejecutó el precio ya estaba en $63,080 — tuviste $80 de slippage. Una orden límite te habría dado el precio exacto que pediste, pero corriendo el riesgo de no ejecutarse si el precio nunca vuelve a tocarlo.",
    },
    {
      type: "tip",
      texto: "Orden límite: controla el precio, no garantiza ejecución. Orden de mercado: garantiza ejecución, no controla el precio. No hay una \"mejor\" siempre — depende de qué te importa más en ese momento.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n6-l1-e7",
        pregunta: "Va a salir una noticia importante en 10 segundos y quieres entrar long en BTC lo antes posible, aceptando que el precio se mueva un poco. ¿Qué tipo de orden tiene más sentido?",
        opciones: [
          { texto: "Orden límite exactamente al precio actual", correcta: false, explicacion: "Si el precio salta rápido por la noticia, esa orden límite podría no llegar a ejecutarse nunca." },
          { texto: "Orden de mercado, aceptando algo de slippage", correcta: true, explicacion: "Correcto — una orden de mercado garantiza que entras ya, a cambio de no controlar el precio exacto de ejecución." },
          { texto: "Orden límite muy por debajo del precio actual", correcta: false, explicacion: "Es una entrada mucho más barata de lo que el precio actual permite — probablemente nunca se ejecute." },
          { texto: "No poner ninguna orden y esperar a que pase la noticia", correcta: false, explicacion: "Es una opción razonable en general, pero no responde lo que pide la pregunta: entrar cuanto antes." },
        ],
      },
    },

    { type: "titulo", texto: "8. Comisiones maker/taker — el costo que se come las ganancias pequeñas" },
    {
      type: "parrafo",
      texto:
        "El exchange cobra una comisión por cada operación. Una orden taker (de mercado, que \"toma\" liquidez que ya estaba en el order book) suele costar más; una orden maker (límite, que \"aporta\" liquidez nueva al esperar en el book) suele costar menos o incluso nada, según el exchange.",
    },
    {
      type: "destacado",
      variante: "advertencia",
      titulo: "POR QUÉ IMPORTA MÁS DE LO QUE PARECE",
      texto:
        "Spread + comisión de entrada + comisión de salida pueden convertir muchas operaciones pequeñas y frecuentes en pérdida neta, incluso cuando el precio se movió a tu favor. Es una de las razones reales por las que el overtrading (operar demasiado seguido, en tamaños chicos) destruye cuentas — no por mala suerte, sino por matemática simple de costos acumulados.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "calculadoraGuiada",
        id: "n6-l1-e8",
        instruccion: "Tu trade cerró con una ganancia BRUTA de $50. Pagaste $5 de spread, $2 de comisión al entrar y $2 al salir. Calcula tu ganancia NETA real.",
        campos: [
          { id: "gananciaBruta", label: "Ganancia bruta (USD)", placeholder: "50" },
          { id: "spreadUsd", label: "Costo de spread (USD)", placeholder: "5" },
          { id: "comisionEntrada", label: "Comisión de entrada (USD)", placeholder: "2" },
          { id: "comisionSalida", label: "Comisión de salida (USD)", placeholder: "2" },
        ],
        calcular: (v) => (v.gananciaBruta ?? 0) - (v.spreadUsd ?? 0) - (v.comisionEntrada ?? 0) - (v.comisionSalida ?? 0),
        unidad: "USD",
        tolerancia: 1,
      },
    },

    { type: "titulo", texto: "Resumen" },
    {
      type: "lista",
      variante: "buenas",
      items: [
        "En cripto piensas en % y en ticks — no en pips, eso es de Forex.",
        "Tu stop se puede medir en dólares, porcentaje y ticks — el porcentaje es el que de verdad se compara entre activos distintos.",
        "El tamaño de posición sale de tu riesgo y tu stop, nunca al revés.",
        "El valor por movimiento traduce el % del gráfico a dinero real en tu bolsillo.",
        "Coloca el stop según volatilidad (ATR) o estructura — nunca a ojo en un número redondo.",
        "Spread, slippage y comisiones son costos reales que se acumulan, aunque no los veas como una línea aparte.",
      ],
    },
    {
      type: "conecta",
      label: "Practica en la Terminal",
      to: "/app/terminal",
      descripcion: "Abre la Terminal, coloca un stop loss y fíjate cómo la distancia aparece en dólares, % y ticks a la vez — y observa el spread real en el order book.",
    },
  ],
};

export const NIVEL_06_GESTION_DE_RIESGO: AcademyLevelContent = {
  id: "gestion-de-riesgo",
  order: 6,
  title: "Gestión de riesgo",
  description: "El nivel más importante: unidades y costos reales, tamaño de posición, stop loss, ratio riesgo/beneficio y rachas perdedoras.",
  difficulty: "intermedio",
  icon: "🛡",
  lessons: [UNIDADES_MEDIDAS_Y_COSTOS],
  quiz: [
    {
      question: "En cripto, ¿cómo se llama la unidad mínima de movimiento de precio (el equivalente al \"pip\" de Forex)?",
      options: ["Pip", "Tick", "Lote", "Spread"],
      correctIndex: 1,
      explanation: "El pip es un término de Forex. En cripto el concepto equivalente es el tick, y su tamaño varía por par.",
    },
    {
      question: "BTC cotiza a $63,000 y TRX a $0.32. ¿Por qué el porcentaje es la unidad más útil para comparar la distancia de un stop entre ambos?",
      options: [
        "Porque los dólares no sirven para nada en cripto",
        "Porque el porcentaje representa lo mismo sin importar el precio absoluto de cada activo",
        "Porque TRX no permite stops en dólares",
        "Porque el porcentaje siempre es un número más grande",
      ],
      correctIndex: 1,
      explanation: "\"$10 de distancia\" significa cosas completamente distintas en BTC y en TRX — pero \"1% de distancia\" significa lo mismo en cualquier activo.",
    },
    {
      question: "¿Qué determina el tamaño de posición correcto?",
      options: [
        "Cuánto capital \"tienes ganas\" de invertir ese día",
        "Tu riesgo por operación (%) y la distancia de tu stop (%)",
        "El apalancamiento máximo que permite el exchange",
        "El tamaño de la última operación que hiciste",
      ],
      correctIndex: 1,
      explanation: "El tamaño de posición se calcula a partir de cuánto estás dispuesto a arriesgar y a qué distancia está tu stop — nunca al revés.",
    },
    {
      question: "Dos traders ven a BTC subir 1% al mismo tiempo. Uno tiene $500 en la posición, el otro $5,000. ¿Qué explica que ganen cantidades distintas?",
      options: [
        "Uno de los dos ve un gráfico distinto",
        "El tamaño de la posición — el mismo % del gráfico vale distinto dinero según cuánto tengas invertido",
        "Solo uno de los dos pagó comisión",
        "Es imposible, deberían ganar lo mismo",
      ],
      correctIndex: 1,
      explanation: "El valor por movimiento depende del tamaño de la posición: mismo % de gráfico, dinero real distinto.",
    },
    {
      question: "¿Qué mide el ATR (Average True Range)?",
      options: [
        "La dirección de la tendencia",
        "El rango promedio que se mueve un activo por vela — su \"ruido normal\"",
        "El volumen total negociado",
        "El número de traders activos",
      ],
      correctIndex: 1,
      explanation: "El ATR mide volatilidad (cuánto se mueve normalmente el precio), no dirección — sirve para colocar un stop fuera del ruido habitual.",
    },
    {
      question: "¿Qué es el spread?",
      options: [
        "Una comisión fija que cobra el exchange",
        "La diferencia entre el mejor precio de compra (bid) y el mejor precio de venta (ask)",
        "El tamaño mínimo de una orden",
        "La cantidad de decimales que muestra un par",
      ],
      correctIndex: 1,
      explanation: "El spread es el hueco entre bid y ask en el order book — un costo real que pagas al cruzarlo, aunque no aparezca como comisión.",
    },
    {
      question: "¿Cuál es la diferencia entre slippage con una orden de mercado y una orden límite?",
      options: [
        "Ambas siempre tienen el mismo slippage",
        "La orden de mercado garantiza ejecución pero no precio exacto; la límite controla el precio pero puede no ejecutarse",
        "La orden límite siempre tiene más slippage",
        "El slippage solo existe en Forex, no en cripto",
      ],
      correctIndex: 1,
      explanation: "Es un trade-off: mercado = ejecución garantizada, precio incierto. Límite = precio controlado, ejecución incierta.",
    },
    {
      question: "¿Por qué una comisión taker suele costar más que una maker?",
      options: [
        "Es un error de los exchanges, no tiene lógica",
        "El taker toma liquidez que ya existía en el book; el maker aporta liquidez nueva, algo que el exchange quiere incentivar",
        "El taker siempre opera montos más grandes",
        "No hay diferencia real entre ambas",
      ],
      correctIndex: 1,
      explanation: "Los exchanges premian aportar liquidez (maker) con comisiones más bajas, porque eso mejora el order book para todos.",
    },
    {
      question: "Un trade cerró con $50 de ganancia bruta, pero pagaste $5 de spread y $4 en comisiones totales. ¿Qué lección ilustra mejor este ejemplo?",
      options: [
        "Que las comisiones nunca afectan el resultado real",
        "Que la ganancia neta puede ser mucho menor que la bruta — y en trades chicos, hasta negativa",
        "Que siempre hay que operar sin stop loss",
        "Que el spread solo existe en TRX, no en BTC",
      ],
      correctIndex: 1,
      explanation: "Spread + comisiones se acumulan y reducen la ganancia real — en operaciones pequeñas y frecuentes, pueden convertir una ganancia bruta en pérdida neta.",
    },
    {
      question: "¿Cuál de estas NO es una de las tres formas válidas de medir la distancia de un stop loss en cripto?",
      options: ["Dólares", "Porcentaje", "Ticks", "Pips"],
      correctIndex: 3,
      explanation: "Pips es terminología de Forex. En cripto medimos en dólares, porcentaje y ticks.",
    },
  ],
};
