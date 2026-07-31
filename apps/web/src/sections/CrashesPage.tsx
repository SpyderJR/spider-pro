import { useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { StatCard } from "../components/StatCard";
import { useMarketCoins } from "../hooks/useMarketData";
import { usePublishContext } from "../hooks/usePublishContext";
import { formatPercent, formatUsd } from "../lib/format";
import { HISTORICAL_CRASHES } from "../data/crashes";
import type { Asset } from "@spider/types";

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
}

export function CrashesPage() {
  const [asset, setAsset] = useState<Asset>("BTC");
  const coins = useMarketCoins();
  const coin = coins.data?.coins.find((c) => c.symbol === asset);

  const crashes = HISTORICAL_CRASHES.filter((c) => c.asset === asset);
  const returns12m = crashes.map((c) => c.return12m).filter((r): r is number => r !== null);
  const winRate = returns12m.length > 0 ? (returns12m.filter((r) => r > 0).length / returns12m.length) * 100 : null;
  const medianReturn12m = returns12m.length > 0 ? median(returns12m) : null;

  const currentDrawdown = coin?.athChangePercent ?? null;

  usePublishContext("crashes", {
    asset,
    currentDrawdownFromAthPercent: currentDrawdown,
    winRate12mPercent: winRate,
    medianReturn12mPercent: medianReturn12m,
    historicalCrashCount: crashes.length,
  });

  return (
    <div>
      <SectionHeader
        title="Crashes Históricos"
        subtitle="Base de datos de caídas históricas con retornos posteriores a distintos plazos."
      />

      <div className="flex gap-2 mb-4">
        {(["BTC", "TRX"] as Asset[]).map((a) => (
          <button
            key={a}
            onClick={() => setAsset(a)}
            className={`px-3 py-1.5 rounded-lg text-sm font-mono border ${
              asset === a
                ? "border-neon-green/50 text-neon-green bg-neon-green/5"
                : "border-void-border text-slate-400"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatCard
          label="Caída en curso desde ATH"
          value={currentDrawdown !== null ? formatPercent(currentDrawdown, false) : "—"}
          accent="red"
        />
        <StatCard
          label="Win-rate a 12 meses (histórico)"
          value={winRate !== null ? `${winRate.toFixed(0)}%` : "—"}
          accent="green"
        />
        <StatCard
          label="Retorno mediano a 12 meses"
          value={medianReturn12m !== null ? formatPercent(medianReturn12m) : "—"}
          accent="gold"
        />
      </div>

      <div className="panel p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-void-border">
              <th className="pb-2 pr-4">Evento</th>
              <th className="pb-2 pr-4">Pico</th>
              <th className="pb-2 pr-4">Fondo</th>
              <th className="pb-2 pr-4">Caída</th>
              <th className="pb-2 pr-4">+6m</th>
              <th className="pb-2 pr-4">+12m</th>
              <th className="pb-2 pr-4">+18m</th>
              <th className="pb-2 pr-4">+24m</th>
              <th className="pb-2">+36m</th>
            </tr>
          </thead>
          <tbody>
            {crashes.map((c) => (
              <tr key={c.id} className="border-b border-void-border/50">
                <td className="py-2.5 pr-4 text-slate-200">{c.name}</td>
                <td className="py-2.5 pr-4 value-mono text-slate-400">{formatUsd(c.peakPrice, 4)}</td>
                <td className="py-2.5 pr-4 value-mono text-slate-400">{formatUsd(c.bottomPrice, 4)}</td>
                <td className="py-2.5 pr-4 value-mono text-neon-red">{formatPercent(c.dropPercent, false)}</td>
                {[c.return6m, c.return12m, c.return18m, c.return24m, c.return36m].map((r, i) => (
                  <td
                    key={i}
                    className={`py-2.5 pr-4 value-mono ${
                      r === null ? "text-slate-600" : r >= 0 ? "text-neon-green" : "text-neon-red"
                    }`}
                  >
                    {r === null ? "—" : formatPercent(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Disclaimer text="Los retornos post-crash son datos históricos y no garantizan un comportamiento similar en el futuro. Esto no es una recomendación de inversión (NFA)." />
    </div>
  );
}
