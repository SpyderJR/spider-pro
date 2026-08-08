import type { AcademyLevelContent, Lesson } from "./types";

const FUERZA_INDECISION_REVERSION: Lesson = {
  id: "fuerza-indecision-reversion",
  title: "Velas de fuerza, de indecisión, y patrones de reversión — sin sobre-interpretarlos",
  estimatedMinutes: 13,
  blocks: [
    {
      type: "parrafo",
      texto:
        "Ya sabes leer una vela individual (Nivel 2). Este nivel da el siguiente paso: agrupar 1, 2 o 3 velas en \"patrones\" que la comunidad de trading lleva más de un siglo observando — y, más importante, entender qué tan en serio tomarlos. Un patrón de velas nunca es una promesa matemática; es una lectura de psicología de mercado con una probabilidad histórica a favor, ni más ni menos.",
    },
    {
      type: "destacado",
      variante: "advertencia",
      titulo: "EL RIESGO REAL DE ESTE NIVEL",
      texto:
        "Es muy fácil \"ver\" un patrón donde no hay uno real, sobre todo después de aprenderlos — el cerebro busca confirmar lo que acaba de estudiar. Cada patrón de este nivel tiene una condición de CONFIRMACIÓN explícita: sin esa confirmación, no es una señal, es una forma que se parece a una señal.",
    },

    { type: "titulo", texto: "1. Tres familias de velas, según lo que revelan" },
    {
      type: "parrafo",
      texto:
        "Antes de nombres específicos, es más útil clasificar por lo que la vela REVELA sobre la pelea entre compradores y vendedores: velas de fuerza (un bando dominó claramente, cuerpo grande, mechas cortas), velas de indecisión (ninguno de los dos ganó, cuerpo chico, el Doji es el caso extremo), y velas de rechazo (un bando intentó controlar pero fue empujado de vuelta con fuerza — mecha larga de un solo lado, como el Martillo o la Estrella Fugaz).",
    },
    {
      type: "tabla",
      headers: ["Familia", "Qué se ve", "Qué revela"],
      filas: [
        ["Fuerza", "Cuerpo grande, mechas cortas o inexistentes", "Un bando dominó la pelea de principio a fin"],
        ["Indecisión", "Cuerpo muy pequeño (Doji)", "Compradores y vendedores empataron — el mercado \"duda\""],
        ["Rechazo", "Mecha larga de un solo lado, cuerpo pequeño en el otro extremo", "Un bando intentó controlar y fue rechazado con fuerza"],
      ],
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n3-l1-e1",
        pregunta: "Aparece un Doji (cuerpo casi inexistente) después de una tendencia alcista larga. ¿Qué familia es y qué sugiere?",
        opciones: [
          { texto: "Vela de fuerza — la tendencia alcista sigue con toda su potencia", correcta: false, explicacion: "Un cuerpo casi inexistente es lo opuesto a una vela de fuerza." },
          { texto: "Vela de indecisión — compradores y vendedores empataron, posible pausa o giro de la tendencia", correcta: true, explicacion: "Correcto — el Doji es el caso extremo de indecisión; después de una tendencia larga, sugiere que el bando dominante puede estar perdiendo el control." },
          { texto: "Vela de rechazo — el precio fue empujado con fuerza en una dirección", correcta: false, explicacion: "El rechazo se caracteriza por una mecha larga de un solo lado, no por un cuerpo casi inexistente en ambos lados." },
          { texto: "No tiene ningún significado especial", correcta: false, explicacion: "El Doji es una de las velas más vigiladas del análisis técnico, especialmente después de una tendencia extendida." },
        ],
      },
    },

    { type: "titulo", texto: "2. Martillo y Estrella Fugaz — el par clásico de rechazo" },
    {
      type: "analogia",
      texto:
        "Imagina que el precio intenta \"probar\" un nivel más bajo (o más alto), como alguien tanteando el agua fría de una alberca — y se arrepiente, saliendo disparado de vuelta. Esa mecha larga es la huella de ese arrepentimiento colectivo del mercado.",
    },
    {
      type: "parrafo",
      texto:
        "El Martillo (Hammer) aparece al final de una caída: mecha inferior larga (al menos 2 veces el cuerpo), cuerpo pequeño en la parte superior, mecha superior casi inexistente. Sugiere que los vendedores empujaron el precio abajo, pero los compradores lo recuperaron con fuerza antes del cierre. La Estrella Fugaz (Shooting Star) es su espejo exacto al final de una subida: mecha superior larga, cuerpo pequeño abajo.",
    },
    {
      type: "destacado",
      variante: "info",
      titulo: "LA CONFIRMACIÓN NO ES OPCIONAL",
      texto:
        "Ni el Martillo ni la Estrella Fugaz se operan solos. La confirmación estándar es esperar a que la SIGUIENTE vela cierre en la dirección sugerida (verde después de un Martillo, roja después de una Estrella Fugaz) — operar el patrón mismo, sin esperar esa confirmación, es de los errores más comunes de quien recién los aprende.",
    },
    {
      type: "conecta",
      label: "Velas Japonesas — enciclopedia de patrones",
      to: "/app/velas-japonesas",
      descripcion: "Ahí está el detalle completo de Martillo, Martillo Invertido, Hombre Colgado, Estrella Fugaz y el resto — con su fiabilidad histórica y cómo operarlos.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n3-l1-e2",
        enunciado: "Un Martillo al final de una caída es suficiente por sí solo para entrar en largo, sin esperar ninguna otra confirmación.",
        respuesta: false,
        explicacion: "Falso — la confirmación estándar es esperar a que la vela SIGUIENTE cierre en la dirección sugerida antes de actuar sobre el patrón.",
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "emparejar",
        id: "n3-l1-e3",
        instruccion: "Une cada patrón con su ubicación característica en la tendencia.",
        pares: [
          { izquierda: "Martillo", derecha: "Final de una caída — mecha inferior larga" },
          { izquierda: "Estrella Fugaz", derecha: "Final de una subida — mecha superior larga" },
          { izquierda: "Hombre Colgado", derecha: "Misma forma que el Martillo, pero al final de una subida (señal bajista)" },
        ],
      },
    },

    { type: "titulo", texto: "3. Envolvente y estrellas de 3 velas — reversión con más peso" },
    {
      type: "parrafo",
      texto:
        "La vela Envolvente (Engulfing) usa 2 velas: la segunda tiene un cuerpo que \"envuelve\" completamente el cuerpo de la primera, en dirección contraria. Una Envolvente Alcista después de una caída (vela roja pequeña seguida de una verde grande que la cubre por completo) sugiere que los compradores no solo detuvieron la caída — la revirtieron con fuerza superior a la de todo el movimiento anterior.",
    },
    {
      type: "parrafo",
      texto:
        "Los patrones de 3 velas (Estrella de la Mañana / Estrella de la Tarde) cuentan una historia más completa: vela fuerte en la dirección de la tendencia, vela pequeña de indecisión, y vela fuerte en la dirección contraria que confirma el giro — literalmente la secuencia \"dominio → duda → reversión\" en 3 pasos.",
    },
    {
      type: "tip",
      texto: "En general, mientras más velas necesita un patrón para completarse, más 'peso' estadístico suele tener — pero también tarda más en confirmarse, así que llega más tarde en el movimiento.",
    },
    {
      type: "conecta",
      label: "Terminal — Patrones de vela (detección automática)",
      to: "/app/terminal",
      descripcion: "Activa el toggle 'Patrones de vela' en la Terminal — marca automáticamente Doji, Martillo, Estrella Fugaz y Envolventes directo sobre las velas reales de cualquier par.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n3-l1-e4",
        pregunta: "¿Qué caracteriza a una vela Envolvente Alcista?",
        opciones: [
          { texto: "Una sola vela con mecha inferior muy larga", correcta: false, explicacion: "Esa descripción corresponde al Martillo, no a la Envolvente." },
          { texto: "Una vela roja pequeña seguida de una vela verde cuyo cuerpo cubre completamente el cuerpo de la roja anterior", correcta: true, explicacion: "Correcto — el 'engullir' completamente el cuerpo anterior es la característica que define a la Envolvente." },
          { texto: "Tres velas seguidas del mismo color", correcta: false, explicacion: "Eso describiría más bien un patrón como Tres Soldados Blancos, no una Envolvente." },
          { texto: "Un Doji seguido de otro Doji", correcta: false, explicacion: "Dos Dojis seguidos no forman un patrón de Envolvente — la Envolvente requiere que un cuerpo cubra por completo al anterior." },
        ],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "completaEspacio",
        id: "n3-l1-e5",
        plantilla: "La Estrella de la Mañana es un patrón de ___ velas que cuenta la historia \"dominio → ___ → reversión\".",
        opciones: ["3 / duda", "2 / volumen", "5 / fractal", "1 / confirmación"],
        correcta: "3 / duda",
      },
    },

    { type: "titulo", texto: "4. Por qué no hay que sobre-interpretarlos" },
    {
      type: "destacado",
      variante: "advertencia",
      titulo: "UN PATRÓN ES PROBABILIDAD, NO CERTEZA",
      texto:
        "Ningún patrón de velas tiene 100% de acierto histórico — ni siquiera cerca. Son una pieza más de evidencia, del mismo tipo que un indicador o un nivel de soporte: útiles quyando confluyen con otras señales (por eso el Nivel 4 termina justo en la regla de confluencia), peligrosos cuando se operan solos como si fueran garantía.",
    },
    {
      type: "errorComun",
      texto: "Ignorar el CONTEXTO. Un Martillo en medio de un mercado lateral sin tendencia previa no significa lo mismo que un Martillo al final de una caída marcada de varios días — el mismo dibujo, distinto peso según dónde aparece.",
    },
    {
      type: "conecta",
      label: "Indicadores técnicos — la regla de confluencia",
      to: "/app/academia/indicadores-tecnicos",
      descripcion: "Ese nivel explica cómo combinar patrones de velas con medias, RSI y MACD antes de confiar en cualquier señal.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "ordenar",
        id: "n3-l1-e6",
        instruccion: "Ordena estos pasos para operar un patrón de velas de forma responsable, del primero al último.",
        items: [
          { id: "a", texto: "Identificar el patrón (ej. Martillo) al final de una tendencia clara" },
          { id: "b", texto: "Confirmar el contexto: ¿tiene sentido ahí, o aparece en medio de un rango sin tendencia?" },
          { id: "c", texto: "Esperar la vela de confirmación (que cierre en la dirección sugerida)" },
          { id: "d", texto: "Buscar confluencia con otra señal (soporte, RSI, volumen) antes de entrar" },
        ],
        ordenCorrecto: ["a", "b", "c", "d"],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n3-l1-e7",
        enunciado: "Un Martillo tiene exactamente la misma fuerza como señal sin importar si aparece en un mercado lateral o al final de una caída marcada.",
        respuesta: false,
        explicacion: "Falso — el contexto donde aparece un patrón cambia por completo su peso; el mismo dibujo en un mercado sin tendencia clara vale mucho menos que al final de un movimiento marcado.",
      },
    },

    { type: "titulo", texto: "Resumen" },
    {
      type: "lista",
      variante: "buenas",
      items: [
        "Clasifica primero por familia: fuerza (cuerpo grande), indecisión (Doji), o rechazo (mecha larga de un lado) — antes de memorizar nombres.",
        "Martillo y Estrella Fugaz son espejos: rechazo al final de una caída y de una subida, respectivamente.",
        "La Envolvente y las estrellas de 3 velas dan más peso porque muestran una reversión más completa, a costa de confirmarse más tarde.",
        "Ningún patrón se opera sin confirmación de la vela siguiente — el patrón solo es la primera mitad de la señal.",
        "El contexto (dónde aparece el patrón) cambia por completo su peso — el mismo dibujo no vale igual en cualquier lugar del gráfico.",
      ],
    },
    {
      type: "conecta",
      label: "Ver todos los patrones en detalle",
      to: "/app/velas-japonesas",
      descripcion: "Repasa cada patrón con su fiabilidad histórica, contexto y cómo operarlo — la enciclopedia completa que complementa este nivel.",
    },
  ],
};

export const NIVEL_03_PATRONES_DE_VELAS: AcademyLevelContent = {
  id: "patrones-de-velas",
  order: 3,
  title: "Patrones de velas",
  description: "Velas de fuerza, indecisión, martillo/estrella fugaz y patrones de reversión — sin sobre-interpretarlos.",
  difficulty: "principiante",
  icon: "🎴",
  recommendedBeforeId: "leer-el-grafico",
  lessons: [FUERZA_INDECISION_REVERSION],
  quiz: [
    {
      question: "¿Qué caracteriza a una vela de la familia 'fuerza'?",
      options: [
        "Cuerpo muy pequeño, casi inexistente",
        "Cuerpo grande, con mechas cortas o inexistentes",
        "Mecha larga de un solo lado",
        "Tres velas seguidas del mismo tamaño",
      ],
      correctIndex: 1,
      explanation: "Una vela de fuerza muestra que un bando (compradores o vendedores) dominó claramente la pelea de principio a fin — cuerpo grande, mechas mínimas.",
    },
    {
      question: "¿Qué es un Doji y qué familia representa?",
      options: [
        "Una vela con cuerpo casi inexistente — el caso extremo de la familia de indecisión",
        "Un patrón de 3 velas de reversión",
        "Otro nombre para el Martillo",
        "Una vela exclusiva de mercados de rango",
      ],
      correctIndex: 0,
      explanation: "El Doji tiene apertura y cierre casi idénticos — representa un empate total entre compradores y vendedores, el caso extremo de indecisión.",
    },
    {
      question: "¿Dónde aparece característicamente un Martillo (Hammer)?",
      options: [
        "En medio de una tendencia alcista fuerte, sin razón aparente",
        "Al final de una caída — mecha inferior larga, cuerpo pequeño arriba",
        "Al final de una subida — mecha superior larga",
        "Solo en gráficos semanales",
      ],
      correctIndex: 1,
      explanation: "El Martillo aparece al final de caídas: mecha inferior larga (rechazo de precios más bajos), cuerpo pequeño en la parte superior.",
    },
    {
      question: "¿Cuál es la confirmación estándar antes de operar un Martillo o una Estrella Fugaz?",
      options: [
        "Ninguna — se opera el patrón apenas se cierra",
        "Esperar a que la vela siguiente cierre en la dirección sugerida por el patrón",
        "Esperar exactamente 24 horas sin importar qué pase",
        "Consultar el chat de IA antes de cada operación",
      ],
      correctIndex: 1,
      explanation: "La confirmación estándar es esperar el cierre de la siguiente vela en la dirección sugerida — operar el patrón solo, sin esa confirmación, es un error común.",
    },
    {
      question: "¿Qué diferencia hay entre el Martillo y el Hombre Colgado (Hanging Man)?",
      options: [
        "Ninguna, son exactamente el mismo patrón con nombre distinto sin importar dónde aparecen",
        "Tienen la misma forma visual, pero el Hombre Colgado aparece al final de una SUBIDA (señal bajista) y el Martillo al final de una CAÍDA (señal alcista)",
        "El Hombre Colgado necesita 3 velas, el Martillo solo 1",
        "El Hombre Colgado solo existe en el mercado de acciones",
      ],
      correctIndex: 1,
      explanation: "Visualmente son casi idénticos — la diferencia clave es la ubicación en la tendencia, que cambia por completo su interpretación.",
    },
    {
      question: "¿Qué caracteriza a una vela Envolvente (Engulfing)?",
      options: [
        "Una sola vela con dos mechas largas",
        "El cuerpo de la segunda vela cubre completamente el cuerpo de la primera, en dirección contraria",
        "Tres velas seguidas del mismo color",
        "Un Doji rodeado de dos velas iguales",
      ],
      correctIndex: 1,
      explanation: "La Envolvente usa 2 velas — la segunda 'engulle' por completo el cuerpo de la primera, sugiriendo una reversión con más fuerza que el movimiento anterior.",
    },
    {
      question: "¿Qué historia cuenta un patrón de 3 velas como la Estrella de la Mañana?",
      options: [
        "Dominio → duda → reversión confirmada",
        "Volumen alto → volumen bajo → volumen alto",
        "Tres subidas seguidas sin ninguna pausa",
        "No cuenta ninguna historia, es solo decorativo",
      ],
      correctIndex: 0,
      explanation: "La secuencia de 3 velas muestra la tendencia dominante, luego una vela de indecisión, y finalmente una vela fuerte que confirma el giro.",
    },
    {
      question: "En términos generales, ¿qué relación hay entre el número de velas de un patrón y su peso estadístico?",
      options: [
        "Mientras más velas necesita, generalmente más peso tiene, pero también tarda más en confirmarse",
        "El número de velas no tiene ninguna relación con el peso del patrón",
        "Los patrones de 1 vela siempre son más confiables que los de 3",
        "Solo los patrones de exactamente 2 velas son válidos",
      ],
      correctIndex: 0,
      explanation: "Patrones de más velas (como las estrellas de 3 velas) suelen tener más peso porque muestran una historia más completa, a costa de llegar más tarde en el movimiento.",
    },
    {
      question: "¿Por qué el contexto donde aparece un patrón es tan importante?",
      options: [
        "No lo es — un patrón vale exactamente igual en cualquier situación",
        "Porque el mismo dibujo (ej. un Martillo) tiene mucho más peso al final de una tendencia marcada que en medio de un mercado lateral sin dirección",
        "Solo importa el color de la vela, nunca el contexto",
        "El contexto solo importa en marcos de tiempo semanales",
      ],
      correctIndex: 1,
      explanation: "Ignorar el contexto es un error común — el mismo patrón visual puede significar cosas muy distintas según dónde aparezca en la estructura del mercado.",
    },
    {
      question: "¿Cuál es la actitud correcta hacia los patrones de velas, según esta lección?",
      options: [
        "Son garantías matemáticas de que el precio va a moverse en cierta dirección",
        "Son una pieza de evidencia probabilística, útil en confluencia con otras señales, nunca una certeza por sí sola",
        "No sirven para nada y deben ignorarse por completo",
        "Solo funcionan si los confirma un profesional certificado",
      ],
      correctIndex: 1,
      explanation: "Ningún patrón de velas tiene 100% de acierto — son evidencia probabilística que gana fuerza real cuando confluye con otras señales, no una garantía aislada.",
    },
  ],
};
