import type { AcademyLevelContent, Lesson } from "./types";

const MEDIAS_RSI_MACD_FRACTALES: Lesson = {
  id: "medias-rsi-macd-fractales",
  title: "Medias móviles, RSI, MACD, fractales — y cómo combinarlos",
  estimatedMinutes: 15,
  blocks: [
    {
      type: "parrafo",
      texto:
        "Un indicador técnico no predice el futuro — es una forma de resumir el pasado reciente del precio en un número o una línea, para que no tengas que \"sentir\" la tendencia a ojo. Cada uno mide algo distinto: unos miden dirección de fondo, otros miden qué tan estirado está el precio respecto a sí mismo, otros miden si el impulso está acelerando o frenando. Ninguno funciona solo — la habilidad real está en combinarlos, no en memorizar uno solo como si fuera mágico.",
    },
    {
      type: "destacado",
      variante: "advertencia",
      titulo: "LA TRAMPA MÁS COMÚN",
      texto:
        "Buscar \"el indicador perfecto\" que siempre acierte. No existe. Todos los indicadores de esta lección son rezagados en algún grado (confirman lo que ya empezó) o ruidosos en algún grado (dan señales falsas en mercados laterales). La ventaja real viene de saber en qué condición de mercado confiar en cada uno — no de encontrar uno infalible.",
    },

    { type: "titulo", texto: "1. Medias móviles y cruces — la dirección de fondo" },
    {
      type: "analogia",
      texto:
        "Vas manejando de noche y en vez de mirar cada piedra del camino, te fijas en el promedio de los últimos 50 metros — eso es una media móvil: te muestra hacia dónde va el camino de fondo sin que cada bache te distraiga.",
    },
    {
      type: "parrafo",
      texto:
        "Una media móvil promedia los últimos N cierres. La SMA (media simple) pesa todos los datos por igual; la EMA (media exponencial) pesa más los datos recientes, así que reacciona más rápido a cambios nuevos. Un 'Golden Cross' ocurre cuando una media corta cruza por encima de una larga — señal clásica de que la tendencia de fondo giró a alcista. Un 'Death Cross' es lo contrario.",
    },
    { type: "diagramaSVG", diagrama: "cruce-de-medias", caption: "El cruce no es instantáneo — confirma una tendencia que ya empezó, no la anticipa." },
    {
      type: "tabla",
      headers: ["Situación", "Lectura"],
      filas: [
        ["Precio por encima de la media", "Sesgo alcista de fondo"],
        ["Precio por debajo de la media", "Sesgo bajista de fondo"],
        ["Medias muy separadas entre sí", "Tendencia fuerte"],
        ["Medias juntas y planas", "Mercado indeciso / lateral"],
      ],
    },
    {
      type: "errorComun",
      texto: "Usar cruces de medias en gráficos de 1m o 5m — el ruido de esos marcos genera cruces falsos constantemente. Funcionan mejor en 4h en adelante.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n4-l1-e1",
        enunciado: "Un Golden Cross garantiza que el precio va a seguir subiendo a partir de ese momento.",
        respuesta: false,
        explicacion:
          "Falso — el cruce confirma que la tendencia de fondo ya giró a alcista, pero es una señal rezagada (basada en el pasado), no una garantía de lo que pasará después.",
      },
    },
    {
      type: "conecta",
      label: "Terminal — EMA 20 / EMA 50",
      to: "/app/terminal",
      descripcion: "Activa ambas medias en la Terminal y observa cuánto tarda un cruce real en confirmarse en un par en vivo.",
    },

    { type: "titulo", texto: "2. RSI — qué tan estirado está el precio" },
    {
      type: "analogia",
      texto:
        "Es un velocímetro de qué tan 'estirado' está el precio respecto a sí mismo: no mide si va rápido o lento en términos absolutos, sino si subió o bajó demasiado rápido en muy poco tiempo comparado con su propio ritmo reciente.",
    },
    {
      type: "parrafo",
      texto:
        "El RSI (Índice de Fuerza Relativa) se mueve en una escala fija de 0 a 100. Por encima de 70 se considera sobrecompra (subió con tanta fuerza que estadísticamente está \"caro\" respecto a sí mismo); por debajo de 30, sobreventa. Entre 30 y 70 es zona neutral — la mayor parte del tiempo el precio vive ahí.",
    },
    {
      type: "destacado",
      variante: "advertencia",
      titulo: "EL ERROR NÚMERO 1 CON EL RSI",
      texto:
        "Vender apenas el RSI toca 70, o comprar apenas toca 30. En una tendencia fuerte, el RSI puede quedarse \"pegado\" arriba de 70 (o abajo de 30) durante días o semanas — la tendencia sigue, y quien vendió por el nivel del RSI se pierde el resto del movimiento.",
    },
    {
      type: "parrafo",
      texto:
        "Más valiosa que el nivel absoluto es la divergencia: cuando el precio hace un máximo nuevo pero el RSI hace un máximo MÁS BAJO que el anterior, es una señal de que el impulso interno se está debilitando, aunque el precio siga subiendo.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n4-l1-e2",
        pregunta: "BTC hace un nuevo máximo de precio, pero el RSI en ese nuevo máximo es más bajo que en el máximo anterior. ¿Cómo se llama esta señal y qué sugiere?",
        opciones: [
          { texto: "Golden Cross — señal de continuación alcista fuerte", correcta: false, explicacion: "El Golden Cross es un concepto de medias móviles, no de RSI." },
          { texto: "Divergencia bajista — el impulso interno se está debilitando", correcta: true, explicacion: "Correcto — precio arriba, RSI abajo, es la divergencia bajista clásica: advertencia de que el rally pierde fuerza." },
          { texto: "Sobreventa — señal de compra inmediata", correcta: false, explicacion: "Sobreventa es RSI por debajo de 30, lo opuesto a lo descrito en la pregunta." },
          { texto: "No significa nada, es ruido normal", correcta: false, explicacion: "Las divergencias son una de las lecturas más vigiladas del RSI, no ruido a ignorar." },
        ],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "completaEspacio",
        id: "n4-l1-e3",
        plantilla: "El RSI se mueve en una escala fija de 0 a ___, y la zona de sobreventa clásica es por debajo de ___.",
        opciones: ["100 / 30", "10 / 3", "1000 / 300", "100 / 50"],
        correcta: "100 / 30",
      },
    },

    { type: "titulo", texto: "3. MACD — momentum y aceleración" },
    {
      type: "analogia",
      texto:
        "Es la diferencia de velocidad entre un auto rápido y uno lento que van en la misma dirección: cuando el rápido se aleja del lento, la tendencia está acelerando; cuando se acercan de nuevo, está perdiendo fuerza.",
    },
    {
      type: "parrafo",
      texto:
        "El MACD resta una EMA rápida (12) de una EMA lenta (26). El resultado es la línea MACD. Una EMA de 9 periodos de esa misma línea es la 'señal' — su cruce con el MACD es el gatillo clásico. El histograma dibuja la distancia entre ambas: cuando se expande, la tendencia actual está ganando fuerza; cuando se contrae hacia cero, la está perdiendo, aunque el precio todavía no haya girado.",
    },
    {
      type: "tip",
      texto: "El histograma suele cambiar de dirección ANTES que el cruce de líneas ocurra — por eso muchos traders lo miran como una alerta temprana, y el cruce como la confirmación.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "emparejar",
        id: "n4-l1-e4",
        instruccion: "Une cada situación del MACD con su lectura correcta.",
        pares: [
          { izquierda: "MACD cruza por encima de la señal", derecha: "Posible impulso alcista" },
          { izquierda: "MACD cruza por debajo de la señal", derecha: "Posible impulso bajista" },
          { izquierda: "Histograma expandiéndose", derecha: "La tendencia actual está acelerando" },
          { izquierda: "Histograma contrayéndose hacia cero", derecha: "La tendencia actual está perdiendo fuerza" },
        ],
      },
    },

    { type: "titulo", texto: "4. Fractales — soporte y resistencia desde la estructura misma" },
    {
      type: "parrafo",
      texto:
        "Un fractal alcista es una vela cuyo mínimo es más bajo que los mínimos de las velas inmediatamente antes y después — marca un punto donde el precio \"rebotó\" localmente. Un fractal bajista es lo mismo pero con máximos. A diferencia de las medias o el RSI (que se calculan sobre el cierre), los fractales salen directamente de la forma de las velas — son soporte y resistencia que el propio mercado ya dibujó, no una fórmula externa.",
    },
    {
      type: "destacado",
      variante: "info",
      titulo: "POR QUÉ IMPORTAN PARA EL STOP LOSS",
      texto:
        "Un fractal reciente por debajo del precio (en un long) es una referencia natural para el Stop Loss: si el precio rompe ese nivel, la estructura que sostenía la operación ya se rompió — no es un número redondo elegido a ojo, es un nivel que el mercado ya demostró que le importa.",
    },
    {
      type: "conecta",
      label: "Fractales & Estructura",
      to: "/app/fractales-estructura",
      descripcion: "Este nivel cubre fractales a fondo — higher highs/lower lows, y cómo leer la estructura completa del mercado.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n4-l1-e5",
        enunciado: "Un fractal se calcula con una fórmula matemática sobre el precio de cierre, igual que una media móvil.",
        respuesta: false,
        explicacion:
          "Falso — un fractal sale directamente de la forma de las velas (un mínimo o máximo local rodeado por velas de ambos lados), no de una fórmula sobre el cierre como las medias o el RSI.",
      },
    },

    { type: "titulo", texto: "5. La regla de oro: confluencia, no un indicador solo" },
    {
      type: "parrafo",
      texto:
        "Cada indicador de esta lección mide algo distinto: las medias miden dirección de fondo, el RSI mide qué tan estirado está el precio, el MACD mide aceleración de momentum, los fractales marcan estructura real. Ninguno por sí solo es suficiente — la confluencia es exigir que varias señales independientes apunten en la misma dirección al mismo tiempo, antes de confiar en una entrada.",
    },
    {
      type: "destacado",
      variante: "exito",
      titulo: "ASÍ LO HACE ESTA PLATAFORMA",
      texto:
        "Análisis Técnico calcula una 'Señal Compuesta' que exige que al menos 2 de 3 indicadores (RSI, MACD, Bollinger) coincidan antes de mostrar una lectura alcista o bajista — un solo indicador nunca basta para esa señal. Es la misma idea de confluencia de esta lección, aplicada mecánicamente en código.",
    },
    {
      type: "conecta",
      label: "Ver la Señal Compuesta en vivo",
      to: "/app/analisis-tecnico",
      descripcion: "Activa varios indicadores a la vez y observa cómo la Señal Compuesta solo se marca alcista o bajista cuando hay confluencia real.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "ordenar",
        id: "n4-l1-e6",
        instruccion: "Ordena estos pasos de un análisis con confluencia, del primero al último.",
        items: [
          { id: "a", texto: "Mirar la media móvil para saber el sesgo de fondo (alcista o bajista)" },
          { id: "b", texto: "Revisar si el RSI está en zona neutral o extrema" },
          { id: "c", texto: "Confirmar con el MACD si el momentum acompaña esa dirección" },
          { id: "d", texto: "Ubicar un fractal cercano como referencia de stop loss" },
          { id: "e", texto: "Entrar solo si varias de estas señales coinciden, nunca con una sola" },
        ],
        ordenCorrecto: ["a", "b", "c", "d", "e"],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n4-l1-e7",
        pregunta: "El precio está por encima de la EMA50 (sesgo alcista), el RSI está en 45 (neutral) y el MACD acaba de cruzar hacia arriba. ¿Qué dice la regla de confluencia sobre esta situación?",
        opciones: [
          { texto: "Es una señal perfecta, hay que entrar con el máximo tamaño posible", correcta: false, explicacion: "La confluencia reduce la incertidumbre, pero no la elimina — nunca es una garantía que justifique 'todo adentro'." },
          { texto: "Dos señales (tendencia + momentum) apuntan igual, pero el RSI es neutral — hay confluencia parcial, no total", correcta: true, explicacion: "Correcto — la confluencia no es todo o nada. Aquí hay más a favor que en contra, pero el RSI no suma un extremo claro." },
          { texto: "No sirve de nada mirar más de un indicador a la vez", correcta: false, explicacion: "Es exactamente lo opuesto a la idea central de esta lección." },
          { texto: "El MACD por sí solo ya es suficiente para ignorar todo lo demás", correcta: false, explicacion: "Ningún indicador solo reemplaza el análisis conjunto — esa es la trampa que la lección advierte evitar." },
        ],
      },
    },

    { type: "titulo", texto: "Resumen" },
    {
      type: "lista",
      variante: "buenas",
      items: [
        "Las medias móviles muestran la dirección de fondo — más confiables en marcos altos (4h+).",
        "El RSI mide qué tan estirado está el precio respecto a sí mismo — las divergencias valen más que el nivel absoluto.",
        "El MACD mide aceleración de momentum — el histograma suele adelantarse al cruce de líneas.",
        "Los fractales son soporte/resistencia que sale de la estructura real de las velas, útiles para el Stop Loss.",
        "Ningún indicador funciona solo — la confluencia (varias señales de acuerdo) es la regla de oro real.",
      ],
    },
    {
      type: "conecta",
      label: "Practica en Análisis Técnico",
      to: "/app/analisis-tecnico",
      descripcion: "Activa medias, RSI y MACD juntos sobre cualquier token y observa cuándo la Señal Compuesta realmente se activa.",
    },
  ],
};

export const NIVEL_04_INDICADORES_TECNICOS: AcademyLevelContent = {
  id: "indicadores-tecnicos",
  order: 4,
  title: "Indicadores técnicos",
  description: "Medias móviles, RSI, MACD, fractales — y la regla de oro de la confluencia.",
  difficulty: "intermedio",
  icon: "📊",
  lessons: [MEDIAS_RSI_MACD_FRACTALES],
  quiz: [
    {
      question: "¿Qué diferencia principal hay entre una SMA y una EMA?",
      options: [
        "La SMA solo funciona en cripto, la EMA solo en acciones",
        "La EMA pesa más los datos recientes, por lo que reacciona más rápido que la SMA",
        "No hay ninguna diferencia real entre ambas",
        "La SMA se usa solo para volumen, no para precio",
      ],
      correctIndex: 1,
      explanation: "La SMA pesa todos los datos por igual; la EMA da más peso a los datos recientes, así que reacciona más rápido a cambios nuevos.",
    },
    {
      question: "¿Qué es un Golden Cross?",
      options: [
        "Cuando el RSI cruza por encima de 70",
        "Cuando una media móvil corta cruza por encima de una media larga",
        "Cuando el precio toca un fractal alcista",
        "Cuando el MACD cruza por debajo de cero",
      ],
      correctIndex: 1,
      explanation: "El Golden Cross es específicamente un cruce de medias móviles (corta sobre larga) — señal clásica de tendencia alcista de fondo.",
    },
    {
      question: "¿Por qué los cruces de medias móviles son poco confiables en marcos de 1m o 5m?",
      options: [
        "Porque en esos marcos las medias no se pueden calcular",
        "Porque el ruido normal del precio en marcos cortos genera cruces falsos constantemente",
        "Porque Binance no permite verlas en esos marcos",
        "Porque solo funcionan de noche",
      ],
      correctIndex: 1,
      explanation: "En temporalidades muy cortas el ruido normal del precio produce muchos cruces sin sustancia real — funcionan mejor en marcos de 4h en adelante.",
    },
    {
      question: "El RSI está en 85 durante una tendencia alcista muy fuerte que lleva varios días. ¿Qué es lo más probable, según lo visto en esta lección?",
      options: [
        "El precio va a caer inmediatamente, sin excepción",
        "El RSI puede quedarse 'pegado' en zona de sobrecompra durante toda la tendencia, sin que eso signifique un giro inminente",
        "Es un error del indicador, no puede pasar",
        "Significa que hay que comprar más de inmediato",
      ],
      correctIndex: 1,
      explanation: "En tendencias fuertes el RSI puede permanecer en zona extrema por mucho tiempo — vender solo por el nivel es uno de los errores más comunes con este indicador.",
    },
    {
      question: "Precio hace un máximo nuevo, pero el RSI hace un máximo más bajo que el anterior. ¿Cómo se llama esta señal?",
      options: ["Golden Cross", "Divergencia bajista", "Sobreventa", "Death Cross"],
      correctIndex: 1,
      explanation: "Es una divergencia bajista — el precio sube pero el impulso interno (medido por el RSI) se está debilitando.",
    },
    {
      question: "¿Qué mide el histograma del MACD?",
      options: [
        "El volumen total operado",
        "La distancia entre la línea MACD y su línea de señal — su expansión o contracción",
        "El precio de cierre exacto",
        "La cantidad de holders de un token",
      ],
      correctIndex: 1,
      explanation: "El histograma visualiza qué tan separadas están la línea MACD y la de señal — expandiéndose indica aceleración, contrayéndose indica pérdida de fuerza.",
    },
    {
      question: "¿Qué hace especial a un fractal comparado con una media móvil o el RSI?",
      options: [
        "Sale directamente de la forma de las velas (un máximo o mínimo local), no de una fórmula sobre el cierre",
        "Solo funciona en el par BTC/USDT",
        "Es exactamente lo mismo que una media móvil",
        "No tiene ninguna utilidad práctica",
      ],
      correctIndex: 0,
      explanation: "El fractal marca un punto donde el precio rebotó localmente, visible directamente en la estructura de las velas — no requiere ningún cálculo sobre el cierre.",
    },
    {
      question: "¿Por qué un fractal reciente es útil como referencia de Stop Loss?",
      options: [
        "Porque es un número redondo fácil de recordar",
        "Porque marca un nivel donde la estructura del mercado ya reaccionó — si se rompe, la razón original de la operación también se rompió",
        "Porque siempre coincide exactamente con el precio de entrada",
        "Los fractales no sirven para eso",
      ],
      correctIndex: 1,
      explanation: "Un fractal es un nivel de soporte/resistencia real, ya validado por el propio mercado — más objetivo que elegir un stop a ojo.",
    },
    {
      question: "¿Qué es la 'confluencia' en análisis técnico?",
      options: [
        "Usar un solo indicador pero mirarlo varias veces",
        "Exigir que varias señales independientes (tendencia, momentum, estructura) apunten en la misma dirección antes de confiar en una entrada",
        "Un tipo de orden límite especial",
        "El nombre de otro indicador más",
      ],
      correctIndex: 1,
      explanation: "La confluencia es combinar señales de distinta naturaleza (no repetir la misma) para reducir la incertidumbre de una sola lectura aislada.",
    },
    {
      question: "En esta plataforma, ¿cómo se aplica la idea de confluencia de forma mecánica?",
      options: [
        "No se aplica en ningún lado",
        "La Señal Compuesta de Análisis Técnico exige que al menos 2 de 3 indicadores (RSI, MACD, Bollinger) coincidan",
        "Usando solo el precio, sin ningún indicador",
        "Preguntándole a la IA del chat cada vez",
      ],
      correctIndex: 1,
      explanation: "La Señal Compuesta de Análisis Técnico es exactamente la regla de confluencia aplicada en código: nunca se basa en un solo indicador.",
    },
  ],
};
