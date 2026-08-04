import { IndicatorCard } from "../../components/fractals/IndicatorCard";
import { MarketStructureDiagram } from "../../components/fractals/diagrams/MarketStructureDiagram";

export function MarketStructureSection() {
  return (
    <IndicatorCard
      id="estructura"
      icon="⌬"
      title="6. Estructura de Mercado (BOS / CHoCH)"
      tagline="El enfoque moderno de Smart Money Concepts — la misma idea de los fractales, con otro nombre"
      diagram={<MarketStructureDiagram />}
      whatIsIt={
        <>
          <p>
            La estructura de mercado describe la tendencia mirando la secuencia de máximos y mínimos que forma
            el precio. En tendencia alcista, el precio hace{" "}
            <strong className="text-white">máximos crecientes (Higher Highs, HH)</strong> y{" "}
            <strong className="text-white">mínimos crecientes (Higher Lows, HL)</strong>. En tendencia
            bajista, ocurre lo opuesto:{" "}
            <strong className="text-white">máximos decrecientes (Lower Highs, LH)</strong> y{" "}
            <strong className="text-white">mínimos decrecientes (Lower Lows, LL)</strong>.
          </p>
          <p>
            Sobre esa base, el vocabulario de <strong className="text-white">Smart Money Concepts (SMC)</strong>
            {" "}— una corriente de análisis técnico popularizada en la última década, sobre todo en YouTube y
            Twitter/X de trading — define dos eventos: el{" "}
            <strong className="text-neon-green">BOS (Break of Structure)</strong>, una ruptura de un máximo
            previo en tendencia alcista (o mínimo en bajista) que confirma continuación, y el{" "}
            <strong className="text-neon-gold">CHoCH (Change of Character)</strong>, la primera ruptura{" "}
            <em>en contra</em> de la estructura vigente — la primera señal de que la tendencia podría estar
            girando.
          </p>
        </>
      }
      howItWorks={
        <>
          <p>
            El mecanismo compara cada nuevo swing (máximo o mínimo local) contra el swing anterior del mismo
            tipo. En tendencia alcista, cada nuevo máximo que supera al máximo anterior es un BOS de
            continuación; cada nuevo mínimo que se mantiene por encima del mínimo anterior confirma que la
            estructura alcista sigue intacta (sigue siendo HH/HL). El CHoCH aparece en el momento exacto en
            que el precio rompe por debajo del último mínimo ascendente (HL) — es decir, la primera vez que un
            mínimo deja de ser más alto que el anterior.
          </p>
          <div className="bg-void-soft rounded-lg p-4 border border-void-border/60">
            <div className="text-xs font-mono text-neon-blue mb-2">EJEMPLO NUMÉRICO, PASO A PASO</div>
            <p className="text-sm">
              BTC hace: HL en $61,000 → HH en $64,000 → HL en $62,500 (más alto que el HL anterior, estructura
              intacta) → HH en $66,000 (nuevo BOS alcista, continuación) → el precio cae y esta vez perfora
              $62,500 (el último HL) llegando a $61,800. Ese cruce por debajo de $62,500 es el{" "}
              <strong className="text-neon-gold">CHoCH</strong>: primera ruptura contra la estructura alcista
              vigente. Si después el precio hace un nuevo mínimo por debajo de $61,800 y luego un máximo que no
              logra superar los $66,000 previos, eso confirma un{" "}
              <strong className="text-neon-red">BOS bajista</strong> — la estructura completa cambió de
              alcista a bajista.
            </p>
          </div>
          <p>
            <strong className="text-white">La conexión directa con la sección 1:</strong> los "swing points"
            que usa SMC para definir HH/HL/LH/LL son, matemáticamente, fractales de Bill Williams — un máximo o
            mínimo local rodeado de velas que no lo superan. SMC le puso un branding y un vocabulario nuevo
            (BOS, CHoCH, y conceptos relacionados como <em>order blocks</em> y <em>liquidez</em>, que quedan
            como temas para una futura pestaña) a una idea que ya existía en 1995. Entender el fractal de la
            sección 1 significa que ya sabes identificar a mano un swing point de estructura moderna.
          </p>
          <p>
            Un punto de debate activo en la comunidad SMC es si un BOS/CHoCH debe confirmarse con el{" "}
            <strong className="text-white">cierre de la vela</strong> por encima/debajo del nivel, o si basta
            con que la <strong className="text-white">mecha</strong> lo toque. Usar solo la mecha genera más
            señales (y más falsas): muchas veces el precio "barre" liquidez por encima de un máximo con una
            mecha larga y cierra por debajo — eso no es una ruptura real de estructura, es una cacería de stops
            seguida de reversión. Exigir cierre de vela es más conservador pero más fiable.
          </p>
        </>
      }
      whenTimeframes="Análisis multi-temporalidad: leer la estructura de fondo en 4h/diario, y buscar la entrada en 15m-1h dentro de esa estructura mayor."
      whenConditions="Mercados con swings claros y suficiente volumen — es la misma lógica del fractal, así que hereda las mismas condiciones ideales."
      whenAvoid="Marcar swings insignificantes en marcos muy cortos genera una estructura falsa que cambia de 'alcista' a 'bajista' cada pocas velas, sin ningún valor predictivo real."
      strategies={[
        "Entrada en el retroceso: después de un CHoCH confirmado y un primer BOS en la nueva dirección, buscar entrada en el retroceso hacia el último fractal/swing antes de la ruptura, no perseguir el precio.",
        "Filtro multi-temporalidad: solo operar a favor de la estructura del marco mayor (4h/diario) usando el menor (15m-1h) para el timing de entrada.",
        "Invalidación clara: un CHoCH que falla y el precio vuelve a hacer un nuevo HH es una razón objetiva para cerrar una posición corta abierta en la reversión.",
      ]}
      combinesWith={[
        {
          label: "Fractales",
          role: "son la misma base técnica",
          reason: "los swing points de HH/HL/LH/LL son fractales — dominar la sección 1 es dominar la mitad de este indicador.",
        },
        {
          label: "ZigZag",
          role: "visualización de los swings mayores",
          reason: "limpia el ruido para ver la secuencia de HH/HL/LH/LL con claridad — nunca se usa como señal de entrada aquí tampoco.",
        },
        {
          label: "Alligator",
          role: "segunda confirmación de tendencia de fondo",
          reason: "si el Alligator y la estructura coinciden en la dirección, el contexto es más sólido.",
        },
      ]}
      mistakes={[
        "Confundir una mecha de barrido de liquidez con un BOS real por no exigir cierre de vela.",
        "Marcar swings demasiado pequeños, generando cambios de estructura constantes sin significado.",
        "Operar el CHoCH como entrada inmediata en vez de esperar la confirmación del primer BOS en la nueva dirección.",
        "Ignorar la temporalidad mayor y operar solo la estructura del marco chico, a contra-tendencia del marco grande.",
      ]}
    />
  );
}
