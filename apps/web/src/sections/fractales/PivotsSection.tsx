import { IndicatorCard } from "../../components/fractals/IndicatorCard";
import { PivotPointsDiagram } from "../../components/fractals/diagrams/PivotPointsDiagram";

export function PivotsSection() {
  return (
    <IndicatorCard
      id="pivots"
      icon="⌗"
      title="4. Pivot Points"
      tagline="El primo prospectivo del fractal — niveles que existen antes de que abra la vela"
      diagram={<PivotPointsDiagram />}
      whatIsIt={
        <>
          <p>
            Los Pivot Points son niveles de soporte y resistencia calculados matemáticamente a partir del{" "}
            <strong className="text-white">máximo, mínimo y cierre del período anterior</strong> (el día
            anterior, la semana anterior, etc., según el uso). El resultado es un punto central (PP) y hasta 3
            niveles de resistencia (R1, R2, R3) por encima y 3 de soporte (S1, S2, S3) por debajo. Se originan
            en el trading de piso de las bolsas de materias primas y acciones, donde los operadores calculaban
            estos niveles a mano cada mañana antes de la apertura.
          </p>
          <p>
            Existen varias variantes con fórmulas distintas: el{" "}
            <strong className="text-white">Clásico</strong> (el más común, PP = (H+L+C)/3), el de{" "}
            <strong className="text-white">Fibonacci</strong> (usa proporciones 38.2%/61.8%/100% del rango
            anterior), el <strong className="text-white">Camarilla</strong> (niveles más ajustados, pensado
            para reversión intradía) y el <strong className="text-white">Woodie</strong> (le da más peso al
            cierre reciente). Esta plataforma usa el método Clásico en su calculadora de Análisis Técnico.
          </p>
        </>
      }
      howItWorks={
        <>
          <p>
            El cálculo del método Clásico toma 3 datos del período anterior — máximo (H), mínimo (L) y cierre
            (C) — y deriva todo lo demás a partir de ellos:
          </p>
          <div className="bg-void-soft rounded-lg p-4 border border-void-border/60 value-mono text-xs text-slate-300 space-y-1">
            <div>PP = (H + L + C) / 3</div>
            <div>R1 = (PP × 2) − L &nbsp;·&nbsp; S1 = (PP × 2) − H</div>
            <div>R2 = PP + (H − L) &nbsp;·&nbsp; S2 = PP − (H − L)</div>
            <div>R3 = H + 2 × (PP − L) &nbsp;·&nbsp; S3 = L − 2 × (H − PP)</div>
          </div>
          <div className="bg-void-soft rounded-lg p-4 border border-void-border/60">
            <div className="text-xs font-mono text-neon-blue mb-2">EJEMPLO NUMÉRICO</div>
            <p className="text-sm">
              Si ayer BTC hizo máximo $65,200, mínimo $63,800 y cerró en $64,500: PP = (65,200 + 63,800 +
              64,500) / 3 = $64,500. R1 = (64,500 × 2) − 63,800 = $65,200. S1 = (64,500 × 2) − 65,200 =
              $63,800. Hoy, si el precio abre y cae hacia $63,800 (S1), esa zona ya estaba calculada{" "}
              <strong className="text-white">antes de que abriera la sesión</strong> — no depende de ninguna
              vela de hoy.
            </p>
          </div>
          <p>
            <strong className="text-white">La diferencia clave con el fractal:</strong> el fractal aparece{" "}
            <em>desde adentro</em> del propio precio (necesita que se formen 5 velas reales) y siempre mira
            hacia atrás. El pivot se conoce <em>desde afuera</em>, calculado antes de que exista una sola vela
            nueva — es prospectivo, no reactivo. Por eso muchos traders los llaman "primos": ambos marcan zonas
            de soporte/resistencia, pero llegan a esa zona por caminos matemáticamente opuestos. Cuando
            coinciden en el mismo nivel (un fractal se forma justo sobre un pivot), es una señal de que dos
            métodos completamente independientes están de acuerdo — ver Combo B más abajo.
          </p>
        </>
      }
      whenTimeframes="Los pivots diarios son el estándar para trading intradía; los semanales/mensuales para swing trading. En cripto, que opera 24/7 sin campana de apertura, se suele fijar el corte en las 00:00 UTC como 'cierre del día anterior'."
      whenConditions="Mercados con suficiente volumen para que los niveles matemáticos generen reacción real — funcionan mejor en los activos más operados (BTC, ETH) que en tokens de baja liquidez."
      whenAvoid="En tendencias muy fuertes el precio puede atravesar varios niveles de pivot sin ninguna reacción — no son paredes infranqueables, son zonas de probabilidad."
      strategies={[
        "Objetivos de toma de ganancias: usar R1/R2 o S1/S2 como niveles razonables para cerrar parcial o totalmente una posición.",
        "Rebote intradía: comprar cerca de S1 con stop debajo de S2 (o vender cerca de R1 con stop encima de R2) cuando no hay noticias que justifiquen una ruptura.",
        "Confluencia con fractales: un fractal que se forma casi exactamente sobre un nivel de pivot es una señal considerablemente más fuerte que cualquiera de los dos por separado.",
      ]}
      combinesWith={[
        {
          label: "Fractales",
          role: "confluencia de dos métodos independientes",
          reason: "cuando un fractal se forma sobre un pivot, dos formas distintas de calcular soporte/resistencia coinciden en el mismo precio.",
        },
        {
          label: "Williams %R",
          role: "confirma que hay agotamiento real en el nivel",
          reason: "el precio tocando S1 mientras %R sale de sobreventa suma una tercera confirmación independiente.",
        },
      ]}
      mistakes={[
        "Tratar los niveles como paredes garantizadas en vez de zonas de mayor probabilidad de reacción.",
        "No ajustar la referencia horaria en cripto (mercado 24/7) y comparar pivots calculados con distintos cortes de 'día'.",
        "Ignorar el contexto de tendencia — un pivot de soporte en plena tendencia bajista fuerte tiene mucha menos fiabilidad.",
      ]}
    />
  );
}
