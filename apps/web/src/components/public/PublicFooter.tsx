import { Link } from "react-router-dom";
import { SOCIALS } from "../../data/socials";

export function PublicFooter() {
  return (
    <footer className="border-t border-void-border bg-void-soft/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-neon-green text-xl">◈</span>
              <span className="font-mono font-bold text-white">SPIDER</span>
              <span className="text-[10px] font-mono text-neon-gold border border-neon-gold/40 rounded px-1.5 py-0.5">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Plataforma educativa gratuita de simulación de trading cripto. Sin costo, sin señales, sin promesas.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-neon-green transition-colors"
                >
                  <span className="text-sm">{s.icon}</span>
                  {s.handle}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-2">LEGAL</div>
              <div className="flex flex-col gap-1.5">
                <Link to="/terminos" className="text-slate-400 hover:text-neon-blue transition-colors">
                  Términos y Condiciones
                </Link>
                <Link to="/privacidad" className="text-slate-400 hover:text-neon-blue transition-colors">
                  Política de Privacidad
                </Link>
                <Link to="/riesgo" className="text-slate-400 hover:text-neon-blue transition-colors">
                  Aviso de Riesgo
                </Link>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-2">PLATAFORMA</div>
              <div className="flex flex-col gap-1.5">
                <Link to="/app" className="text-slate-400 hover:text-neon-blue transition-colors">
                  Ir a la app
                </Link>
                <Link to="/app/academia" className="text-slate-400 hover:text-neon-blue transition-colors">
                  Academia
                </Link>
                <Link to="/app/arcade" className="text-slate-400 hover:text-neon-blue transition-colors">
                  Arcade
                </Link>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-2">CONTACTO</div>
              <div className="flex flex-col gap-1.5">
                <a
                  href="https://x.com/Spyde3rAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-neon-blue transition-colors"
                >
                  @Spyde3rAI en X
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-void-border pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-[11px] text-slate-600">
            Datos de mercado, no asesoría financiera (NFA). Gráficos por TradingView Lightweight Charts (open
            source).
          </p>
          <p className="text-[11px] text-slate-600">© {new Date().getFullYear()} Spider Pro</p>
        </div>
      </div>
    </footer>
  );
}
