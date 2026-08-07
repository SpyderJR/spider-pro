import { useMemo, useState } from "react";
import type { WhaleCategory } from "@spider/types";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { CategoryFilter } from "../components/whales/CategoryFilter";
import { WhaleCard } from "../components/whales/WhaleCard";
import { WhaleDetailPanel } from "../components/whales/WhaleDetailPanel";
import { useWhales } from "../hooks/useWhales";
import { useWhaleDetail } from "../hooks/useWhaleDetail";
import { usePublishContext } from "../hooks/usePublishContext";

export function WhaleWatcherPage() {
  const { entities, error } = useWhales();
  const [category, setCategory] = useState<WhaleCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!entities) return null;
    return category === "all" ? entities : entities.filter((e) => e.category === category);
  }, [entities, category]);

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: entities?.length ?? 0 };
    for (const e of entities ?? []) out[e.category] = (out[e.category] ?? 0) + 1;
    return out;
  }, [entities]);

  const activeId = selectedId ?? filtered?.[0]?.id ?? null;
  const { entity: detail } = useWhaleDetail(activeId);

  // Publica un resumen real de todas las ballenas cargadas para que el chat pueda responder
  // preguntas que cruzan datos entre entidades (ej. "¿cuánto BTC mueve Satoshi comparado con
  // MicroStrategy?") con las mismas cifras que ve el usuario, no números inventados.
  usePublishContext(
    "whale-watcher",
    entities
      ? {
          entidadSeleccionada: detail
            ? {
                nombre: detail.name,
                categoria: detail.category,
                totalUsd: detail.totalUsdValue,
                modoDatos: detail.dataMode,
                confianza: detail.confidence,
                balances: detail.balances.map((b) => ({
                  red: b.chain,
                  activoNativo: b.nativeSymbol,
                  cantidadNativa: b.nativeAmount,
                  valorUsdNativo: b.nativeUsdValue,
                  tokens: b.tokens,
                })),
                nota: detail.declaredNote,
                patrimonioRealEstimadoPorTerceros: detail.externalEstimateNote,
              }
            : null,
          todasLasEntidades: entities.map((e) => ({
            nombre: e.name,
            categoria: e.category,
            totalUsd: e.totalUsdValue,
            modoDatos: e.dataMode,
            redes: e.chains,
            patrimonioRealEstimadoPorTerceros: e.externalEstimateNote,
          })),
          aviso:
            "Los valores son balances de direcciones públicas verificadas, no necesariamente el patrimonio total de la entidad. No hay datos de actividad reciente ('qué compró hoy') — solo balances actuales.",
        }
      : null,
  );

  return (
    <div>
      <SectionHeader
        title="Whale Watcher"
        subtitle="Balances públicos y verificables de las ballenas más influyentes de cripto — exchanges, instituciones, fundadores y figuras públicas."
      />
      <Disclaimer text="Cada cifra viene de una dirección pública verificada y citada — nunca inventada. Cuando una entidad no tiene una dirección on-chain verificable (ej. tesorerías institucionales custodiadas), se muestra su cifra declarada públicamente en vez de un saldo en vivo. Contenido educativo, no asesoría financiera (NFA)." />

      {entities && (
        <div className="mb-5">
          <CategoryFilter active={category} onChange={setCategory} counts={counts} />
        </div>
      )}

      {error && !entities && <p className="text-sm text-neon-red">No se pudo cargar Whale Watcher — intenta de nuevo en unos segundos.</p>}

      {!entities && !error && <p className="text-sm text-slate-500 font-mono">Cargando ballenas…</p>}

      {filtered && (
        <div className="grid lg:grid-cols-[360px_1fr] gap-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3 content-start">
            {filtered.map((e) => (
              <WhaleCard key={e.id} entity={e} selected={e.id === activeId} onSelect={() => setSelectedId(e.id)} />
            ))}
          </div>

          <div>{detail && detail.id === activeId ? <WhaleDetailPanel entity={detail} /> : <div className="panel p-6 text-sm text-slate-500">Cargando detalle…</div>}</div>
        </div>
      )}
    </div>
  );
}
