import { IndicatorCard } from "../../components/fractals/IndicatorCard";
import { ZigzagDiagram } from "../../components/fractals/diagrams/ZigzagDiagram";

export function ZigzagSection() {
  return (
    <IndicatorCard
      id="zigzag"
      icon="⚡"
      title="3. ZigZag"
      tagline="El limpiador de ruido — muestra la estructura mayor sin el detalle que distrae"
      diagram={<ZigzagDiagram />}
      whatIsIt={
        <>
          <p>
            El ZigZag es un indicador de estructura que conecta con líneas rectas únicamente los máximos y
            mínimos <strong className="text-white">significativos</strong> del precio, filtrando cualquier
            movimiento menor a un porcentaje (o cantidad de puntos) configurable — típicamente{" "}
            <strong className="text-white">5%</strong>. No tiene un creador único documentado como Bill
            Williams con sus herramientas; es una técnica de visualización clásica del análisis técnico,
            popularizada porque simplifica drásticamente la lectura de gráficos ruidosos.
          </p>
          <p>
            Es, en esencia, un filtro: toma cientos de velas con docenas de mini-giros y las reduce a un
            puñado de tramos rectos entre los giros que realmente importaron. Por eso es tan usado como
            herramienta educativa y de planificación — no porque prediga nada, sino porque ordena visualmente
            lo que ya pasó.
          </p>
        </>
      }
      howItWorks={
        <>
          <p>
            El cálculo recorre el precio buscando el próximo máximo o mínimo que se aleje del último punto
            confirmado en al menos el porcentaje configurado. Mientras el precio no se mueva ese % en contra
            del último tramo, el ZigZag no dibuja nada nuevo — sigue "esperando" a ver si el movimiento actual
            se vuelve significativo o se revierte antes de confirmarse como significativo.
          </p>
          <div className="bg-void-soft rounded-lg p-4 border border-void-border/60">
            <div className="text-xs font-mono text-neon-blue mb-2">POR QUÉ REPINTA, Y POR QUÉ ESO IMPORTA</div>
            <p className="text-sm">
              Supongamos un ZigZag al 5% que viene subiendo desde $60,000 y el precio llega a $65,000 (+8.3%,
              ya confirmó ese tramo como significativo). Si desde ahí el precio cae a $63,500 (−2.3% desde el
              máximo, todavía no llega al 5%), el ZigZag sigue dibujando la línea hacia $65,000 como si fuera
              el máximo vigente. Pero si el precio sigue subiendo en cambio hasta $66,200, el punto de $65,000
              deja de ser el máximo: la línea se <strong className="text-white">redibuja</strong> hacia atrás
              para reflejar que en realidad el giro todavía no había ocurrido en $65,000. El último tramo
              siempre puede cambiar hasta que un movimiento del 5% en la dirección contraria lo confirma
              definitivamente — por diseño, no por error.
            </p>
          </div>
          <p>
            Esto es exactamente lo opuesto al fractal, que una vez confirmado (2 velas después) nunca cambia de
            valor. El ZigZag filtra por <strong className="text-white">magnitud del movimiento</strong>{" "}
            (cuánto se movió el precio), mientras que el fractal filtra por{" "}
            <strong className="text-white">patrón de velas</strong> (forma geométrica de 5 barras) — son dos
            formas distintas de definir "giro importante", y no siempre coinciden en el mismo punto exacto.
          </p>
        </>
      }
      whenTimeframes="Cualquiera, pero su uso principal es de análisis retrospectivo — no depende tanto del marco temporal como de para qué se lo usa."
      whenConditions="Ideal para revisar gráficos históricos, identificar patrones chartistas (hombro-cabeza-hombro, dobles techos/suelos), contar ondas de Elliott, o trazar retrocesos de Fibonacci entre dos giros mayores."
      whenAvoid="Nunca como señal de entrada en tiempo real — el último tramo (el más reciente, justo donde estaría la 'señal') es exactamente el que puede repintarse. Operar el último quiebre del ZigZag es operar una señal que todavía no terminó de confirmarse."
      strategies={[
        "Visualización de estructura: usarlo para 'limpiar' un gráfico ruidoso antes de trazar soportes/resistencias a mano.",
        "Fibonacci entre giros: anclar el retroceso de Fibonacci entre dos puntos que el ZigZag ya marcó como máximo/mínimo confirmado (no en el tramo más reciente).",
        "Educación y backtesting visual: identificar cuántos giros mayores tuvo un activo en determinado período, sin el ruido de las velas intermedias.",
      ]}
      combinesWith={[
        {
          label: "Estructura de mercado",
          role: "es una versión simplificada de lo mismo",
          reason: "el ZigZag conecta los mismos tipos de swings que definen HH/HL/LH/LL — útil solo como capa visual de fondo, nunca como señal.",
        },
        {
          label: "Fractales",
          role: "referencia cruzada de giros",
          reason: "un giro del ZigZag que coincide con un fractal confirmado da más confianza de que fue un giro real, no ruido.",
        },
      ]}
      mistakes={[
        "Operar el tramo más reciente del ZigZag como si fuera una señal confirmada — es justo el que puede repintarse.",
        "No entender que el % de filtro cambia completamente el resultado: un ZigZag al 2% marca muchos más giros que uno al 8%.",
        "Confundirlo con un indicador predictivo cuando es puramente descriptivo/retrospectivo.",
      ]}
    />
  );
}
