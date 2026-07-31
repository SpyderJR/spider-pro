import { NavLink } from "react-router-dom";
import { SECTIONS } from "../lib/sections";

export function Nav() {
  return (
    <nav className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-void-border bg-void-soft/60 h-screen sticky top-0 overflow-y-auto">
      <div className="px-5 py-6 border-b border-void-border relative overflow-hidden">
        <div className="pointer-events-none absolute -top-10 -left-10 w-32 h-32 bg-neon-green/10 blur-3xl rounded-full" />
        <div className="relative flex items-center gap-2">
          <span className="text-neon-green text-2xl glow-text">◈</span>
          <span className="font-mono font-bold text-lg tracking-tight text-white">SPIDER</span>
          <span className="text-[10px] font-mono text-neon-gold border border-neon-gold/40 rounded px-1.5 py-0.5">
            PRO
          </span>
        </div>
      </div>
      <div className="flex-1 py-3">
        {SECTIONS.map((s) => (
          <NavLink
            key={s.path}
            to={s.path}
            end={s.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm transition-all border-l-2 ${
                isActive
                  ? "border-neon-green text-white bg-gradient-to-r from-neon-green/10 to-transparent shadow-[inset_0_0_20px_-8px_rgba(57,255,156,0.5)]"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`
            }
          >
            <span className="text-base leading-none w-5 text-center">{s.icon}</span>
            <span>{s.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="px-5 py-4 border-t border-void-border text-[11px] text-slate-600">
        Datos de mercado, no asesoría financiera (NFA).
      </div>
    </nav>
  );
}
