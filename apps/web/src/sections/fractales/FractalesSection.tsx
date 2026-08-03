import { IndicatorCard } from "../../components/fractals/IndicatorCard";
import { FractalDiagram } from "../../components/fractals/diagrams/FractalDiagram";

export function FractalesSection() {
  return (
    <IndicatorCard
      id="fractales"
      icon="〽"
      title="1. Fractales (Bill Williams)"
      tagline="El patrón de giro más básico — la base de casi todo lo demás en esta página"
      diagram={<FractalDiagram />}
      whatIsIt={
        <>
          <p>
            Un fractal es un patrón de <strong className="text-white">5 velas consecutivas</strong> que marca un
            posible punto de giro local del precio. Fue formalizado por el trader e ingeniero{" "}
            <strong className="text-white">Bill Williams</strong> en su libro de 1995{" "}
            <em>"Trading Chaos"</em>, donde tomó prestado el término de la geometría fractal de Benoît
            Mandelbrot — la idea de que un patrón se repite a distintas escalas (el mismo patrón de 5 velas
            aparece en un gráfico de 1 minuto y en uno mensual).
          </p>
          <p>
            Hay dos tipos: el <strong className="text-neon-green">fractal alcista</strong> (o "down fractal"),
            que marca un mínimo local y suele actuar como soporte, y el{" "}
            <strong className="text-neon-red">fractal bajista</strong> ("up fractal"), que marca un máximo
            local y suele actuar como resistencia. Es, con diferencia, el indicador más simple de esta página
            — y por eso mismo es la base sobre la que se construyen los otros cinco.
          </p>
        </>
      }
      howItWorks={
        <>
          <p>
            El fractal solo mira dos datos de cada vela: su <strong className="text-white">máximo</strong> y su{" "}
            <strong className="text-white">mínimo</strong> — no le importan la apertura, el cierre ni el color
            de la vela. Toma una ventana de 5 velas consecutivas (la vela central más 2 a cada lado) y compara:
          </p>
          <p>
            <strong className="text-neon-green">Fractal alcista:</strong> el mínimo de la vela central debe ser
            más bajo que el mínimo de las 2 velas anteriores Y más bajo que el mínimo de las 2 velas
            posteriores. Ninguna de las 4 velas vecinas puede igualar o superar hacia abajo ese mínimo central.
          </p>
          <p>
            <strong className="text-neon-red">Fractal bajista:</strong> exactamente la misma lógica pero con
            máximos — el máximo de la vela central debe superar al de las 4 velas vecinas.
          </p>
          <div className="bg-void-soft rounded-lg p-4 border border-void-border/60">
            <div className="text-xs font-mono text-neon-blue mb-2">EJEMPLO NUMÉRICO, VELA POR VELA</div>
            <p className="text-sm">
              Supongamos 5 velas de BTC con estos mínimos: vela 1 = $62,800; vela 2 = $62,400; vela 3 = $62,100;
              vela 4 = $62,500; vela 5 = $63,000.
            </p>
            <p className="text-sm mt-2">
              Comparamos el mínimo de la vela 3 ($62,100) contra las otras 4: ¿es menor que $62,800? Sí. ¿Menor
              que $62,400? Sí. ¿Menor que $62,500? Sí. ¿Menor que $63,000? Sí. Las 4 comparaciones son
              verdaderas → la vela 3 es un <strong className="text-neon-green">fractal alcista</strong> en
              $62,100.
            </p>
            <p className="text-sm mt-2">
              Si en cambio la vela 4 hubiera hecho un mínimo de $61,900 (más bajo que la vela 3), el patrón se
              rompe: la vela 3 ya no calificaría, porque no es el mínimo más bajo de su ventana de 5.
            </p>
          </div>
          <p>
            <strong className="text-white">El detalle que casi nadie explica bien:</strong> el fractal no se
            puede confirmar en el momento en que se forma la vela central, porque en ese instante todavía no
            existen las 2 velas posteriores necesarias para la comparación. Usando el ejemplo de arriba, recién
            cuando cierra la vela 5 el gráfico "sabe" que la vela 3 fue un fractal — es decir, la señal aparece
            con <strong className="text-white">2 velas de retraso</strong> respecto al mínimo real. Esto es lo
            que en la jerga de trading se llama "repintado": el indicador no cambia valores pasados, pero la
            señal se confirma después del hecho, nunca en tiempo real exacto.
          </p>
          <p>
            ¿Por qué funciona esta lógica? Porque un mínimo (o máximo) que resiste ser superado por 2 velas a
            cada lado refleja que, en ese nivel de precio, la presión compradora (o vendedora) fue lo
            suficientemente fuerte como para revertir el movimiento durante al menos 4 períodos consecutivos —
            no es una vela aislada, es una zona donde el mercado mostró rechazo sostenido.
          </p>
        </>
      }
      whenTimeframes="Mejor en 4h y diario, donde cada fractal representa una decisión real del mercado. En 1m-5m el ruido genera decenas de fractales por hora, la mayoría sin valor."
      whenConditions="Mercados con tendencia direccional, donde los fractales marcan pullbacks y continuaciones claras. También útiles para mapear la estructura general (soportes/resistencias dinámicos)."
      whenAvoid="En rango lateral puro genera fractales alternados sin ninguna utilidad direccional — y en gráficos de muy corto plazo, donde 2 velas de retraso pueden significar que el precio ya se movió un 1-2% antes de que la señal exista."
      strategies={[
        "Soporte/resistencia dinámica: usar el precio del último fractal confirmado como zona de reacción esperada, en vez de una línea horizontal fija dibujada a mano.",
        "Stop loss estructural: en una compra, colocar el stop unos ticks por debajo del último fractal alcista confirmado — si el precio lo rompe, la premisa de la operación quedó invalidada.",
        "Ruptura de fractal (breakout): entrar cuando el precio cierra por encima de un fractal bajista (o por debajo de uno alcista) — es la señal de entrada clásica del sistema Bill Williams, ver el Combo A más abajo.",
      ]}
      combinesWith={[
        {
          label: "Alligator",
          role: "da el contexto de tendencia",
          reason: "confirma si conviene operar el fractal en la dirección de la boca abierta o ignorarlo.",
        },
        {
          label: "Awesome Oscillator",
          role: "confirma la fuerza detrás de la ruptura",
          reason: "un breakout de fractal con AO alineado tiene más probabilidad de continuar.",
        },
        {
          label: "Pivot Points",
          role: "aporta un segundo nivel independiente",
          reason: "un fractal que coincide con un pivot es una confluencia más fuerte que cualquiera de los dos solos.",
        },
        {
          label: "Estructura de mercado",
          role: "es literalmente el mismo concepto",
          reason: "los swing points de BOS/CHoCH son fractales — ver la sección 6 para la conexión directa.",
        },
      ]}
      mistakes={[
        "Operar el fractal en el instante en que 'parece' formarse, sin esperar las 2 velas de confirmación.",
        "Usarlos como única señal de entrada, sin ningún filtro de tendencia (Alligator, estructura) detrás.",
        "Aplicarlos en 1m-5m esperando la misma fiabilidad que en 4h o diario.",
        "Operar fractales en pleno rango lateral, donde se alternan sin ninguna dirección útil.",
      ]}
    />
  );
}
