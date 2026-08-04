import { TermifiedText } from "../../components/TermifiedText";

interface Bias {
  name: string;
  icon: string;
  feels: string;
  detect: string;
  rule: string;
}

const BIASES: Bias[] = [
  {
    name: "FOMO (miedo a quedarse afuera)",
    icon: "🔥",
    feels: "Ves que el precio ya subió mucho, sientes que 'te lo estás perdiendo' y la urgencia de entrar YA, sin plan, solo para no quedar afuera del movimiento.",
    detect: "Entraste sin haber revisado tu lista de condiciones de antemano, y el motivo principal para entrar es 'ya subió mucho, va a seguir subiendo'.",
    rule: "Si el trade te da miedo por lo rápido que se está moviendo, no es una entrada — es la señal más clara de que ya llegaste tarde. Espera el retroceso o déjalo pasar.",
  },
  {
    name: "Revenge trading (trading de venganza)",
    icon: "😤",
    feels: "Acabas de perder un trade y sientes la necesidad inmediata de 'recuperarlo' con otra entrada, generalmente más grande y peor planeada que la anterior.",
    detect: "Abriste una segunda posición minutos después de cerrar una en pérdida, con un tamaño mayor al habitual y sin haber esperado a que se cumplan tus condiciones normales de entrada.",
    rule: "Después de una pérdida, la regla es esperar — un café, una caminata, lo que sea, pero no la pantalla. Ninguna pérdida se 'recupera' con una entrada apurada; se recupera con el proceso normal, en el próximo trade que sí cumpla tus condiciones.",
  },
  {
    name: "Sesgo de confirmación",
    icon: "🔍",
    feels: "Ya tienes una idea de hacia dónde va el precio, y de repente todos los indicadores 'confirman' lo que ya pensabas — ignoras sin darte cuenta la evidencia que contradice tu idea.",
    detect: "Revisas 5 indicadores distintos buscando que todos digan lo mismo que tu primera intuición, y descartas mentalmente los que no coinciden como 'ruido'.",
    rule: "Antes de entrar, busca activamente la razón por la que el trade podría fallar. Si no puedes nombrar al menos una, no estás analizando — estás justificando una decisión que ya tomaste.",
  },
  {
    name: "Exceso de confianza",
    icon: "🚀",
    feels: "Después de 3-4 trades ganadores seguidos, sientes que 'entendiste el mercado' y empiezas a aumentar el tamaño de posición o a saltarte pasos de tu propio análisis.",
    detect: "Tu tamaño de posición promedio subió notablemente después de una racha ganadora, sin que haya cambiado nada en tu análisis de riesgo.",
    rule: "Una racha ganadora no cambia las probabilidades del próximo trade — cada trade es independiente. Mantén el mismo % de riesgo sin importar cuántos trades seguidos ganaste antes.",
  },
  {
    name: "Aversión a la pérdida",
    icon: "💔",
    feels: "Un trade va en tu contra y en vez de respetar el stop loss, lo mueves 'un poco más lejos' para 'darle espacio' — la pérdida realizada duele mucho más que una pérdida no realizada del mismo tamaño.",
    detect: "Modificaste un stop loss hacia un precio peor después de que el trade ya estaba en tu contra, en vez de antes de entrar.",
    rule: "El stop loss se define ANTES de entrar y no se toca salvo para mejorarlo a tu favor (nunca para darle más espacio a una pérdida). Si el análisis que justificaba el trade ya no es válido, ciérralo — no le cambies las reglas a mitad de partido.",
  },
];

export function PsychologySection() {
  return (
    <section id="psicologia" className="scroll-mt-24 mb-10">
      <h2 className="text-xl font-bold text-white mb-4">4. Psicología del Trading</h2>
      <p className="text-sm text-slate-400 mb-4 max-w-3xl">
        La gestión de riesgo matemática (bloques 1-3) es la mitad del trabajo — la otra mitad es notar cuándo
        tu cabeza te está por hacer romper esas reglas que tú mismo definiste en frío.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {BIASES.map((b) => (
          <div key={b.name} className="panel p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{b.icon}</span>
              <h3 className="font-semibold text-white">
                <TermifiedText text={b.name} />
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-[10px] font-mono text-neon-gold mb-1">CÓMO SE SIENTE</div>
                <p className="text-slate-400">{b.feels}</p>
              </div>
              <div>
                <div className="text-[10px] font-mono text-neon-blue mb-1">CÓMO DETECTARLA</div>
                <p className="text-slate-400">{b.detect}</p>
              </div>
              <div>
                <div className="text-[10px] font-mono text-neon-green mb-1">REGLA PARA NEUTRALIZARLA</div>
                <p className="text-slate-300">
                  <TermifiedText text={b.rule} />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
