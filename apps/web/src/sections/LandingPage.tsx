import { Link } from "react-router-dom";
import { PublicHeader } from "../components/public/PublicHeader";
import { PublicFooter } from "../components/public/PublicFooter";
import { DashboardMockPreview } from "../components/public/DashboardMockPreview";
import { Reveal } from "../components/public/Reveal";
import { SOCIALS } from "../data/socials";

const FEATURES = [
  { icon: "💹", label: "Terminal de paper trading profesional", to: "/app/terminal" },
  { icon: "🎓", label: "Academia por niveles", to: "/app/academia" },
  { icon: "🕹", label: "Arcade de juegos de trading", to: "/app/arcade" },
  { icon: "🌋", label: "Simulador de liquidaciones", to: "/app/contratos" },
  { icon: "🛡", label: "Gestión de riesgo", to: "/app/gestion-de-riesgo" },
  { icon: "◈", label: "Spider Chat AI", to: "/app" },
  { icon: "〽", label: "Fractales & estructura", to: "/app/fractales-estructura" },
  { icon: "📔", label: "Diario de trading", to: "/app/diario" },
  { icon: "📉", label: "Replay de crashes históricos", to: "/app/terminal" },
];

const STEPS = [
  {
    n: "1",
    title: "Aprendé en la Academia",
    body: "Niveles progresivos, de lo básico a contratos y apalancamiento, con quizzes que confirman que entendiste antes de avanzar.",
  },
  {
    n: "2",
    title: "Practicá con dinero ficticio",
    body: "Terminal de paper trading y minijuegos del Arcade — mismas velas y mecánicas reales, cero riesgo de capital.",
  },
  {
    n: "3",
    title: "Entendé tus errores",
    body: "Feedback automático basado en reglas después de cada trade, más tu Diario de Trading, para que el próximo error salga más barato.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <PublicHeader />

      {/* Hero */}
      <section className="relative px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/4 w-96 h-96 bg-neon-green/10 blur-[120px] rounded-full" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-neon-blue/10 blur-[120px] rounded-full" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neon-green border border-neon-green/30 rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            100% GRATIS, SIN LÍMITES DE TIEMPO
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Aprendé a operar antes de arriesgar un solo peso
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            La plataforma gratuita que te enseña trading de cripto con simuladores, juegos y datos reales — sin
            que te cueste los miles de dólares que cuestan los errores de novato.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link
              to="/app"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-mono font-bold border border-neon-green/50 text-neon-green bg-neon-green/10 hover:bg-neon-green/20 hover:shadow-neon-green transition-all"
            >
              Empezar gratis →
            </Link>
            <Link
              to="/app/academia"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-mono font-bold border border-void-border text-slate-300 hover:border-slate-500 hover:text-white transition-all"
            >
              Ver la Academia
            </Link>
          </div>
        </div>
        <Reveal>
          <div className="relative max-w-3xl mx-auto">
            <DashboardMockPreview />
          </div>
        </Reveal>
      </section>

      {/* La historia */}
      <Reveal>
        <section className="px-4 sm:px-6 py-20 border-t border-void-border bg-void-soft/30">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-[10px] font-mono font-bold tracking-widest text-neon-gold mb-4">POR QUÉ EXISTE SPIDER PRO</div>
            <p className="text-lg sm:text-xl text-slate-200 leading-relaxed mb-8">
              "Cuando empecé en el trading no entendía nada: velas, apalancamiento, liquidaciones. Aprendí a
              golpes, y cada golpe costó dinero real — miles de dólares que hoy sé que eran evitables. Spider
              Pro es la plataforma que a mí me hubiera gustado encontrar el primer día: un lugar donde
              entendés lo que vas a hacer ANTES de hacerlo con dinero de verdad. Por eso es gratis y lo va a
              seguir siendo."
            </p>
            <a
              href="https://x.com/Spyde3rAI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-mono text-slate-400 hover:text-neon-green transition-colors"
            >
              — El creador de Spider Pro, <span className="text-neon-blue">@Spyde3rAI</span>
            </a>
          </div>
        </section>
      </Reveal>

      {/* Qué incluye */}
      <Reveal>
        <section className="px-4 sm:px-6 py-20 border-t border-void-border">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neon-green border border-neon-green/30 rounded-full px-3 py-1 mb-4">
                100% GRATIS
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Todo lo que incluye</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f) => (
                <Link
                  key={f.label}
                  to={f.to}
                  className="panel p-5 flex items-center gap-4 hover:border-neon-green/40 transition-colors group"
                >
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{f.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Cómo funciona */}
      <Reveal>
        <section className="px-4 sm:px-6 py-20 border-t border-void-border bg-void-soft/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">Cómo funciona en 3 pasos</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {STEPS.map((s) => (
                <div key={s.n} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-neon-green/10 border border-neon-green/40 text-neon-green font-mono font-bold text-lg flex items-center justify-center">
                    {s.n}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-slate-500 mt-10 font-mono">
              Todo esto antes de tocar dinero real.
            </p>
          </div>
        </section>
      </Reveal>

      {/* La cifra honesta */}
      <Reveal>
        <section className="px-4 sm:px-6 py-20 border-t border-void-border">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-[10px] font-mono font-bold tracking-widest text-neon-red mb-4">LA CIFRA HONESTA</div>
            <p className="text-lg sm:text-xl text-slate-200 leading-relaxed">
              La mayoría de los traders principiantes pierde dinero. No te vendemos señales ni promesas de
              riqueza: te entrenamos para que, si decidís operar, lo hagas entendiendo los riesgos.
            </p>
          </div>
        </section>
      </Reveal>

      {/* Redes y comunidad */}
      <Reveal>
        <section className="px-4 sm:px-6 py-20 border-t border-void-border bg-void-soft/30">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-bold text-white mb-6">Seguí el proyecto</h2>
            <div className="flex flex-col gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel px-5 py-4 flex items-center justify-center gap-3 hover:border-neon-green/40 transition-colors"
                >
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-sm font-mono text-slate-300">{s.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <PublicFooter />
    </div>
  );
}
