export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  levelId: string;
  questions: QuizQuestion[];
}

export const QUIZZES: Quiz[] = [
  {
    levelId: "fundamentos",
    questions: [
      {
        question: "¿Qué es Bitcoin, en esencia?",
        options: [
          "Una empresa que cotiza en bolsa",
          "Una moneda digital descentralizada, sin banco central que la controle",
          "Un fondo de inversión administrado por un banco",
          "Una tarjeta de crédito internacional",
        ],
        correctIndex: 1,
        explanation: "Bitcoin es una red descentralizada: no hay un banco central ni una empresa que la controle — la validan miles de participantes independientes.",
      },
      {
        question: "¿Qué es TRX en esta plataforma?",
        options: [
          "El navegador oficial de TRON",
          "El token nativo de la red TRON",
          "Un tipo de wallet",
          "Un indicador técnico",
        ],
        correctIndex: 1,
        explanation: "TRX es la criptomoneda nativa de la blockchain TRON, fundada por Justin Sun — puedes ver su ficha completa en la sección TRON.",
      },
      {
        question: "¿Qué es un exchange centralizado (CEX)?",
        options: [
          "Un tipo de wallet física",
          "Una plataforma donde compras y vendes cripto, como Binance",
          "Un indicador de tendencia",
          "Un contrato inteligente",
        ],
        correctIndex: 1,
        explanation: "Un exchange centralizado es una empresa (como Binance) que opera una plataforma para comprar, vender e intercambiar criptomonedas.",
      },
      {
        question: "¿Qué es una wallet (billetera) cripto?",
        options: [
          "Una tarjeta física que emite el banco",
          "Una herramienta para guardar las claves que dan acceso a tu cripto",
          "Un tipo de exchange",
          "Un gráfico de precios",
        ],
        correctIndex: 1,
        explanation: "Una wallet no 'contiene' cripto físicamente — guarda las claves privadas que demuestran que esa cripto, registrada en la blockchain, es tuya.",
      },
      {
        question: "Si BTC vale $63,700 y subió +1.10% en las últimas 24h, ¿qué representa ese +1.10%?",
        options: [
          "Cuánto subirá mañana",
          "El cambio porcentual respecto al precio de hace 24 horas",
          "La comisión del exchange",
          "El volumen operado",
        ],
        correctIndex: 1,
        explanation: "El % de cambio de 24h siempre compara el precio actual contra el precio de exactamente 24 horas atrás — no predice nada hacia adelante.",
      },
      {
        question: "¿Qué es el 'market cap' (capitalización de mercado)?",
        options: [
          "El precio máximo histórico del activo",
          "El precio actual multiplicado por la cantidad total de monedas en circulación",
          "La cantidad de exchanges donde cotiza",
          "El volumen operado en el último minuto",
        ],
        correctIndex: 1,
        explanation: "Market cap = precio × supply circulante. Es una forma de comparar el 'tamaño' relativo de distintos activos, más allá del precio unitario.",
      },
      {
        question: "¿Qué es el ATH (All-Time High)?",
        options: [
          "El precio promedio de los últimos 30 días",
          "El precio más alto que alcanzó ese activo en toda su historia",
          "Un tipo de orden límite",
          "El precio mínimo de todos los tiempos",
        ],
        correctIndex: 1,
        explanation: "ATH es el máximo histórico — la 'distancia al ATH' que ves en varias secciones mide qué tan lejos está el precio actual de ese pico.",
      },
      {
        question: "¿Por qué la Terminal de esta plataforma usa dinero ficticio en vez de dinero real?",
        options: [
          "Porque todavía no soporta dinero real",
          "Para que puedas practicar y equivocarte sin arriesgar dinero de verdad, con datos de precio 100% reales",
          "Porque cobra comisión",
          "Porque es solo para usuarios avanzados",
        ],
        correctIndex: 1,
        explanation: "El objetivo es aprender: los precios y la ejecución son reales (Binance en vivo), pero el dinero es simulado — el error aquí no cuesta nada, la lección sí queda.",
      },
    ],
  },
  {
    levelId: "leer-grafico",
    questions: [
      {
        question: "En una vela japonesa, ¿qué representan las mechas (las líneas finas arriba y abajo del cuerpo)?",
        options: [
          "El precio de apertura y cierre",
          "El máximo y el mínimo que tocó el precio durante ese período",
          "El volumen operado",
          "La tendencia del día siguiente",
        ],
        correctIndex: 1,
        explanation: "El cuerpo de la vela marca apertura/cierre; las mechas marcan hasta dónde llegó el precio en ese período, aunque no haya cerrado ahí.",
      },
      {
        question: "¿Qué es un soporte?",
        options: [
          "Un nivel de precio donde históricamente el precio tendió a rebotar hacia arriba",
          "El precio máximo histórico",
          "Un tipo de vela japonesa",
          "El promedio de los últimos 200 días",
        ],
        correctIndex: 0,
        explanation: "Un soporte es una zona de precio donde la presión compradora tendió a superar a la vendedora en el pasado, generando rebotes.",
      },
      {
        question: "¿Qué es una resistencia?",
        options: [
          "Lo opuesto a un soporte: una zona donde el precio tendió a frenarse o revertir hacia abajo",
          "El precio mínimo histórico",
          "Un indicador de volumen",
          "La comisión del exchange",
        ],
        correctIndex: 0,
        explanation: "La resistencia es una zona de precio donde la presión vendedora históricamente superó a la compradora.",
      },
      {
        question: "Si el precio va formando máximos y mínimos cada vez más altos, ¿qué tipo de estructura es?",
        options: [
          "Tendencia bajista (Lower Highs / Lower Lows)",
          "Rango lateral",
          "Tendencia alcista (Higher Highs / Higher Lows)",
          "Un fractal bajista",
        ],
        correctIndex: 2,
        explanation: "Máximos y mínimos crecientes (HH/HL) es la definición de estructura alcista — la vas a ver en detalle en Fractales & Estructura.",
      },
      {
        question: "¿Qué información aporta el volumen en un gráfico?",
        options: [
          "El precio promedio del día",
          "Cuánta cantidad del activo se operó en ese período — ayuda a medir la 'convicción' detrás de un movimiento",
          "El próximo soporte",
          "La comisión que cobra el exchange",
        ],
        correctIndex: 1,
        explanation: "Un movimiento de precio con mucho volumen suele considerarse más significativo que el mismo movimiento con poco volumen.",
      },
      {
        question: "¿Qué caracteriza a un patrón 'doji'?",
        options: [
          "Un cuerpo muy grande y sin mechas",
          "Apertura y cierre casi idénticos, reflejando indecisión del mercado",
          "Tres velas verdes seguidas",
          "Una mecha superior enorme sin cuerpo",
        ],
        correctIndex: 1,
        explanation: "El doji tiene un cuerpo casi inexistente porque el precio cerró donde abrió — señal clásica de indecisión, no de dirección.",
      },
      {
        question: "¿Qué significa que una vela envolvente (engulfing) sea alcista?",
        options: [
          "Que la vela verde 'envuelve' completamente el cuerpo de la vela roja anterior",
          "Que hay 5 velas rojas seguidas",
          "Que el volumen bajó a cero",
          "Que el RSI está en 50",
        ],
        correctIndex: 0,
        explanation: "Una envolvente alcista es una vela verde cuyo cuerpo cubre por completo el cuerpo de la vela roja anterior — sugiere que los compradores tomaron el control.",
      },
      {
        question: "¿Por qué el mismo patrón de velas suele ser más confiable en 4h que en 1m?",
        options: [
          "Porque en 1m las velas son de otro color",
          "Porque en marcos más cortos hay mucho más ruido y señales falsas",
          "Porque 4h tiene menos volumen",
          "No hay diferencia real entre temporalidades",
        ],
        correctIndex: 1,
        explanation: "A menor temporalidad, más ruido aleatorio — un patrón que se repite en 4h refleja una decisión de mercado más sostenida que en 1m.",
      },
    ],
  },
  {
    levelId: "indicadores",
    questions: [
      {
        question: "¿Qué mide el RSI?",
        options: [
          "El volumen operado",
          "La velocidad y magnitud de los movimientos recientes de precio, en una escala de 0 a 100",
          "La distancia al ATH",
          "El número de exchanges donde cotiza el activo",
        ],
        correctIndex: 1,
        explanation: "El RSI compara ganancias contra pérdidas recientes para detectar cuándo un movimiento se volvió estadísticamente extremo.",
      },
      {
        question: "Si el RSI está en 85, ¿qué zona indica según esta plataforma?",
        options: [
          "Sobreventa",
          "Zona neutral",
          "Sobrecompra",
          "Divergencia bajista confirmada",
        ],
        correctIndex: 2,
        explanation: "Por encima de 70 se considera sobrecompra — el activo subió con tanta fuerza que estadísticamente está 'caro' respecto a sí mismo.",
      },
      {
        question: "¿Qué representa una media móvil (SMA/EMA)?",
        options: [
          "El precio promedio de los últimos N períodos, suavizando el ruido del precio",
          "El volumen acumulado",
          "El próximo soporte exacto",
          "La comisión del exchange",
        ],
        correctIndex: 0,
        explanation: "Una media móvil promedia los últimos N cierres para dejar ver la dirección de fondo del mercado sin el ruido vela a vela.",
      },
      {
        question: "¿Qué es un 'Golden Cross'?",
        options: [
          "Cuando el RSI cruza 50",
          "Cuando una media móvil corta cruza por encima de una media móvil larga",
          "Cuando el precio toca el ATH",
          "Un patrón de velas japonesas",
        ],
        correctIndex: 1,
        explanation: "El Golden Cross (ej. SMA50 sobre SMA200) se interpreta como posible cambio hacia tendencia alcista de mediano/largo plazo.",
      },
      {
        question: "Según la definición de Bill Williams usada en esta plataforma, ¿cuántas velas forman un fractal?",
        options: ["3 velas", "5 velas", "10 velas", "1 vela"],
        correctIndex: 1,
        explanation: "El fractal clásico usa una ventana de 5 velas: la vela central más 2 a cada lado.",
      },
      {
        question: "¿Cuándo se confirma un fractal en tiempo real?",
        options: [
          "En el momento exacto en que se forma la vela central",
          "2 velas después de la vela central, cuando ya existen las 2 velas posteriores necesarias para compararla",
          "Nunca se confirma, es solo teórico",
          "Al cerrar la sesión diaria",
        ],
        correctIndex: 1,
        explanation: "El fractal necesita 2 velas posteriores para poder comparar — por eso 'repinta' con 2 velas de retraso respecto al mínimo o máximo real.",
      },
      {
        question: "¿Qué compara el MACD?",
        options: [
          "Dos medias móviles exponenciales de distinta velocidad, para medir el momentum",
          "El precio contra el volumen",
          "El RSI contra el Fear & Greed",
          "Dos exchanges distintos",
        ],
        correctIndex: 0,
        explanation: "El MACD resta una EMA rápida menos una EMA lenta — cuando la rápida domina, sugiere momentum alcista creciente, y viceversa.",
      },
      {
        question: "¿Qué mide el Awesome Oscillator (AO)?",
        options: [
          "El precio de cierre únicamente",
          "El momentum reciente comparado contra el momentum de más largo plazo, usando SMA(5) menos SMA(34)",
          "La cantidad de fractales confirmados",
          "El balance de la cuenta de la Terminal",
        ],
        correctIndex: 1,
        explanation: "El AO es un histograma: cuando la media rápida (5) supera a la lenta (34), el momentum reciente es más fuerte que el de fondo.",
      },
    ],
  },
  {
    levelId: "gestion-riesgo",
    questions: [
      {
        question: "¿Qué % de riesgo por trade recomienda como punto de partida la calculadora de esta plataforma?",
        options: ["10-15%", "1-2%", "25%", "50%"],
        correctIndex: 1,
        explanation: "1-2% por trade es el estándar recomendado — permite sobrevivir muchas pérdidas seguidas sin quebrar la cuenta.",
      },
      {
        question: "Con un ratio riesgo/beneficio de 1:2, ¿qué win rate mínimo necesitas para no perder dinero?",
        options: ["Alrededor de 33%", "Alrededor de 90%", "Exactamente 100%", "Alrededor de 66%"],
        correctIndex: 0,
        explanation: "Win rate mínimo = 1 / (1 + ratio) = 1/3 ≈ 33.3% — con 1:2 puedes perder 2 de cada 3 trades y seguir siendo rentable.",
      },
      {
        question: "Si tu cuenta cae -50%, ¿qué % de ganancia necesitas para volver al balance inicial?",
        options: ["50%", "75%", "100%", "25%"],
        correctIndex: 2,
        explanation: "La pérdida y la recuperación no son simétricas: recuperar un -50% requiere un +100% sobre el capital ya reducido.",
      },
      {
        question: "¿Qué es el 'revenge trading'?",
        options: [
          "Una estrategia de cobertura profesional",
          "Abrir un nuevo trade apurado, generalmente más grande, para 'recuperar' una pérdida reciente",
          "Un tipo de orden límite",
          "Copiar las operaciones de otro trader",
        ],
        correctIndex: 1,
        explanation: "El revenge trading es una reacción emocional a una pérdida — suele llevar a peores decisiones que el proceso normal.",
      },
      {
        question: "¿Cuál es el orden correcto para calcular el tamaño de una posición?",
        options: [
          "Elegir el tamaño primero, después ver qué stop loss queda",
          "Definir el % de riesgo y el stop loss primero, y dejar que eso determine el tamaño",
          "Usar siempre el 100% del balance",
          "El tamaño no depende del stop loss",
        ],
        correctIndex: 1,
        explanation: "Se calcula al revés de lo intuitivo: primero el riesgo en $ (balance × %riesgo) y el stop loss, y de ahí sale el tamaño correcto.",
      },
      {
        question: "¿Qué es el FOMO en trading?",
        options: [
          "Un indicador técnico",
          "El miedo a quedarse afuera de un movimiento, que empuja a entrar sin plan",
          "Un tipo de vela japonesa",
          "Una estrategia de gestión de riesgo",
        ],
        correctIndex: 1,
        explanation: "FOMO es 'Fear Of Missing Out' — la urgencia de entrar solo porque el precio 'ya se movió mucho', sin ningún análisis detrás.",
      },
      {
        question: "¿Por qué mover un stop loss en contra tuyo (para 'darle espacio') es peligroso?",
        options: [
          "No es peligroso, es una técnica válida",
          "Porque convierte una pérdida controlada y definida en una pérdida sin límite claro",
          "Porque el exchange lo prohíbe",
          "Porque cambia el color de la vela",
        ],
        correctIndex: 1,
        explanation: "El stop loss se define antes de entrar precisamente para no tomar esa decisión con la emoción de una pérdida ya en curso.",
      },
      {
        question: "Según el simulador de rachas de Gestión de Riesgo, ¿qué tiende a pasarle a una cuenta que arriesga 10% por trade en una racha de pérdidas?",
        options: [
          "No le afecta, el riesgo por trade no importa",
          "Puede quebrar la cuenta con relativamente pocas pérdidas seguidas",
          "Se vuelve automáticamente rentable",
          "El exchange la protege",
        ],
        correctIndex: 1,
        explanation: "Con 10% de riesgo por trade, una racha de 15-20 pérdidas (estadísticamente esperable) puede dejar la cuenta casi en cero.",
      },
    ],
  },
  {
    levelId: "estrategias",
    questions: [
      {
        question: "En el Combo A (sistema Bill Williams original), ¿qué indicador da el 'contexto' de tendencia?",
        options: ["El Awesome Oscillator", "El Alligator", "El fractal", "El RSI"],
        correctIndex: 1,
        explanation: "El Alligator abre la boca en una dirección primero — eso define el contexto antes de buscar la señal de entrada (el fractal).",
      },
      {
        question: "En el Combo B (confluencia de niveles), ¿qué dos métodos independientes coinciden en el mismo precio?",
        options: [
          "El RSI y el MACD",
          "Un Pivot Point (S1) y un fractal confirmado",
          "El volumen y el ATH",
          "Dos medias móviles",
        ],
        correctIndex: 1,
        explanation: "Un fractal calculado desde el precio y un pivot calculado matemáticamente de antemano son métodos independientes — cuando coinciden, la señal es más fuerte.",
      },
      {
        question: "¿Qué es un BOS (Break of Structure)?",
        options: [
          "La primera ruptura en contra de la tendencia vigente",
          "Una ruptura de un máximo (o mínimo) previo que confirma continuación de la tendencia",
          "Un tipo de vela japonesa",
          "El cierre de una posición en la Terminal",
        ],
        correctIndex: 1,
        explanation: "El BOS confirma que la tendencia sigue: un nuevo máximo que supera al anterior en tendencia alcista, por ejemplo.",
      },
      {
        question: "¿Qué es un CHoCH (Change of Character)?",
        options: [
          "Lo mismo que un BOS",
          "La primera ruptura en contra de la estructura vigente — posible aviso de giro de tendencia",
          "Un indicador de volumen",
          "El nombre de un patrón de velas",
        ],
        correctIndex: 1,
        explanation: "El CHoCH es la primera señal de que la tendencia podría estar cambiando — distinto del BOS, que confirma continuación.",
      },
      {
        question: "Según el principio de las 3 capas (contexto, señal, confirmación), ¿cuántos indicadores como máximo conviene usar por capa?",
        options: ["5 o más", "Uno", "Ninguno", "Tres, siempre"],
        correctIndex: 1,
        explanation: "La regla es máximo un indicador por capa — apilar varios que miden lo mismo no suma información nueva, suma ruido.",
      },
      {
        question: "¿Por qué combinar 5 osciladores de momentum distintos no da 'más certeza'?",
        options: [
          "Porque los osciladores no funcionan",
          "Porque todos miden esencialmente lo mismo — es información redundante, no independiente",
          "Porque tardan mucho en calcularse",
          "Porque el dashboard no lo permite",
        ],
        correctIndex: 1,
        explanation: "Cinco indicadores de la misma categoría (momentum) tienden a decir lo mismo con distintas palabras — no son 5 confirmaciones reales.",
      },
      {
        question: "Si arriesgas 8% de tu cuenta en un solo trade en la Terminal, ¿qué tipo de feedback vas a recibir al cerrarlo?",
        options: [
          "Ninguno, el sistema no evalúa el riesgo",
          "Una advertencia explícita de que el riesgo estuvo muy por encima del 1-2% recomendado",
          "Un mensaje felicitándote sin importar el resultado",
          "Se cierra automáticamente el trade",
        ],
        correctIndex: 1,
        explanation: "El motor de feedback de la Terminal evalúa el % de riesgo real de cada trade cerrado y avisa cuando está muy por encima de lo recomendado.",
      },
      {
        question: "¿Cuál es el propósito principal de la Terminal de paper trading?",
        options: [
          "Ganar dinero real",
          "Practicar todo lo aprendido con datos reales y cero riesgo financiero, recibiendo feedback objetivo de cada trade",
          "Reemplazar a un exchange real",
          "Competir contra otros usuarios",
        ],
        correctIndex: 1,
        explanation: "Es el espacio de práctica: mismos datos e indicadores que el resto del dashboard, pero sin dinero real en juego — el error ahí es la lección más barata que existe.",
      },
    ],
  },
  {
    levelId: "contratos-apalancamiento",
    questions: [
      {
        question: "¿Cuál es la diferencia principal entre comprar BTC en Spot y abrir un contrato de futuros?",
        options: [
          "En futuros los precios son distintos a los de spot",
          "En spot eres dueño del activo real; en futuros tienes una posición sobre su precio, sin poseerlo",
          "Los futuros solo existen para TRX, no para BTC",
          "No hay ninguna diferencia real",
        ],
        correctIndex: 1,
        explanation: "En spot el BTC entra a tu wallet, eres dueño de algo real. En futuros nunca posees el activo — solo una posición sobre su precio, lo que te permite apostar tanto a que sube como a que baja.",
      },
      {
        question: "¿Cuándo ganas dinero en una posición SHORT?",
        options: [
          "Cuando el precio del activo sube",
          "Cuando el precio del activo baja",
          "Solo si el mercado está en rango lateral",
          "Nunca — el short siempre pierde con el tiempo",
        ],
        correctIndex: 1,
        explanation: "El short es apostar a la baja: ganas cuando el precio cae. Es lo opuesto al long y algo que en spot es imposible (a lo sumo evitas una pérdida si no vendes).",
      },
      {
        question: "Abres una posición con 10x de apalancamiento y el precio se mueve 2% en tu contra. ¿Aproximadamente qué % de tu margen pierdes?",
        options: ["2%", "10%", "20%", "0.2%"],
        correctIndex: 2,
        explanation: "El efecto se multiplica por el apalancamiento: 2% de movimiento × 10x = 20% de tu margen. Por eso un movimiento chico del precio puede ser un golpe grande a tu cuenta.",
      },
      {
        question: "Quieres abrir una posición de $5,000 de exposición con 25x de apalancamiento. ¿Cuánto margen necesitas bloquear?",
        options: ["$5,000", "$500", "$200", "$25"],
        correctIndex: 2,
        explanation: "Margen = exposición / apalancamiento = $5,000 / 25 = $200. El apalancamiento reduce el margen necesario, pero no cambia cuánto dinero real está en juego con el movimiento del precio.",
      },
      {
        question: "¿Cuál es la ventaja del margen AISLADO sobre el CRUZADO para alguien que recién empieza?",
        options: [
          "El aislado da más apalancamiento disponible",
          "Si te liquidan, solo pierdes el margen de esa posición puntual — el resto de tu cuenta queda a salvo",
          "El aislado no cobra funding rate",
          "No hay ninguna diferencia práctica",
        ],
        correctIndex: 1,
        explanation: "Con margen aislado, una liquidación solo te cuesta el margen que asignaste a esa posición. Con margen cruzado, toda tu cuenta respalda la posición — más difícil de liquidar en esa operación puntual, pero expone todo tu balance.",
      },
      {
        question: "Entras LONG con $200 de margen a 10x en BTC a $63,000. Usando un margen de mantenimiento aproximado de 0.5%, ¿a qué precio aproximado te liquidas?",
        options: ["≈ $60,000", "≈ $57,000", "≈ $50,000", "≈ $61,500"],
        correctIndex: 1,
        explanation: "Distancia a liquidación ≈ 1/apalancamiento − margen de mantenimiento = 1/10 − 0.5% = 9.5%. Precio de liquidación ≈ $63,000 × (1 − 0.095) ≈ $57,015.",
      },
      {
        question: "Mantienes una posición de $10,000 de exposición con un funding rate de 0.01% cada 8 horas en tu contra. ¿Aproximadamente cuánto pagas en un día completo (3 pagos)?",
        options: ["$0.30", "$3", "$30", "$300"],
        correctIndex: 1,
        explanation: "Cada pago: $10,000 × 0.0001 = $1. En un día hay 3 pagos de funding (cada 8h) → $1 × 3 = $3 por día.",
      },
      {
        question: "Si sigues la regla profesional de arriesgar siempre el mismo % de tu cuenta, ¿qué cambia realmente el apalancamiento?",
        options: [
          "Cuánto dinero real arriesgas en la operación",
          "Solo el margen que necesitas bloquear — el riesgo real en dólares no cambia si tu stop loss se respeta",
          "El precio de entrada de la operación",
          "El apalancamiento siempre aumenta el riesgo real, sin excepción",
        ],
        correctIndex: 1,
        explanation: "El error mental más común es pensar 'más apalancamiento = más riesgo'. En realidad, si defines tu tamaño de posición por el % de cuenta que arriesgas con tu SL, el apalancamiento solo determina cuánto margen bloqueas — no cuánto pierdes si el SL se ejecuta.",
      },
      {
        question: "¿En cuál de estas situaciones es más peligroso abrir una posición apalancada?",
        options: [
          "Con una tendencia clara y un stop loss ya definido",
          "En un rango lateral sin dirección clara, o justo antes de una noticia de alta volatilidad, sin plan de salida",
          "Usando apalancamiento bajo (2x-3x)",
          "Con margen aislado",
        ],
        correctIndex: 1,
        explanation: "Sin dirección clara o con un evento de alta volatilidad encima, el ruido del mercado es impredecible — justo el escenario donde una liquidación por apalancamiento alto es más probable, sin que tu análisis haya estado necesariamente equivocado.",
      },
      {
        question: "Tienes una posición LONG a 20x con margen aislado. Tu stop loss está a 8% de distancia del precio de entrada. La liquidación (margen de mantenimiento ~0.5%) está a 1/20 − 0.5% = 4.5% de distancia. ¿Qué va a pasar si el precio cae?",
        options: [
          "Tu stop loss se ejecuta primero, como planeaste",
          "Te liquidas antes de que tu stop loss llegue a activarse — el SL nunca se ejecuta",
          "Ambos se ejecutan al mismo tiempo",
          "No pasa nada, el exchange respeta siempre el SL primero",
        ],
        correctIndex: 1,
        explanation: "La liquidación (4.5%) está más cerca que el stop loss (8%), así que el precio te liquida antes de llegar a tu SL. La regla es siempre verificar que la distancia a liquidación sea MAYOR que la distancia de tu stop loss — si no, tu stop loss nunca se ejecutaría.",
      },
    ],
  },
];
