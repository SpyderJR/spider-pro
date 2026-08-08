import type { AcademyLevelContent, Lesson } from "./types";

const SPOT_FUTUROS_MARGEN_LIQUIDACION_FUNDING: Lesson = {
  id: "spot-futuros-margen-liquidacion-funding",
  title: "Spot vs futuros, long/short, margen, liquidación y funding",
  estimatedMinutes: 16,
  blocks: [
    {
      type: "destacado",
      variante: "advertencia",
      titulo: "EL NIVEL MÁS PELIGROSO DE TODA LA ACADEMIA",
      texto:
        "Los contratos con apalancamiento son la forma más rápida de perder el 100% de una cuenta, incluso cuando el análisis técnico era correcto. Este nivel exige haber completado Gestión de Riesgo (Nivel 6) antes — el apalancamiento no perdona errores de tamaño de posición de la forma en que spot sí lo hace.",
    },
    {
      type: "parrafo",
      texto:
        "Todo lo que viste en la Terminal en modo Spot hasta ahora es simple: compras un activo con dinero real (o ficticio, en esta plataforma), y tu pérdida máxima posible es el 100% de lo que invertiste — nunca más. Los contratos de futuros cambian esa regla por completo, y este nivel existe para que entiendas exactamente cómo, antes de tocarlos con dinero real alguna vez.",
    },

    { type: "titulo", texto: "1. Spot vs. Futuros — la diferencia que lo cambia todo" },
    {
      type: "tabla",
      headers: ["", "Spot", "Futuros"],
      filas: [
        ["¿Qué compras?", "El activo real (o su simulación)", "Un CONTRATO que sigue el precio del activo, sin poseerlo"],
        ["¿Puedes perder más del 100% invertido?", "No — nunca", "Sí, si no gestionas el riesgo — la posición puede liquidarse"],
        ["¿Puedes apostar a que el precio BAJE?", "No directamente", "Sí — abriendo un SHORT"],
        ["¿Existe el apalancamiento?", "No", "Sí, hasta niveles muy altos según el exchange"],
      ],
    },
    {
      type: "analogia",
      texto:
        "Spot es comprar una casa de contado: si su valor baja, pierdes valor en papel, pero la casa sigue siendo tuya. Futuros con apalancamiento es como comprar esa misma casa con un préstamo enorme donde el banco puede QUITÁRTELA automáticamente si el valor cae solo un poco — no hay margen para esperar a que se recupere.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n8-l1-e1",
        enunciado: "En spot, igual que en futuros, es posible perder más del 100% del dinero invertido en una sola operación.",
        respuesta: false,
        explicacion: "Falso — en spot, sin apalancamiento, la pérdida máxima posible es el 100% de lo invertido. Los futuros apalancados sí pueden generar pérdidas que llegan al 100% de la posición mucho más rápido, mediante la liquidación.",
      },
    },

    { type: "titulo", texto: "2. Long y short — apostar a que sube, o a que baja" },
    {
      type: "parrafo",
      texto:
        "Abrir un LONG es apostar a que el precio va a subir — ganas si sube, pierdes si baja (igual que en spot). Abrir un SHORT es lo que spot no permite directamente: apostar a que el precio va a BAJAR. Técnicamente estás \"pidiendo prestado\" el activo, vendiéndolo al precio actual, y recomprándolo después — si el precio bajó, recompras más barato y te quedas con la diferencia; si subió, la diferencia juega en tu contra.",
    },
    {
      type: "conecta",
      label: "Simulador de Contratos",
      to: "/app/contratos",
      descripcion: "Practica long y short con dinero ficticio y observa cómo cada uno responde a los movimientos del precio, sin ningún riesgo real.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "emparejar",
        id: "n8-l1-e2",
        instruccion: "Une cada posición con la condición que la hace ganar.",
        pares: [
          { izquierda: "Long", derecha: "Gana si el precio SUBE" },
          { izquierda: "Short", derecha: "Gana si el precio BAJA" },
        ],
      },
    },

    { type: "titulo", texto: "3. Margen y apalancamiento — el multiplicador de doble filo" },
    {
      type: "parrafo",
      texto:
        "El margen es el capital real que pones como \"garantía\" para abrir una posición más grande de lo que ese capital por sí solo permitiría. El apalancamiento es el multiplicador: con 10x de apalancamiento, $100 de margen controlan una posición de $1,000. Las ganancias se multiplican por ese mismo factor — pero las PÉRDIDAS también, en la misma proporción exacta.",
    },
    {
      type: "destacado",
      variante: "advertencia",
      titulo: "EL APALANCAMIENTO NO CAMBIA TU VENTAJA, SOLO TU VELOCIDAD",
      texto:
        "Una idea errónea muy común es pensar que más apalancamiento significa más ganancia esperada. Falso — el apalancamiento no mejora tu análisis ni tu win rate, solo multiplica la velocidad a la que ganas O pierdes. Con la misma estrategia, más apalancamiento significa llegar a la ruina más rápido si la racha es mala — este es exactamente el mismo concepto del Simulador de Monte Carlo en Gestión de Riesgo.",
    },
    {
      type: "conecta",
      label: "Gestión de Riesgo — Monte Carlo",
      to: "/app/gestion-de-riesgo",
      descripcion: "Prueba distintos niveles de riesgo por trade en el simulador y observa cómo la probabilidad de ruina cambia drásticamente, sin tocar tu win rate.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n8-l1-e3",
        pregunta: "¿Qué hace exactamente el apalancamiento a una estrategia de trading?",
        opciones: [
          { texto: "Mejora el win rate de la estrategia automáticamente", correcta: false, explicacion: "El apalancamiento no tiene ningún efecto sobre qué tan buena es la estrategia o su win rate." },
          { texto: "Multiplica tanto las ganancias como las pérdidas por el mismo factor — no mejora la ventaja, solo la velocidad del resultado", correcta: true, explicacion: "Correcto — es un multiplicador simétrico: gana más rápido, pero también quiebra más rápido si la racha es mala." },
          { texto: "Elimina el riesgo de pérdida por completo", correcta: false, explicacion: "Es exactamente lo opuesto — el apalancamiento aumenta la velocidad a la que el riesgo se materializa." },
          { texto: "Solo afecta a las posiciones long, no a las short", correcta: false, explicacion: "El apalancamiento multiplica de la misma forma tanto posiciones long como short." },
        ],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "completaEspacio",
        id: "n8-l1-e4",
        plantilla: "Con $100 de margen y apalancamiento de 10x, controlas una posición de $___.",
        opciones: ["1,000", "100", "10", "10,000"],
        correcta: "1,000",
      },
    },

    { type: "titulo", texto: "4. Liquidación — el punto sin retorno" },
    {
      type: "parrafo",
      texto:
        "La liquidación ocurre cuando las pérdidas de una posición apalancada consumen todo el margen puesto como garantía — el exchange cierra la posición automáticamente, de forma forzosa, para evitar que la pérdida siga creciendo más allá del margen disponible. A mayor apalancamiento, MÁS CERCA está el precio de liquidación del precio de entrada — un movimiento pequeño puede ser suficiente para liquidar una posición con apalancamiento alto.",
    },
    {
      type: "destacado",
      variante: "info",
      titulo: "EL FEED DE LIQUIDACIONES REALES",
      texto:
        "En la Terminal, el modo Futuros muestra un feed en vivo de liquidaciones que están ocurriendo AHORA MISMO en el mercado real de Binance — no una simulación. Verlas en tiempo real es la forma más directa de entender por qué el apalancamiento alto es tan riesgoso: son cuentas reales llegando a ese punto sin retorno, todos los días.",
    },
    {
      type: "conecta",
      label: "Terminal (modo Futuros) — Liquidaciones en vivo",
      to: "/app/terminal",
      descripcion: "Cambia a modo Futuros y observa el feed de liquidaciones reales — cada una es una posición apalancada que llegó a este punto.",
    },
    {
      type: "conecta",
      label: "Simulador de Liquidaciones",
      to: "/app/contratos",
      descripcion: "Calcula tu propio precio de liquidación según entrada y apalancamiento, y visualiza qué tan cerca queda del precio de entrada en cada caso.",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "verdaderoFalso",
        id: "n8-l1-e5",
        enunciado: "A mayor apalancamiento, el precio de liquidación queda MÁS LEJOS del precio de entrada, dando más margen de seguridad.",
        respuesta: false,
        explicacion: "Falso — es exactamente lo contrario: a mayor apalancamiento, el precio de liquidación queda MÁS CERCA del precio de entrada, dejando menos margen antes de perder toda la posición.",
      },
    },

    { type: "titulo", texto: "5. Funding — el costo (o pago) de mantener una posición abierta" },
    {
      type: "parrafo",
      texto:
        "Los contratos perpetuos (el tipo más común en cripto) no tienen fecha de vencimiento, así que necesitan un mecanismo que mantenga su precio cerca del precio real (spot) del activo — ese mecanismo es el funding rate. Cada cierto tiempo (típicamente cada 8 horas), quien esté del lado \"mayoritario\" del mercado le paga a quien está del lado minoritario. Si el funding es positivo, los longs pagan a los shorts; si es negativo, los shorts pagan a los longs.",
    },
    {
      type: "tip",
      texto: "Un funding muy positivo y sostenido suele indicar que el mercado está mayoritariamente posicionado en largo (a veces señal de sobre-optimismo); uno muy negativo, lo contrario. No es una señal de trading por sí sola, pero es información real sobre el posicionamiento del mercado.",
    },
    {
      type: "conecta",
      label: "Terminal (modo Futuros) — Funding Rate y Open Interest",
      to: "/app/terminal",
      descripcion: "El panel de información de Futuros muestra el funding rate en vivo de cualquier par, junto al Open Interest (valor total de contratos abiertos).",
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "opcionMultiple",
        id: "n8-l1-e6",
        pregunta: "El funding rate de un par está fuertemente positivo. ¿Qué significa esto?",
        opciones: [
          { texto: "Que los shorts le están pagando a los longs", correcta: false, explicacion: "Es lo contrario — funding positivo significa que los longs pagan a los shorts." },
          { texto: "Que los longs le están pagando a los shorts, generalmente porque el mercado está mayoritariamente posicionado en largo", correcta: true, explicacion: "Correcto — funding positivo es el mecanismo que se activa cuando el lado largo del mercado es el mayoritario." },
          { texto: "Que el exchange va a cerrar todas las posiciones", correcta: false, explicacion: "El funding es solo un pago periódico entre traders, no un cierre forzoso de posiciones." },
          { texto: "Que no hay ninguna posición abierta en ese par", correcta: false, explicacion: "El funding solo existe cuando hay posiciones abiertas de ambos lados — su valor no indica ausencia de posiciones." },
        ],
      },
    },
    {
      type: "ejercicio",
      ejercicio: {
        kind: "ordenar",
        id: "n8-l1-e7",
        instruccion: "Ordena estos pasos antes de abrir cualquier posición apalancada, del primero al último.",
        items: [
          { id: "a", texto: "Definir el tamaño de posición según tu % de riesgo (Nivel 6), nunca según qué tan seguro te sientes" },
          { id: "b", texto: "Elegir el apalancamiento sabiendo que solo multiplica velocidad, no ventaja" },
          { id: "c", texto: "Calcular el precio de liquidación real antes de confirmar la orden" },
          { id: "d", texto: "Revisar el funding rate si planeas mantener la posición abierta varias horas" },
        ],
        ordenCorrecto: ["a", "b", "c", "d"],
      },
    },

    { type: "titulo", texto: "Resumen" },
    {
      type: "lista",
      variante: "buenas",
      items: [
        "En spot, la pérdida máxima es el 100% de lo invertido; en futuros apalancados, la posición puede liquidarse mucho antes de eso.",
        "Long gana si el precio sube; short gana si baja — futuros permite apostar en ambas direcciones, spot no directamente.",
        "El apalancamiento multiplica ganancias Y pérdidas por igual — no mejora tu ventaja, solo la velocidad del resultado.",
        "A mayor apalancamiento, más cerca queda el precio de liquidación del precio de entrada.",
        "El funding rate es un pago periódico entre longs y shorts que mantiene el precio del contrato perpetuo cerca del precio spot real.",
      ],
    },
    {
      type: "conecta",
      label: "Practica en el Simulador de Contratos",
      to: "/app/contratos",
      descripcion: "Calcula precios de liquidación, compara apalancamientos y practica long/short con dinero ficticio antes de tocar futuros reales.",
    },
  ],
};

export const NIVEL_08_CONTRATOS_Y_APALANCAMIENTO: AcademyLevelContent = {
  id: "contratos-y-apalancamiento",
  order: 8,
  title: "Contratos y apalancamiento",
  description: "Spot vs futuros, long/short, margen, liquidación y funding — con el riesgo siempre al frente.",
  difficulty: "avanzado",
  icon: "⚖️",
  recommendedBeforeId: "gestion-de-riesgo",
  lessons: [SPOT_FUTUROS_MARGEN_LIQUIDACION_FUNDING],
  quiz: [
    {
      question: "¿Cuál es la diferencia clave entre comprar en spot y abrir una posición en futuros?",
      options: [
        "No hay ninguna diferencia real",
        "En spot posees el activo real; en futuros posees un contrato que sigue su precio, con posibilidad de apalancamiento y liquidación",
        "Futuros solo existe para acciones, no para cripto",
        "Spot siempre es más caro que futuros",
      ],
      correctIndex: 1,
      explanation: "Spot implica posesión directa del activo; futuros es un contrato derivado que permite apalancamiento, short, y conlleva riesgo de liquidación.",
    },
    {
      question: "¿Es posible perder más del 100% de lo invertido en una operación spot sin apalancamiento?",
      options: [
        "Sí, siempre",
        "No — la pérdida máxima posible en spot es el 100% de lo invertido",
        "Solo los fines de semana",
        "Depende del exchange",
      ],
      correctIndex: 1,
      explanation: "Sin apalancamiento, spot tiene un piso natural: la pérdida máxima es el 100% del capital invertido, nunca más.",
    },
    {
      question: "¿Qué es abrir un 'short'?",
      options: [
        "Comprar el activo esperando que suba",
        "Apostar a que el precio va a BAJAR, ganando si efectivamente baja",
        "Un tipo de orden límite",
        "Cerrar todas las posiciones abiertas",
      ],
      correctIndex: 1,
      explanation: "Un short gana cuando el precio baja — es la herramienta que permite apostar a la baja, algo que spot no permite directamente.",
    },
    {
      question: "Con $200 de margen y apalancamiento de 5x, ¿qué tamaño de posición controlas?",
      options: ["$200", "$1,000", "$40", "$5,000"],
      correctIndex: 1,
      explanation: "El apalancamiento multiplica el margen: $200 × 5 = $1,000 de posición controlada.",
    },
    {
      question: "¿Qué efecto tiene el apalancamiento sobre la ventaja estadística (win rate) de una estrategia?",
      options: [
        "La mejora significativamente",
        "Ninguno — solo multiplica la velocidad de ganancias y pérdidas, no la calidad de la estrategia",
        "La empeora siempre a la mitad",
        "Depende del color de las velas",
      ],
      correctIndex: 1,
      explanation: "El apalancamiento es un multiplicador simétrico de resultados — no tiene ningún efecto sobre qué tan buena es la estrategia subyacente.",
    },
    {
      question: "¿Qué es la liquidación?",
      options: [
        "Un tipo de bono por operar mucho volumen",
        "El cierre forzoso automático de una posición cuando las pérdidas consumen todo el margen disponible",
        "Convertir cripto a efectivo",
        "Una comisión fija que cobra el exchange",
      ],
      correctIndex: 1,
      explanation: "La liquidación es el mecanismo con el que el exchange cierra automáticamente una posición cuyas pérdidas ya consumieron el margen de garantía.",
    },
    {
      question: "¿Cómo cambia la distancia al precio de liquidación cuando aumenta el apalancamiento?",
      options: [
        "Se aleja del precio de entrada, dando más seguridad",
        "Se acerca al precio de entrada — menos margen de movimiento antes de liquidarse",
        "No cambia en absoluto",
        "Solo cambia en posiciones long, nunca en short",
      ],
      correctIndex: 1,
      explanation: "A mayor apalancamiento, el precio de liquidación queda más cerca del precio de entrada — un movimiento más pequeño es suficiente para liquidar la posición.",
    },
    {
      question: "¿Qué es el funding rate en un contrato perpetuo?",
      options: [
        "Una comisión única al abrir la posición",
        "Un pago periódico entre longs y shorts que mantiene el precio del contrato cerca del precio spot real",
        "El precio de liquidación de la posición",
        "El máximo apalancamiento permitido",
      ],
      correctIndex: 1,
      explanation: "El funding es el mecanismo que ancla el precio del contrato perpetuo (sin fecha de vencimiento) al precio spot real, mediante pagos periódicos entre las partes.",
    },
    {
      question: "Si el funding rate está fuertemente positivo, ¿quién le paga a quién?",
      options: [
        "Los shorts le pagan a los longs",
        "Los longs le pagan a los shorts",
        "El exchange le paga a todos los traders",
        "Nadie le paga a nadie con funding positivo",
      ],
      correctIndex: 1,
      explanation: "Funding positivo significa que el lado largo es mayoritario, y por convención son los longs quienes pagan a los shorts en ese caso.",
    },
    {
      question: "¿Dónde se puede ver un feed en vivo de liquidaciones REALES (no simuladas) del mercado de Binance Futures?",
      options: [
        "No existe esa herramienta en ningún lado de la plataforma",
        "En la Terminal, modo Futuros — un feed conectado directo al stream de liquidaciones reales de Binance",
        "Solo consultando el chat de IA",
        "En el Diario de Trading",
      ],
      correctIndex: 1,
      explanation: "La Terminal en modo Futuros muestra un feed en vivo de liquidaciones reales que están ocurriendo en el mercado en ese momento — datos reales, no una estimación.",
    },
  ],
};
