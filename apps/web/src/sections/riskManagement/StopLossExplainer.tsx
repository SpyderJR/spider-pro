import { Link } from "react-router-dom";

export function StopLossExplainer() {
  return (
    <section id="que-es-stop-loss" className="scroll-mt-24 mb-10">
      <h2 className="text-xl font-bold text-white mb-4">0. ¿Qué es un Stop Loss?</h2>

      <div className="panel p-5 mb-4">
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          Un <strong className="text-white">stop loss (SL)</strong> es una orden que dejás programada de
          antemano para que, si el precio se mueve en contra tuyo hasta un nivel determinado, la posición se
          cierre <strong className="text-white">automáticamente</strong> — sin que tengas que estar mirando la
          pantalla ni tomar la decisión en caliente. Es la herramienta que convierte "cuánto puedo perder en
          este trade" de una esperanza en un número exacto y garantizado de antemano.
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Sin un SL, cada trade tiene una pérdida máxima teórica de "todo tu capital" — porque nada te obliga
          a salir. Con un SL, la pérdida máxima está definida antes de entrar. Esa es la diferencia entre
          especular con un límite y especular sin red.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="panel p-5">
          <div className="text-[10px] font-mono font-bold tracking-widest text-neon-blue mb-2">
            DÓNDE COLOCARLO
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            El error más común de un principiante es elegir el SL por un número redondo o por "cuánto quiero
            arriesgar en dólares" — al revés de cómo se hace bien. El SL se coloca primero en un{" "}
            <strong className="text-white">nivel estructural del gráfico</strong>: debajo del último fractal o
            soporte relevante si estás en largo, o arriba de la última resistencia si estás en corto — el
            punto donde, si el precio realmente lo rompe, tu idea de trade queda invalidada.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Recién después de fijar ese nivel estructural calculás el tamaño de posición para que esa distancia
            represente el % de riesgo que elegiste (ver calculadora abajo). El nivel del SL nunca se ajusta
            para "que me convenga la cuenta" — se ajusta la cuenta (el tamaño) al nivel.
          </p>
          <Link
            to="/fractales-estructura"
            className="inline-block mt-3 text-xs font-mono text-neon-blue hover:underline"
          >
            → Ver cómo identificar fractales y soportes/resistencias
          </Link>
        </div>

        <div className="panel p-5">
          <div className="text-[10px] font-mono font-bold tracking-widest text-neon-green mb-2">
            CUÁNDO USARLO
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            <strong className="text-white">Siempre.</strong> En todo trade con apalancamiento sin excepción, y
            en la gran mayoría de operaciones spot también. Las únicas excepciones razonadas son estrategias
            específicas de larguísimo plazo tipo DCA/HODL con capital que genuinamente podés dejar quieto años
            sin necesitarlo — y aun así, un SL mental claro ("si pasa X, revisás la tesis") sigue siendo
            recomendable.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            "Iba a poner un stop pero decidí esperar a ver si rebotaba" es, en la práctica, la forma más común
            en la que un principiante convierte una pérdida chica y planeada en una pérdida grande y no
            planeada.
          </p>
        </div>
      </div>

      <div className="panel p-5 mb-4">
        <div className="text-[10px] font-mono font-bold tracking-widest text-neon-gold mb-3">
          LOS DOS ERRORES OPUESTOS MÁS COMUNES
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-void-soft rounded-lg p-4 border border-neon-red/20">
            <div className="text-xs font-mono font-bold text-neon-red mb-1.5">SL DEMASIADO AJUSTADO</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lo ponés tan cerca del precio de entrada que el ruido normal del mercado (una mecha, una
              corrección menor dentro de la tendencia) te saca del trade antes de que tu idea tenga tiempo de
              funcionar — aunque la dirección que pensaste haya sido correcta. Se ve como "me sacan siempre
              justo antes de que suba".
            </p>
          </div>
          <div className="bg-void-soft rounded-lg p-4 border border-neon-red/20">
            <div className="text-xs font-mono font-bold text-neon-red mb-1.5">SL DEMASIADO AMPLIO</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lo ponés tan lejos que, aunque técnicamente esté en un nivel estructural válido, la distancia
              implica arriesgar mucho más capital del que deberías en ese trade — o te obliga a usar una
              posición diminuta para compensar. La cura no es "ajustarlo más", es aceptar el nivel estructural
              real y calcular el tamaño en base a él.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4">
          El punto de equilibrio no es una distancia fija en % — es el nivel estructural correcto según el
          gráfico, combinado con un tamaño de posición calculado para esa distancia exacta. Por eso el SL se
          define primero y el tamaño de posición se calcula después, nunca al revés — usá la calculadora justo
          abajo con el nivel de SL que ya identificaste en el gráfico.
        </p>
      </div>
    </section>
  );
}
