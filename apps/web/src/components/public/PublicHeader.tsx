import { Link } from "react-router-dom";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 bg-void/80 backdrop-blur border-b border-void-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Spider" className="w-9 h-9 rounded-lg shadow-neon-gold shrink-0" />
          <span className="font-mono font-bold text-lg tracking-tight text-white">SPIDER</span>
          <span className="text-[10px] font-mono text-neon-gold border border-neon-gold/40 rounded px-1.5 py-0.5">
            PRO
          </span>
        </Link>
        <Link
          to="/app"
          className="px-4 py-2 rounded-lg text-sm font-mono font-bold border border-neon-green/50 text-neon-green bg-neon-green/10 hover:bg-neon-green/20 hover:shadow-neon-green transition-all"
        >
          Entrar a la app →
        </Link>
      </div>
    </header>
  );
}
