import type { AcademyLevelContent, Lesson } from "./types";

const ANATOMIA_SOPORTE_TENDENCIA_VOLUMEN: Lesson = {
  id: "anatomia-soporte-tendencia-volumen",
  title: "Anatomía de una vela, soporte y resistencia, tendencias y volumen",
  estimatedMinutes: 14,
  blocks: [
    {
      type: "parrafo",
      texto:
        "Antes de cualquier indicador, cualquier patrón o cualquier estrategia, hay una habilidad que todo lo demás depende de tener bien aprendida: leer el gráfico desnudo, sin nada encima. Este nivel es esa base — cómo se arma una sola vela, qué son soporte y resistencia, cómo se distingue una tendencia real de un mercado lateral, y por qué el volumen es el dato que confirma o desmiente todo lo anterior.",
    },

    { type: "titulo", texto: "1. Anatomía de una vela japonesa" },
    {
      type: "analogia",
      texto:
        "Una vela es el resumen completo de una \"pelea\" entre compradores y vendedores durante un periodo de tiempo fijo (1 minuto, 1 hora, 1 día — lo que elijas). El cuerpo te dice quién ganó esa pelea; las mechas te dicen hasta dónde llegó el bando perdedor antes de ser rechazado.",
    },
    {
      type: "parrafo",
      texto:
        "Cada vela tiene 4 datos: apertura (precio al iniciar el periodo), cierre (precio al terminarlo), máximo y mínimo (los extremos que tocó en el camino). El cuerpo es el rectángulo entre apertura y cierre — verde si el cierre quedó por encima de la apertura (ganaron los compradores), rojo si quedó por debajo (ganaron los vendedores). Las mechas (o \"sombras\") son las líneas finas arriba y abajo del cuerpo — muestran hasta dónde llegó el precio antes de ser empujado de vuelta.",
    },
    { type: "diagramaSVG", diagrama: "anatomia-de-vela", caption: "Los 4 datos de toda vela: apertura, cierre, máximo y mínimo — el color solo indica quién ganó la pelea de ese periodo." },
    {
      type: "destacado",
      variante: "info",
      titulo: "LO QUE UNA MECHA LARGA REVELA",
      texto:
        "Una mecha larga no es decorativa — significa que el precio visitó ese nivel y fue rechazado con fuerza. Una mecha inferior larga en una vela verde dice \"los vendedores empujaron el precio abajo, pero los compradores lo recuperaron con fuerza antes del cierre\" — información real sobre quién tiene el control ahora mismo.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n2-l1-e1",
        pregunta: "Una vela cierra por debajo de su precio de apertura. ¿De qué color es y qué significa?",
        opciones: [
          { texto: "Verde — ganaron los compradores", correcta: false, explicacion: "Verde es cuando el cierre queda POR ENCIMA de la apertura, lo opuesto a lo descrito." },
          { texto: "Roja — ganaron los vendedores", correcta: true, explicacion: "Correcto — cierre por debajo de apertura significa que el precio bajó durante ese periodo, vela roja." },
          { texto: "El color depende del volumen, no del cierre", correcta: false, explicacion: "El color de una vela estándar depende únicamente de si el cierre quedó arriba o abajo de la apertura." },
          { texto: "No se puede saber sin ver el máximo y el mínimo", correcta: false, explicacion: "El color se determina solo con apertura y cierre — el máximo/mínimo definen las mechas, no el color del cuerpo." },
        ],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "completaEspacio",
        id: "n2-l1-e2",
        plantilla: "El ___ de una vela es el rectángulo entre apertura y cierre; las ___ muestran los extremos que tocó el precio en el camino.",
        opciones: ["cuerpo / mechas", "volumen / medias", "fractal / patrones", "RSI / MACD"],
        correcta: "cuerpo / mechas",
      },
    },
    {
      type: "conecta",
      label: "Velas Japonesas — patrones completos",
      to: "/app/velas-japonesas",
      descripcion: "Este nivel cubre la anatomía básica; ese módulo profundiza en los patrones que se arman combinando varias velas.",
    },

    { type: "titulo", texto: "2. Soporte y resistencia" },
    {
      type: "analogia",
      texto:
        "Imagina el precio como una pelota rebotando dentro de un cuarto. El piso es el soporte — cada vez que la pelota baja hasta ahí, algo la empuja de vuelta arriba. El techo es la resistencia — cada vez que sube hasta ahí, algo la frena. Ninguno de los dos es una pared indestructible: si la pelota golpea el piso o el techo con suficiente fuerza, los rompe y sigue de largo.",
    },
    {
      type: "parrafo",
      texto:
        "El soporte es un nivel de precio donde la presión compradora históricamente ha sido suficiente para detener o revertir una caída. La resistencia es lo opuesto: un nivel donde la presión vendedora ha frenado subidas. Ambos se identifican mirando dónde el precio \"rebotó\" más de una vez en el pasado — cuantas más veces un nivel fue respetado, más relevante se considera (aunque nunca hay garantía de que se respete la próxima vez).",
    },
    {
      type: "destacado",
      variante: "info",
      titulo: "EL GIRO DE ROLES",
      texto:
        "Cuando una resistencia finalmente se rompe con fuerza, con frecuencia pasa a actuar como soporte en el futuro — y viceversa. Es uno de los conceptos más citados del análisis técnico: \"la resistencia rota se convierte en soporte\". No es magia — es que los traders que compraron justo debajo de esa resistencia ahora defienden ese nivel para no perder.",
    },
    {
      type: "tip",
      texto: "Los niveles psicológicos (precios redondos como $70,000 o $1.00) suelen actuar como soporte/resistencia informal, simplemente porque mucha gente coloca órdenes justo ahí.",
    },
    {
      type: "errorComun",
      texto: "Tratar soporte/resistencia como una línea exacta de un solo precio. En la práctica son ZONAS, no líneas — el precio puede tocar ligeramente por encima o por debajo y seguir respetando la zona.",
    },
    {
      type: "conecta",
      label: "Terminal — Pivots",
      to: "/app/terminal",
      descripcion: "Activa el toggle de Pivots (Diarios/Semanales) en la Terminal — son niveles de soporte/resistencia calculados automáticamente con una fórmula estándar, no elegidos a ojo.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n2-l1-e3",
        enunciado: "Una resistencia que se rompe con fuerza suele quedar inutilizable para siempre, sin ningún rol futuro.",
        respuesta: false,
        explicacion: "Falso — un patrón muy común es que la resistencia rota pase a actuar como soporte en el futuro (y viceversa cuando se rompe un soporte).",
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n2-l1-e4",
        pregunta: "¿Por qué se dice que soporte y resistencia son \"zonas\" y no líneas exactas?",
        opciones: [
          { texto: "Porque el precio nunca los toca realmente", correcta: false, explicacion: "El precio sí los toca — esa es justo la razón por la que se identifican, por los rebotes históricos." },
          { texto: "Porque en la práctica el precio puede tocar ligeramente arriba o abajo del nivel exacto y aun así respetarlo", correcta: true, explicacion: "Correcto — tratar S/R como un solo precio exacto es un error común; son rangos, no líneas de un solo pixel." },
          { texto: "Porque cambian de nombre cada día", correcta: false, explicacion: "El nombre no cambia — lo que varía es la precisión con la que el precio los respeta." },
          { texto: "Porque solo existen en velas de 1 minuto", correcta: false, explicacion: "Soporte y resistencia se identifican en cualquier temporalidad, típicamente son más confiables en marcos altos." },
        ],
      },
    },

    { type: "titulo", texto: "3. Tendencias — alcista, bajista y lateral" },
    {
      type: "parrafo",
      texto:
        "Una tendencia alcista se define por una secuencia de máximos y mínimos cada vez más altos (\"higher highs, higher lows\"). Una tendencia bajista es la secuencia opuesta: máximos y mínimos cada vez más bajos. Cuando el precio no logra hacer ni una cosa ni la otra de forma consistente — se mueve dentro de un rango sin dirección clara — se le llama mercado lateral (\"rango\" o \"choppy\").",
    },
    {
      type: "destacado",
      variante: "advertencia",
      titulo: "\"THE TREND IS YOUR FRIEND\" — PERO NO SIEMPRE",
      texto:
        "Es una de las frases más repetidas del trading, y tiene su lógica: operar a favor de la tendencia de fondo tiene estadísticamente más a favor que operar en contra de ella. Pero un mercado lateral no tiene \"amigo\" — intentar aplicar estrategias de tendencia en un rango es una fuente clásica de pérdidas, porque el precio rebota entre soporte y resistencia sin ir a ningún lado.",
    },
    {
      type: "parrafo",
      texto:
        "Este nivel se queda en la definición visual de tendencia; el Nivel 5 (Estructura de mercado y fractales) profundiza en cómo identificar EXACTAMENTE cuándo una tendencia cambia de dirección (BOS, CHoCH) con reglas objetivas en vez de \"a ojo\".",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "emparejar",
        id: "n2-l1-e5",
        instruccion: "Une cada tipo de mercado con su definición correcta.",
        pares: [
          { izquierda: "Tendencia alcista", derecha: "Máximos y mínimos cada vez más altos" },
          { izquierda: "Tendencia bajista", derecha: "Máximos y mínimos cada vez más bajos" },
          { izquierda: "Mercado lateral", derecha: "Se mueve dentro de un rango, sin dirección consistente" },
        ],
      },
    },

    { type: "titulo", texto: "4. Volumen — el dato que confirma (o desmiente) todo" },
    {
      type: "analogia",
      texto:
        "El precio te dice QUÉ pasó; el volumen te dice qué tan CONVENCIDO estaba el mercado de que pasara. Una ruptura de resistencia con volumen alto es como una multitud empujando una puerta — probablemente la abre de verdad. La misma ruptura con volumen bajo es como una sola persona empujando — puede ceder apenas alguien la empuje de vuelta.",
    },
    {
      type: "parrafo",
      texto:
        "El volumen mide cuánto se operó (en unidades del activo o en valor) durante cada vela. Un movimiento de precio con volumen alto tiene más \"peso\" real detrás — más participantes de acuerdo con esa dirección. El mismo movimiento con volumen bajo es más sospechoso de ser ruido temporal o manipulación de corto plazo, y estadísticamente tiene más probabilidad de revertirse.",
    },
    {
      type: "tabla",
      headers: ["Situación", "Lectura"],
      filas: [
        ["Ruptura de resistencia + volumen alto", "Movimiento con más probabilidad de sostenerse"],
        ["Ruptura de resistencia + volumen bajo", "Sospechosa — puede ser una falsa ruptura"],
        ["Tendencia fuerte + volumen decreciente", "El impulso se está agotando, aunque el precio siga en la misma dirección"],
        ["Vela de rango grande + volumen muy alto", "Posible clímax — mucha gente entrando o saliendo de golpe"],
      ],
    },
    {
      type: "conecta",
      label: "Terminal — barra de volumen",
      to: "/app/terminal",
      descripcion: "El panel de volumen está debajo de cada gráfico en la Terminal — compara su altura cuando el precio rompe un nivel importante contra el volumen de velas normales.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n2-l1-e6",
        pregunta: "El precio rompe una resistencia importante, pero el volumen de esa vela es más bajo que el promedio reciente. ¿Qué sugiere esto?",
        opciones: [
          { texto: "Que la ruptura es completamente confiable, sin dudas", correcta: false, explicacion: "Es lo contrario — bajo volumen en una ruptura es una señal de alerta, no de confianza." },
          { texto: "Que podría ser una falsa ruptura, con menos participantes reales respaldando el movimiento", correcta: true, explicacion: "Correcto — una ruptura con volumen bajo tiene menos 'peso' real detrás y es más propensa a fallar/revertirse." },
          { texto: "Que el exchange tiene un error técnico", correcta: false, explicacion: "El volumen bajo es información válida sobre participación del mercado, no un error técnico." },
          { texto: "El volumen no tiene relación con la fiabilidad de una ruptura", correcta: false, explicacion: "Es exactamente lo opuesto a la idea central de esta sección — el volumen es clave para juzgar rupturas." },
        ],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "ordenar",
        id: "n2-l1-e7",
        instruccion: "Ordena estos pasos para leer un gráfico desnudo, del primero al último.",
        items: [
          { id: "a", texto: "Identificar si cada vela es alcista o bajista y qué tan largas son sus mechas" },
          { id: "b", texto: "Ubicar zonas de soporte y resistencia donde el precio rebotó varias veces" },
          { id: "c", texto: "Determinar si hay una tendencia clara (alcista/bajista) o un mercado lateral" },
          { id: "d", texto: "Revisar el volumen de los movimientos clave para juzgar qué tan confiables son" },
        ],
        ordenCorrecto: ["a", "b", "c", "d"],
      },
    },

    { type: "titulo", texto: "Resumen" },
    {
      type: "lista",
      variante: "buenas",
      items: [
        "Toda vela resume una pelea entre compradores y vendedores: cuerpo = quién ganó, mechas = hasta dónde llegó el otro bando.",
        "Soporte y resistencia son ZONAS donde el precio rebotó antes — no líneas exactas de un solo precio.",
        "La resistencia rota con frecuencia pasa a actuar como soporte, y viceversa.",
        "Una tendencia alcista hace máximos y mínimos cada vez más altos; una bajista, cada vez más bajos; un rango no hace ni una cosa ni la otra.",
        "El volumen mide qué tan \"convencido\" está el mercado — confirma o pone en duda cualquier movimiento de precio.",
      ],
    },
    {
      type: "conecta",
      label: "Practica en la Terminal",
      to: "/app/terminal",
      descripcion: "Activa Pivots y observa el volumen debajo del gráfico mientras identificas tendencias y zonas de soporte/resistencia en un par real.",
    },
  ],
};

export const NIVEL_02_LEER_EL_GRAFICO: AcademyLevelContent = {
  id: "leer-el-grafico",
  order: 2,
  title: "Leer el gráfico",
  description: "Anatomía de una vela japonesa, soporte y resistencia, tendencias y volumen.",
  difficulty: "principiante",
  icon: "🕯",
  lessons: [ANATOMIA_SOPORTE_TENDENCIA_VOLUMEN],
  quiz: [
    {
      question: "¿Qué determina si una vela es verde (alcista) o roja (bajista)?",
      options: [
        "El volumen operado durante ese periodo",
        "Si el cierre quedó por encima (verde) o por debajo (roja) de la apertura",
        "El tamaño de las mechas",
        "La hora del día en que se formó",
      ],
      correctIndex: 1,
      explanation: "El color del cuerpo depende únicamente de la relación entre apertura y cierre de ese periodo.",
    },
    {
      question: "¿Qué representa una mecha larga en una vela?",
      options: [
        "Un error de datos del exchange",
        "Que el precio visitó ese nivel extremo y fue rechazado con fuerza antes del cierre",
        "El volumen total operado",
        "Que la vela pertenece a un marco de tiempo distinto",
      ],
      correctIndex: 1,
      explanation: "Una mecha larga muestra que el precio llegó hasta ahí pero fue empujado de vuelta antes de que terminara el periodo — información real sobre presión de compra/venta.",
    },
    {
      question: "¿Qué es un nivel de soporte?",
      options: [
        "Un precio donde la presión compradora históricamente ha detenido o revertido caídas",
        "El precio más alto que ha tenido un activo en toda su historia",
        "Un indicador técnico calculado con una fórmula matemática",
        "El precio de apertura del día",
      ],
      correctIndex: 0,
      explanation: "El soporte es un nivel donde, en el pasado, la presión de compra ha sido suficiente para frenar o revertir caídas del precio.",
    },
    {
      question: "Una resistencia se rompe con fuerza. ¿Qué suele pasar con ese nivel después?",
      options: [
        "Desaparece por completo y nunca vuelve a tener relevancia",
        "Con frecuencia pasa a actuar como soporte en el futuro",
        "Se convierte automáticamente en un fractal",
        "El precio nunca vuelve a acercarse a ese nivel",
      ],
      correctIndex: 1,
      explanation: "El giro de roles (resistencia rota se convierte en soporte, y viceversa) es uno de los patrones más citados del análisis técnico clásico.",
    },
    {
      question: "¿Por qué se dice que soporte y resistencia son 'zonas' y no líneas exactas?",
      options: [
        "Porque cambian de precio cada segundo",
        "Porque en la práctica el precio puede tocar ligeramente arriba o abajo del nivel y aun así respetarlo",
        "Porque solo aplican en criptomonedas",
        "Porque los exchanges los ocultan",
      ],
      correctIndex: 1,
      explanation: "Tratar S/R como un precio exacto de un solo pixel es un error común — en la práctica funcionan como rangos.",
    },
    {
      question: "¿Cómo se define una tendencia alcista en términos de máximos y mínimos?",
      options: [
        "Máximos y mínimos cada vez más bajos",
        "Máximos y mínimos cada vez más altos",
        "El precio se mantiene exactamente igual",
        "No tiene relación con máximos y mínimos",
      ],
      correctIndex: 1,
      explanation: "Una tendencia alcista se caracteriza por una secuencia de máximos y mínimos ascendentes ('higher highs, higher lows').",
    },
    {
      question: "¿Qué es un mercado lateral (rango)?",
      options: [
        "Un mercado que sube sin parar",
        "Un mercado que se mueve dentro de un rango de precios, sin una dirección consistente de máximos/mínimos ascendentes o descendentes",
        "Un tipo de orden especial en el exchange",
        "Un mercado que solo existe en fines de semana",
      ],
      correctIndex: 1,
      explanation: "El mercado lateral no logra hacer ni máximos ni mínimos consistentemente más altos o más bajos — se mueve dentro de un rango.",
    },
    {
      question: "¿Qué mide el volumen en un gráfico de velas?",
      options: [
        "El precio promedio del periodo",
        "Cuánto se operó (en unidades o en valor) durante cada vela",
        "El número de exchanges donde cotiza el activo",
        "La volatilidad implícita de opciones",
      ],
      correctIndex: 1,
      explanation: "El volumen cuantifica la actividad de trading real durante cada periodo — cuánta gente participó en ese movimiento.",
    },
    {
      question: "Una ruptura de resistencia ocurre con volumen bajo respecto al promedio reciente. ¿Qué sugiere esto?",
      options: [
        "Que la ruptura es 100% confiable",
        "Que podría ser una falsa ruptura, con menos participación real respaldando el movimiento",
        "Que hay que comprar de inmediato sin dudar",
        "El volumen no tiene relación con la fiabilidad de una ruptura",
      ],
      correctIndex: 1,
      explanation: "Bajo volumen en una ruptura es una señal de alerta clásica — sugiere menos convicción real detrás del movimiento.",
    },
    {
      question: "¿Por qué la frase 'the trend is your friend' no aplica en un mercado lateral?",
      options: [
        "Porque en un rango no hay una dirección de fondo consistente que seguir — el precio rebota entre soporte y resistencia",
        "Porque la frase nunca es cierta en ningún contexto",
        "Porque los mercados laterales no existen en la realidad",
        "Porque solo aplica a acciones, no a cripto",
      ],
      correctIndex: 0,
      explanation: "Operar estrategias de tendencia dentro de un rango sin dirección clara es una fuente clásica de pérdidas — el 'amigo' de la tendencia no existe cuando no hay tendencia.",
    },
  ],
};
