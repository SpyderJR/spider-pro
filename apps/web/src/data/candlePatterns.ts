export interface CandleOhlc {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlePattern {
  id: string;
  name: string;
  tipo: "alcista" | "bajista" | "neutral";
  candles: CandleOhlc[];
  contexto: string;
  psicologia: string;
  fiabilidad: "baja" | "media" | "alta";
  confirmacion: string;
  comoOperarlo: string;
}

export const CANDLE_PATTERNS: CandlePattern[] = [
  {
    id: "martillo",
    name: "Martillo (Hammer)",
    tipo: "alcista",
    candles: [{ open: 45, high: 47, low: 20, close: 46 }],
    contexto: "Aparece al final de una tendencia bajista, tras varias velas rojas consecutivas.",
    psicologia:
      "Los vendedores empujan el precio muy por debajo durante la sesión, pero los compradores reaccionan con fuerza y lo recuperan casi por completo antes del cierre — la presión vendedora se está agotando.",
    fiabilidad: "media",
    confirmacion: "Se confirma si la siguiente vela cierra por encima del cuerpo del martillo.",
    comoOperarlo:
      "Se busca entrada tras la vela de confirmación, con stop-loss debajo de la mecha inferior del martillo.",
  },
  {
    id: "martillo-invertido",
    name: "Martillo Invertido",
    tipo: "alcista",
    candles: [{ open: 44, high: 49, low: 43, close: 45 }],
    contexto: "Aparece al final de una tendencia bajista.",
    psicologia:
      "Los compradores intentan revertir el precio durante la sesión pero no logran sostener el máximo — aun así, muestra que la demanda está despertando.",
    fiabilidad: "baja",
    confirmacion: "Requiere una vela alcista posterior que confirme el cambio de presión.",
    comoOperarlo: "Esperar confirmación antes de entrar; es menos fiable que el martillo estándar.",
  },
  {
    id: "envolvente-alcista",
    name: "Envolvente Alcista (Bullish Engulfing)",
    tipo: "alcista",
    candles: [
      { open: 48, high: 49, low: 45, close: 46 },
      { open: 45.5, high: 51, low: 45, close: 50.5 },
    ],
    contexto: "Dos velas: una roja pequeña seguida de una verde que la 'envuelve' por completo.",
    psicologia:
      "Los compradores toman el control de forma abrupta, revirtiendo en una sola sesión todo el terreno perdido en la anterior.",
    fiabilidad: "alta",
    confirmacion: "Más fiable cuando aparece tras una tendencia bajista clara y con volumen elevado.",
    comoOperarlo: "Entrada al cierre de la vela envolvente, stop-loss debajo de su mínimo.",
  },
  {
    id: "envolvente-bajista",
    name: "Envolvente Bajista (Bearish Engulfing)",
    tipo: "bajista",
    candles: [
      { open: 45, high: 49, low: 44.5, close: 48 },
      { open: 48.5, high: 49, low: 43, close: 44 },
    ],
    contexto: "Una vela verde pequeña seguida de una roja que la envuelve por completo.",
    psicologia: "Los vendedores retoman el control con fuerza tras un intento de recuperación.",
    fiabilidad: "alta",
    confirmacion: "Más fiable cerca de una resistencia relevante o tras una subida prolongada.",
    comoOperarlo: "Entrada corta al cierre de la envolvente, stop-loss encima de su máximo.",
  },
  {
    id: "estrella-manana",
    name: "Estrella de la Mañana (Morning Star)",
    tipo: "alcista",
    candles: [
      { open: 50, high: 50.5, low: 45, close: 45.5 },
      { open: 44, high: 45, low: 42, close: 44.5 },
      { open: 45, high: 50, low: 44.5, close: 49.5 },
    ],
    contexto: "Patrón de 3 velas: una roja grande, una pequeña de indecisión, y una verde grande.",
    psicologia: "Marca el momento exacto en que la presión vendedora se agota y los compradores toman el control.",
    fiabilidad: "alta",
    confirmacion: "La tercera vela debe cerrar por encima de la mitad del cuerpo de la primera.",
    comoOperarlo: "Entrada tras el cierre de la tercera vela, stop-loss debajo del mínimo de la vela central.",
  },
  {
    id: "estrella-tarde",
    name: "Estrella de la Tarde (Evening Star)",
    tipo: "bajista",
    candles: [
      { open: 45, high: 50, low: 44.5, close: 49.5 },
      { open: 50, high: 51, low: 49, close: 50.5 },
      { open: 50, high: 50.5, low: 45, close: 45.5 },
    ],
    contexto: "Patrón inverso a la estrella de la mañana, aparece en la cima de una tendencia alcista.",
    psicologia: "Los compradores pierden fuerza y los vendedores toman el control de forma decisiva.",
    fiabilidad: "alta",
    confirmacion: "La tercera vela debe penetrar por debajo de la mitad del cuerpo de la primera.",
    comoOperarlo: "Entrada corta tras la tercera vela, stop-loss encima del máximo de la vela central.",
  },
  {
    id: "doji",
    name: "Doji",
    tipo: "neutral",
    candles: [{ open: 46, high: 49, low: 43, close: 46.1 }],
    contexto: "El precio abre y cierra prácticamente en el mismo nivel, con mechas notorias en ambos extremos.",
    psicologia: "Refleja un empate total entre compradores y vendedores — indecisión pura del mercado.",
    fiabilidad: "media",
    confirmacion: "Su relevancia depende del contexto: tras una tendencia fuerte puede anticipar un giro.",
    comoOperarlo: "No se opera por sí solo; se espera la vela siguiente para confirmar dirección.",
  },
  {
    id: "colgado",
    name: "Hombre Colgado (Hanging Man)",
    tipo: "bajista",
    candles: [{ open: 49, high: 49.5, low: 43, close: 48.5 }],
    contexto: "Misma forma que el martillo, pero aparece en la cima de una tendencia alcista.",
    psicologia: "Aunque cierra cerca de máximos, la mecha larga revela que los vendedores ya probaron su fuerza durante la sesión.",
    fiabilidad: "media",
    confirmacion: "Se confirma con una vela bajista posterior.",
    comoOperarlo: "Salida de posiciones largas o entrada corta tras confirmación.",
  },
  {
    id: "estrella-fugaz",
    name: "Estrella Fugaz (Shooting Star)",
    tipo: "bajista",
    candles: [{ open: 45.5, high: 51, low: 45, close: 46 }],
    contexto: "Aparece en la cima de una tendencia alcista, con una mecha superior larga.",
    psicologia: "Los compradores empujan el precio muy alto, pero los vendedores lo rechazan con fuerza antes del cierre.",
    fiabilidad: "media",
    confirmacion: "Se confirma con una vela bajista al día siguiente.",
    comoOperarlo: "Entrada corta tras confirmación, stop-loss encima de la mecha superior.",
  },
  {
    id: "tres-soldados",
    name: "Tres Soldados Blancos",
    tipo: "alcista",
    candles: [
      { open: 40, high: 43.5, low: 39.5, close: 43 },
      { open: 43, high: 46.5, low: 42.8, close: 46 },
      { open: 46, high: 49.5, low: 45.8, close: 49 },
    ],
    contexto: "Tres velas verdes consecutivas, cada una con cierre superior a la anterior y mechas cortas.",
    psicologia: "Presión compradora sostenida y creciente durante tres sesiones seguidas — fuerte convicción alcista.",
    fiabilidad: "alta",
    confirmacion: "Más fiable si aparece tras una fase de consolidación o tendencia bajista agotada.",
    comoOperarlo: "Entrada progresiva; vigilar señales de sobrecompra en RSI tras el tercer soldado.",
  },
];
