import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ClusterGroup, MemeHolder } from "@spider/types";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { ExplainButton } from "../components/spider/ExplainButton";
import { TokenSearchBar } from "../components/meme/TokenSearchBar";
import { TokenSummaryPanel } from "../components/meme/TokenSummaryPanel";
import { RecentTokensFeed } from "../components/meme/RecentTokensFeed";
import { WatchlistPanel } from "../components/meme/WatchlistPanel";
import { HolderBubbleMap } from "../components/meme/HolderBubbleMap";
import { ActivityTicker } from "../components/meme/ActivityTicker";
import { useMemeToken } from "../hooks/useMemeToken";
import { useRecentMemeTokens } from "../hooks/useRecentMemeTokens";
import { useMemeActivity } from "../hooks/useMemeActivity";
import { fetchMemeHolders, fetchMemeClustering } from "../lib/api";
import { useMemeWatchlistStore } from "../store/memeWatchlistStore";
import { usePublishContext } from "../hooks/usePublishContext";

export function MemeRadarPage() {
  usePublishContext("meme-radar", {
    section:
      "buscador y analizador de memecoins creados en SunPump (launchpad de TRON): estado bonding-curve vs graduado, precio/liquidez reales cuando aplica, mapa de holders y watchlist personal",
  });

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [holders, setHolders] = useState<MemeHolder[] | null>(null);
  const [holdersError, setHoldersError] = useState(false);
  const [clustering, setClustering] = useState<ClusterGroup[] | null>(null);
  const [clusteringLoading, setClusteringLoading] = useState(false);

  const { token, error: tokenError } = useMemeToken(selectedAddress);
  const { tokens: recentTokens, error: recentError } = useRecentMemeTokens();
  const { events: activityEvents } = useMemeActivity();
  const isWatched = useMemeWatchlistStore((s) => (selectedAddress ? s.isWatched(selectedAddress) : false));
  const addToWatchlist = useMemeWatchlistStore((s) => s.addToWatchlist);
  const removeFromWatchlist = useMemeWatchlistStore((s) => s.removeFromWatchlist);

  useEffect(() => {
    setHolders(null);
    setHoldersError(false);
    setClustering(null);
    if (!selectedAddress) return;

    let cancelled = false;
    fetchMemeHolders(selectedAddress)
      .then((res) => {
        if (!cancelled) setHolders(res.holders);
      })
      .catch(() => {
        if (!cancelled) setHoldersError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedAddress]);

  async function runClustering() {
    if (!selectedAddress) return;
    setClusteringLoading(true);
    try {
      const res = await fetchMemeClustering(selectedAddress);
      setClustering(res.groups);
    } catch {
      setClustering([]);
    } finally {
      setClusteringLoading(false);
    }
  }

  function toggleWatch() {
    if (!selectedAddress) return;
    if (isWatched) removeFromWatchlist(selectedAddress);
    else addToWatchlist(selectedAddress, token?.symbol ?? null);
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <SectionHeader
          title="Meme Radar"
          subtitle="Buscador y analizador de memecoins de SunPump (TRON) — estado real, holders y watchlist. Contenido informativo, sin conexión de wallet ni compra/venta dentro de la app."
        />
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-neon-green shrink-0 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          LEYENDO EL CONTRATO DE SUNPUMP EN VIVO
        </span>
      </div>

      <div className="-mx-4 sm:-mx-6 mb-6">
        <ActivityTicker events={activityEvents} onSelect={setSelectedAddress} />
      </div>

      <div className="panel border-2 border-neon-red/40 p-5 mb-6">
        <div className="text-xs font-mono font-bold tracking-widest text-neon-red mb-2">⚠ RIESGO EXTREMO</div>
        <p className="text-sm text-slate-200 leading-relaxed">
          Los memecoins son el activo de mayor riesgo en todo el mercado cripto — la inmensa mayoría termina valiendo
          cero. No hay equipo, producto ni promesa detrás de la mayoría de estos tokens, solo especulación pura.
          Nada en esta página es una recomendación de compra o venta (NFA). Esta app nunca ejecuta transacciones ni
          se conecta a tu wallet — todo aquí es informativo.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="panel p-4">
            <TokenSearchBar onSearch={setSelectedAddress} />
          </div>

          {selectedAddress && (
            <>
              <TokenSummaryPanel token={token} error={tokenError} isWatched={isWatched} onToggleWatch={toggleWatch} />

              <div className="panel p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">Mapa de holders</h3>
                  <button
                    onClick={runClustering}
                    disabled={clusteringLoading || !holders || holders.length === 0}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold border border-neon-gold/40 text-neon-gold hover:bg-neon-gold/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {clusteringLoading ? "Analizando..." : "Analizar clustering (estimado)"}
                  </button>
                </div>
                {holdersError ? (
                  <p className="text-xs text-neon-red">No se pudieron cargar los holders.</p>
                ) : (
                  <HolderBubbleMap holders={holders ?? []} clustering={clustering} />
                )}
                <p className="text-[10px] text-slate-500 mt-3">
                  El tamaño de cada burbuja es proporcional al balance. El clustering agrupa carteras fondeadas desde
                  el mismo origen — es una <strong className="text-neon-gold">estimación propia</strong>, no una
                  identificación certera de que sean la misma persona.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="panel p-4">
            <h3 className="text-sm font-bold text-white mb-3">Recién creados en SunPump</h3>
            <RecentTokensFeed tokens={recentTokens} error={recentError} onSelect={setSelectedAddress} />
          </div>

          <div className="panel p-4">
            <h3 className="text-sm font-bold text-white mb-3">Tu watchlist</h3>
            <WatchlistPanel onSelect={setSelectedAddress} />
          </div>
        </div>
      </div>

      <div className="panel p-5 mb-8">
        <h2 className="text-lg font-bold text-white mb-3">Sigue explorando</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link to="/app/on-chain" className="block rounded-xl border border-void-border p-3 hover:border-neon-blue/40 transition-colors">
            <div className="text-sm font-bold text-white mb-1">On-Chain</div>
            <div className="text-xs text-slate-500">Cómo leer direcciones, grafos de flujos y entidades etiquetadas.</div>
          </Link>
          <Link to="/app/gestion-de-riesgo" className="block rounded-xl border border-void-border p-3 hover:border-neon-blue/40 transition-colors">
            <div className="text-sm font-bold text-white mb-1">Gestión de Riesgo</div>
            <div className="text-xs text-slate-500">Por qué el tamaño de posición importa más que la elección del activo.</div>
          </Link>
          <Link to="/app/tron" className="block rounded-xl border border-void-border p-3 hover:border-neon-blue/40 transition-colors">
            <div className="text-sm font-bold text-white mb-1">TRON</div>
            <div className="text-xs text-slate-500">Fundamentos de la red donde vive SunPump.</div>
          </Link>
        </div>
        <div className="mt-4">
          <ExplainButton question="¿Qué es SunPump y por qué los memecoins son tan riesgosos?" />
        </div>
      </div>

      <Disclaimer text="Contenido informativo, no asesoría financiera (NFA). Los memecoins tienen riesgo extremo de pérdida total. El clustering de carteras es una estimación propia basada en heurísticas, no una identificación certera. Esta app no ejecuta transacciones ni se conecta a wallets — toda operación real la haces por tu cuenta y bajo tu propio riesgo, fuera de esta plataforma." />
    </div>
  );
}
