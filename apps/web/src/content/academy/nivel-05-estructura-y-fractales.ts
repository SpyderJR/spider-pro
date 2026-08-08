import type { AcademyLevelContent, Lesson } from "./types";

const HH_LL_BOS_CHOCH_BILL_WILLIAMS: Lesson = {
  id: "hh-ll-bos-choch-bill-williams",
  title: "Higher highs/lower lows, BOS, CHoCH — y el sistema completo de Bill Williams",
  estimatedMinutes: 15,
  blocks: [
    {
      type: "parrafo",
      texto:
        "En el Nivel 2 viste la idea general de tendencia. Aquí la volvemos precisa: en vez de decir \"parece alcista\" a ojo, vas a tener reglas objetivas para decir EXACTAMENTE cuándo una tendencia sigue viva y EXACTAMENTE en qué vela cambió de dirección. Es la diferencia entre opinar sobre el mercado y leerlo con un criterio que cualquier otra persona con las mismas reglas leería igual.",
    },

    { type: "titulo", texto: "1. Higher highs / higher lows — el lenguaje objetivo de la tendencia" },
    {
      type: "parrafo",
      texto:
        "Una tendencia alcista, en términos precisos, es una secuencia donde cada máximo importante (\"swing high\") es más alto que el anterior, Y cada mínimo importante (\"swing low\") es más alto que el anterior — higher highs, higher lows (HH, HL). Una tendencia bajista es la secuencia espejo: lower highs, lower lows (LH, LL). Mientras esa secuencia se mantenga intacta, la tendencia sigue viva, sin importar cuántas velas rojas (o verdes) individuales aparezcan en el camino.",
    },
    {
      type: "analogia",
      texto:
        "Es como subir una escalera: cada escalón (mínimo) está más alto que el anterior, aunque el pie a veces baje un poco al dar el siguiente paso. Mientras cada escalón nuevo quede más alto que el escalón anterior, sigues subiendo — sin importar esos pequeños retrocesos en el camino.",
    },
    {
      type: "tabla",
      headers: ["Secuencia", "Significado"],
      filas: [
        ["HH + HL (higher highs, higher lows)", "Tendencia alcista intacta"],
        ["LH + LL (lower highs, lower lows)", "Tendencia bajista intacta"],
        ["Se rompe un HL sin hacer un HH nuevo antes", "Primera señal de que la estructura alcista está en duda"],
      ],
    },
    {
      type: "conecta",
      label: "Fractales & Estructura — Fractales",
      to: "/app/fractales-estructura",
      descripcion: "Los fractales (Nivel 4) son justamente la herramienta técnica para marcar esos swing highs/lows de forma objetiva, no a ojo.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n5-l1-e1",
        enunciado: "Una tendencia alcista se rompe apenas aparece UNA sola vela roja en el gráfico.",
        respuesta: false,
        explicacion: "Falso — la tendencia se define por la secuencia de máximos y mínimos importantes (swing highs/lows), no por el color de cada vela individual. Velas en contra son normales dentro de una tendencia intacta.",
      },
    },

    { type: "titulo", texto: "2. BOS — Break of Structure (ruptura de estructura)" },
    {
      type: "parrafo",
      texto:
        "Un BOS ocurre cuando el precio rompe un swing high (en tendencia alcista) o un swing low (en tendencia bajista) anterior, CONFIRMANDO que la tendencia sigue en la misma dirección. No es un cambio de tendencia — es la tendencia actual reafirmándose con un nuevo máximo (o mínimo) que continúa la secuencia HH/HL o LH/LL.",
    },
    {
      type: "destacado",
      variante: "info",
      titulo: "BOS = CONTINUACIÓN, NO GIRO",
      texto:
        "Es el error de nomenclatura más común entre quien empieza: BOS suena a \"ruptura\" y se asume que es un cambio de dirección. Es lo contrario — un BOS confirma que la tendencia EXISTENTE sigue viva y acaba de dar un paso más en la misma dirección.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n5-l1-e2",
        pregunta: "El precio está en tendencia alcista y rompe el swing high anterior, haciendo un nuevo máximo más alto. ¿Cómo se llama esto?",
        opciones: [
          { texto: "CHoCH — la tendencia acaba de cambiar de dirección", correcta: false, explicacion: "CHoCH describe un cambio de carácter/dirección, no la continuación de la tendencia existente." },
          { texto: "BOS — la tendencia alcista se confirma y continúa", correcta: true, explicacion: "Correcto — romper el swing high anterior en la misma dirección de la tendencia es exactamente un Break of Structure de continuación." },
          { texto: "Un Death Cross", correcta: false, explicacion: "El Death Cross es un concepto de medias móviles, no de estructura de mercado." },
          { texto: "Una divergencia bajista", correcta: false, explicacion: "Las divergencias son de indicadores como el RSI, un concepto distinto a la estructura de máximos/mínimos." },
        ],
      },
    },

    { type: "titulo", texto: "3. CHoCH — Change of Character (cambio de carácter)" },
    {
      type: "parrafo",
      texto:
        "El CHoCH es la señal opuesta: ocurre cuando el precio rompe la estructura en la dirección CONTRARIA a la tendencia vigente — por ejemplo, en una tendencia alcista, cuando el precio rompe por debajo del último swing low (higher low) sin haber hecho antes un nuevo máximo. Es la primera evidencia objetiva de que el control del mercado puede estar cambiando de manos.",
    },
    {
      type: "analogia",
      texto:
        "Si BOS es \"la escalera sigue subiendo, un escalón más\", el CHoCH es el momento en que, en vez de subir el siguiente escalón, el pie retrocede por debajo del escalón anterior — la primera señal real de que quizás ya no estás subiendo.",
    },
    {
      type: "destacado",
      variante: "advertencia",
      titulo: "UN CHoCH NO ES UNA REVERSIÓN GARANTIZADA",
      texto:
        "Un CHoCH es evidencia de duda, no una promesa de reversión total. Puede ser el inicio real de una tendencia contraria, o puede quedarse en una simple corrección dentro de la tendencia original que luego se reanuda. Por eso se trata como una alerta que pide más confirmación (igual que un patrón de velas), no como una señal aislada suficiente por sí sola.",
    },
    {
      type: "conecta",
      label: "Fractales & Estructura — sección Estructura",
      to: "/app/fractales-estructura",
      descripcion: "Ahí puedes ver BOS y CHoCH marcados directamente sobre gráficos reales, con ejemplos visuales de cada caso.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "emparejar",
        id: "n5-l1-e3",
        instruccion: "Une cada concepto con su definición correcta.",
        pares: [
          { izquierda: "BOS", derecha: "Ruptura de estructura EN LA MISMA dirección de la tendencia — confirma continuación" },
          { izquierda: "CHoCH", derecha: "Ruptura de estructura en dirección CONTRARIA — primera señal de posible cambio" },
          { izquierda: "Higher High / Higher Low", derecha: "Secuencia que define una tendencia alcista objetivamente" },
        ],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "completaEspacio",
        id: "n5-l1-e4",
        plantilla: "Un BOS confirma que la tendencia actual ___, mientras que un CHoCH es la primera señal de que el control del mercado podría estar ___.",
        opciones: ["continúa / cambiando", "terminó / igual", "se invierte / fijo", "no existe / creciendo"],
        correcta: "continúa / cambiando",
      },
    },

    { type: "titulo", texto: "4. El sistema completo de Bill Williams" },
    {
      type: "parrafo",
      texto:
        "Bill Williams, trader e ingeniero, construyó un sistema completo alrededor de la idea de que el mercado tiene \"estructura fractal\" — patrones que se repiten en distintas escalas. Su sistema combina 3 herramientas que ya viste por separado en esta plataforma, pero que él diseñó para usarse JUNTAS: los Fractales (para marcar giros), el Alligator (una combinación de 3 medias móviles suavizadas que indica si el mercado está \"dormido\" en rango o \"despierto\" en tendencia), y el Awesome Oscillator (AO, que mide el momentum comparando el promedio de precio reciente contra uno más largo).",
    },
    {
      type: "tabla",
      headers: ["Herramienta", "Qué aporta al sistema"],
      filas: [
        ["Fractales", "Marcan los giros locales (máximos y mínimos) donde podría iniciar un movimiento"],
        ["Alligator", "Indica si el mercado está en rango (medias entrelazadas, 'durmiendo') o en tendencia (medias separadas, 'despierto y comiendo')"],
        ["Awesome Oscillator (AO)", "Mide si el momentum reciente está acelerando o frenando respecto al momentum de fondo"],
      ],
    },
    {
      type: "tip",
      texto: "La lógica de Bill Williams es no operar mientras el Alligator está 'dormido' (medias entrelazadas) — la mayoría de las señales falsas ocurren precisamente en esos periodos de mercado lateral.",
    },
    {
      type: "conecta",
      label: "Fractales & Estructura — Alligator y combinaciones",
      to: "/app/fractales-estructura",
      descripcion: "Ese módulo tiene una sección dedicada al Alligator y otra específica de cómo Bill Williams combinaba las 3 herramientas juntas.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n5-l1-e5",
        pregunta: "Según el sistema de Bill Williams, ¿qué sugiere un Alligator con sus 3 medias entrelazadas y planas?",
        opciones: [
          { texto: "Una tendencia extremadamente fuerte, momento ideal para entrar con tamaño máximo", correcta: false, explicacion: "Medias entrelazadas indican justo lo opuesto — el 'Alligator' está durmiendo, no cazando." },
          { texto: "El mercado está en rango/lateral ('el Alligator duerme') — mayor riesgo de señales falsas", correcta: true, explicacion: "Correcto — medias entrelazadas y planas son la señal de que el sistema de Bill Williams recomienda cautela, no acción." },
          { texto: "Es momento de usar apalancamiento máximo", correcta: false, explicacion: "Es precisamente lo contrario a lo que el sistema recomienda en ese estado del mercado." },
          { texto: "El AO y los Fractales dejan de funcionar por completo", correcta: false, explicacion: "Siguen funcionando, pero sus señales son menos confiables durante el rango — no dejan de calcularse." },
        ],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "ordenar",
        id: "n5-l1-e6",
        instruccion: "Ordena estos pasos para leer estructura de mercado de forma objetiva, del primero al último.",
        items: [
          { id: "a", texto: "Marcar los swing highs/lows recientes (con fractales u otra herramienta objetiva)" },
          { id: "b", texto: "Determinar si la secuencia es HH/HL (alcista), LH/LL (bajista), o ninguna de las dos (rango)" },
          { id: "c", texto: "Vigilar si el precio confirma la tendencia (BOS) o la pone en duda (CHoCH)" },
          { id: "d", texto: "Revisar si el Alligator está 'dormido' o 'despierto' antes de confiar en cualquier señal" },
        ],
        ordenCorrecto: ["a", "b", "c", "d"],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n5-l1-e7",
        enunciado: "Un CHoCH garantiza que la tendencia se va a revertir por completo a partir de ese momento.",
        respuesta: false,
        explicacion: "Falso — un CHoCH es una alerta de duda, no una garantía. Puede convertirse en una reversión real o quedarse en una corrección temporal dentro de la tendencia original.",
      },
    },

    { type: "titulo", texto: "Resumen" },
    {
      type: "lista",
      variante: "buenas",
      items: [
        "Una tendencia alcista se define objetivamente por la secuencia HH/HL (higher highs, higher lows); la bajista por LH/LL.",
        "BOS confirma que la tendencia actual continúa — no es un cambio de dirección, aunque el nombre suene así.",
        "CHoCH es la primera señal objetiva de que el control del mercado podría estar cambiando — evidencia de duda, no garantía de reversión.",
        "El sistema de Bill Williams combina Fractales (giros), Alligator (¿rango o tendencia?) y AO (momentum) para usarse juntos, no por separado.",
        "La mayoría de señales falsas del sistema ocurren cuando el Alligator está 'dormido' — en mercado lateral.",
      ],
    },
    {
      type: "conecta",
      label: "Practica en Fractales & Estructura",
      to: "/app/fractales-estructura",
      descripcion: "Repasa BOS, CHoCH y el sistema completo de Bill Williams con ejemplos visuales sobre gráficos reales.",
    },
  ],
};

export const NIVEL_05_ESTRUCTURA_Y_FRACTALES: AcademyLevelContent = {
  id: "estructura-y-fractales",
  order: 5,
  title: "Estructura de mercado y fractales",
  description: "Higher highs/lower lows, BOS y CHoCH, el sistema Bill Williams completo.",
  difficulty: "intermedio",
  icon: "〽",
  recommendedBeforeId: "indicadores-tecnicos",
  lessons: [HH_LL_BOS_CHOCH_BILL_WILLIAMS],
  quiz: [
    {
      question: "¿Cómo se define objetivamente una tendencia alcista en términos de estructura?",
      options: [
        "Cuando la mayoría de las velas del día son verdes",
        "Una secuencia de higher highs Y higher lows (cada máximo y cada mínimo importante más alto que el anterior)",
        "Cuando el RSI está por encima de 50",
        "Cuando el volumen sube todos los días",
      ],
      correctIndex: 1,
      explanation: "La definición objetiva de tendencia alcista es la secuencia de swing highs y swing lows ascendentes, HH y HL.",
    },
    {
      question: "¿Qué significa que una tendencia siga 'intacta' aunque aparezcan velas en contra?",
      options: [
        "Que ninguna vela roja puede aparecer nunca en una tendencia alcista",
        "Que mientras la secuencia de máximos y mínimos importantes se mantenga (HH/HL), retrocesos individuales no rompen la tendencia",
        "Que las velas no importan en absoluto",
        "Que solo cuenta el precio de cierre del día",
      ],
      correctIndex: 1,
      explanation: "La tendencia se juzga por la secuencia de swings importantes, no por cada vela individual — retrocesos normales no la rompen mientras la estructura de fondo se mantenga.",
    },
    {
      question: "¿Qué es un BOS (Break of Structure)?",
      options: [
        "Una ruptura de estructura en dirección CONTRARIA a la tendencia — señal de posible giro",
        "Una ruptura de estructura en la MISMA dirección de la tendencia — confirma que continúa",
        "Un tipo de orden límite",
        "Un indicador de volumen",
      ],
      correctIndex: 1,
      explanation: "A pesar de que 'ruptura' suene a cambio, un BOS confirma que la tendencia existente sigue viva y avanza un paso más.",
    },
    {
      question: "¿Qué es un CHoCH (Change of Character)?",
      options: [
        "Lo mismo que un BOS, con otro nombre",
        "Una ruptura de estructura en dirección contraria a la tendencia vigente — primera señal objetiva de posible cambio de control",
        "Un patrón de velas de 3 velas",
        "Un indicador de volumen",
      ],
      correctIndex: 1,
      explanation: "El CHoCH ocurre cuando el precio rompe la estructura en contra de la tendencia actual, sugiriendo que el control del mercado podría estar cambiando de manos.",
    },
    {
      question: "¿Un CHoCH garantiza que la tendencia se va a revertir por completo?",
      options: [
        "Sí, siempre, sin excepción",
        "No — es evidencia de duda, puede convertirse en reversión real o quedarse en una corrección temporal",
        "Solo si aparece en gráficos de 1 minuto",
        "Los CHoCH no existen en criptomonedas",
      ],
      correctIndex: 1,
      explanation: "Un CHoCH es una alerta objetiva, no una garantía — requiere más confirmación antes de asumir una reversión completa.",
    },
    {
      question: "¿Qué 3 herramientas combina el sistema completo de Bill Williams?",
      options: [
        "RSI, MACD y Bollinger",
        "Fractales, Alligator y Awesome Oscillator (AO)",
        "Medias móviles, volumen y velas japonesas",
        "Soporte, resistencia y tendencia",
      ],
      correctIndex: 1,
      explanation: "El sistema de Bill Williams combina Fractales (giros), Alligator (rango vs. tendencia) y AO (momentum), diseñados para usarse juntos.",
    },
    {
      question: "¿Qué indica el Alligator cuando sus 3 medias están entrelazadas y planas?",
      options: [
        "Una tendencia extremadamente fuerte",
        "Que el mercado está en rango/lateral ('el Alligator duerme') — mayor riesgo de señales falsas",
        "Que hay que usar el apalancamiento máximo",
        "Un error en el cálculo del indicador",
      ],
      correctIndex: 1,
      explanation: "Medias entrelazadas y planas son la señal clásica de mercado lateral en este sistema — momento de cautela, no de acción.",
    },
    {
      question: "¿Qué mide el Awesome Oscillator (AO) dentro del sistema de Bill Williams?",
      options: [
        "El volumen total operado",
        "Si el momentum reciente está acelerando o frenando respecto al momentum de más largo plazo",
        "El número de holders de un token",
        "El tick size del par",
      ],
      correctIndex: 1,
      explanation: "El AO compara el promedio de precio reciente contra uno más largo, para juzgar si el impulso está ganando o perdiendo fuerza.",
    },
    {
      question: "¿Cuál es la principal ventaja de usar conceptos como HH/HL, BOS y CHoCH en vez de 'sentir' la tendencia a ojo?",
      options: [
        "No hay ninguna ventaja real",
        "Dan un criterio objetivo y repetible — cualquier persona con las mismas reglas leería la estructura de forma similar",
        "Son más rápidos de calcular que cualquier indicador",
        "Eliminan por completo el riesgo de la operación",
      ],
      correctIndex: 1,
      explanation: "El valor de estos conceptos es la objetividad: reemplazan la opinión subjetiva sobre 'si hay tendencia o no' con reglas claras y verificables.",
    },
    {
      question: "¿En qué condición de mercado ocurren la mayoría de las señales falsas del sistema de Bill Williams?",
      options: [
        "Cuando el Alligator está 'despierto' con las medias muy separadas",
        "Cuando el Alligator está 'dormido', con las medias entrelazadas — mercado lateral",
        "Solo en marcos de tiempo semanales",
        "Nunca hay señales falsas en este sistema",
      ],
      correctIndex: 1,
      explanation: "El propio sistema advierte evitar operar mientras el Alligator duerme (mercado en rango), precisamente porque ahí es donde más señales falsas aparecen.",
    },
  ],
};
