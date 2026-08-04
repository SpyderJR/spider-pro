import { IndicatorCard } from "../../components/fractals/IndicatorCard";
import { AlligatorDiagram } from "../../components/fractals/diagrams/AlligatorDiagram";

export function AlligatorSection() {
  return (
    <IndicatorCard
      id="alligator"
      icon="🐊"
      title="2. Alligator (Bill Williams)"
      tagline="El filtro de tendencia — decide si vale la pena operar los fractales"
      diagram={<AlligatorDiagram />}
      whatIsIt={
        <>
          <p>
            El Alligator ("caimán") es un indicador de tendencia creado también por{" "}
            <strong className="text-white">Bill Williams</strong>, formado por{" "}
            <strong className="text-white">tres medias móviles suavizadas (SMMA) y desplazadas</strong> hacia
            adelante en el tiempo: la <strong className="text-neon-blue">Mandíbula</strong> (13 períodos,
            desplazada 8 velas, azul), los <strong className="text-neon-red">Dientes</strong> (8 períodos,
            desplazada 5 velas, roja) y los <strong className="text-neon-green">Labios</strong> (5 períodos,
            desplazada 3 velas, verde).
          </p>
          <p>
            La metáfora es intencional: cuando las 3 líneas están entrelazadas y planas, el "caimán duerme"
            (mercado en rango, sin comer). Cuando empiezan a cruzarse y abrirse, "se despierta". Cuando las 3
            quedan claramente ordenadas y separadas (labios más externos, mandíbula más atrás), "está comiendo"
            — hay una tendencia real en curso. Williams diseñó el Alligator específicamente para usarse{" "}
            <strong className="text-white">junto con los fractales</strong>: uno da el contexto, el otro da la
            señal exacta de entrada.
          </p>
        </>
      }
      howItWorks={
        <>
          <p>
            Cada línea es una media móvil suavizada de Williams (una variante de la EMA) aplicada sobre el
            precio medio de cada vela <em>(máximo + mínimo) / 2</em>, y luego desplazada N velas hacia la
            derecha del gráfico — no es una media móvil normal, es una que "vive en el futuro" respecto al
            precio actual. Ese desplazamiento es la clave de su comportamiento visual: cuando la tendencia
            cambia, las líneas desplazadas tardan en reaccionar y por eso se cruzan y entrelazan, generando
            visualmente el efecto de "boca cerrándose".
          </p>
          <p>
            El mecanismo para leerlo es de <strong className="text-white">orden y distancia</strong>, no de un
            único número: en un mercado alcista sano, los Labios (más rápidos) están por encima de los Dientes,
            que están por encima de la Mandíbula (más lenta) — las 3 en ese orden y separándose es "boca
            abierta hacia arriba". En un mercado bajista, el orden se invierte. Cuando las 3 líneas están
            entrecruzadas sin un orden claro y muy cerca entre sí, no hay tendencia identificable — eso es "el
            caimán duerme".
          </p>
          <div className="bg-void-soft rounded-lg p-4 border border-void-border/60">
            <div className="text-xs font-mono text-neon-blue mb-2">POR QUÉ FUNCIONA ESTA LÓGICA</div>
            <p className="text-sm">
              Tres medias de distinta velocidad que se ordenan y separan reflejan que compradores (o
              vendedores) están empujando el precio de forma sostenida en una dirección — cada media nueva
              "cierre" queda sistemáticamente por encima (o debajo) de la anterior. Cuando el precio se mueve
              sin dirección clara, las 3 medias convergen porque están promediando prácticamente el mismo rango
              de precios una y otra vez. El Alligator no predice el giro: mide, con retraso intencional, si YA
              hay una tendencia establecida lo suficientemente fuerte como para separar las 3 velocidades.
            </p>
          </div>
        </>
      }
      whenTimeframes="Funciona como filtro en cualquier temporalidad — su valor no depende tanto del marco temporal como de usarlo siempre junto a otro indicador de señal (fractales, estructura)."
      whenConditions="Su mayor utilidad es negativa: decirte cuándo NO operar. Si la boca está cerrada, cualquier señal de entrada de otro indicador pierde fiabilidad."
      whenAvoid="Nunca se usa solo para decidir una entrada — solo indica si hay tendencia, no dónde entrar ni cuándo salir. Operar cruces de las 3 líneas como señal directa genera muchas señales tardías."
      strategies={[
        "Filtro binario: solo considerar señales de compra (fractales, breakouts) cuando la boca está abierta hacia arriba, y de venta cuando está abierta hacia abajo — ignorar todo lo demás.",
        "Ruptura de fractal por fuera de la boca: la entrada clásica del sistema es un fractal que se rompe cuando el precio ya está claramente por fuera (por encima o debajo) de las 3 líneas.",
        "Salida por 'boca cerrándose': cuando las 3 líneas empiezan a converger de nuevo después de una tendencia, es una señal de que el impulso se está agotando, útil para ajustar el stop o tomar ganancias parciales.",
      ]}
      combinesWith={[
        {
          label: "Fractales",
          role: "aporta la señal de entrada exacta",
          reason: "el Alligator solo dice 'hay tendencia', el fractal dice 'aquí específicamente'.",
        },
        {
          label: "Awesome Oscillator",
          role: "confirma el momentum",
          reason: "creado por el mismo autor para trabajar en conjunto — mide la fuerza detrás de lo que el Alligator ya identificó como tendencia.",
        },
        {
          label: "Estructura de mercado",
          role: "da una segunda lectura de tendencia",
          reason: "si el Alligator y los HH/HL de estructura coinciden en la dirección, la confianza en el contexto sube.",
        },
      ]}
      mistakes={[
        "Operar señales de otros indicadores cuando el caimán está claramente dormido (líneas entrelazadas).",
        "Ignorar que las líneas están desplazadas hacia adelante — comparar su posición actual contra el precio actual sin entender ese desfase lleva a mala lectura.",
        "Usar el cruce de las 3 líneas como señal de entrada en sí misma, en vez de como filtro de contexto.",
      ]}
    />
  );
}
