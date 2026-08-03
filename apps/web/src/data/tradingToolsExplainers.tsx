import type { ReactNode } from "react";

export interface ToolExplainerContent {
  whatItMeasures: ReactNode;
  howToRead: ReactNode;
  example: ReactNode;
  whenToUse: ReactNode;
}

export const TOOL_EXPLAINERS: Record<string, ToolExplainerContent> = {
  timer: {
    whatItMeasures: (
      <>
        Cuánto tiempo falta para que cierre la vela actual en la temporalidad elegida (1m/5m/15m/1h), y cómo se está
        formando esa vela en tiempo real: apertura, máximo, mínimo, cierre parcial y % de cambio desde la apertura.
      </>
    ),
    howToRead: (
      <>
        El anillo/barra se llena a medida que pasa el tiempo dentro de la vela. Se pinta <strong className="text-neon-green">verde</strong> si
        el precio va por encima de la apertura de esa vela, <strong className="text-neon-red">rojo</strong> si va por debajo. Al lado
        tenés los datos de la <strong>vela anterior</strong>, ya cerrada y confirmada (dirección, rango high-low).
      </>
    ),
    example: (
      <>
        Estás en 15m y quedan 40 segundos para el cierre. La vela en formación está +0.3% (verde) — pero eso{" "}
        <strong>no</strong> significa que vaya a cerrar verde: en 40 segundos el precio puede moverse lo suficiente
        para invertir el signo antes del cierre real.
      </>
    ),
    whenToUse: (
      <>
        Usalo para no reaccionar a mitad de vela a un movimiento que todavía puede revertir — esperá el cierre antes
        de confirmar una señal, especialmente en marcos cortos donde el ruido intra-vela es alto. No es una señal de
        entrada por sí sola, es una herramienta de timing.
      </>
    ),
  },

  confluence: {
    whatItMeasures: (
      <>
        Si el RSI(14), el histograma del MACD(12,26,9) y el cruce de medias SMA20/SMA50 apuntan en la misma dirección,
        evaluado simultáneamente en 6 temporalidades (1m, 5m, 15m, 1h, 4h, 1d).
      </>
    ),
    howToRead: (
      <>
        Cada fila es una temporalidad. Se necesitan <strong>al menos 2 de 3 señales coincidiendo</strong> (RSI por
        debajo de 30 o por encima de 70, e histograma MACD positivo/negativo) para marcar ALCISTA o BAJISTA — si no
        alcanzan las 2, queda en NEUTRAL. El panel superior resume cuántas temporalidades están alineadas.
      </>
    ),
    example: (
      <>
        Si 5m y 15m marcan ALCISTA pero 4h y 1d marcan BAJISTA, estás mirando una señal de corto plazo que rema{" "}
        <strong>en contra</strong> de la tendencia mayor — probabilidad más baja de que se sostenga que una señal
        alineada en todas las temporalidades.
      </>
    ),
    whenToUse: (
      <>
        Usalo antes de entrar, para chequear si tu señal de temporalidad corta tiene "viento a favor" de las
        temporalidades más grandes. La regla de "2 de 3" reduce falsos positivos de un solo indicador, pero sigue
        siendo mecánica — no reemplaza el contexto (noticias, estructura de mercado, fractales).
      </>
    ),
  },

  volatility: {
    whatItMeasures: (
      <>
        El ATR(14) — rango promedio que se mueve el precio por vela, en $ y en % — y el ancho de las Bandas de
        Bollinger(20,2), comparados contra su propio historial reciente mediante un percentil.
      </>
    ),
    howToRead: (
      <>
        Percentil ≤25 = <strong className="text-neon-blue">COMPRESIÓN</strong> (volatilidad baja — históricamente
        precede rupturas fuertes). Percentil ≥75 = <strong className="text-neon-red">EXPANSIÓN ALTA</strong> (movimientos
        amplios, mayor riesgo por vela). Entre 26 y 74 = <strong className="text-neon-gold">NORMAL</strong>.
      </>
    ),
    example: (
      <>
        Si el ATR de 15m está en $80 y tu stop loss está a $40 de la entrada (más ajustado que el ATR), el ruido
        normal de una sola vela puede sacarte del trade sin que la tendencia haya cambiado realmente.
      </>
    ),
    whenToUse: (
      <>
        Usalo para calibrar la distancia de tu stop loss (no lo pongas más ajustado que el ATR reciente) y para
        anticipar que después de una compresión prolongada suele venir un movimiento fuerte — sin que esto te diga
        la dirección de antemano.
      </>
    ),
  },

  levels: {
    whatItMeasures: (
      <>
        Dos tipos de niveles: <strong>Pivots Clásicos</strong> (PP, R1-R3, S1-S3, calculados matemáticamente a partir
        del rango del día anterior) y <strong>Soportes/Resistencias Dinámicos</strong> (máximos y mínimos locales
        reales, detectados en la temporalidad elegida con una ventana de 4 velas a cada lado).
      </>
    ),
    howToRead: (
      <>
        Cada nivel se muestra con su precio y su distancia % al precio actual; el más cercano se resalta. El PP
        (punto pivote) es la referencia de "equilibrio" del día — precio por encima suele leerse como sesgo alcista
        intradiario, por debajo como bajista. R1→R3 son resistencias crecientes, S1→S3 soportes crecientes en fuerza.
      </>
    ),
    example: (
      <>
        Si el precio está entre el PP y R1 y viene subiendo, R1 es el primer objetivo "natural" de resistencia; si lo
        rompe con volumen, R2 pasa a ser la siguiente referencia.
      </>
    ),
    whenToUse: (
      <>
        Usalo para ubicar zonas donde el precio históricamente reaccionó — útil para pensar dónde colocar SL/TP. No
        son garantías de rebote o rechazo: son probabilidades basadas en niveles matemáticos y en máximos/mínimos
        reales, no en magia.
      </>
    ),
  },

  radar: {
    whatItMeasures: (
      <>
        Compara BTC y TRX lado a lado en la misma temporalidad: cambio % de las últimas 15 velas, RSI(14), histograma
        MACD, volatilidad (ATR%), y cuál de los dos tiene mayor momentum relativo (mayor cambio % en valor absoluto).
      </>
    ),
    howToRead: (
      <>
        El panel superior indica qué activo tiene mayor momentum relativo ahora mismo. Las dos tarjetas muestran las
        métricas lado a lado, con la misma lógica de señal ALCISTA/BAJISTA/NEUTRAL (2 de 2 señales disponibles
        coincidiendo) que la Confluencia Multi-TF.
      </>
    ),
    example: (
      <>
        Si BTC subió +2.1% en las últimas 15 velas de 5m y TRX solo +0.3%, BTC tiene mayor momentum relativo ahora —
        es el activo con movimiento más "vivo" para mirar en el próximo tramo.
      </>
    ),
    whenToUse: (
      <>
        Usalo para decidir a cuál de los dos activos prestarle atención en este momento, no como una señal de entrada
        aislada — combinalo con Confluencia Multi-TF o Niveles Clave sobre el activo que elijas mirar.
      </>
    ),
  },
};
