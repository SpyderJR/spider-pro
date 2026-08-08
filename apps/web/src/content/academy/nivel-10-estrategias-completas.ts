import type { AcademyLevelContent, Lesson } from "./types";

const OPERACION_COMPLETA_Y_TU_PLAN: Lesson = {
  id: "operacion-completa-y-tu-plan",
  title: "Cómo se ve una operación de principio a fin — y cómo construir tu propio plan de trading",
  estimatedMinutes: 16,
  blocks: [
    {
      type: "parrafo",
      texto:
        "Llegaste al último nivel. Hasta ahora cada nivel enseñó UNA pieza: leer velas, patrones, indicadores, estructura, riesgo, psicología, contratos, contexto macro. Este nivel no agrega una pieza nueva — arma el rompecabezas completo, mostrando cómo esas piezas se usan JUNTAS en una sola operación real, y te ayuda a convertir todo eso en tu propio plan de trading escrito.",
    },
    {
      type: "destacado",
      variante: "exito",
      titulo: "SI LLEGASTE HASTA AQUÍ",
      texto:
        "Completar los 9 niveles anteriores te pone en un lugar donde muy pocos principiantes llegan antes de arriesgar dinero real: entiendes el gráfico, la gestión de riesgo, tu propia psicología, y el contexto que mueve todo el mercado. Este nivel es sobre convertir todo ese conocimiento disperso en un proceso repetible.",
    },

    { type: "titulo", texto: "1. Una operación completa, de principio a fin" },
    {
      type: "parrafo",
      texto:
        "Sigamos un trade hipotético de largo (long) en BTC, aplicando cada nivel de la Academia en el orden en que realmente se usan en la práctica — no en el orden en que los aprendiste.",
    },
    {
      type: "tabla",
      headers: ["Paso", "Qué se hace", "Nivel de la Academia que aplica"],
      filas: [
        ["1. Contexto macro", "M2 en expansión, DXY débil — condiciones favorables para activos de riesgo", "Nivel 9 — On-chain y fundamentos"],
        ["2. Estructura de fondo", "BTC en secuencia de higher highs/higher lows en 4h — tendencia alcista intacta", "Nivel 5 — Estructura y fractales"],
        ["3. Zona de interés", "El precio retrocede hacia un soporte que coincide con un fractal reciente", "Nivel 2 — Leer el gráfico"],
        ["4. Señal de entrada", "Aparece un Martillo, confirmado por la vela siguiente cerrando verde", "Nivel 3 — Patrones de velas"],
        ["5. Confluencia técnica", "RSI sale de zona neutral al alza, MACD cruza a favor — 2 de 3 señales coinciden", "Nivel 4 — Indicadores técnicos"],
        ["6. Tamaño de posición", "Se calcula el tamaño exacto según 1% de riesgo, no 'a ojo'", "Nivel 6 — Gestión de riesgo"],
        ["7. Chequeo emocional", "¿Esta entrada nace de mis condiciones, o de FOMO por el movimiento reciente?", "Nivel 7 — Psicología del trading"],
        ["8. Ejecución", "Se define el stop loss bajo el fractal, el take profit, y si se usa apalancamiento se calcula la liquidación real", "Nivel 8 — Contratos y apalancamiento"],
        ["9. Registro", "Gane o pierda, la operación se anota en el Diario con la razón de entrada y la emoción del momento", "Nivel 7 — Diario de Trading"],
      ],
    },
    {
      type: "destacado",
      variante: "info",
      titulo: "NINGÚN PASO ES OPCIONAL",
      texto:
        "Un trader que hace los pasos 1 a 6 perfectos pero se salta el 7 (chequeo emocional) puede terminar rompiendo su propio plan igual. Un trader con análisis técnico mediocre pero pasos 6, 7 y 9 sólidos sobrevive mucho más tiempo que uno con análisis perfecto y sin gestión de riesgo ni disciplina. El proceso completo importa más que cualquier paso individual sea 'perfecto'.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "ordenar",
        id: "n10-l1-e1",
        instruccion: "Ordena estos pasos de una operación completa, del primero al último, según el orden real en que se aplican.",
        items: [
          { id: "a", texto: "Revisar contexto macro y estructura de fondo del activo" },
          { id: "b", texto: "Identificar una zona de interés (soporte/resistencia) y esperar una señal de entrada (patrón de velas)" },
          { id: "c", texto: "Confirmar con indicadores (confluencia) y calcular el tamaño de posición según tu % de riesgo" },
          { id: "d", texto: "Hacer un chequeo emocional honesto antes de ejecutar" },
          { id: "e", texto: "Ejecutar con stop loss y take profit definidos, y registrar el resultado en el Diario" },
        ],
        ordenCorrecto: ["a", "b", "c", "d", "e"],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n10-l1-e2",
        enunciado: "Un análisis técnico perfecto es suficiente por sí solo para garantizar que un trader sobreviva a largo plazo.",
        respuesta: false,
        explicacion: "Falso — sin gestión de riesgo, disciplina emocional y registro/aprendizaje continuo, incluso el mejor análisis técnico no protege de romper el propio plan en el momento equivocado.",
      },
    },

    { type: "titulo", texto: "2. Backtesting — probar una estrategia antes de arriesgar nada" },
    {
      type: "parrafo",
      texto:
        "Antes de operar cualquier conjunto de reglas con dinero (incluso ficticio) de forma repetida, tiene sentido probarlo primero contra años de datos históricos reales — eso es exactamente lo que hace el Backtester de esta plataforma. Le defines reglas objetivas (ej. \"RSI cruza abajo de 30 Y precio sobre la EMA200\") y corre esa estrategia contra el historial completo de un par, mostrando win rate, profit factor y máximo drawdown reales.",
    },
    {
      type: "conecta",
      label: "Backtester",
      to: "/app/backtester",
      descripcion: "Arma una estrategia con las condiciones que definiste en este nivel y compruébala contra años de datos reales antes de operarla en vivo.",
    },
    {
      type: "tip",
      texto: "Un backtest con muy pocos trades (por ejemplo, menos de 30) no es una muestra estadísticamente confiable — cualquier racha corta, buena o mala, puede ser pura casualidad.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n10-l1-e3",
        pregunta: "¿Por qué backtestear una estrategia antes de operarla en vivo, incluso con dinero ficticio?",
        opciones: [
          { texto: "Porque garantiza que la estrategia va a funcionar igual en el futuro", correcta: false, explicacion: "El backtesting no garantiza resultados futuros — el mercado cambia — pero sí da evidencia objetiva sobre el comportamiento histórico de las reglas." },
          { texto: "Porque da evidencia objetiva (win rate, drawdown, profit factor) sobre cómo se comportaron esas reglas exactas en años de datos reales, en vez de operar 'a ciegas'", correcta: true, explicacion: "Correcto — reemplaza la intuición sobre si una estrategia 'debería' funcionar con datos verificables sobre cómo se comportó realmente." },
          { texto: "Porque es un paso obligatorio antes de poder usar la Terminal", correcta: false, explicacion: "El Backtester y la Terminal son herramientas independientes — no hay una dependencia técnica obligatoria entre ellas." },
          { texto: "No tiene ninguna utilidad real", correcta: false, explicacion: "Es una de las herramientas más valiosas para validar una idea antes de arriesgar cualquier capital, real o ficticio." },
        ],
      },
    },

    { type: "titulo", texto: "3. Elige un estilo — no intentes usarlos todos a la vez" },
    {
      type: "parrafo",
      texto:
        "Existen distintas filosofías de inversión probadas (HODLing de largo plazo, promediar el costo con compras periódicas, seguimiento de tendencia, rotación entre activos, entre otras) — cada una con su propio perfil de riesgo, horizonte de tiempo y carga psicológica. El error común de quien empieza es intentar aplicar todas a la vez, o cambiar de una a otra apenas una operación sale mal. La consistencia dentro de UN estilo bien entendido supera, casi siempre, saltar entre varios a medias.",
    },
    {
      type: "conecta",
      label: "Estrategias & Cómo Invertir",
      to: "/app/estrategias",
      descripcion: "Las estrategias de inversión más usadas en cripto, explicadas a fondo con ejemplos numéricos, más una guía práctica de 6 pasos para empezar.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n10-l1-e4",
        enunciado: "La mejor práctica es combinar varias filosofías de inversión distintas al mismo tiempo, en la misma cuenta, sin definir cuál es la principal.",
        respuesta: false,
        explicacion: "Falso — mezclar filosofías sin un criterio claro (o saltar de una a otra tras cada pérdida) suele generar peores resultados que la consistencia dentro de un estilo bien entendido.",
      },
    },

    { type: "titulo", texto: "4. Construye tu plan de trading personal" },
    {
      type: "parrafo",
      texto:
        "Un plan de trading es un documento simple, escrito ANTES de operar, que responde preguntas concretas — para que en el momento de la operación no tengas que decidir bajo presión emocional, solo seguir lo que ya decidiste con la cabeza fría.",
    },
    {
      type: "tabla",
      headers: ["Pregunta de tu plan", "Nivel donde se responde"],
      filas: [
        ["¿Qué mercado y qué temporalidad opero?", "Nivel 2 — Leer el gráfico"],
        ["¿Qué condiciones EXACTAS necesito para considerar una entrada?", "Niveles 3, 4 y 5"],
        ["¿Cuánto arriesgo por operación, en %, nunca en un monto fijo 'a ojo'?", "Nivel 6 — Gestión de riesgo"],
        ["¿Uso apalancamiento? ¿Cuánto, como máximo, y por qué ese número?", "Nivel 8 — Contratos y apalancamiento"],
        ["¿Qué hago específicamente después de una pérdida, antes de la siguiente entrada?", "Nivel 7 — Psicología del trading"],
        ["¿Cómo y cuándo reviso mi propio historial para corregir patrones?", "Diario de Trading"],
      ],
    },
    {
      type: "destacado",
      variante: "exito",
      titulo: "TU PLAN NO TIENE QUE SER PERFECTO — TIENE QUE EXISTIR"
      ,
      texto:
        "El plan más simple, escrito y seguido de verdad, vale infinitamente más que el plan más sofisticado que solo existe en tu cabeza y se reescribe cada vez que el mercado te asusta o te emociona. Empieza simple, y ajústalo con datos reales de tu propio Diario con el tiempo.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "emparejar",
        id: "n10-l1-e5",
        instruccion: "Une cada pregunta de un plan de trading con el nivel de la Academia que la responde.",
        pares: [
          { izquierda: "¿Cuánto arriesgo por operación?", derecha: "Gestión de riesgo (Nivel 6)" },
          { izquierda: "¿Qué hago después de una pérdida?", derecha: "Psicología del trading (Nivel 7)" },
          { izquierda: "¿Cuánto apalancamiento uso, como máximo?", derecha: "Contratos y apalancamiento (Nivel 8)" },
        ],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n10-l1-e6",
        pregunta: "¿Cuál es el propósito principal de escribir un plan de trading ANTES de operar?",
        opciones: [
          { texto: "Impresionar a otros traders con un documento elaborado", correcta: false, explicacion: "El plan es una herramienta personal, no un documento para mostrar." },
          { texto: "Tomar las decisiones importantes con la cabeza fría, de antemano, para no tener que decidirlas bajo presión emocional en el momento", correcta: true, explicacion: "Correcto — el plan traslada las decisiones difíciles a un momento sin presión, para simplemente seguirlas después." },
          { texto: "Garantizar ganancias en todas las operaciones futuras", correcta: false, explicacion: "Ningún plan garantiza ganancias — su valor es la consistencia del proceso, no la certeza del resultado." },
          { texto: "Cumplir un requisito legal para operar en cualquier exchange", correcta: false, explicacion: "No es un requisito de ningún exchange — es una herramienta personal de disciplina." },
        ],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "completaEspacio",
        id: "n10-l1-e7",
        plantilla: "Un plan de trading simple y realmente seguido vale más que uno sofisticado que solo existe en tu ___ y se reescribe cada vez que el mercado te ___.",
        opciones: ["cabeza / asusta o emociona", "computadora / actualiza", "Diario / analiza", "celular / notifica"],
        correcta: "cabeza / asusta o emociona",
      },
    },

    { type: "titulo", texto: "Resumen — y lo que sigue" },
    {
      type: "lista",
      variante: "buenas",
      items: [
        "Una operación completa combina contexto macro, estructura, patrones, indicadores, tamaño de posición, chequeo emocional, ejecución y registro — ningún paso es opcional.",
        "El Backtester valida reglas objetivas contra años de datos reales antes de arriesgar cualquier capital, real o ficticio.",
        "Elegir UN estilo de inversión y ser consistente supera, casi siempre, saltar entre varios a medias.",
        "Un plan de trading responde de antemano las preguntas que, sin plan, terminarías decidiendo bajo presión emocional.",
        "El plan más simple que de verdad sigues vale más que el más sofisticado que solo existe en tu cabeza.",
      ],
    },
    {
      type: "destacado",
      variante: "exito",
      titulo: "COMPLETASTE LA ACADEMIA",
      texto:
        "Los 10 niveles cubren, de principio a fin, lo que separa a quien improvisa de quien opera con un proceso real. El siguiente paso no es otro nivel — es aplicar todo esto en la Terminal con dinero ficticio, las veces que hagan falta, hasta que el proceso se vuelva un hábito antes de considerar arriesgar dinero real alguna vez.",
    },
    {
      type: "conecta",
      label: "Aplica todo en la Terminal",
      to: "/app/terminal",
      descripcion: "Paper trading con datos reales de Binance — el lugar donde todo lo aprendido en la Academia se pone en práctica de verdad.",
    },
  ],
};

export const NIVEL_10_ESTRATEGIAS_COMPLETAS: AcademyLevelContent = {
  id: "estrategias-completas",
  order: 10,
  title: "Estrategias completas y tu plan",
  description: "Cómo se ve una operación de principio a fin — y cómo construir tu propio plan de trading.",
  difficulty: "avanzado",
  icon: "🎓",
  recommendedBeforeId: "contratos-y-apalancamiento",
  lessons: [OPERACION_COMPLETA_Y_TU_PLAN],
  quiz: [
    {
      question: "Según el ejemplo de operación completa de este nivel, ¿qué se revisa primero, antes que cualquier señal técnica?",
      options: [
        "El tamaño de posición exacto",
        "El contexto macro y la estructura de fondo del activo",
        "El apalancamiento máximo disponible",
        "El Diario de Trading",
      ],
      correctIndex: 1,
      explanation: "El proceso completo empieza por el contexto más amplio (macro y estructura de fondo) antes de bajar a señales específicas de entrada.",
    },
    {
      question: "¿Qué pasa si un trader ejecuta perfectamente los pasos técnicos pero se salta el chequeo emocional?",
      options: [
        "No pasa nada, el chequeo emocional es irrelevante",
        "Puede terminar rompiendo su propio plan de todas formas, aunque el análisis técnico haya sido correcto",
        "El resultado siempre será positivo de todas formas",
        "El backtest automáticamente lo corrige",
      ],
      correctIndex: 1,
      explanation: "Ningún paso del proceso es opcional — un análisis técnico perfecto no protege de decisiones tomadas bajo presión emocional.",
    },
    {
      question: "¿Qué hace el Backtester de esta plataforma?",
      options: [
        "Predice el precio exacto del día siguiente",
        "Corre reglas de entrada/salida definidas por el usuario contra años de datos históricos reales, mostrando win rate, profit factor y drawdown",
        "Ejecuta operaciones automáticas con dinero real",
        "Reemplaza la necesidad de aprender análisis técnico",
      ],
      correctIndex: 1,
      explanation: "El Backtester valida objetivamente cómo se hubiera comportado una estrategia en el pasado, dando evidencia real en vez de intuición.",
    },
    {
      question: "¿Por qué un backtest con muy pocos trades (menos de 30, por ejemplo) no es confiable?",
      options: [
        "Porque el Backtester tiene un límite técnico de 30 trades",
        "Porque una muestra tan pequeña puede reflejar pura casualidad, buena o mala, sin ser representativa del comportamiento real de la estrategia",
        "Porque siempre da resultados negativos",
        "No es cierto, cualquier cantidad de trades es igual de confiable",
      ],
      correctIndex: 1,
      explanation: "Con muestras muy pequeñas, una racha de suerte (buena o mala) puede distorsionar por completo las métricas — se necesita más volumen de datos para confiar en el resultado.",
    },
    {
      question: "¿Qué recomienda esta lección sobre combinar varias filosofías de inversión a la vez?",
      options: [
        "Es la mejor práctica, mientras más se combinen mejor",
        "Generalmente es un error — la consistencia dentro de un estilo bien entendido supera saltar entre varios a medias",
        "Solo se puede usar una filosofía por cuenta, por regla del exchange",
        "No existe ninguna diferencia entre las distintas filosofías",
      ],
      correctIndex: 1,
      explanation: "Mezclar filosofías sin criterio claro, o cambiar de una a otra tras cada pérdida, suele dar peores resultados que la consistencia.",
    },
    {
      question: "¿Cuál es el propósito principal de escribir un plan de trading antes de operar?",
      options: [
        "Cumplir un requisito legal",
        "Tomar las decisiones importantes con la cabeza fría, de antemano, para no decidirlas bajo presión emocional en el momento",
        "Garantizar que todas las operaciones sean ganadoras",
        "Impresionar a otros traders",
      ],
      correctIndex: 1,
      explanation: "El plan traslada decisiones difíciles a un momento sin presión emocional — el objetivo es seguirlas después, no decidirlas en caliente.",
    },
    {
      question: "¿Qué pregunta de un plan de trading responde específicamente el Nivel 6 (Gestión de Riesgo)?",
      options: [
        "¿Qué patrón de velas prefiero?",
        "¿Cuánto arriesgo por operación, en porcentaje, no en un monto fijo elegido a ojo?",
        "¿Qué red blockchain uso?",
        "¿Cómo leo una noticia?",
      ],
      correctIndex: 1,
      explanation: "El tamaño de riesgo por operación (en %, no en un monto arbitrario) es exactamente el tema central de Gestión de Riesgo.",
    },
    {
      question: "Según esta lección, ¿qué vale más: un plan sofisticado que solo existe en la cabeza, o uno simple que de verdad se sigue?",
      options: [
        "El plan sofisticado siempre, sin excepción",
        "El plan simple que realmente se sigue, de forma consistente",
        "Ninguno de los dos tiene valor real",
        "Solo importa memorizar indicadores, no tener un plan escrito",
      ],
      correctIndex: 1,
      explanation: "Un plan simple pero seguido de verdad supera a uno elaborado que se reescribe cada vez que el mercado genera miedo o euforia.",
    },
    {
      question: "Al completar los 10 niveles de la Academia, ¿cuál es el siguiente paso recomendado?",
      options: [
        "Arriesgar dinero real inmediatamente, sin más práctica",
        "Aplicar todo lo aprendido en la Terminal con dinero ficticio, hasta que el proceso se vuelva un hábito",
        "Repetir el Nivel 1 sin avanzar más",
        "No hace falta seguir practicando, la teoría es suficiente",
      ],
      correctIndex: 1,
      explanation: "El objetivo final es convertir todo el conocimiento en un proceso practicado y repetible con paper trading, antes de considerar dinero real.",
    },
    {
      question: "¿Cuál es la idea central que conecta TODOS los niveles de la Academia, según este nivel final?",
      options: [
        "Cada nivel es independiente y no se relaciona con los demás",
        "Una operación real combina piezas de todos los niveles anteriores a la vez — ningún paso del proceso es opcional",
        "Solo el análisis técnico importa, el resto es decorativo",
        "La psicología es lo único que realmente importa, todo lo demás es secundario",
      ],
      correctIndex: 1,
      explanation: "El nivel final demuestra que todas las piezas — técnica, riesgo, psicología, contexto — se usan juntas en cada operación real, no por separado.",
    },
  ],
};
