import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: "green" | "red" | "blue" | "gold" | "neutral";
}

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  green: "text-neon-green",
  red: "text-neon-red",
  blue: "text-neon-blue",
  gold: "text-neon-gold",
  neutral: "text-slate-200",
};

const accentBar: Record<NonNullable<StatCardProps["accent"]>, string> = {
  green: "from-neon-green/60",
  red: "from-neon-red/60",
  blue: "from-neon-blue/60",
  gold: "from-neon-gold/60",
  neutral: "from-slate-500/40",
};

export function StatCard({ label, value, sub, accent = "neutral" }: StatCardProps) {
  return (
    <div className="panel p-4 overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${accentBar[accent]} to-transparent`} />
      <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">{label}</div>
      <div className={`value-mono text-xl font-semibold ${accentClasses[accent]}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1 value-mono">{sub}</div>}
    </div>
  );
}
