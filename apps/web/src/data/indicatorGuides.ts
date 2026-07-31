export interface IndicatorGuide {
  id: string;
  title: string;
  shortName: string;
  icon: string;
  category: "Tendencia" | "Momentum" | "Volumen" | "Volatilidad";
  what: string;
  formula: string;
  howToRead: string;
  example: string;
  bestConditions: string;
  limitations: string;
  signals: string[];
  commonMistakes: string[];
}

export const INDICATOR_GUIDES: IndicatorGuide[] = [
  {
    id: "medias-cruces",
    title: "Medias Móviles y Cruces (Golden/Death Cross)",
    shortName: "Medias Móviles",
    icon: "〰",
    category: "Tendencia",
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
  },
  {
    id: "bollinger",
    title: "Bandas de Bollinger",
    shortName: "Bollinger",
    icon: "⌇",
    category: "Volatilidad",
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
  },
  {
    id: "vwap",
    title: "VWAP — Precio Promedio Ponderado por Volumen",
    shortName: "VWAP",
    icon: "▤",
    category: "Tendencia",
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
  },
  {
    id: "parabolic-sar",
    title: "Parabolic SAR",
    shortName: "Parabolic SAR",
    icon: "•",
    category: "Tendencia",
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
  },
  {
    id: "rsi",
    title: "RSI — Índice de Fuerza Relativa",
    shortName: "RSI",
    icon: "◐",
    category: "Momentum",
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
  },
  {
    id: "macd",
    title: "MACD — Convergencia/Divergencia de Medias Móviles",
    shortName: "MACD",
    icon: "≈",
    category: "Momentum",
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
  },
  {
    id: "estocastico",
    title: "Oscilador Estocástico (%K / %D)",
    shortName: "Estocástico",
    icon: "↯",
    category: "Momentum",
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
  },
  {
    id: "williams-r",
    title: "Williams %R",
    shortName: "Williams %R",
    icon: "↕",
    category: "Momentum",
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
  },
  {
    id: "cci",
    title: "CCI — Índice de Canal de Materias Primas",
    shortName: "CCI",
    icon: "⟡",
    category: "Momentum",
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
  },
  {
    id: "roc",
    title: "ROC — Tasa de Cambio (Rate of Change)",
    shortName: "ROC",
    icon: "↗",
    category: "Momentum",
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
  },
  {
    id: "adx",
    title: "ADX con +DI / -DI",
    shortName: "ADX",
    icon: "△",
    category: "Tendencia",
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
  },
  {
    id: "mfi",
    title: "MFI — Índice de Flujo de Dinero",
    shortName: "MFI",
    icon: "◈",
    category: "Volumen",
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
  },
  {
    id: "obv",
    title: "OBV — Volumen en Balance (On-Balance Volume)",
    shortName: "OBV",
    icon: "▮",
    category: "Volumen",
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
  },
];
