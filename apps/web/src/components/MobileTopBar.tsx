import { useState } from "react";
import { NavLink } from "react-router-dom";
import { SECTIONS } from "../lib/sections";
import { useUiStore } from "../store/uiStore";

export function MobileTopBar() {
  const [open, setOpen] = useState(false);
  const openBackupModal = useUiStore((s) => s.openBackupModal);

  return (
    <div className="lg:hidden bg-void-soft/95 backdrop-blur border-b border-void-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-neon-green text-xl">◈</span>
          <span className="font-mono font-bold tracking-tight text-white">SPIDER</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-slate-300 border border-void-border rounded-lg px-3 py-1.5 text-sm font-mono"
          aria-label="Abrir navegación"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <div className="border-t border-void-border max-h-[70vh] overflow-y-auto">
          {SECTIONS.map((s) => (
            <NavLink
              key={s.path}
              to={s.path}
              end={s.path === "/app"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm border-b border-void-border/50 ${
                  isActive ? "text-neon-green bg-neon-green/5" : "text-slate-300"
                }`
              }
            >
              <span className="w-5 text-center">{s.icon}</span>
              <span>{s.label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => {
              openBackupModal();
              setOpen(false);
            }}
            className="w-full text-left flex items-center gap-3 px-5 py-3 text-sm text-slate-400"
          >
            <span className="w-5 text-center">⚙</span>
            <span>Respaldo de datos</span>
          </button>
        </div>
      )}
    </div>
  );
}
