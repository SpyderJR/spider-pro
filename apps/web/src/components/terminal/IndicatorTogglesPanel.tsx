import { useTerminalPreferencesStore } from "../../store/terminalPreferencesStore";
import type { TerminalIndicatorToggles } from "../../hooks/useTerminalIndicators";

const ITEMS: Array<{ key: keyof TerminalIndicatorToggles; label: string; icon: string }> = [
  { key: "fractals", label: "Fractales", icon: "〽" },
  { key: "alligator", label: "Alligator", icon: "🐊" },
  { key: "pivots", label: "Pivots", icon: "⌗" },
  { key: "ema20", label: "EMA 20", icon: "〰" },
  { key: "ema50", label: "EMA 50", icon: "〰" },
  { key: "ema200", label: "EMA 200", icon: "〰" },
  { key: "volume", label: "Volumen", icon: "▮" },
  { key: "rsi", label: "RSI", icon: "◐" },
  { key: "ao", label: "AO", icon: "≋" },
  { key: "vwap", label: "VWAP", icon: "Σ" },
  { key: "volumeProfile", label: "Perfil Vol.", icon: "▤" },
];

export function IndicatorTogglesPanel() {
  const { toggles, toggle } = useTerminalPreferencesStore();

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => toggle(item.key)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
            toggles[item.key]
              ? "border-neon-green/50 text-neon-green bg-neon-green/10"
              : "border-void-border text-slate-500 hover:border-slate-600"
          }`}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}
