import { useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "spider-onboarding-completed";

type Level = "principiante" | "intermedio" | "avanzado";

const LEVEL_OPTIONS: { id: Level; label: string; description: string }[] = [
  { id: "principiante", label: "Recién arranco", description: "No sé leer un gráfico todavía" },
  { id: "intermedio", label: "Tengo lo básico", description: "Entiendo velas y algún indicador" },
  { id: "avanzado", label: "Ya opero", description: "Quiero herramientas, no clases" },
];

export function OnboardingModal() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(() => typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY));
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<Level | null>(null);

  if (!visible) return null;

  function finish() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
    if (level === "principiante") navigate("/app/academia");
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="panel max-w-md w-full p-6">
        <div className="flex items-center gap-1.5 mb-5">
          {[0, 1, 2].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? "bg-neon-green" : "bg-void-soft"}`} />
          ))}
        </div>

        {step === 0 && (
          <div>
            <div className="text-3xl mb-3">◈</div>
            <h2 className="text-xl font-bold text-white mb-2">Bienvenido a Spider Pro</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Una plataforma educativa de trading cripto: terminal de paper trading con datos reales, academia con
              quizzes, minijuegos de entrenamiento, diario y más. Nada aquí es asesoría financiera (NFA) — todo es
              para practicar sin arriesgar un centavo real.
            </p>
            <button onClick={() => setStep(1)} className="w-full py-2.5 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green">
              Empezar
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-1">¿Qué tan familiarizado estás con trading?</h2>
            <p className="text-sm text-slate-400 mb-5">Así te sugerimos por dónde arrancar. Puedes cambiar de sección en cualquier momento.</p>
            <div className="space-y-2 mb-6">
              {LEVEL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setLevel(opt.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                    level === opt.id ? "border-neon-green/50 bg-neon-green/5" : "border-void-border hover:border-slate-600"
                  }`}
                >
                  <div className="text-sm font-bold text-white">{opt.label}</div>
                  <div className="text-xs text-slate-500">{opt.description}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!level}
              className="w-full py-2.5 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green disabled:opacity-30"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-3xl mb-3">{level === "principiante" ? "🎓" : "🚀"}</div>
            <h2 className="text-lg font-bold text-white mb-2">
              {level === "principiante" ? "Te llevamos a la Academia" : "Listo, explora la plataforma"}
            </h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              {level === "principiante"
                ? "Empieza por el Nivel 1: Fundamentos. Cada nivel tiene un quiz corto al final — no es obligatorio aprobarlo para seguir, es solo para que veas qué tan sólido tienes cada tema."
                : "Tienes la Terminal, el Arcade, el Diario y el Glosario a un clic en el menú lateral. Cualquier duda, Spider Chat está abajo a la derecha."}
            </p>
            <button onClick={finish} className="w-full py-2.5 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green">
              {level === "principiante" ? "Ir a la Academia" : "Entrar a Spider Pro"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
