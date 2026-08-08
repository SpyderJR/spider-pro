import { NavLink } from "react-router-dom";
import { SECTIONS } from "../lib/sections";
import { useAcademyProgressStore } from "../store/academyProgressStore";
import { useUiStore } from "../store/uiStore";
import { DonationAddress } from "./DonationAddress";

export function Nav() {
  const { streakDays, overallPercent } = useAcademyProgressStore();
  const percent = overallPercent();
  const openBackupModal = useUiStore((s) => s.openBackupModal);

  return (
    <nav className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-void-border bg-void-soft/60 h-screen sticky top-0 overflow-y-auto">
      <div className="px-5 py-6 border-b border-void-border relative overflow-hidden">
        <div className="pointer-events-none absolute -bottom-10 -right-10 w-32 h-32 bg-neon-green/10 blur-3xl rounded-full" />
        <div className="relative flex items-center gap-2.5">
          <img src="/logo.png" alt="Spider" className="w-10 h-10 rounded-lg object-cover shrink-0" />
          <span className="font-mono font-bold text-lg tracking-tight text-white">SPIDER</span>
          <span className="text-[10px] font-mono text-neon-gold border border-neon-gold/40 rounded px-1.5 py-0.5">
            PRO
          </span>
        </div>
      </div>

      {(streakDays > 0 || percent > 0) && (
        <NavLink to="/app/academia" className="px-5 py-3 border-b border-void-border flex items-center justify-between text-xs hover:bg-white/5 transition-colors">
          <span className="flex items-center gap-1.5 text-neon-gold font-mono">
            🔥 {streakDays} {streakDays === 1 ? "día" : "días"}
          </span>
          <span className="flex items-center gap-1.5 text-slate-500 font-mono">
            <span className="w-12 h-1.5 bg-void-soft rounded-full overflow-hidden">
              <span className="block h-full bg-neon-green" style={{ width: `${percent}%` }} />
            </span>
            {percent}%
          </span>
        </NavLink>
      )}

      <div className="flex-1 py-3">
        {SECTIONS.map((s) => (
          <NavLink
            key={s.path}
            to={s.path}
            end={s.path === "/app"}
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
      <div className="px-5 py-4 border-t border-void-border">
        <button
          onClick={openBackupModal}
          className="text-[11px] font-mono text-slate-500 hover:text-neon-blue mb-2 flex items-center gap-1.5"
        >
          ⚙ Respaldo de datos
        </button>
        <div className="mb-2">
          <DonationAddress compact />
        </div>
        <div className="text-[11px] text-slate-600">Datos de mercado, no asesoría financiera (NFA).</div>
        <div className="text-[10px] text-slate-700 mt-1">Gráficos por TradingView Lightweight Charts (open source).</div>
      </div>
    </nav>
  );
}
