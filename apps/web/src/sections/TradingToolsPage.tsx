import { useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { TokenSearchBox } from "../components/TokenSearchBox";
import { usePublishContext } from "../hooks/usePublishContext";
import { BTC_TOKEN, TRX_TOKEN, type SelectedToken } from "../store/indicatorConfigStore";
import { CandleTimerTool } from "../components/tools/CandleTimerTool";
import { MultiTimeframeConfluence } from "../components/tools/MultiTimeframeConfluence";
import { VolatilityGauge } from "../components/tools/VolatilityGauge";
import { KeyLevelsTool } from "../components/tools/KeyLevelsTool";
import { MomentumRadarTool } from "../components/tools/MomentumRadarTool";

const TOOLS = [
  { id: "timer", label: "Cuenta Regresiva de Vela", icon: "⏱" },
  { id: "confluence", label: "Confluencia Multi-TF", icon: "🧬" },
  { id: "volatility", label: "Medidor de Volatilidad", icon: "〰" },
  { id: "levels", label: "Niveles Clave", icon: "🎯" },
  { id: "radar", label: "Radar BTC vs TRX", icon: "📡" },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

export function TradingToolsPage() {
  const [tool, setTool] = useState<ToolId>("timer");
  const [token, setToken] = useState<SelectedToken>(BTC_TOKEN);

  usePublishContext("trading-tools", { activeTool: tool, token: token.symbol });

  const isCustomToken = token.symbol !== "BTC" && token.symbol !== "TRX";

  return (
    <div>
      <SectionHeader
        title="Radar de Trading"
        subtitle="Cinco herramientas pensadas para operativa de marcos cortos (5–15 min): timing de vela, confluencia entre temporalidades, volatilidad, niveles clave y momentum relativo."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm border transition-all ${
              tool === t.id
                ? "border-neon-green/50 text-neon-green bg-neon-green/5 shadow-neon-green"
                : "border-void-border text-slate-400 hover:border-slate-600 hover:text-slate-200"
            }`}
          >
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {tool !== "radar" && (
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <button
            onClick={() => setToken(BTC_TOKEN)}
            className={`px-3 py-1.5 rounded-lg text-sm font-mono border transition-colors ${
              token.symbol === "BTC"
                ? "border-neon-gold/50 text-neon-gold bg-neon-gold/5"
                : "border-void-border text-slate-400 hover:border-slate-600"
            }`}
          >
            BTC
          </button>
          <button
            onClick={() => setToken(TRX_TOKEN)}
            className={`px-3 py-1.5 rounded-lg text-sm font-mono border transition-colors ${
              token.symbol === "TRX"
                ? "border-neon-gold/50 text-neon-gold bg-neon-gold/5"
                : "border-void-border text-slate-400 hover:border-slate-600"
            }`}
          >
            TRX
          </button>
          {isCustomToken && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-mono border border-neon-gold/50 text-neon-gold bg-neon-gold/5">
              {token.symbol} · {token.label}
            </span>
          )}
          <TokenSearchBox onSelect={setToken} />
        </div>
      )}

      <div className="mb-6">
        {tool === "timer" && <CandleTimerTool token={token} />}
        {tool === "confluence" && <MultiTimeframeConfluence token={token} />}
        {tool === "volatility" && <VolatilityGauge token={token} />}
        {tool === "levels" && <KeyLevelsTool token={token} />}
        {tool === "radar" && <MomentumRadarTool />}
      </div>

      <Disclaimer text="Estas herramientas son ayudas de lectura de mercado, no señales de entrada ni promesas de resultado. Los marcos de tiempo cortos amplifican tanto ganancias como pérdidas — operá solo capital que puedas permitirte perder (NFA)." />
    </div>
  );
}
