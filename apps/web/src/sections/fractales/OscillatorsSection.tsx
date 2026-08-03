import { IndicatorCard } from "../../components/fractals/IndicatorCard";
import { OscillatorsDiagram } from "../../components/fractals/diagrams/OscillatorsDiagram";

export function OscillatorsSection() {
  return (
    <IndicatorCard
      id="osciladores"
      icon="≋"
      title="5. Williams %R + Awesome Oscillator"
      tagline="El sistema Bill Williams, completo: los dos osciladores que confirman fractales y rupturas"
      diagram={<OscillatorsDiagram />}
      whatIsIt={
        <>
          <p>
            Cierran el "sistema Bill Williams" junto a los Fractales y el Alligator — dos osciladores de
            momentum pensados para confirmar, no para generar señales por sí solos.
          </p>
          <p>
            <strong className="text-white">Williams %R</strong> — creado por{" "}
            <strong className="text-white">Larry Williams</strong> (sin relación con Bill Williams, es una
            coincidencia de apellido) — mide dónde cerró el precio dentro de su rango de los últimos N períodos
            en una escala de <strong className="text-white">0 a −100</strong>. Es prácticamente el mismo
            cálculo que el %K del Estocástico, solo que invertido y sin el suavizado del %D, lo que lo hace más
            rápido y más ruidoso.
          </p>
          <p>
            <strong className="text-white">Awesome Oscillator (AO)</strong> — también de Bill Williams — es un
            histograma que compara el momentum reciente contra el momentum de más largo plazo, usando el punto
            medio de cada vela <em>(máximo + mínimo) / 2</em> en vez del cierre.
          </p>
        </>
      }
      howItWorks={
        <>
          <p>
            <strong className="text-neon-blue">Williams %R:</strong> toma el máximo y el mínimo de los últimos
            N períodos (14 por defecto) y calcula dónde quedó el cierre actual dentro de ese rango:{" "}
            <span className="value-mono text-xs">%R = −100 × (Máximo(N) − Cierre) / (Máximo(N) − Mínimo(N))</span>.
            Por encima de −20 significa que el precio está cerrando muy cerca de su máximo reciente
            (sobrecompra); por debajo de −80, muy cerca de su mínimo reciente (sobreventa). El dashboard ya
            tiene un RSI en la sección de Análisis Técnico que mide algo similar — la diferencia es que el RSI
            promedia ganancias/pérdidas suavizadas a lo largo del período, mientras que %R solo mira la
            posición del cierre actual dentro del rango, lo que lo hace reaccionar más rápido pero con más
            señales falsas.
          </p>
          <p>
            <strong className="text-neon-green">Awesome Oscillator:</strong> calcula una media simple de 5
            períodos y otra de 34 períodos, ambas sobre el punto medio de las velas, y resta{" "}
            <span className="value-mono text-xs">AO = SMA(5) − SMA(34)</span>. Cuando la media rápida está por
            encima de la lenta, el histograma es verde y positivo (momentum reciente más fuerte que el de
            fondo); cuando está por debajo, rojo y negativo. Sus 3 señales clásicas son el{" "}
            <strong className="text-white">cruce de la línea cero</strong> (cambio de momentum), el{" "}
            <strong className="text-white">"twin peaks"</strong> (dos picos del mismo lado de la línea cero
            donde el segundo es más bajo que el primero, anticipando reversión) y el{" "}
            <strong className="text-white">"saucer"</strong> (tres barras consecutivas del mismo color donde la
            del medio es la más extrema, sugiriendo aceleración).
          </p>
          <div className="bg-void-soft rounded-lg p-4 border border-void-border/60">
            <div className="text-xs font-mono text-neon-blue mb-2">EJEMPLO DE CONFLUENCIA</div>
            <p className="text-sm">
              El precio cae y forma un fractal alcista en $62,100 (vela 8 de una serie). En esa misma vela, %R
              está en −93 (sobreventa profunda) y el AO todavía tiene barras rojas pero cada vez menos
              negativas. Dos velas después %R cruza por encima de −80 y el AO cambia a la primera barra verde —
              ese cruce simultáneo, alineado con el fractal ya confirmado, es la confluencia completa: el
              fractal dio el nivel, %R confirmó el agotamiento vendedor, el AO confirmó que el momentum ya
              había empezado a girar antes de que el precio lo reflejara del todo.
            </p>
          </div>
        </>
      }
      whenTimeframes="Ambos funcionan en cualquier temporalidad como confirmadores; en marcos muy cortos (1m-5m) el %R en particular genera muchísimo ruido si se usa solo."
      whenConditions="Su rol es siempre de confirmación, nunca de señal primaria — se usan después de que Fractales, Alligator o Estructura ya señalaron algo."
      whenAvoid="Usar %R solo en tendencias fuertes: igual que el RSI, puede quedarse 'pegado' en sobrecompra o sobreventa durante muchas velas mientras la tendencia continúa."
      strategies={[
        "Confirmar rupturas de fractal: si el AO está del mismo lado de cero que la dirección de la ruptura, hay más probabilidad de continuación.",
        "Confirmar rebotes en niveles (pivots, soportes): %R saliendo de sobreventa exactamente cuando el precio toca un nivel conocido suma una confirmación independiente.",
        "Divergencias con AO: precio hace un mínimo más bajo pero el AO hace un mínimo más alto — advertencia de que el impulso bajista se está agotando, incluso antes de que aparezca un fractal.",
      ]}
      combinesWith={[
        {
          label: "Fractales",
          role: "confirma la fuerza detrás del giro",
          reason: "un fractal sin momentum detrás (osciladores planos) es más débil que uno con AO y %R alineados.",
        },
        {
          label: "Alligator",
          role: "mismo autor, mismo sistema",
          reason: "el AO fue diseñado para leerse junto al Alligator: mide el momentum dentro de la tendencia que el Alligator ya identificó.",
        },
        {
          label: "Pivot Points",
          role: "tercera confirmación en el nivel",
          reason: "precio + nivel + oscilador saliendo de extremo es una confluencia de 3 métodos independientes.",
        },
      ]}
      mistakes={[
        "Usar Williams %R y el AO como doble confirmación de lo mismo sin entender que ambos pueden dar señales tardías juntos.",
        "Operar cruces de −80/−20 en tendencias fuertes sin filtro de contexto — se quedan en zona extrema durante toda la tendencia.",
        "Ignorar las divergencias del AO, que suelen anticipar giros antes que el cruce de línea cero.",
      ]}
    />
  );
}
