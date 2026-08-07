import { useState } from "react";
import type { MemeConcentrationRisk, MemeCreatorToken, MemeTokenSummary, MemeWhaleMove } from "@spider/types";
import { fetchMemeCreatorHistory } from "../../lib/api";

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "hace menos de 1h";
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${Math.floor(hours / 24)}d`;
}

const RISK_STYLE: Record<MemeConcentrationRisk, { label: string; cls: string }> = {
  bajo: { label: "BAJO", cls: "text-neon-green border-neon-green/40 bg-neon-green/10" },
  medio: { label: "MEDIO", cls: "text-neon-gold border-neon-gold/40 bg-neon-gold/10" },
  alto: { label: "ALTO", cls: "text-neon-red border-neon-red/40 bg-neon-red/10" },
};

interface Props {
  token: MemeTokenSummary;
  top10ConcentrationPercent: number | null;
  concentrationRisk: MemeConcentrationRisk | null;
  recentWhaleMove: MemeWhaleMove | null;
}

export function RiskSignalsPanel({ token, top10ConcentrationPercent, concentrationRisk, recentWhaleMove }: Props) {
  const [creatorTokens, setCreatorTokens] = useState<MemeCreatorToken[] | null>(null);
  const [creatorAddress, setCreatorAddress] = useState<string | null>(null);
  const [loadingCreator, setLoadingCreator] = useState(false);
  const [creatorError, setCreatorError] = useState(false);

  async function runCreatorHistory() {
    setLoadingCreator(true);
    setCreatorError(false);
    try {
      const res = await fetchMemeCreatorHistory(token.address);
      setCreatorTokens(res.otherTokens);
      setCreatorAddress(res.creatorAddress);
    } catch {
      setCreatorError(true);
    } finally {
      setLoadingCreator(false);
    }
  }

  const deadOtherTokens = (creatorTokens ?? []).filter((t) => t.status === "CREATED" && (t.holders ?? 0) <= 1);

  return (
    <div className="panel p-5">
      <h3 className="text-sm font-bold text-white mb-1">Señales de riesgo</h3>
      <p className="text-[11px] text-slate-500 mb-4">
        Heurísticas calculadas de datos reales — cada una es una señal de alerta, no una prueba de estafa. Combínalas
        con tu propio criterio.
      </p>

      <div className="space-y-3">
        {/* Progreso de la curva de bonding */}
        {token.pumpPercentage !== null && token.status === "bonding-curve" && (
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span className="text-slate-500">PROGRESO DE LA CURVA DE BONDING</span>
              <span className="text-slate-300">{token.pumpPercentage.toFixed(2)}%</span>
            </div>
            <div className="h-2 rounded-full bg-void-soft border border-void-border overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-gold to-neon-green transition-all"
                style={{ width: `${Math.min(100, Math.max(0, token.pumpPercentage))}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-600 mt-1">
              % del suministro ya comprado en la curva — al 100% el token "gradúa" a un pool real en SunSwap.
            </p>
          </div>
        )}

        {/* Nombre/símbolo sospechoso */}
        {token.nameSimilarityWarning && (
          <div className="flex gap-2 bg-neon-red/10 border border-neon-red/30 rounded-lg p-3">
            <span className="text-neon-red shrink-0">⚠</span>
            <p className="text-xs text-neon-red leading-relaxed">{token.nameSimilarityWarning}</p>
          </div>
        )}

        {/* Concentración de holders */}
        {concentrationRisk && top10ConcentrationPercent !== null && (
          <div className="flex items-center justify-between bg-void-soft rounded-lg p-3">
            <div>
              <div className="text-[11px] font-mono text-slate-500 mb-0.5">CONCENTRACIÓN (TOP 10 HOLDERS)</div>
              <div className="text-xs text-slate-300">
                {top10ConcentrationPercent.toFixed(1)}% del supply en circulación está en solo 10 carteras.
              </div>
            </div>
            <span className={`shrink-0 text-[10px] font-mono font-bold px-2 py-1 rounded border ${RISK_STYLE[concentrationRisk].cls}`}>
              {RISK_STYLE[concentrationRisk].label}
            </span>
          </div>
        )}

        {/* Movimiento de ballenas */}
        {recentWhaleMove && (
          <div className="flex gap-2 bg-neon-gold/10 border border-neon-gold/30 rounded-lg p-3">
            <span className="text-neon-gold shrink-0">🐋</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              Se detectó una transferencia de <strong className="text-neon-gold">{recentWhaleMove.percentOfSupply.toFixed(1)}%</strong> del
              supply ({shortAddress(recentWhaleMove.fromAddress)} → {shortAddress(recentWhaleMove.toAddress)}),{" "}
              {timeAgo(recentWhaleMove.timestamp)}.
            </p>
          </div>
        )}

        {/* Detector de creador en serie */}
        <div className="border-t border-void-border pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-500">HISTORIAL DEL CREADOR</span>
            {!creatorTokens && (
              <button
                onClick={runCreatorHistory}
                disabled={loadingCreator}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold border border-neon-gold/40 text-neon-gold hover:bg-neon-gold/10 transition-colors disabled:opacity-40"
              >
                {loadingCreator ? "Buscando..." : "Ver otros tokens de este creador (estimado)"}
              </button>
            )}
          </div>

          {creatorError && <p className="text-xs text-neon-red">No se pudo cargar el historial del creador.</p>}

          {creatorTokens && (
            <div>
              {!creatorAddress ? (
                <p className="text-xs text-slate-500">No se pudo identificar la cartera creadora de este token.</p>
              ) : creatorTokens.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No encontramos otros tokens de {shortAddress(creatorAddress)} en sus transacciones recientes en
                  SunPump — puede ser su primer lanzamiento, o lanzó otros hace más tiempo del que revisamos.
                </p>
              ) : (
                <div>
                  <p className="text-xs text-slate-300 mb-2">
                    {shortAddress(creatorAddress)} lanzó al menos <strong className="text-white">{creatorTokens.length}</strong>{" "}
                    otro{creatorTokens.length !== 1 ? "s" : ""} token{creatorTokens.length !== 1 ? "s" : ""} en SunPump
                    {deadOtherTokens.length > 0 && (
                      <>
                        {" "}
                        —{" "}
                        <strong className="text-neon-red">
                          {deadOtherTokens.length} parece{deadOtherTokens.length === 1 ? "" : "n"} abandonado{deadOtherTokens.length === 1 ? "" : "s"}
                        </strong>{" "}
                        (sin comprador real más allá de él mismo)
                      </>
                    )}
                    .
                  </p>
                  <div className="space-y-1.5">
                    {creatorTokens.map((t) => (
                      <a
                        key={t.address}
                        href={`https://tronscan.org/#/address/${t.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-2.5 py-1.5 rounded border border-void-border hover:border-neon-blue/40 transition-colors text-xs"
                      >
                        <span className="font-mono text-slate-300">{t.symbol ?? shortAddress(t.address)}</span>
                        <span className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                          {t.status === "LAUNCHED" ? (
                            <span className="text-neon-green">graduado</span>
                          ) : (t.holders ?? 0) <= 1 ? (
                            <span className="text-neon-red">abandonado</span>
                          ) : (
                            <span className="text-neon-gold">en curva</span>
                          )}
                        </span>
                      </a>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-600 mt-2">
                    Estimación basada en las transacciones recientes de esa cartera — no es su historial completo.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
