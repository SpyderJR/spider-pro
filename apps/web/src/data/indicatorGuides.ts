export interface IndicatorGuide {
  id: string;
  title: string;
  shortName: string;
  icon: string;
  category: "Tendencia" | "Momentum" | "Volumen" | "Volatilidad";
  /** Analogía simple (sin jerga) antes de la explicación técnica — mismo principio pedagógico de
   * "la idea en simple antes de los números" que ya usan ConceptCard y la Academia. */
  analogy: string;
  what: string;
  formula: string;
  howToRead: string;
  example: string;
  bestConditions: string;
  limitations: string;
  signals: string[];
  commonMistakes: string[];
  /** 3 pasos concretos para probarlo YA en las herramientas reales de Spider (Terminal,
   * Backtester, Análisis Técnico) — sin esto, la sección se queda en teoría abstracta. */
  practicalSteps: string[];
}

export const INDICATOR_GUIDES: IndicatorGuide[] = [
  {
    id: "medias-cruces",
    title: "Medias Móviles y Cruces (Golden/Death Cross)",
    shortName: "Medias Móviles",
    icon: "〰",
    category: "Tendencia",
    analogy:
      "Vas manejando de noche y en vez de mirar cada piedra del camino, te fijas en el promedio de los últimos 50 metros — eso es una media móvil: te muestra hacia dónde va el camino de fondo sin que cada bache te distraiga.",
    what: "Una media móvil suaviza el ruido del precio promediando los últimos N cierres, para dejar ver la dirección de fondo del mercado. La SMA pesa todos los datos por igual; la EMA pesa más los datos recientes, por lo que reacciona más rápido. Un 'Golden Cross' ocurre cuando una media corta cruza por encima de una larga; un 'Death Cross', cuando cruza por debajo.",
    formula: "SMA = (P₁ + P₂ + ... + Pₙ) / N   ·   EMA = Precio × k + EMA_anterior × (1 − k), con k = 2/(N+1)",
    howToRead:
      "Precio por encima de la media = sesgo alcista de fondo; por debajo = sesgo bajista. Cuanto más se alejan las dos medias entre sí, más fuerte es la tendencia. Cuando se juntan y aplanan, el mercado está indeciso.",
    example:
      "En BTC, cuando la SMA50 cruza por encima de la SMA200 (Golden Cross), muchos fondos institucionales interpretan que empieza una fase alcista de fondo y ajustan su asignación de cartera — ese cruce ocurrió, por ejemplo, en abril de 2020, meses antes del gran rally 2020-2021.",
    bestConditions:
      "Funciona mejor en mercados con tendencias sostenidas y de temporalidades altas (4h en adelante). Es la base de casi cualquier sistema de seguimiento de tendencia (trend-following).",
    limitations:
      "En mercados laterales genera 'cruces falsos' constantes (whipsaws) que producen señales contradictorias en poco tiempo. Es un indicador rezagado: confirma tendencias que ya empezaron, nunca las anticipa.",
    signals: [
      "Golden Cross: confirmación de tendencia alcista de fondo",
      "Death Cross: confirmación de tendencia bajista de fondo",
      "Precio rebotando repetidamente sobre una media: esa media actúa como soporte dinámico",
    ],
    commonMistakes: [
      "Usar cruces de medias en 1m o 5m — el ruido de esos marcos genera demasiadas señales falsas",
      "Ignorar el contexto: un Golden Cross en medio de una tendencia bajista de fondo es menos fiable",
      "Operar el cruce apenas ocurre sin esperar confirmación de al menos una vela adicional",
    ],
    practicalSteps: [
      "En la Terminal, activa EMA 20 y EMA 50 desde el panel de indicadores y observa varios días si el precio se mantiene arriba o abajo de ambas.",
      "En el Backtester, arma la condición 'EMA(20) cruza por arriba de EMA(50)' como regla de entrada y corre el backtest para ver si esa señal habría funcionado en el activo que te interesa.",
      "Repite el mismo backtest en 15m y en 4h — vas a comprobar en números por qué este indicador se recomienda para marcos altos, no cortos.",
    ],
  },
  {
    id: "bollinger",
    title: "Bandas de Bollinger",
    shortName: "Bollinger",
    icon: "⌇",
    category: "Volatilidad",
    analogy:
      "Es un elástico alrededor del precio: cuando el mercado está tranquilo el elástico se aprieta, y cuando se estira mucho de golpe ('squeeze') suele ser porque está a punto de soltarse con fuerza en alguna dirección.",
    what: "Tres líneas: una media móvil central (típicamente SMA20) y dos bandas ubicadas a N desviaciones estándar (típicamente 2) por encima y por debajo. Como la desviación estándar mide dispersión, las bandas se expanden cuando el mercado se vuelve más volátil y se contraen cuando se calma.",
    formula: "Banda superior = SMA(20) + 2σ   ·   Banda inferior = SMA(20) − 2σ, donde σ es la desviación estándar de los últimos 20 cierres",
    howToRead:
      "El ~95% de la acción de precio ocurre estadísticamente dentro de las bandas (2 desviaciones estándar). Bandas muy juntas ('squeeze') indican baja volatilidad y suelen preceder a un movimiento fuerte. Bandas muy separadas indican volatilidad ya elevada, con menor margen de expansión adicional.",
    example:
      "Cuando el ancho de banda de TRX cae a un mínimo de varios meses (squeeze), operadores de opciones y futuros suelen anticipar una ruptura fuerte en cualquier dirección y ajustan su tamaño de posición o compran volatilidad antes del evento.",
    bestConditions:
      "Muy útil combinado con RSI o volumen: precio tocando la banda inferior + RSI bajo es una lectura más confiable que la banda sola.",
    limitations:
      "Tocar la banda superior NO es automáticamente señal de venta — en tendencias fuertes el precio puede 'caminar' pegado a la banda durante muchas velas seguidas ('band walk').",
    signals: [
      "Precio en banda inferior + RSI bajo: posible zona de sobreventa",
      "Precio en banda superior + RSI alto: posible zona de sobrecompra",
      "Contracción extrema de bandas ('squeeze'): suele preceder a un movimiento fuerte",
    ],
    commonMistakes: [
      "Vender apenas el precio toca la banda superior en una tendencia alcista fuerte (band walk)",
      "Ignorar la dirección de la media central, que ya indica el sesgo de fondo",
      "Usar el mismo período de banda (20) en todas las temporalidades sin ajustar",
    ],
    practicalSteps: [
      "Activa 'Bollinger' en Análisis Técnico y observa cómo se abren y se cierran las bandas según la volatilidad del momento.",
      "Combínalo con el toggle de RSI: busca el precio tocando la banda inferior justo cuando el RSI también está bajo — dos señales de sobreventa a la vez.",
      "En el Backtester, prueba una condición de 'precio' cruzando por debajo de un valor cercano a tu banda inferior actual para simular una entrada en squeeze.",
    ],
  },
  {
    id: "vwap",
    title: "VWAP — Precio Promedio Ponderado por Volumen",
    shortName: "VWAP",
    icon: "▤",
    category: "Tendencia",
    analogy:
      "Es el precio 'real' promedio al que se movió el dinero de verdad, no un promedio simple: si mil personas compraron a $100 y una sola a $200, un promedio simple diría $150, pero el VWAP sabe que casi todo el volumen ocurrió en $100.",
    what: "Precio promedio acumulado desde un punto de partida, donde cada vela pesa según su volumen operado. A diferencia de una media simple, una vela con mucho volumen mueve más el VWAP que una vela de bajo volumen — refleja mejor 'a qué precio se movió realmente el dinero'.",
    formula: "VWAP = Σ(Precio típico × Volumen) / Σ(Volumen)   ·   Precio típico = (Máximo + Mínimo + Cierre) / 3",
    howToRead:
      "Precio por encima del VWAP = los compradores recientes están, en promedio, ganando — sesgo comprador dominante. Precio por debajo = sesgo vendedor dominante. Muchos algoritmos institucionales usan el VWAP como benchmark de ejecución: comprar por debajo de VWAP se considera 'buena ejecución'.",
    example:
      "Un trader intradía que compró TRX y ve el precio sostenerse por encima del VWAP durante toda la sesión gana confianza en mantener la posición; si el precio perfora el VWAP hacia abajo con volumen, muchos cierran la posición ahí mismo.",
    bestConditions:
      "Diseñado para operativa intradía — pierde relevancia estadística en gráficos de muy largo plazo (semanal/mensual) donde el 'ancla' de inicio del cálculo importa menos.",
    limitations:
      "En esta plataforma el VWAP es 'anclado' al inicio de las velas cargadas, no a la apertura de la sesión de mercado tradicional (cripto opera 24/7 sin apertura fija) — es una referencia de tendencia acumulada, no un VWAP de sesión bursátil clásico.",
    signals: [
      "Rebote sobre VWAP en tendencia alcista: posible continuación",
      "Rechazo desde VWAP en tendencia bajista: posible continuación bajista",
      "Cruce de precio a través del VWAP: posible cambio de sesgo de corto plazo",
    ],
    commonMistakes: [
      "Tratar el VWAP como un soporte/resistencia infalible en vez de una referencia de sesgo",
      "Usarlo en timeframes semanales/mensuales donde pierde su propósito original",
      "No considerar que un solo volumen anómalo puede distorsionar el VWAP temporalmente",
    ],
    practicalSteps: [
      "Activa 'VWAP' en el panel de indicadores de la Terminal y observa si el precio actual está por encima o por debajo de la línea.",
      "Abre una posición en Paper Trading y usa el VWAP como referencia mental: mantener la posición mientras el precio lo respeta, replantearla si lo pierde con volumen.",
      "Compáralo con la EMA20 en el mismo gráfico — vas a notar que el VWAP reacciona distinto en velas de mucho volumen, algo que una media simple no distingue.",
    ],
  },
  {
    id: "parabolic-sar",
    title: "Parabolic SAR",
    shortName: "Parabolic SAR",
    icon: "•",
    category: "Tendencia",
    analogy:
      "Es un stop-loss que camina solo detrás del precio, como una sombra que se acerca cada vez más rápido mientras la tendencia dura — así protege ganancias sin que tengas que mover nada a mano.",
    what: "'Stop And Reverse': una serie de puntos que siguen al precio como un stop-loss dinámico, acelerando su velocidad de seguimiento (factor de aceleración) cuanto más tiempo se sostiene la tendencia. Cuando el precio toca el punto, el indicador 'voltea' de lado y empieza a seguir la tendencia contraria.",
    formula: "SAR siguiente = SAR actual + AF × (Punto Extremo − SAR actual), donde AF crece de 0.02 en 0.02 hasta un máximo de 0.2 mientras la tendencia continúa",
    howToRead:
      "Puntos debajo de las velas = tendencia alcista activa, esos puntos actúan como trailing stop sugerido. Puntos encima de las velas = tendencia bajista activa. La distancia entre el precio y el punto se va achicando mientras la tendencia madura — eso es intencional, para proteger ganancias.",
    example:
      "Un trader en una posición larga de BTC puede usar el nivel del Parabolic SAR del día como su stop-loss dinámico: a medida que el precio sube, el SAR sube con él, 'bloqueando' ganancias sin necesidad de mover el stop manualmente vela por vela.",
    bestConditions:
      "Excelente como mecanismo de trailing stop en tendencias direccionales claras y sostenidas.",
    limitations:
      "En mercados laterales o de baja volatilidad genera volteos constantes que resultan en señales falsas muy seguidas — casi inútil sin un filtro de tendencia (como ADX) que confirme que realmente hay tendencia.",
    signals: [
      "Volteo de puntos de arriba a abajo: posible inicio de tendencia alcista",
      "Volteo de puntos de abajo a arriba: posible inicio de tendencia bajista",
      "Funciona mejor en mercados con tendencia clara; da señales falsas en rangos laterales",
    ],
    commonMistakes: [
      "Usarlo solo, sin confirmar con ADX que hay una tendencia real en curso",
      "Operar cada volteo como señal de entrada en vez de usarlo solo como stop dinámico",
      "Aplicarlo en rangos laterales, donde produce la mayoría de sus señales falsas",
    ],
    practicalSteps: [
      "Activa ADX junto al Parabolic SAR en el mismo gráfico — solo confía en el SAR cuando el ADX confirme que hay tendencia real (arriba de 25).",
      "En una posición larga de Paper Trading, sigue el nivel del SAR del día y ajusta tu Stop Loss manualmente a ese nivel cada pocas velas para simular un trailing stop.",
      "En el Backtester, aproxima su comportamiento con una salida basada en el cruce del precio contra una EMA corta, y compara qué tan seguido te habría sacado de una tendencia sana.",
    ],
  },
  {
    id: "rsi",
    title: "RSI — Índice de Fuerza Relativa",
    shortName: "RSI",
    icon: "◐",
    category: "Momentum",
    analogy:
      "Es un velocímetro de qué tan 'estirado' está el precio respecto a sí mismo: no mide si va rápido o lento en términos absolutos, sino si subió o bajó demasiado rápido en muy poco tiempo comparado con su propio ritmo reciente.",
    what: "Compara la magnitud de las subidas contra las bajadas de los últimos N periodos (14 por defecto) y la expresa en una escala fija de 0 a 100, para detectar cuándo un movimiento se volvió estadísticamente extremo respecto a su propio historial reciente.",
    formula: "RSI = 100 − [100 / (1 + RS)]   ·   RS = Promedio de ganancias / Promedio de pérdidas (suavizado, método de Wilder)",
    howToRead:
      "Por encima de 70: el activo subió con tanta fuerza reciente que estadísticamente está 'caro' respecto a sí mismo (sobrecompra). Por debajo de 30: lo opuesto (sobreventa). Entre 30 y 70 es zona neutral — la mayor parte del tiempo el precio vive ahí.",
    example:
      "Si TRX sube 8 días seguidos casi sin pausas, su RSI probablemente supere 75-80: eso no significa 'vender ya', significa que una pausa o corrección de corto plazo es estadísticamente más probable que una continuación igual de vertical.",
    bestConditions:
      "Muy fiable en mercados que oscilan dentro de un rango (range-bound). También muy útil buscando divergencias contra el precio.",
    limitations:
      "En tendencias fuertes, el RSI puede quedarse 'pegado' por encima de 70 (o debajo de 30) durante semanas — vender solo porque 'está sobrecomprado' en plena tendencia fuerte es uno de los errores más comunes en trading.",
    signals: [
      "RSI > 70: posible corrección a la baja en el corto plazo",
      "RSI < 30: posible rebote en el corto plazo",
      "Divergencias entre precio y RSI pueden anticipar giros de tendencia",
    ],
    commonMistakes: [
      "Vender automáticamente al tocar 70 sin considerar que la tendencia puede seguir con fuerza",
      "Ignorar las divergencias (precio hace máximo nuevo, RSI no) que suelen ser más valiosas que el nivel absoluto",
      "Usar el mismo umbral 30/70 en todos los activos sin ajustar por su volatilidad típica",
    ],
    practicalSteps: [
      "En la Terminal, el RSI ya viene activado por defecto — míralo en el panel oscilador debajo del gráfico mientras el precio se mueve.",
      "En el Backtester, la condición por defecto ya es 'RSI(14) cruza por abajo de 30' — ejecútala tal cual para ver, con números reales, cómo se prueba esta señal contra años de velas.",
      "Cambia el par y la temporalidad y vuelve a correr el mismo backtest: vas a comprobar que el umbral clásico 30/70 no funciona igual de bien en todos lados.",
    ],
  },
  {
    id: "macd",
    title: "MACD — Convergencia/Divergencia de Medias Móviles",
    shortName: "MACD",
    icon: "≈",
    category: "Momentum",
    analogy:
      "Es la diferencia de velocidad entre un auto rápido y uno lento que van en la misma dirección: cuando el rápido se aleja del lento, la tendencia está acelerando; cuando se acercan de nuevo, está perdiendo fuerza.",
    what: "Mide la relación entre dos EMAs (rápida de 12 y lenta de 26 periodos) para capturar cambios de momentum antes de que sean obvios en el precio. La línea de señal (EMA9 del MACD) actúa como gatillo, y el histograma visualiza la distancia entre ambas.",
    formula: "MACD = EMA(12) − EMA(26)   ·   Señal = EMA(9) del MACD   ·   Histograma = MACD − Señal",
    howToRead:
      "MACD por encima de 0: la media rápida está por encima de la lenta, momentum alcista de fondo. El histograma expandiéndose (más alto o más bajo) indica que la tendencia actual está acelerando; contrayéndose hacia 0 indica que está perdiendo fuerza.",
    example:
      "Un histograma de MACD que pasa de barras rojas decrecientes a la primera barra verde suele ser una de las señales de reversión de momentum más vigiladas por traders de swing en criptomonedas, especialmente si coincide con un soporte técnico.",
    bestConditions:
      "Muy popular precisamente porque combina tendencia y momentum en un solo indicador — funciona razonablemente bien en la mayoría de condiciones de mercado, con matices.",
    limitations:
      "Al estar basado en EMAs, es un indicador rezagado (lagging): confirma giros después de que ya ocurrieron, no los predice. En mercados muy laterales genera cruces frecuentes de bajo valor.",
    signals: [
      "Cruce MACD > señal: posible impulso alcista",
      "Cruce MACD < señal: posible impulso bajista",
      "Histograma expandiéndose: la tendencia actual está ganando fuerza",
    ],
    commonMistakes: [
      "Operar cada cruce de líneas en marcos muy cortos sin filtrar por tendencia mayor",
      "No prestarle atención al histograma, que suele anticipar el cruce de líneas",
      "Ignorar divergencias entre el precio y el MACD en máximos/mínimos importantes",
    ],
    practicalSteps: [
      "Activa el panel de MACD en Análisis Técnico y observa el histograma cambiar de color cada vez que cruza el cero.",
      "En el Backtester, arma una condición con 'MACD Histograma' cruzando por arriba de 0 como señal de entrada.",
      "Combina esa condición con una de RSI en la misma regla — recuerda que en el Backtester varias condiciones son un AND, así exiges las dos cosas a la vez antes de entrar.",
    ],
  },
  {
    id: "estocastico",
    title: "Oscilador Estocástico (%K / %D)",
    shortName: "Estocástico",
    icon: "↯",
    category: "Momentum",
    analogy:
      "Piensa en dónde cruzas la meta dentro de una pista: si siempre terminas pegado al borde de adelante, vas 'fuerte'. El Estocástico mide justamente eso — en qué punto de su propio rango reciente cerró el precio.",
    what: "Parte de la premisa de que en tendencias alcistas el precio tiende a cerrar cerca de su máximo reciente, y en tendencias bajistas cerca de su mínimo. %K mide dónde cerró el precio dentro de su rango de los últimos N periodos; %D es una media móvil de %K que suaviza la señal.",
    formula: "%K = 100 × (Cierre − Mínimo(N)) / (Máximo(N) − Mínimo(N))   ·   %D = SMA(3) de %K",
    howToRead:
      "Por encima de 80: el precio está cerrando sistemáticamente cerca de sus máximos recientes (sobrecompra de corto plazo). Por debajo de 20: cerca de sus mínimos (sobreventa). El cruce de %K sobre %D dentro de esas zonas es la señal clásica de entrada/salida de corto plazo.",
    example:
      "En operativa de 5-15 minutos, un cruce de %K sobre %D con ambas líneas por debajo de 20 es una de las señales de rebote de corto plazo más usadas por scalpers, generalmente combinada con un nivel de soporte.",
    bestConditions:
      "Diseñado para mercados oscilantes de corto plazo — es de los indicadores más usados específicamente para timeframes de 1m a 15m.",
    limitations:
      "Muy sensible al ruido: en marcos ultra-cortos puede cruzar decenas de veces por hora sin que ninguna señal sea aprovechable por sí sola.",
    signals: [
      "%K cruza por encima de %D en zona <20: posible señal de compra",
      "%K cruza por debajo de %D en zona >80: posible señal de venta",
      "Muy sensible al ruido — se usa mejor combinado con otro indicador de tendencia",
    ],
    commonMistakes: [
      "Operar cada cruce sin filtro de tendencia superior — en tendencias fuertes se queda 'pegado' en zonas extremas igual que el RSI",
      "Usarlo aislado en vez de combinarlo con soporte/resistencia o volumen",
      "No ajustar el período según la temporalidad operada",
    ],
    practicalSteps: [
      "Actívalo en Análisis Técnico y bájalo a temporalidades cortas (5m-15m), que es donde está pensado para funcionar mejor.",
      "Busca visualmente el cruce de %K sobre %D justo mientras ambas líneas están por debajo de 20.",
      "Compáralo en paralelo con el RSI en el mismo gráfico — vas a notar que el Estocástico se mueve más rápido y cruza mucho más seguido.",
    ],
  },
  {
    id: "williams-r",
    title: "Williams %R",
    shortName: "Williams %R",
    icon: "↕",
    category: "Momentum",
    analogy:
      "Es casi el mismo cálculo que el Estocástico pero sin el suavizado extra — como ver la misma foto sin retocar: más nítida (reacciona antes) pero también más ruidosa (más señales falsas).",
    what: "Matemáticamente casi idéntico al %K del Estocástico, pero invertido y escalado de 0 a -100 en vez de 0 a 100. Mide qué tan cerca cerró el precio del máximo del rango reciente.",
    formula: "%R = -100 × (Máximo(N) − Cierre) / (Máximo(N) − Mínimo(N))",
    howToRead:
      "Entre 0 y -20: sobrecompra (cerca del máximo reciente). Entre -80 y -100: sobreventa (cerca del mínimo reciente). Al no llevar suavizado adicional como el %D del Estocástico, reacciona un paso más rápido — útil para timing, más ruidoso también.",
    example:
      "Scalpers que buscan entradas muy tempranas en reversiones de 1-5 minutos suelen preferir Williams %R sobre el Estocástico exactamente por esa mayor velocidad de reacción, aceptando a cambio más señales falsas.",
    bestConditions:
      "Útil en marcos cortos para timing de entradas, siempre con confirmación de otro indicador o de un nivel de soporte/resistencia.",
    limitations:
      "Su mayor velocidad de reacción es también su debilidad: genera más falsas alarmas que el Estocástico suavizado, especialmente en mercados de baja liquidez.",
    signals: [
      "Williams %R > -20: posible zona de sobrecompra",
      "Williams %R < -80: posible zona de sobreventa",
      "Útil en marcos cortos para timing de entradas, con confirmación de otro indicador",
    ],
    commonMistakes: [
      "Confundirlo con el RSI por su escala similar y aplicarle los mismos supuestos",
      "Usarlo como única señal sin ningún filtro de contexto de tendencia",
      "Ignorar que su extrema sensibilidad exige un stop-loss más ajustado que otros osciladores",
    ],
    practicalSteps: [
      "Actívalo junto al Estocástico en el mismo gráfico y compara cómo reacciona cada uno ante la misma vela.",
      "Úsalo solo en marcos muy cortos (1m-5m), donde su velocidad de reacción es una ventaja y no un problema.",
      "Nunca lo uses solo — combínalo siempre con un nivel de soporte/resistencia visible en el gráfico antes de considerar una entrada.",
    ],
  },
  {
    id: "cci",
    title: "CCI — Índice de Canal de Materias Primas",
    shortName: "CCI",
    icon: "⟡",
    category: "Momentum",
    analogy:
      "En vez de preguntar '¿está caro en una escala fija de 0 a 100?', el CCI pregunta '¿qué tan lejos está de su comportamiento normal reciente, sin ningún límite?' — por eso puede dispararse muy por arriba de 100 en movimientos realmente fuertes.",
    what: "Originalmente diseñado para commodities, mide qué tan lejos está el precio típico actual de su media estadística reciente, en unidades de desviación media. A diferencia del RSI, no está acotado a un rango fijo — puede irse muy por encima de +100 o muy por debajo de -100 en movimientos extremos.",
    formula: "CCI = (Precio típico − SMA del precio típico) / (0.015 × Desviación media)",
    howToRead:
      "Entre -100 y +100 se considera 'rango normal' de fluctuación. Cruzar por encima de +100 sugiere el inicio de un movimiento alcista inusualmente fuerte (no solo sobrecompra); cruzar por debajo de -100, lo mismo en bajista. Muchos lo usan al revés del RSI: como señal de inicio de tendencia fuerte, no de agotamiento.",
    example:
      "Un trader de breakout puede usar el cruce del CCI por encima de +100 como confirmación de que una ruptura de resistencia tiene momentum real detrás, en vez de ser una falsa ruptura de bajo volumen.",
    bestConditions:
      "Particularmente útil para identificar el arranque de movimientos fuertes y nuevas tendencias, más que para 'timing' de reversión.",
    limitations:
      "Al no tener límites fijos, comparar valores de CCI entre distintos activos o periodos no es tan directo como con el RSI (0-100 siempre significa lo mismo; un CCI de 150 en un activo puede no ser comparable a 150 en otro).",
    signals: [
      "CCI cruza por encima de +100: posible inicio de impulso alcista fuerte",
      "CCI cruza por debajo de -100: posible inicio de impulso bajista fuerte",
      "Retorno del CCI hacia 0 desde un extremo: el impulso se está agotando",
    ],
    commonMistakes: [
      "Tratar +100/-100 como sobrecompra/sobreventa clásicas en vez de como señal de arranque de tendencia",
      "Comparar valores absolutos de CCI entre activos distintos sin normalizar",
      "Ignorarlo en favor del RSI cuando en realidad miden cosas ligeramente distintas",
    ],
    practicalSteps: [
      "Actívalo en Análisis Técnico y observa cómo, a diferencia del RSI, puede alejarse mucho de la zona -100/+100 en rupturas fuertes.",
      "Úsalo para confirmar rupturas de resistencia: si el CCI cruza +100 al mismo tiempo que el precio rompe un máximo, es una señal más fuerte que la ruptura sola.",
      "Evita compararlo directamente contra el CCI de otro activo — a diferencia del RSI, su escala no está acotada a 0-100.",
    ],
  },
  {
    id: "roc",
    title: "ROC — Tasa de Cambio (Rate of Change)",
    shortName: "ROC",
    icon: "↗",
    category: "Momentum",
    analogy:
      "Es la pregunta más simple posible sobre momentum: '¿cuánto más caro o más barato estoy comparado con hace N velas?' — sin fórmulas complicadas, solo un porcentaje directo.",
    what: "El indicador de momentum más simple posible: cuánto cambió el precio, en porcentaje, respecto a N velas atrás. Sin suavizados ni normalizaciones — momentum puro y directo.",
    formula: "ROC = [(Precio actual − Precio de hace N periodos) / Precio de hace N periodos] × 100",
    howToRead:
      "ROC positivo = el precio está por encima de donde estaba hace N velas (momentum alcista). ROC negativo = lo contrario. Lo importante no es solo el signo sino la pendiente: un ROC que crece cada vez más rápido indica aceleración; uno que se achica indica desaceleración aunque siga siendo positivo.",
    example:
      "Comparar el ROC de BTC y TRX en la misma temporalidad (como hace la herramienta 'Radar BTC vs TRX' de esta plataforma) es una forma directa de detectar cuál de los dos activos tiene más momentum relativo en un momento dado.",
    bestConditions:
      "Excelente para comparar momentum entre distintos activos en igualdad de condiciones, ya que es un cálculo simple y no está acotado.",
    limitations:
      "Muy sensible a valores atípicos: una sola vela extrema hace N periodos puede distorsionar la lectura hasta que esa vela 'sale' de la ventana de cálculo.",
    signals: [
      "ROC cruza por encima de 0: el momentum pasa a ser positivo",
      "ROC cruza por debajo de 0: el momentum pasa a ser negativo",
      "Picos extremos de ROC suelen preceder consolidaciones",
    ],
    commonMistakes: [
      "Interpretar cualquier ROC positivo como 'comprar' sin mirar si está acelerando o desacelerando",
      "No tener en cuenta que un solo dato extremo puede distorsionar la lectura durante todo el periodo N",
      "Usarlo aislado en vez de para comparar momentum relativo entre activos",
    ],
    practicalSteps: [
      "Compara el ROC de BTC contra el de TRX en la misma temporalidad para ver cuál tiene más momentum relativo ahora mismo.",
      "Úsalo junto al RSI: un ROC acelerando junto con un RSI subiendo confirma que el momentum es real, no solo ruido de una vela.",
      "Presta atención a la pendiente del ROC, no solo a su signo — un ROC positivo pero cayendo ya está avisando desaceleración.",
    ],
  },
  {
    id: "adx",
    title: "ADX con +DI / -DI",
    shortName: "ADX",
    icon: "△",
    category: "Tendencia",
    analogy:
      "No te dice si va ganando el equipo local o el visitante — te dice qué tan reñido o aplastante está el marcador ahora mismo. Quienes te dicen quién va ganando son +DI y -DI.",
    what: "A diferencia de casi todos los demás indicadores de esta lista, el ADX no dice si el mercado sube o baja — dice qué tan fuerte es la tendencia actual, en cualquier dirección. +DI y -DI son quienes indican la dirección: miden la presión direccional compradora y vendedora respectivamente.",
    formula: "ADX = SMA(14) del DX, donde DX = 100 × |+DI − −DI| / (+DI + −DI)",
    howToRead:
      "ADX < 20: no hay tendencia clara, el mercado está en rango — las estrategias de seguimiento de tendencia (medias, MACD, SAR) tienden a fallar aquí. ADX > 25: tendencia establecida y con fuerza real. La dirección la marca cuál de +DI/-DI está más arriba.",
    example:
      "Antes de aplicar un cruce de medias o un Parabolic SAR, muchos traders primero chequean el ADX: si está por debajo de 20, directamente descartan esa señal porque saben que el mercado está lateral y esas herramientas fallan más en ese contexto.",
    bestConditions:
      "Es el filtro ideal para decidir SI conviene usar indicadores de tendencia (medias, MACD, SAR) o de rango (RSI, Estocástico) en un momento dado.",
    limitations:
      "Es un indicador rezagado como la mayoría de los basados en medias móviles — confirma que ya hay tendencia fuerte, no anticipa cuándo va a empezar.",
    signals: [
      "ADX > 25 y +DI > -DI: tendencia alcista fuerte confirmada",
      "ADX > 25 y -DI > +DI: tendencia bajista fuerte confirmada",
      "ADX < 20: evitar estrategias de seguimiento de tendencia, mercado lateral",
    ],
    commonMistakes: [
      "Confundir un ADX alto con 'hay que comprar' — un ADX alto solo dice que hay fuerza, la dirección la dan +DI/-DI",
      "Ignorar el ADX y aplicar cruces de medias en mercados claramente laterales",
      "Esperar que el ADX anticipe el inicio de una tendencia, cuando en realidad la confirma después de iniciada",
    ],
    practicalSteps: [
      "Antes de confiar en EMAs, MACD o SuperTrend en la Terminal, mira primero si el ADX está por encima de 25 — si no, esas herramientas fallan más seguido.",
      "Activa ADX y SuperTrend juntos: usa el SuperTrend con más confianza solo cuando el ADX confirme que hay tendencia real.",
      "Si tu estrategia del Backtester usa cruces de medias, revisa manualmente el ADX de los periodos donde falló — probablemente coincidan con mercado lateral.",
    ],
  },
  {
    id: "mfi",
    title: "MFI — Índice de Flujo de Dinero",
    shortName: "MFI",
    icon: "◈",
    category: "Volumen",
    analogy:
      "Es un RSI que además pregunta '¿y cuánto dinero de verdad se movió en esa subida?' — dos rallys de precio idéntico pesan muy distinto si uno tuvo mucho volumen detrás y el otro casi ninguno.",
    what: "Es, en esencia, un RSI que en vez de mirar solo el precio incorpora el volumen: calcula 'flujo de dinero' multiplicando el precio típico por el volumen de cada vela, y compara los flujos positivos contra los negativos de los últimos N periodos.",
    formula: "MFI = 100 − [100 / (1 + Money Ratio)]   ·   Money Ratio = Flujo de dinero positivo / Flujo de dinero negativo",
    howToRead:
      "Igual que el RSI: >80 sobrecompra, <20 sobreventa. La diferencia clave es que un MFI extremo tiene 'volumen real' detrás — es una lectura de sobrecompra/sobreventa más robusta que un RSI que puede estar moviéndose con poco volumen.",
    example:
      "Cuando el precio de un token hace un nuevo máximo pero el MFI no logra superar su máximo anterior (divergencia), es una señal de que el rally reciente tuvo menos volumen real detrás que el anterior — una advertencia temprana de agotamiento que el RSI solo (sin volumen) no puede dar.",
    bestConditions:
      "Especialmente valioso para detectar divergencias, ya que incorpora una dimensión (volumen) que el precio y el RSI solos no capturan.",
    limitations:
      "En activos de bajo volumen o listados nuevos, los datos de volumen pueden ser erráticos o poco representativos, restándole fiabilidad al indicador.",
    signals: [
      "MFI > 80: posible sobrecompra, especialmente si el precio no confirma con volumen",
      "MFI < 20: posible sobreventa con capitulación de volumen",
      "Divergencia bajista (precio sube, MFI baja): advertencia de debilidad interna",
    ],
    commonMistakes: [
      "Tratarlo como un RSI más sin aprovechar la información extra de volumen que lo diferencia",
      "Aplicarlo en tokens de muy bajo volumen donde los datos son poco confiables",
      "No cruzarlo con el OBV, que da una segunda confirmación de la misma idea (presión de volumen)",
    ],
    practicalSteps: [
      "Compara el MFI y el RSI del mismo activo al mismo tiempo — si divergen, el volumen te está contando algo que el precio solo no muestra.",
      "Actívalo junto al volumen normal del gráfico para ver la relación directa entre ambos.",
      "Úsalo para confirmar, no para decidir solo — combínalo con una señal de sobrecompra/sobreventa que ya viste con el RSI.",
    ],
  },
  {
    id: "obv",
    title: "OBV — Volumen en Balance (On-Balance Volume)",
    shortName: "OBV",
    icon: "▮",
    category: "Volumen",
    analogy:
      "Es un contador que suma un punto cada vez que el precio sube y resta uno cada vez que baja, sin importar cuánto — lo que importa no es el número final sino si esa línea sube o baja junto con el precio.",
    what: "Acumula el volumen en una sola línea: lo suma en velas alcistas y lo resta en velas bajistas. La idea, propuesta por Joseph Granville en los años 60, es que el volumen precede al precio — el 'dinero inteligente' entra o sale antes de que el precio lo refleje del todo.",
    formula: "Si Cierre > Cierre_anterior: OBV = OBV_anterior + Volumen   ·   Si Cierre < Cierre_anterior: OBV = OBV_anterior − Volumen",
    howToRead:
      "Lo que importa es la FORMA de la línea, no su valor absoluto (que no tiene una unidad significativa por sí sola). Un OBV que sube junto con el precio confirma que la tendencia tiene volumen real detrás. Si el precio sube pero el OBV se aplana o cae, es una divergencia de alerta.",
    example:
      "En la ruptura de una resistencia importante de TRX, ver que el OBV también rompe su propia resistencia (o incluso la rompe antes que el precio) da mucha más confianza de que la ruptura es genuina y no una trampa de liquidez de bajo volumen.",
    bestConditions:
      "Ideal para confirmar rupturas de soporte/resistencia y para detectar acumulación o distribución silenciosa antes de que se refleje en el precio.",
    limitations:
      "Un solo volumen anómalo (por ejemplo, una liquidación masiva o un error de bot) puede distorsionar la línea de forma desproporcionada durante un buen tiempo.",
    signals: [
      "OBV y precio suben juntos: la tendencia alcista está respaldada por volumen real",
      "Precio sube pero OBV se aplana o cae: divergencia bajista, posible falta de convicción",
      "Ruptura de una resistencia en el OBV antes que en el precio: puede anticipar el movimiento",
    ],
    commonMistakes: [
      "Mirar el valor absoluto del OBV en vez de su tendencia y forma relativa",
      "No usarlo junto al precio — el OBV solo tiene sentido interpretado en conjunto con la acción de precio",
      "Ignorar picos de volumen anómalos que distorsionan la lectura temporalmente",
    ],
    practicalSteps: [
      "Actívalo debajo del gráfico de precio y compara visualmente la forma de ambas líneas durante la última semana.",
      "Antes de confiar en una ruptura de resistencia, revisa si el OBV también rompió su propia resistencia al mismo tiempo.",
      "Combínalo con el MFI: ambos miden presión de volumen desde ángulos distintos, y que coincidan da más confianza en la señal.",
    ],
  },
  {
    id: "ao",
    title: "AO — Awesome Oscillator",
    shortName: "AO",
    icon: "≋",
    category: "Momentum",
    analogy:
      "Compara qué tan rápido se está moviendo el mercado 'ahora' contra su ritmo de fondo reciente — como notar si un corredor está acelerando o desacelerando comparado con su propio promedio de los últimos kilómetros.",
    what: "Un oscilador de momentum creado por Bill Williams: resta una media móvil simple de 34 periodos a una de 5 periodos, ambas calculadas sobre el precio medio (máximo+mínimo)/2 de cada vela, no sobre el cierre. Mide qué tan rápido se está moviendo el mercado 'ahora' comparado con su ritmo reciente de fondo.",
    formula: "AO = SMA(precio medio, 5) − SMA(precio medio, 34)   ·   precio medio = (Máximo + Mínimo) / 2",
    howToRead:
      "Se dibuja como un histograma alrededor de cero. Barras por encima de cero = momentum alcista dominante; por debajo = momentum bajista. El cambio de color entre una barra y la siguiente (más alta o más baja que la anterior) es la señal clásica de 'plato saucer', usada para entradas tempranas dentro de una tendencia ya identificada.",
    example:
      "En una tendencia alcista de BTC ya confirmada por el Alligator, un cruce del AO de negativo a positivo (o el patrón de 'dos picos' con el segundo más bajo pero aún positivo) se usa como gatillo de entrada dentro de esa tendencia, no como señal de tendencia por sí sola.",
    bestConditions:
      "Diseñado para usarse junto con el Alligator (ambos de Bill Williams): el Alligator confirma que hay tendencia, el AO da el momento de entrada dentro de ella.",
    limitations:
      "Como toda media móvil, es rezagado — no anticipa giros, los confirma después de que ya empezaron. En mercados laterales genera cruces de cero constantes sin valor direccional.",
    signals: [
      "Cruce de cero de negativo a positivo: momentum girando a favor de los compradores",
      "Patrón 'plato saucer' (barras que suben, bajan, vuelven a subir): entrada clásica dentro de tendencia",
      "Divergencia entre precio y AO: el movimiento de precio pierde fuerza interna",
    ],
    commonMistakes: [
      "Usarlo solo, sin confirmar primero que existe una tendencia de fondo con otra herramienta",
      "Confundir el precio medio (high+low)/2 que usa el AO con el cierre — no son lo mismo",
      "Operar cada cruce de cero en un mercado lateral, donde el indicador pierde utilidad",
    ],
    practicalSteps: [
      "Activa el toggle 'AO' en la Terminal y mira el panel oscilador — es el mismo histograma que RSI/MACD pero centrado en el precio medio de cada vela.",
      "Confirma tendencia primero con ADX o EMAs, y usa el AO solo para afinar el momento de entrada dentro de esa tendencia ya confirmada.",
      "Busca el patrón 'plato saucer' (barras que suben, bajan, y vuelven a subir sin cruzar cero) como gatillo de entrada dentro de una tendencia ya identificada.",
    ],
  },
  {
    id: "atr",
    title: "ATR — Average True Range",
    shortName: "ATR",
    icon: "⇕",
    category: "Volatilidad",
    analogy:
      "Es un cinturón de seguridad que se ajusta solo según qué tan movido está el camino: en un día tranquilo lo aprieta poco, en uno lleno de baches lo afloja para no reventarse con cada sacudida normal.",
    what: "Mide la volatilidad en unidades de precio (no en %, ni con dirección): el 'rango verdadero' de cada vela es el mayor entre (máximo−mínimo), (máximo−cierre anterior) y (mínimo−cierre anterior) — así captura también los gaps entre velas, no solo su rango visible. El ATR es el promedio suavizado de ese rango verdadero durante los últimos 14 periodos.",
    formula: "TR = máx(Máximo−Mínimo, |Máximo−Cierre_anterior|, |Mínimo−Cierre_anterior|)   ·   ATR = promedio suavizado (Wilder) de TR sobre 14 periodos",
    howToRead:
      "Un ATR alto significa que el activo se mueve mucho por vela ahora mismo; uno bajo, que está tranquilo. No dice si el precio va a subir o bajar — solo cuánto se mueve. Se usa sobre todo para dimensionar el Stop Loss: un stop fijo de 2% puede ser demasiado ajustado en un día volátil y demasiado ancho en uno tranquilo, mientras que un stop de '1.5× ATR' se adapta solo.",
    example:
      "Con BTC en un ATR(14) de $800 en 1h, un stop de 1.5×ATR = $1,200 de distancia del precio de entrada. Si al día siguiente el ATR sube a $1,500 por un evento macro, el mismo múltiplo produce un stop de $2,250 — se ensancha automáticamente en vez de que el trader lo deje fijo y lo saque el ruido normal de un día más volátil.",
    bestConditions:
      "Imprescindible para dimensionar Stop Loss y Take Profit de forma objetiva, y para comparar la volatilidad actual contra la histórica del mismo activo antes de decidir el tamaño de posición.",
    limitations:
      "No indica dirección — un ATR alto ocurre tanto en rupturas alcistas como en caídas fuertes. Tampoco anticipa cuándo va a cambiar la volatilidad, solo mide la que ya ocurrió.",
    signals: [
      "ATR en mínimos históricos: volatilidad comprimida, suele preceder a un movimiento fuerte",
      "ATR en expansión rápida: el mercado está en un momento de alto riesgo/oportunidad, ajusta tamaño de posición",
      "Usar ATR × multiplicador como distancia de Stop Loss en vez de un % fijo arbitrario",
    ],
    commonMistakes: [
      "Usar el mismo % de Stop Loss en todos los activos y temporalidades sin mirar su ATR real",
      "Confundir un ATR alto con 'va a subir' — solo mide magnitud de movimiento, no dirección",
      "No re-chequear el ATR: un stop calculado hace una semana puede ya no reflejar la volatilidad actual",
    ],
    practicalSteps: [
      "Activa el panel 'ATR' en la Terminal y compara su valor actual contra hace una semana para ver si el mercado se calmó o se aceleró.",
      "En el Backtester, cambia el Stop Loss a modo 'ATR' y compara los resultados contra el mismo backtest en modo '% Fijo' — vas a ver la diferencia en el número de operaciones y el drawdown.",
      "En el panel de Futuros de la Terminal, usa el botón 'Sugerir con ATR' junto al Stop Loss para ver el nivel que calcula automáticamente antes de abrir una posición.",
    ],
  },
  {
    id: "volume-profile",
    title: "Volume Profile (VPVR)",
    shortName: "Vol. Profile",
    icon: "▤",
    category: "Volumen",
    analogy:
      "En vez de preguntar 'CUÁNDO se operó más', pregunta 'a qué PRECIO se operó más' — como un mapa de calor de dónde se concentró la multitud, no de a qué hora llegó.",
    what: "En vez de mostrar el volumen en el tiempo (como el histograma clásico abajo del gráfico), reparte todo el volumen operado por NIVEL DE PRECIO durante el rango visible, dibujado como un histograma horizontal al costado del gráfico. Revela en qué precios se concentró realmente la actividad, sin importar cuándo ocurrió.",
    formula: "Para cada vela, su volumen se reparte proporcionalmente entre las bandas de precio que su rango [mínimo, máximo] atraviesa — sumado por banda a lo largo de todo el periodo analizado.",
    howToRead:
      "El POC (Point of Control) es la banda de precio con más volumen acumulado — suele actuar como imán de precio y zona de soporte/resistencia fuerte. El 'value area' (típicamente ~70% del volumen total) marca la zona donde ocurrió la mayoría de la negociación — precio fuera de esa zona se considera 'caro' o 'barato' en términos relativos recientes.",
    example:
      "Si el POC de BTC en las últimas 4 semanas está en $61,200 y el precio actual cae hacia ahí después de estar mucho más arriba, muchos traders esperan una reacción (rebote o consolidación) en esa zona, precisamente porque fue donde más operadores ya validaron ese precio con volumen real.",
    bestConditions:
      "Muy útil para ubicar zonas de soporte/resistencia basadas en actividad real (no solo en máximos/mínimos visuales) y para entender si el precio actual está en una zona de 'consenso' o en una de 'rechazo' históricamente poco operada.",
    limitations:
      "Ninguna API pública gratuita expone volumen a nivel de cada operación (tick-by-tick) — este perfil se aproxima repartiendo el volumen de cada vela entre las bandas de precio que toca, que es una aproximación razonable pero no es el dato exacto de un exchange con acceso a su libro completo.",
    signals: [
      "Precio acercándose al POC desde lejos: zona de mayor probabilidad de reacción",
      "Zonas de bajo volumen ('low volume nodes'): el precio suele atravesarlas rápido, sin oponer mucha resistencia",
      "Value area alta/baja como referencia de 'caro' vs 'barato' relativo al rango reciente",
    ],
    commonMistakes: [
      "Tratar el POC como un nivel garantizado en vez de una zona de mayor probabilidad estadística",
      "Ignorar que el perfil cambia según el rango de tiempo elegido para calcularlo",
      "Confundirlo con el volumen normal (en el tiempo) que se muestra abajo del gráfico — miden cosas distintas",
    ],
    practicalSteps: [
      "Activa 'Perfil Vol.' en la Terminal y ubica visualmente la banda más ancha del histograma horizontal — ese es el POC.",
      "La próxima vez que el precio se acerque al POC desde lejos, anota si reaccionó ahí o lo atravesó de largo — así calibras tu propia confianza en el nivel.",
      "Compara el perfil en 15m contra 4h para el mismo activo — vas a ver que el POC cambia según cuánto historial estés mirando.",
    ],
  },
  {
    id: "pivot-points",
    title: "Pivot Points (Puntos Pivote)",
    shortName: "Pivots",
    icon: "⌗",
    category: "Tendencia",
    analogy:
      "Es como si todo un salón lleno de traders recibiera la misma hoja de referencia antes de empezar el día, calculada con la misma fórmula — precisamente porque tantos miran los mismos números, esos números terminan importando de verdad.",
    what: "Niveles de soporte y resistencia calculados con una fórmula fija a partir del máximo, mínimo y cierre del periodo ANTERIOR (día o semana previa) — no se ajustan a ojo, salen directo de esos tres números. Son ampliamente usados por traders institucionales e intradía precisamente porque son objetivos y los calcula todo el mundo con la misma fórmula.",
    formula: "PP = (Máximo + Mínimo + Cierre) / 3   ·   R1 = 2×PP − Mínimo   ·   S1 = 2×PP − Máximo   ·   R2 = PP + Rango   ·   S2 = PP − Rango",
    howToRead:
      "El PP (pivote central) es el nivel de 'equilibrio' del periodo — precio por encima sugiere sesgo alcista intradía, por debajo sugiere sesgo bajista. R1/R2 son resistencias por encima; S1/S2 son soportes por debajo. Cuantos más traders miran los mismos niveles, más se comportan como una profecía autocumplida.",
    example:
      "Un day trader de BTC que ve el precio abrir el día por encima del PP diario, con la sesión respetando S1 como soporte en cada retroceso, puede usar eso como confirmación de sesgo alcista para el resto de la sesión, sin necesitar ningún otro indicador.",
    bestConditions:
      "Muy usados en trading intradía y por escritorios institucionales — los pivots diarios para operativa del día, los semanales para tener contexto de la semana completa (ambos disponibles en la Terminal de Spider).",
    limitations:
      "En mercados con muy poca participación institucional 'clásica' (como algunas altcoins), pierden algo de la fuerza que tienen en BTC/ETH, donde muchos más operadores realmente los usan.",
    signals: [
      "Precio rebotando repetidamente en S1/R1: esos niveles están actuando como soporte/resistencia real",
      "Ruptura limpia de R2 o S2 con volumen: posible extensión fuerte de la sesión",
      "Precio abriendo lejos del PP: sesgo direccional de la sesión ya sugerido desde el inicio",
    ],
    commonMistakes: [
      "Tratar los niveles como paredes garantizadas en vez de zonas de mayor probabilidad de reacción",
      "Usar solo pivots diarios sin contexto del pivot semanal, perdiendo la imagen más amplia",
      "Ignorarlos en activos con muy poco volumen, donde tienen menos participantes respetándolos",
    ],
    practicalSteps: [
      "Activa 'Pivots (D)' en la Terminal y observa cómo el precio reacciona (o no) al tocar el PP, R1 o S1 durante el día.",
      "Activa también 'Pivots (S)' (semanales) al mismo tiempo para tener el contexto de la semana completa, no solo del día.",
      "Anota si el precio abrió por encima o por debajo del PP diario — es el primer sesgo direccional de la sesión, antes de mirar cualquier otro indicador.",
    ],
  },
  {
    id: "fibonacci",
    title: "Fibonacci (Retroceso y Extensión)",
    shortName: "Fibonacci",
    icon: "𝜙",
    category: "Tendencia",
    analogy:
      "Después de subir corriendo varios pisos por una escalera, es normal bajar un par de escalones para tomar aire antes de seguir subiendo — el Fibonacci marca en qué escalones exactos suele 'tomar aire' el precio antes de continuar.",
    what: "Herramienta que traza niveles horizontales entre un mínimo y un máximo recientes ('swing'), en las proporciones de la secuencia de Fibonacci (23.6%, 38.2%, 50%, 61.8%...). La idea es que, tras un movimiento fuerte, el precio suele retroceder una porción de ese movimiento antes de continuar — y esas proporciones concretas aparecen con frecuencia notable en mercados financieros, probablemente en parte porque tantísimos traders las vigilan.",
    formula: "Nivel = Máximo − (Máximo − Mínimo) × ratio   (retroceso, ratio entre 0 y 1)   ·   Extensión = mismo cálculo con ratios > 1 (127.2%, 161.8%) para proyectar objetivos más allá del swing original",
    howToRead:
      "En una tendencia alcista, se traza del mínimo al máximo del último impulso — los niveles 38.2%, 50% y 61.8% son las zonas de retroceso más vigiladas como posible soporte antes de que continúe la subida. El 61.8% ('golden ratio') es tradicionalmente el más observado. En una tendencia bajista se invierte: se buscan como resistencia en un rebote.",
    example:
      "Tras un rally fuerte de TRX de $0.10 a $0.14, muchos traders esperan un retroceso hacia el 50%-61.8% (~$0.117-$0.122) como zona de posible entrada 'con descuento' dentro de la tendencia alcista de fondo, en vez de perseguir el precio en el máximo.",
    bestConditions:
      "Funciona mejor combinado con otra confirmación (una zona de soporte/resistencia previa, una media móvil, o un patrón de velas) que coincida con el mismo nivel — la confluencia de varias señales en el mismo precio es mucho más fuerte que el Fibonacci solo.",
    limitations:
      "Es subjetivo: distintos traders eligen distintos swings (máximo/mínimo) para trazarlo, lo que produce niveles ligeramente distintos. No es una ley física — es una herramienta estadística basada en el comportamiento colectivo de los participantes del mercado.",
    signals: [
      "Rebote en la zona 38.2%-61.8% dentro de una tendencia ya establecida: posible continuación",
      "Ruptura limpia del 78.6% o más: el retroceso puede estar convirtiéndose en un cambio de tendencia, no solo una pausa",
      "Confluencia con un nivel de soporte/resistencia horizontal ya conocido: señal más confiable",
    ],
    commonMistakes: [
      "Trazar el Fibonacci sobre un swing poco claro o demasiado pequeño para ser relevante",
      "Tratar cada nivel como un soporte garantizado en vez de una zona de mayor probabilidad",
      "Ignorar la tendencia de fondo — el Fibonacci ubica zonas de retroceso, no predice giros de tendencia por sí solo",
    ],
    practicalSteps: [
      "Activa 'Fibonacci' en la Terminal — la plataforma traza automáticamente los niveles sobre el swing más reciente de hasta 100 velas.",
      "Busca confluencia: si un nivel de Fibonacci coincide con un pivot o una EMA200 en el mismo precio, esa zona es mucho más significativa que el Fibonacci solo.",
      "Anota qué nivel (38.2%, 50%, 61.8%) respetó el precio la última vez que hubo un retroceso — te da una idea de qué tan 'profundo' retrocede este activo en particular.",
    ],
  },
  {
    id: "heikin-ashi",
    title: "Heikin Ashi",
    shortName: "Heikin Ashi",
    icon: "🕯",
    category: "Tendencia",
    analogy:
      "Es como escuchar una canción con reducción de ruido activada: sigues escuchando la melodía de fondo (la tendencia) sin que cada pequeña interferencia (el ruido normal del precio) te distraiga vela por vela.",
    what: "Una forma alternativa de dibujar las velas, pensada para suavizar el ruido y hacer más visibles las tendencias. En vez de usar el precio de apertura real de cada vela, usa el punto medio de la vela Heikin Ashi ANTERIOR — ese pequeño cambio hace que el color de las velas tienda a mantenerse constante durante toda una tendencia, en vez de alternar verde/rojo por cada pequeño zigzag del precio real.",
    formula: "Cierre_HA = (Apertura+Máximo+Mínimo+Cierre) / 4   ·   Apertura_HA = (Apertura_HA_anterior + Cierre_HA_anterior) / 2",
    howToRead:
      "Una racha larga de velas verdes sin mechas inferiores indica una tendencia alcista fuerte y limpia. Velas con cuerpos chicos y mechas en ambos lados señalan indecisión o posible agotamiento de la tendencia. Es más fácil 'leer' visualmente la tendencia de fondo que con velas japonesas normales.",
    example:
      "Durante un rally sostenido de BTC, las velas japonesas normales muestran varias velas rojas intermedias por el ruido normal del precio, mientras que las mismas horas en Heikin Ashi suelen mostrarse casi todas verdes — más fácil de sostener psicológicamente una posición larga sin salirse por ruido que no es un giro real.",
    bestConditions:
      "Muy útil para trading de tendencia (trend-following) en temporalidades medias a altas, donde el objetivo es quedarse dentro de un movimiento largo sin salirse por el ruido normal de las velas reales.",
    limitations:
      "El precio de una vela Heikin Ashi NO es el precio real al que se ejecutó nada — es un promedio suavizado. Nunca debe usarse directamente para calcular el precio exacto de entrada, Stop Loss o Take Profit; para eso siempre hay que volver a las velas reales.",
    signals: [
      "Racha de velas del mismo color sin mechas contrarias: tendencia fuerte y limpia",
      "Aparición de mechas en el lado contrario a la tendencia: posible debilitamiento",
      "Velas con cuerpo muy pequeño (casi doji): indecisión, posible pausa o giro cercano",
    ],
    commonMistakes: [
      "Usar el precio de una vela Heikin Ashi como si fuera un precio real operable — no lo es",
      "Ignorar que suaviza TANTO el ruido que puede retrasar la señal de que una tendencia ya terminó",
      "No volver a las velas japonesas reales al momento exacto de calcular niveles de entrada/salida",
    ],
    practicalSteps: [
      "Activa 'Heikin Ashi' en la Terminal — vas a ver las velas normales reemplazadas por las suavizadas, en el mismo gráfico.",
      "Cuenta cuántas velas seguidas del mismo color aparecen en una tendencia — es mucho más fácil de contar que con velas japonesas normales.",
      "Antes de colocar tu Stop Loss o Take Profit real, vuelve a apagar Heikin Ashi y usa las velas normales — el precio suavizado nunca debe usarse para calcular niveles exactos.",
    ],
  },
  {
    id: "ichimoku",
    title: "Ichimoku Kinko Hyo",
    shortName: "Ichimoku",
    icon: "雲",
    category: "Tendencia",
    analogy:
      "Es como un pronóstico del clima que además te muestra un mapa de terreno futuro: la 'nube' proyectada 26 velas adelante funciona como una zona de resistencia o soporte que todavía no llegó, pero que ya puedes ver venir.",
    what: "Un sistema completo de análisis técnico japonés (no solo un indicador) que combina 5 líneas para mostrar tendencia, momentum y niveles de soporte/resistencia a la vez. Su elemento más conocido es la 'nube' (Kumo), el área entre las dos líneas Senkou Span, que se proyecta 26 periodos hacia ADELANTE del precio actual.",
    formula: "Tenkan-sen = punto medio de 9 periodos   ·   Kijun-sen = punto medio de 26 periodos   ·   Senkou A = (Tenkan+Kijun)/2, desplazada 26 al futuro   ·   Senkou B = punto medio de 52 periodos, desplazada 26 al futuro   ·   Chikou = cierre actual, desplazado 26 al pasado",
    howToRead:
      "Precio por encima de la nube = tendencia alcista de fondo; por debajo = bajista; dentro de la nube = mercado indeciso/lateral. Un cruce de Tenkan sobre Kijun (similar a un cruce de medias) da señales de entrada. El grosor de la nube indica la fuerza del soporte/resistencia que representa — una nube gruesa es más difícil de romper que una delgada.",
    example:
      "Cuando BTC rompe por encima de una nube gruesa que había actuado como resistencia durante semanas, con el Tenkan cruzando por encima del Kijun al mismo tiempo, muchos traders de tendencia interpretan eso como una confirmación fuerte de cambio a fase alcista.",
    bestConditions:
      "Pensado para temporalidades medias-altas (4h en adelante) y mercados con tendencias claras — da una imagen completa del contexto (tendencia + momentum + soporte/resistencia futura) en un solo vistazo.",
    limitations:
      "Con 5 líneas superpuestas puede verse abrumador para un principiante. Como usa periodos largos (hasta 52), necesita bastante historial de velas cargado para mostrarse completo, y es más lento para reaccionar en marcos de tiempo muy cortos.",
    signals: [
      "Precio saliendo con fuerza por encima de una nube gruesa: cambio de tendencia con soporte fuerte detrás",
      "Cruce de Tenkan-sen sobre Kijun-sen por encima de la nube: señal de entrada alcista de mayor confianza",
      "Precio atrapado dentro de la nube: mercado sin dirección clara, mejor esperar",
    ],
    commonMistakes: [
      "Usarlo en temporalidades muy cortas donde sus periodos largos lo vuelven casi inútil",
      "Operar cada cruce de Tenkan/Kijun sin mirar la posición del precio respecto a la nube",
      "Ignorar la nube futura (proyectada 26 periodos adelante), que es la parte más distintiva del sistema",
    ],
    practicalSteps: [
      "Activa 'Ichimoku' en la Terminal en un marco de 4h o superior — es donde este sistema está diseñado para funcionar.",
      "Antes de mirar cualquier cruce de líneas, ubica primero si el precio está arriba, abajo o dentro de la nube — ese es el sesgo de fondo.",
      "Observa el grosor de la nube en la zona donde está el precio ahora: una nube gruesa por delante avisa que ese tramo va a costar más romper.",
    ],
  },
  {
    id: "supertrend",
    title: "SuperTrend",
    shortName: "SuperTrend",
    icon: "⇡",
    category: "Tendencia",
    analogy:
      "Es una cerca que se va moviendo sola detrás del precio, apretándose cada vez más cerca mientras la tendencia dura, para proteger las ganancias sin que el trader tenga que recalcular nada a mano.",
    what: "Una línea de tendencia que se ajusta a la volatilidad usando el ATR: se coloca a un múltiplo de ATR por debajo del precio en tendencia alcista (actuando como soporte/stop dinámico) o por encima en tendencia bajista (como resistencia/stop dinámico). Cambia de lado — y de color — cuando el precio la cruza, marcando un cambio de tendencia.",
    formula: "Banda base = precio medio ± multiplicador × ATR   ·   la banda solo se 'aprieta' hacia el precio en la dirección de la tendencia activa, nunca se afloja, hasta que el precio la cruza y el trend cambia",
    howToRead:
      "Línea verde debajo del precio = tendencia alcista activa (esa línea también sirve como Stop Loss dinámico, sugerido). Línea roja arriba del precio = tendencia bajista activa. El cambio de color es la señal: el precio acaba de cruzar su propia línea de tendencia.",
    example:
      "Un trader de tendencia en ETH usa la línea verde del SuperTrend como su Stop Loss móvil mientras dura el long — a medida que el precio sube, la línea sube detrás de él (nunca baja), protegiendo ganancias automáticamente sin que el trader tenga que recalcular nada a mano.",
    bestConditions:
      "Excelente como Stop Loss dinámico ('trailing stop') en estrategias de seguimiento de tendencia, y como filtro visual rápido de si el mercado está en modo alcista o bajista según el multiplicador elegido.",
    limitations:
      "Como cualquier indicador de tendencia, en mercados laterales genera cambios de color frecuentes y señales falsas ('whipsaws') — funciona mucho mejor una vez que ya hay una tendencia establecida que al inicio de una.",
    signals: [
      "Cambio de rojo a verde: la tendencia acaba de girar a alcista",
      "Precio 'caminando' pegado a la línea sin cruzarla: tendencia sana y sostenida",
      "Uso directo como nivel de Stop Loss dinámico mientras dura la tendencia",
    ],
    commonMistakes: [
      "Usarlo como única señal de entrada sin confirmar que hay una tendencia real y no un lateral disfrazado",
      "No ajustar el multiplicador de ATR al activo/temporalidad — uno muy ajustado genera demasiados cambios falsos",
      "Ignorar que, igual que el ATR, no anticipa el próximo movimiento — reacciona a él",
    ],
    practicalSteps: [
      "Activa 'SuperTrend' en la Terminal y observa cuántas veces cambió de color en la última semana — muchos cambios seguidos indican mercado lateral, no tendencia.",
      "En una posición abierta de Paper Trading, usa la línea verde (en un long) como referencia de dónde subirías tu Stop Loss a medida que el precio avanza.",
      "Combínalo con el ADX: solo confía en la señal de cambio de color cuando el ADX también confirme que hay tendencia real.",
    ],
  },
  {
    id: "donchian",
    title: "Canal de Donchian",
    shortName: "Donchian",
    icon: "▭",
    category: "Volatilidad",
    analogy:
      "Marca el techo y el piso más altos y más bajos que tocó el precio en los últimos N días — como pintar una raya en la pared cada vez que alguien mide su altura récord, para saber al instante cuándo alguien nuevo la supera.",
    what: "El indicador de ruptura ('breakout') más simple que existe: dibuja el máximo y el mínimo de los últimos N periodos como dos líneas, con una línea media entre ambas. Fue la base del legendario sistema de los 'Turtle Traders' de los años 80, uno de los sistemas de tendencia más estudiados de la historia del trading.",
    formula: "Banda superior = máximo de los últimos N periodos   ·   Banda inferior = mínimo de los últimos N periodos   ·   Media = (Superior + Inferior) / 2",
    howToRead:
      "Cuando el precio hace un nuevo máximo de N periodos, toca (o rompe) la banda superior — una señal clásica de posible inicio o continuación de tendencia alcista. Lo mismo a la inversa con la banda inferior. El canal se ensancha cuando el mercado es volátil y se contrae cuando está tranquilo.",
    example:
      "El sistema original de los Turtle Traders compraba cuando el precio rompía el canal de Donchian de 20 periodos hacia arriba, y usaba el canal de 10 periodos hacia abajo como señal de salida — una regla mecánica simple que convirtió a operadores sin experiencia previa en traders rentables durante años.",
    bestConditions:
      "Ideal para estrategias de ruptura (breakout) mecánicas y para identificar rápidamente si el precio actual está en un extremo reciente (posible sobreextensión) o en el medio de su rango.",
    limitations:
      "En mercados laterales genera rupturas falsas constantes — el precio toca la banda, revierte, y vuelve a tocar la banda contraria poco después, sin ninguna tendencia real detrás.",
    signals: [
      "Nuevo máximo de N periodos (toque de banda superior): posible señal de entrada en tendencia alcista",
      "Precio volviendo hacia la línea media tras tocar un extremo: posible pérdida de momentum",
      "Canal muy angosto: mercado comprimido, posible ruptura fuerte próxima en cualquier dirección",
    ],
    commonMistakes: [
      "Operar cada toque de banda sin ningún filtro adicional en mercados claramente laterales",
      "Usar un periodo demasiado corto, generando señales de ruptura constantes sin sustancia",
      "No combinarlo con una regla de salida clara — el sistema original necesita ambas partes (entrada Y salida) para funcionar",
    ],
    practicalSteps: [
      "Activa 'Donchian' en la Terminal y observa qué tan seguido el precio toca la banda superior o inferior en el activo que sigues.",
      "En el Backtester, prueba una condición de 'precio' cruzando por arriba de un valor cercano a tu banda superior actual, como aproximación a una estrategia de ruptura.",
      "Compara el canal en 10 periodos contra 20 periodos en el mismo gráfico — replicando la idea original de entrada/salida de los Turtle Traders.",
    ],
  },
  {
    id: "keltner",
    title: "Canal de Keltner",
    shortName: "Keltner",
    icon: "▯",
    category: "Volatilidad",
    analogy:
      "Se ve casi igual que las Bandas de Bollinger, pero mide el ancho con una regla distinta (ATR en vez de desviación estándar) — como dos formas diferentes de medir 'qué tan movido' está el mercado, cada una útil para algo distinto.",
    what: "Similar a las Bandas de Bollinger en apariencia (una línea central con dos bandas alrededor), pero usa el ATR en vez de la desviación estándar para definir el ancho de las bandas — lo que lo hace menos sensible a picos de precio puntuales y más estable en su lectura de volatilidad de fondo.",
    formula: "Línea central = EMA(20)   ·   Banda superior = EMA(20) + multiplicador × ATR(10)   ·   Banda inferior = EMA(20) − multiplicador × ATR(10)",
    howToRead:
      "El precio tocando la banda superior en una tendencia alcista sostenida no es necesariamente señal de venta — igual que Bollinger, puede 'caminar' pegado a la banda durante una tendencia fuerte. La utilidad principal está en comparar su comportamiento CONTRA Bollinger: cuando las Bandas de Bollinger se meten DENTRO del canal de Keltner, es la señal clásica de 'squeeze' (compresión extrema) que suele preceder a un movimiento fuerte.",
    example:
      "Traders que combinan ambos indicadores vigilan el momento exacto en que Bollinger entra dentro de Keltner ('TTM Squeeze') como aviso de que se acerca un movimiento importante — sin decir en qué dirección, solo que la compresión de volatilidad está por resolverse.",
    bestConditions:
      "Especialmente útil combinado con las Bandas de Bollinger para detectar squeezes de volatilidad, y como banda de volatilidad más estable que Bollinger en activos con datos de precio más ruidosos.",
    limitations:
      "Al basarse en ATR, reacciona más lento a cambios súbitos de volatilidad que Bollinger (que usa desviación estándar, más sensible a picos puntuales) — cada uno tiene su propósito, no son intercambiables.",
    signals: [
      "Bollinger comprimiéndose dentro de Keltner: squeeze de volatilidad, movimiento fuerte probablemente próximo",
      "Precio 'caminando' pegado a la banda superior/inferior: tendencia fuerte, no necesariamente reversión",
      "Cruce de la EMA central: cambio de sesgo direccional de corto plazo",
    ],
    commonMistakes: [
      "Usarlo solo, sin cruzarlo con Bollinger, perdiendo la señal de squeeze que es su combinación más valiosa",
      "Vender automáticamente al tocar la banda superior en una tendencia alcista fuerte",
      "Confundirlo visualmente con Bollinger sin notar que miden volatilidad de formas distintas",
    ],
    practicalSteps: [
      "Activa 'Keltner' y 'Bollinger' juntos en la Terminal en el mismo gráfico.",
      "Busca el momento exacto en que las Bandas de Bollinger quedan completamente DENTRO del canal de Keltner — ese es el squeeze clásico.",
      "Cuando veas ese squeeze, no adivines la dirección: espera a que el precio rompa claramente hacia un lado antes de considerar una entrada.",
    ],
  },
  {
    id: "cmf",
    title: "CMF — Chaikin Money Flow",
    shortName: "CMF",
    icon: "◑",
    category: "Volumen",
    analogy:
      "No importa solo si el precio subió o bajó, sino CÓMO cerró dentro de su propio rango: cerrar pegado al máximo con mucho volumen es una vela muy distinta a cerrar pegado al máximo con volumen bajo, aunque el precio final sea el mismo.",
    what: "Mide la presión de compra o venta combinando dónde cerró cada vela dentro de su propio rango (cerca del máximo = presión compradora, cerca del mínimo = presión vendedora) con el volumen de esa vela, acumulado sobre los últimos 20 periodos. A diferencia del precio solo, intenta capturar si el volumen real está entrando o saliendo del activo.",
    formula: "Multiplicador = ((Cierre−Mínimo) − (Máximo−Cierre)) / (Máximo−Mínimo)   ·   CMF = Σ(Multiplicador × Volumen) / Σ(Volumen), sobre 20 periodos",
    howToRead:
      "Oscila aproximadamente entre -1 y +1. Lecturas sostenidas por encima de 0 indican presión compradora neta (acumulación); por debajo de 0, presión vendedora neta (distribución) — sin importar tanto el valor exacto como la persistencia del signo a lo largo de varias velas.",
    example:
      "Si el precio de TRX se mantiene relativamente plano pero el CMF sube de forma sostenida hacia +0.2 durante varios días, se interpreta como acumulación silenciosa — compradores entrando de a poco sin mover mucho el precio todavía, algo que a veces precede a un movimiento alcista visible.",
    bestConditions:
      "Útil para detectar acumulación o distribución que todavía no se refleja claramente en el precio, y como confirmación de volumen real detrás de una ruptura de soporte/resistencia.",
    limitations:
      "Requiere volumen confiable — en pares de bajo volumen los datos pueden ser erráticos. Al ser un promedio de 20 periodos, reacciona con cierto retraso a cambios súbitos de presión.",
    signals: [
      "CMF sostenido por encima de 0 durante varias velas: presión compradora neta (acumulación)",
      "CMF sostenido por debajo de 0: presión vendedora neta (distribución)",
      "Divergencia entre precio y CMF: el movimiento de precio puede no tener el respaldo de volumen que aparenta",
    ],
    commonMistakes: [
      "Reaccionar a un solo cruce de cero en vez de esperar una lectura sostenida en la misma dirección",
      "Usarlo en activos de muy bajo volumen donde el dato pierde fiabilidad",
      "Ignorarlo como confirmación de rupturas, donde aporta la parte de 'volumen real' que el precio solo no muestra",
    ],
    practicalSteps: [
      "Activa 'CMF' en la Terminal y obsérvalo durante varios días en un activo que sigas de cerca.",
      "Busca lecturas sostenidas por encima o por debajo de 0 durante varias velas seguidas, no un solo cruce puntual.",
      "Combínalo con el precio: si el precio está plano pero el CMF sube de forma sostenida, puede ser acumulación silenciosa antes de un movimiento visible.",
    ],
  },
];
