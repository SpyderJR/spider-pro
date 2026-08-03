import { useState } from "react";
import type { FuturesClosedTrade, FuturesPendingOrder, FuturesPosition } from "../../lib/futures/types";
import { computeFuturesPnl } from "../../lib/futures/engine";
import { formatUsd, pricePrecision } from "../../lib/format";

type Tab = "positions" | "orders" | "history" | "stats";

interface Props {
  positions: FuturesPosition[];
  orders: FuturesPendingOrder[];
  history: FuturesClosedTrade[];
  balance: number;
  currentPrices: Partial<Record<string, number>>;
  onClosePosition: (id: string) => void;
  onCancelOrder: (id: string) => void;
  onUpdateSlTp: (id: string, stopLoss: number | null, takeProfit: number | null) => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "positions", label: "Posiciones" },
  { id: "orders", label: "Órdenes" },
  { id: "history", label: "Historial" },
  { id: "stats", label: "Estadísticas" },
];

const EXIT_LABEL: Record<string, string> = {
  manual: "MANUAL",
  stop_loss: "STOP LOSS",
  take_profit: "TAKE PROFIT",
  liquidation: "LIQUIDADO",
};

export function FuturesManagementTabs({ positions, orders, history, balance, currentPrices, onClosePosition, onCancelOrder, onUpdateSlTp }: Props) {
  const [tab, setTab] = useState<Tab>("positions");

  return (
    <div className="panel p-4">
      <div className="flex gap-2 mb-4 border-b border-void-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-xs font-mono border-b-2 -mb-px transition-colors ${
              tab === t.id ? "border-neon-green text-neon-green" : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {t.label}
            {t.id === "positions" && positions.length > 0 ? ` (${positions.length})` : ""}
            {t.id === "orders" && orders.length > 0 ? ` (${orders.length})` : ""}
          </button>
        ))}
      </div>

      {tab === "positions" && (
        <PositionsTab positions={positions} currentPrices={currentPrices} onClose={onClosePosition} onUpdateSlTp={onUpdateSlTp} />
      )}
      {tab === "orders" && <OrdersTab orders={orders} onCancel={onCancelOrder} />}
      {tab === "history" && <HistoryTab history={history} />}
      {tab === "stats" && <StatsTab history={history} balance={balance} />}
    </div>
  );
}

function PositionsTab({
  positions,
  currentPrices,
  onClose,
  onUpdateSlTp,
}: {
  positions: FuturesPosition[];
  currentPrices: Partial<Record<string, number>>;
  onClose: (id: string) => void;
  onUpdateSlTp: (id: string, sl: number | null, tp: number | null) => void;
}) {
  if (positions.length === 0) return <EmptyState text="No tenés posiciones de futuros abiertas." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs min-w-[860px]">
        <thead>
          <tr className="text-left text-slate-500 border-b border-void-border">
            <th className="py-2 pr-3">Par</th>
            <th className="py-2 pr-3">Lado</th>
            <th className="py-2 pr-3">Apalanc.</th>
            <th className="py-2 pr-3">Entrada</th>
            <th className="py-2 pr-3">Margen</th>
            <th className="py-2 pr-3">Liq.</th>
            <th className="py-2 pr-3">SL</th>
            <th className="py-2 pr-3">TP</th>
            <th className="py-2 pr-3">P&L</th>
            <th className="py-2 pr-3"></th>
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => {
            const price = currentPrices[p.pair];
            const pnl = price !== undefined ? computeFuturesPnl(p.side, p.entryPrice, price, p.quantity) : null;
            const precision = pricePrecision(p.entryPrice);
            return (
              <tr key={p.id} className="border-b border-void-border/50 last:border-0">
                <td className="py-2 pr-3 font-mono text-slate-200">{p.pair}</td>
                <td className={`py-2 pr-3 font-bold ${p.side === "long" ? "text-neon-green" : "text-neon-red"}`}>
                  {p.side === "long" ? "LONG" : "SHORT"}
                </td>
                <td className="py-2 pr-3 value-mono text-neon-gold">{p.leverage}x</td>
                <td className="py-2 pr-3 value-mono text-slate-300">{p.entryPrice.toFixed(precision)}</td>
                <td className="py-2 pr-3 value-mono text-slate-300">{formatUsd(p.margin, 2)}</td>
                <td className="py-2 pr-3 value-mono text-neon-red">{p.liquidationPrice.toFixed(precision)}</td>
                <td className="py-2 pr-3">
                  <SlTpInput value={p.stopLoss} onChange={(v) => onUpdateSlTp(p.id, v, p.takeProfit)} precision={precision} />
                </td>
                <td className="py-2 pr-3">
                  <SlTpInput value={p.takeProfit} onChange={(v) => onUpdateSlTp(p.id, p.stopLoss, v)} precision={precision} />
                </td>
                <td className={`py-2 pr-3 value-mono font-semibold ${pnl !== null && pnl >= 0 ? "text-neon-green" : "text-neon-red"}`}>
                  {pnl !== null ? formatUsd(pnl, 2) : "—"}
                </td>
                <td className="py-2 pr-3">
                  <button onClick={() => onClose(p.id)} className="px-2 py-1 rounded border border-neon-red/40 text-neon-red text-[10px] font-mono">
                    CERRAR
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SlTpInput({ value, onChange, precision }: { value: number | null; onChange: (v: number | null) => void; precision: number }) {
  const [draft, setDraft] = useState(value !== null ? value.toFixed(precision) : "");
  return (
    <input
      type="number"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => onChange(draft ? Number(draft) : null)}
      placeholder="—"
      className="w-24 bg-void-soft border border-void-border rounded px-1.5 py-1 value-mono text-slate-200 outline-none focus:border-neon-blue/50"
    />
  );
}

function OrdersTab({ orders, onCancel }: { orders: FuturesPendingOrder[]; onCancel: (id: string) => void }) {
  if (orders.length === 0) return <EmptyState text="No tenés órdenes límite de futuros pendientes." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs min-w-[640px]">
        <thead>
          <tr className="text-left text-slate-500 border-b border-void-border">
            <th className="py-2 pr-3">Par</th>
            <th className="py-2 pr-3">Lado</th>
            <th className="py-2 pr-3">Apalanc.</th>
            <th className="py-2 pr-3">Precio límite</th>
            <th className="py-2 pr-3">Cantidad</th>
            <th className="py-2 pr-3"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-void-border/50 last:border-0">
              <td className="py-2 pr-3 font-mono text-slate-200">{o.pair}</td>
              <td className={`py-2 pr-3 font-bold ${o.side === "long" ? "text-neon-green" : "text-neon-red"}`}>
                {o.side === "long" ? "LONG" : "SHORT"}
              </td>
              <td className="py-2 pr-3 value-mono text-neon-gold">{o.leverage}x</td>
              <td className="py-2 pr-3 value-mono text-slate-300">{o.limitPrice.toFixed(pricePrecision(o.limitPrice))}</td>
              <td className="py-2 pr-3 value-mono text-slate-300">{o.quantity.toFixed(6)}</td>
              <td className="py-2 pr-3">
                <button onClick={() => onCancel(o.id)} className="px-2 py-1 rounded border border-void-border text-slate-400 text-[10px] font-mono">
                  CANCELAR
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HistoryTab({ history }: { history: FuturesClosedTrade[] }) {
  const [filter, setFilter] = useState<"all" | "wins" | "losses" | "liquidations">("all");
  const filtered = history.filter((t) => {
    if (filter === "wins") return t.pnl > 0;
    if (filter === "losses") return t.pnl <= 0;
    if (filter === "liquidations") return t.exitReason === "liquidation";
    return true;
  });

  if (history.length === 0) return <EmptyState text="Todavía no cerraste ningún trade de futuros." />;

  return (
    <div>
      <div className="flex gap-1.5 mb-3">
        {(["all", "wins", "losses", "liquidations"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono border ${
              filter === f ? "border-neon-blue/50 text-neon-blue" : "border-void-border text-slate-500"
            }`}
          >
            {f === "all" ? "Todos" : f === "wins" ? "Ganadores" : f === "losses" ? "Perdedores" : "Liquidados"}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[820px]">
          <thead>
            <tr className="text-left text-slate-500 border-b border-void-border">
              <th className="py-2 pr-3">Fecha</th>
              <th className="py-2 pr-3">Par</th>
              <th className="py-2 pr-3">Lado</th>
              <th className="py-2 pr-3">Apalanc.</th>
              <th className="py-2 pr-3">P&L</th>
              <th className="py-2 pr-3">Funding</th>
              <th className="py-2 pr-3">Cierre</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-void-border/50 last:border-0">
                <td className="py-2 pr-3 text-slate-400">{new Date(t.closedAt).toLocaleString("es-ES")}</td>
                <td className="py-2 pr-3 font-mono text-slate-200">{t.pair}</td>
                <td className={`py-2 pr-3 font-bold ${t.side === "long" ? "text-neon-green" : "text-neon-red"}`}>
                  {t.side === "long" ? "LONG" : "SHORT"}
                </td>
                <td className="py-2 pr-3 value-mono text-neon-gold">{t.leverage}x</td>
                <td className={`py-2 pr-3 value-mono font-semibold ${t.pnl >= 0 ? "text-neon-green" : "text-neon-red"}`}>
                  {formatUsd(t.pnl, 2)} ({t.pnlPercent >= 0 ? "+" : ""}
                  {t.pnlPercent.toFixed(1)}%)
                </td>
                <td className="py-2 pr-3 value-mono text-slate-500">{formatUsd(t.fundingPaid, 2)}</td>
                <td className="py-2 pr-3">
                  <span className={`text-[10px] font-mono ${t.exitReason === "liquidation" ? "text-neon-red font-bold" : "text-slate-500"}`}>
                    {EXIT_LABEL[t.exitReason] ?? t.exitReason}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatsTab({ history, balance }: { history: FuturesClosedTrade[]; balance: number }) {
  if (history.length === 0) return <EmptyState text="Cerrá tu primer trade de futuros para ver estadísticas." />;

  const wins = history.filter((t) => t.pnl > 0);
  const liquidations = history.filter((t) => t.exitReason === "liquidation");
  const totalPnl = history.reduce((sum, t) => sum + t.pnl, 0);
  const totalFunding = history.reduce((sum, t) => sum + t.fundingPaid, 0);
  const winRate = (wins.length / history.length) * 100;
  const avgLeverage = history.reduce((sum, t) => sum + t.leverage, 0) / history.length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
      <Stat label="Balance" value={formatUsd(balance, 2)} />
      <Stat label="P&L total" value={formatUsd(totalPnl, 2)} cls={totalPnl >= 0 ? "text-neon-green" : "text-neon-red"} />
      <Stat label="Win rate" value={`${winRate.toFixed(1)}%`} />
      <Stat label="Apalancamiento promedio" value={`${avgLeverage.toFixed(1)}x`} />
      <Stat label="Operaciones" value={String(history.length)} />
      <Stat label="Liquidaciones" value={String(liquidations.length)} cls={liquidations.length > 0 ? "text-neon-red" : undefined} />
      <Stat label="Funding pagado" value={formatUsd(totalFunding, 2)} cls={totalFunding >= 0 ? "text-neon-red" : "text-neon-green"} />
    </div>
  );
}

function Stat({ label, value, cls }: { label: string; value: string; cls?: string }) {
  return (
    <div className="bg-void-soft rounded-lg p-3">
      <div className="text-[10px] font-mono text-slate-500 mb-1">{label.toUpperCase()}</div>
      <div className={`value-mono text-sm font-semibold ${cls ?? "text-slate-200"}`}>{value}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="text-center text-slate-500 text-sm py-8">{text}</div>;
}
