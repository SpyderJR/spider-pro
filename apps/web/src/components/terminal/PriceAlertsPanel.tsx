import { useState } from "react";
import type { PriceAlert } from "../../store/priceAlertsStore";
import { usePriceAlertsStore } from "../../store/priceAlertsStore";
import { pricePrecision } from "../../lib/format";

interface Props {
  pair: string;
  currentPrice: number | null;
  alertsForPair: PriceAlert[];
}

export function PriceAlertsPanel({ pair, currentPrice, alertsForPair }: Props) {
  const addAlert = usePriceAlertsStore((s) => s.addAlert);
  const removeAlert = usePriceAlertsStore((s) => s.removeAlert);
  const [draftPrice, setDraftPrice] = useState("");
  const [showForm, setShowForm] = useState(false);

  function handleAdd() {
    const target = Number(draftPrice);
    if (!target || !currentPrice) return;
    const direction = target >= currentPrice ? "above" : "below";
    addAlert(pair, target, direction);
    setDraftPrice("");
    setShowForm(false);
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  return (
    <div className="panel p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] font-mono text-slate-500">
          ALERTAS DE PRECIO — {pair.replace("USDT", "/USDT")}
          {alertsForPair.length > 0 && <span className="text-neon-gold ml-1">({alertsForPair.length})</span>}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-[10px] font-mono text-neon-blue px-2 py-1 border border-neon-blue/40 rounded hover:bg-neon-blue/10"
        >
          + AGREGAR
        </button>
      </div>

      {showForm && (
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            value={draftPrice}
            onChange={(e) => setDraftPrice(e.target.value)}
            placeholder={currentPrice ? currentPrice.toFixed(pricePrecision(currentPrice)) : "Precio"}
            className="flex-1 bg-void-soft border border-void-border rounded-lg px-2.5 py-1.5 text-xs value-mono text-slate-100 outline-none focus:border-neon-blue/50"
          />
          <button onClick={handleAdd} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neon-blue/10 border border-neon-blue/40 text-neon-blue">
            Crear
          </button>
        </div>
      )}

      {alertsForPair.length === 0 ? (
        <p className="text-[10px] text-slate-600">
          Sin alertas activas. Se revisan solo mientras tienes este par abierto — no hay notificaciones en segundo
          plano.
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {alertsForPair.map((a) => (
            <span
              key={a.id}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono border border-neon-gold/40 text-neon-gold bg-neon-gold/5"
            >
              {a.direction === "above" ? "▲" : "▼"} {a.targetPrice}
              <button onClick={() => removeAlert(a.id)} className="text-slate-500 hover:text-neon-red">
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
