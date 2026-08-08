import type { AcademyLevelContent, Lesson } from "./types";

const FOMO_REVENGE_SESGOS_DIARIO: Lesson = {
  id: "fomo-revenge-sesgos-diario",
  title: "FOMO, revenge trading, sesgos cognitivos, disciplina — y por qué el diario es clave",
  estimatedMinutes: 14,
  blocks: [
    {
      type: "parrafo",
      texto:
        "Puedes saber leer velas, indicadores y estructura de mercado a la perfección — y aun así perder dinero de forma consistente. La razón casi siempre no es técnica: es psicológica. Este nivel no enseña un indicador nuevo; enseña a reconocer los patrones mentales que hacen que un trader rompa su propio plan justo cuando más importa seguirlo.",
    },
    {
      type: "destacado",
      variante: "advertencia",
      titulo: "POR QUÉ ESTE NIVEL IMPORTA MÁS DE LO QUE PARECE",
      texto:
        "La gran mayoría de las pérdidas evitables no vienen de un mal análisis técnico — vienen de romper el propio plan en el momento equivocado: entrar sin condiciones cumplidas, mover el stop loss por miedo, o duplicar el tamaño después de una pérdida. El análisis técnico define QUÉ hacer; la psicología define si de verdad lo vas a hacer.",
    },

    { type: "titulo", texto: "1. FOMO — el miedo a quedarse afuera" },
    {
      type: "analogia",
      texto:
        "Es la misma sensación de correr a subirte a un autobús que ya está arrancando: la urgencia nubla el juicio y no te da tiempo de preguntarte si ese autobús en realidad iba hacia donde tú querías ir.",
    },
    {
      type: "parrafo",
      texto:
        "FOMO (Fear Of Missing Out) aparece cuando el precio ya subió con fuerza y sientes la urgencia de entrar YA, sin haber revisado tus condiciones habituales, solo para no \"quedarte afuera\" del movimiento. Es una señal casi perfectamente invertida: si un trade te da miedo por lo rápido que se está moviendo, probablemente ya llegaste tarde, no temprano.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n7-l1-e1",
        enunciado: "Sentir urgencia de entrar porque el precio 'ya se está yendo sin ti' es normalmente una buena señal de entrada.",
        respuesta: false,
        explicacion: "Falso — esa urgencia es la firma clásica del FOMO, y suele indicar que el movimiento ya avanzó mucho, no que recién empieza.",
      },
    },

    { type: "titulo", texto: "2. Revenge trading — el trading de venganza" },
    {
      type: "parrafo",
      texto:
        "Ocurre después de una pérdida: la necesidad inmediata de \"recuperarla\" con otra entrada, casi siempre más grande y peor planeada que la anterior. La entrada no nace de una condición técnica cumplida — nace de una emoción. Es, probablemente, el patrón que más cuentas ha quebrado en la historia del trading, porque convierte UNA pérdida normal y controlada en una cadena de pérdidas cada vez más grandes.",
    },
    {
      type: "destacado",
      variante: "exito",
      titulo: "ESTA PLATAFORMA YA LO DETECTA POR TI",
      texto:
        "El Diario de Trading calcula automáticamente tu win rate en las operaciones que siguen inmediatamente a una racha de pérdidas — si ese número cae mucho respecto a tu win rate normal, aparece una alerta explícita de posible revenge trading, calculada con reglas sobre tus propios datos, nunca inventada.",
    },
    {
      type: "conecta",
      label: "Diario de Trading — Auditoría de patrones",
      to: "/app/diario",
      descripcion: "Registra tus operaciones y revisa la sección de Auditoría de patrones — te dice, con tus propios números, si el revenge trading es un problema real en tu historial.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n7-l1-e2",
        pregunta: "¿Cuál es la regla más efectiva contra el revenge trading, según esta lección?",
        opciones: [
          { texto: "Duplicar el tamaño de la siguiente operación para recuperar la pérdida más rápido", correcta: false, explicacion: "Esto es literalmente la definición de revenge trading, no una defensa contra él." },
          { texto: "Esperar después de una pérdida antes de la siguiente entrada — dejar pasar el impulso emocional inmediato", correcta: true, explicacion: "Correcto — la pausa (un café, una caminata, lo que sea) rompe el ciclo emocional antes de que se convierta en una entrada impulsiva." },
          { texto: "Cambiar inmediatamente de estrategia después de cualquier pérdida", correcta: false, explicacion: "Cambiar de estrategia por una sola pérdida es otro síntoma de reacción emocional, no una solución." },
          { texto: "Ignorar la pérdida por completo y no analizarla nunca", correcta: false, explicacion: "Ignorar el trade sin aprender de él desperdicia la única parte útil de una pérdida — la lección." },
        ],
      },
    },

    { type: "titulo", texto: "3. Sesgos cognitivos — cuando la mente 'hace trampa' sin que te des cuenta" },
    {
      type: "parrafo",
      texto:
        "Un sesgo cognitivo no es un error de conocimiento — es un atajo mental automático que el cerebro usa siempre, útil en la vida diaria, pero peligroso en trading. El sesgo de confirmación es revisar 5 indicadores buscando (sin darte cuenta) que todos digan lo que ya pensabas, descartando mentalmente los que no coinciden como \"ruido\". El exceso de confianza aparece después de una racha ganadora: sientes que \"entendiste el mercado\" y empiezas a saltarte pasos de tu propio análisis o a subir el tamaño sin que haya cambiado nada real en tu ventaja estadística.",
    },
    {
      type: "tabla",
      headers: ["Sesgo", "Cómo detectarlo en ti mismo"],
      filas: [
        ["Sesgo de confirmación", "Buscas activamente evidencia a favor de tu idea, no evidencia que la contradiga"],
        ["Exceso de confianza", "Tu tamaño de posición sube después de una racha ganadora, sin que tu análisis haya cambiado"],
        ["FOMO", "Entras por urgencia, sin haber revisado tus condiciones habituales de entrada"],
        ["Revenge trading", "Entras minutos después de una pérdida, con tamaño mayor al habitual"],
      ],
    },
    {
      type: "tip",
      texto: "Antes de entrar, pregúntate activamente: '¿por qué podría fallar este trade?' — si no puedes nombrar al menos una razón real, no estás analizando, estás justificando una decisión que ya tomaste.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "emparejar",
        id: "n7-l1-e3",
        instruccion: "Une cada sesgo con la señal que lo delata.",
        pares: [
          { izquierda: "Sesgo de confirmación", derecha: "Ignoras la evidencia que contradice tu idea inicial" },
          { izquierda: "Exceso de confianza", derecha: "Subes el tamaño de posición después de ganar varias veces seguidas" },
          { izquierda: "FOMO", derecha: "Entras con urgencia porque 'ya se está yendo sin ti'" },
        ],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "completaEspacio",
        id: "n7-l1-e4",
        plantilla: "Un sesgo cognitivo no es falta de conocimiento — es un ___ mental automático, útil en la vida diaria pero ___ en trading.",
        opciones: ["atajo / peligroso", "indicador / gratuito", "patrón de velas / lento", "fractal / obligatorio"],
        correcta: "atajo / peligroso",
      },
    },

    { type: "titulo", texto: "4. Disciplina — la habilidad que sostiene a todas las demás" },
    {
      type: "parrafo",
      texto:
        "La disciplina en trading no es \"fuerza de voluntad\" abstracta — es tener reglas escritas ANTES de operar (tamaño de posición, condiciones de entrada, dónde va el stop loss) y seguirlas incluso cuando la emoción del momento pide algo distinto. Todo lo aprendido en Gestión de Riesgo (Nivel 6) es exactamente eso: reglas objetivas diseñadas para funcionar incluso cuando tu cabeza, en el momento, quiere romperlas.",
    },
    {
      type: "conecta",
      label: "Gestión de Riesgo — sección Psicología",
      to: "/app/gestion-de-riesgo",
      descripcion: "Ese módulo tiene una sección completa de sesgos con ejemplos adicionales y las reglas prácticas para cada uno.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "ordenar",
        id: "n7-l1-e5",
        instruccion: "Ordena estos pasos de un proceso disciplinado antes de operar, del primero al último.",
        items: [
          { id: "a", texto: "Definir las condiciones de entrada ANTES de que el precio se mueva, no durante" },
          { id: "b", texto: "Calcular el tamaño de posición según tu % de riesgo, no según qué tan seguro te sientes" },
          { id: "c", texto: "Entrar solo si las condiciones se cumplen — ignorar la urgencia si no se cumplen" },
          { id: "d", texto: "Registrar el resultado en el Diario, sin importar si ganó o perdió" },
        ],
        ordenCorrecto: ["a", "b", "c", "d"],
      },
    },

    { type: "titulo", texto: "5. Por qué el Diario de Trading es la herramienta más importante de este nivel" },
    {
      type: "parrafo",
      texto:
        "Ningún trader detecta sus propios patrones emocionales solo \"sintiéndolos\" en el momento — el cerebro que toma la decisión impulsiva es el mismo que después la justifica. El Diario rompe ese ciclo: convierte cada operación en un dato objetivo (resultado, emoción registrada, señales usadas, horario) que se puede analizar después, con la cabeza fría, en vez de confiar en la memoria selectiva de \"me fue bien la mayoría de las veces\".",
    },
    {
      type: "destacado",
      variante: "info",
      titulo: "LO QUE EL DIARIO CALCULA POR TI, AUTOMÁTICAMENTE",
      texto:
        "Win rate por emoción registrada, por señal usada, por día de la semana, por horario — y la auditoría de patrones que detecta revenge trading y tu peor combinación de día/horario después de una pérdida. Todo calculado con reglas sobre tus datos reales, nunca con IA inventando conclusiones.",
    },
    {
      type: "conecta",
      label: "Empieza tu Diario de Trading",
      to: "/app/diario",
      descripcion: "Cada trade cerrado en la Terminal se puede convertir en una entrada del Diario en un clic — el hábito más valioso de toda la Academia.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n7-l1-e6",
        pregunta: "¿Por qué 'sentir' tus propios patrones emocionales en el momento no es suficiente para corregirlos?",
        opciones: [
          { texto: "Porque las emociones en trading no existen realmente", correcta: false, explicacion: "Las emociones sí existen y afectan las decisiones — esa es justamente la premisa de todo este nivel." },
          { texto: "Porque el mismo cerebro que toma la decisión impulsiva es el que después la justifica — hace falta un registro objetivo externo para verlo con claridad", correcta: true, explicacion: "Correcto — por eso el Diario convierte cada trade en datos objetivos, revisables después, en vez de depender de la memoria selectiva." },
          { texto: "Porque las computadoras operan mejor que cualquier humano en todos los casos", correcta: false, explicacion: "Esta lección no trata sobre automatizar el trading, sino sobre reconocer y corregir patrones psicológicos propios." },
          { texto: "Porque no hay forma de mejorar la disciplina de ningún trader", correcta: false, explicacion: "Todo lo contrario — el registro objetivo es exactamente la herramienta que permite mejorar la disciplina con el tiempo." },
        ],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n7-l1-e7",
        enunciado: "El Diario de Trading de esta plataforma usa IA para inventar conclusiones sobre tus patrones emocionales.",
        respuesta: false,
        explicacion: "Falso — la Auditoría de patrones se calcula con reglas fijas sobre tus datos reales (win rate por emoción, racha de pérdidas, etc.), nunca con IA generando conclusiones.",
      },
    },

    { type: "titulo", texto: "Resumen" },
    {
      type: "lista",
      variante: "buenas",
      items: [
        "El FOMO es la urgencia de entrar por miedo a quedarte afuera — casi siempre significa que ya llegaste tarde, no temprano.",
        "El revenge trading convierte una pérdida normal en una cadena de pérdidas — la regla más efectiva es la pausa antes de la siguiente entrada.",
        "El sesgo de confirmación y el exceso de confianza son atajos mentales automáticos, no fallas de conocimiento — hay que buscarlos activamente en uno mismo.",
        "La disciplina es tener reglas escritas ANTES de operar y seguirlas incluso cuando la emoción del momento pide otra cosa.",
        "El Diario de Trading convierte tus patrones emocionales en datos objetivos y revisables — la única forma real de corregir lo que no puedes ver mientras estás dentro del momento.",
      ],
    },
    {
      type: "conecta",
      label: "Registra tu primer trade en el Diario",
      to: "/app/diario",
      descripcion: "El primer paso real de este nivel no es más teoría — es empezar a registrar tus propias operaciones.",
    },
  ],
};

export const NIVEL_07_PSICOLOGIA_DEL_TRADING: AcademyLevelContent = {
  id: "psicologia-del-trading",
  order: 7,
  title: "Psicología del trading",
  description: "FOMO, revenge trading, sesgos cognitivos, disciplina y por qué el diario es clave.",
  difficulty: "intermedio",
  icon: "🧠",
  recommendedBeforeId: "gestion-de-riesgo",
  lessons: [FOMO_REVENGE_SESGOS_DIARIO],
  quiz: [
    {
      question: "¿Qué es el FOMO en trading?",
      options: [
        "Un indicador técnico basado en volumen",
        "La urgencia de entrar a un trade por miedo a quedarse afuera de un movimiento que ya avanzó",
        "Un patrón de velas de reversión",
        "Un tipo de orden límite",
      ],
      correctIndex: 1,
      explanation: "FOMO (Fear Of Missing Out) es la urgencia emocional de entrar sin haber revisado condiciones, solo por no quedarse afuera del movimiento.",
    },
    {
      question: "Si un trade te genera miedo por lo rápido que se está moviendo, ¿qué sugiere esto según la lección?",
      options: [
        "Que es el momento perfecto para entrar con el máximo tamaño",
        "Que probablemente ya llegaste tarde al movimiento, no temprano",
        "Que el indicador está roto",
        "Que debes usar más apalancamiento",
      ],
      correctIndex: 1,
      explanation: "Esa urgencia/miedo es la firma clásica del FOMO — casi siempre indica que el movimiento ya avanzó mucho.",
    },
    {
      question: "¿Qué es el revenge trading?",
      options: [
        "Una estrategia válida para recuperar pérdidas rápidamente",
        "La necesidad impulsiva de 'recuperar' una pérdida con otra entrada, generalmente más grande y peor planeada",
        "Un patrón de velas específico",
        "Un tipo de análisis fundamental",
      ],
      correctIndex: 1,
      explanation: "El revenge trading nace de la emoción tras una pérdida, no de una condición técnica cumplida — es uno de los patrones más destructivos del trading.",
    },
    {
      question: "¿Cómo detecta esta plataforma el revenge trading automáticamente?",
      options: [
        "No lo detecta de ninguna forma",
        "El Diario de Trading calcula tu win rate en operaciones que siguen a una racha de pérdidas y alerta si cae mucho respecto a tu win rate normal",
        "Preguntándote directamente si te sientes enojado",
        "Bloqueando la Terminal después de cualquier pérdida",
      ],
      correctIndex: 1,
      explanation: "La Auditoría de patrones del Diario usa reglas sobre datos reales (win rate tras rachas de pérdidas) para detectar este patrón, sin IA ni inventar nada.",
    },
    {
      question: "¿Qué es el sesgo de confirmación?",
      options: [
        "Buscar activamente evidencia que confirme lo que ya pensabas, ignorando sin darte cuenta la evidencia contraria",
        "Un indicador de momentum",
        "La confirmación de una vela de reversión",
        "Un tipo de orden en el exchange",
      ],
      correctIndex: 0,
      explanation: "El sesgo de confirmación es un atajo mental automático: revisar varios indicadores buscando que todos coincidan con la idea inicial, descartando lo que no encaja.",
    },
    {
      question: "¿Cuándo suele aparecer el exceso de confianza?",
      options: [
        "Después de una racha de pérdidas seguidas",
        "Después de varios trades ganadores seguidos, cuando se empieza a subir el tamaño sin que haya cambiado el análisis real",
        "Solo en el primer trade de un trader nuevo",
        "Nunca ocurre en trading",
      ],
      correctIndex: 1,
      explanation: "El exceso de confianza tras una racha ganadora lleva a saltarse pasos del análisis o aumentar el riesgo sin justificación real.",
    },
    {
      question: "¿Qué es la disciplina en trading, según esta lección?",
      options: [
        "Fuerza de voluntad abstracta sin ninguna estructura",
        "Tener reglas escritas ANTES de operar y seguirlas incluso cuando la emoción del momento pide otra cosa",
        "Operar sin ningún plan, confiando en la intuición",
        "Usar siempre el apalancamiento máximo disponible",
      ],
      correctIndex: 1,
      explanation: "La disciplina se define como reglas objetivas definidas de antemano, diseñadas para sostenerse incluso bajo presión emocional.",
    },
    {
      question: "¿Por qué 'sentir' los propios patrones emocionales en el momento no basta para corregirlos?",
      options: [
        "Porque las emociones no existen en trading",
        "Porque el mismo cerebro que toma la decisión impulsiva es el que después la justifica — hace falta un registro objetivo externo",
        "Porque los patrones emocionales son aleatorios y no se pueden estudiar",
        "Porque solo los traders profesionales tienen emociones",
      ],
      correctIndex: 1,
      explanation: "La memoria selectiva y la propia justificación posterior hacen que un registro externo objetivo (el Diario) sea necesario para ver patrones reales.",
    },
    {
      question: "¿Qué calcula automáticamente el Diario de Trading de esta plataforma?",
      options: [
        "Nada, es solo un cuaderno de notas sin análisis",
        "Win rate por emoción, por señal, por día/horario, y alertas de patrones como revenge trading — todo con reglas, no con IA",
        "Predicciones de precio futuro",
        "Recomendaciones automáticas de compra/venta",
      ],
      correctIndex: 1,
      explanation: "El Diario calcula estadísticas reales sobre tus propios datos con reglas fijas, incluyendo la Auditoría de patrones — nunca genera predicciones ni recomendaciones.",
    },
    {
      question: "¿Cuál es el primer paso práctico recomendado al terminar este nivel?",
      options: [
        "Memorizar los nombres de los sesgos y no hacer nada más",
        "Empezar a registrar operaciones reales en el Diario de Trading",
        "Aumentar el apalancamiento para probar lo aprendido",
        "Ignorar la psicología y enfocarse solo en indicadores",
      ],
      correctIndex: 1,
      explanation: "Toda la teoría de este nivel se vuelve útil solo cuando se aplica — el Diario es la herramienta donde eso ocurre en la práctica.",
    },
  ],
};
