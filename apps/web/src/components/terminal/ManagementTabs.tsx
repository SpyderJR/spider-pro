import { useState } from "react";
import type { ClosedTrade, PendingOrder, Position } from "../../lib/paperTrading/types";
import { computeUnrealizedPnl } from "../../lib/paperTrading/engine";
import { computeStats } from "../../lib/paperTrading/stats";
import { formatUsd, pricePrecision } from "../../lib/format";

type Tab = "positions" | "orders" | "history" | "stats";

interface Props {
  positions: Position[];
  orders: PendingOrder[];
  history: ClosedTrade[];
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

export function ManagementTabs({ positions, orders, history, balance, currentPrices, onClosePosition, onCancelOrder, onUpdateSlTp }: Props) {
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
  positions: Position[];
  currentPrices: Partial<Record<string, number>>;
  onClose: (id: string) => void;
  onUpdateSlTp: (id: string, sl: number | null, tp: number | null) => void;
}) {
  if (positions.length === 0) return <EmptyState text="No tienes posiciones abiertas." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs min-w-[720px]">
        <thead>
          <tr className="text-left text-slate-500 border-b border-void-border">
            <th className="py-2 pr-3">Par</th>
            <th className="py-2 pr-3">Lado</th>
            <th className="py-2 pr-3">Entrada</th>
            <th className="py-2 pr-3">Tamaño</th>
            <th className="py-2 pr-3">SL</th>
            <th className="py-2 pr-3">TP</th>
            <th className="py-2 pr-3">P&L</th>
            <th className="py-2 pr-3"></th>
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => {
            const price = currentPrices[p.pair];
            const pnl = price !== undefined ? computeUnrealizedPnl(p, price) : null;
            const precision = pricePrecision(p.entryPrice);
            return (
              <tr key={p.id} className="border-b border-void-border/50 last:border-0">
                <td className="py-2 pr-3 font-mono text-slate-200">{p.pair}</td>
                <td className={`py-2 pr-3 font-bold ${p.side === "buy" ? "text-neon-green" : "text-neon-red"}`}>
                  {p.side === "buy" ? "COMPRA" : "VENTA"}
                </td>
                <td className="py-2 pr-3 value-mono text-slate-300">{p.entryPrice.toFixed(precision)}</td>
                <td className="py-2 pr-3 value-mono text-slate-300">{p.quantity.toFixed(6)}</td>
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

function OrdersTab({ orders, onCancel }: { orders: PendingOrder[]; onCancel: (id: string) => void }) {
  if (orders.length === 0) return <EmptyState text="No tienes órdenes límite pendientes." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs min-w-[600px]">
        <thead>
          <tr className="text-left text-slate-500 border-b border-void-border">
            <th className="py-2 pr-3">Par</th>
            <th className="py-2 pr-3">Lado</th>
            <th className="py-2 pr-3">Precio límite</th>
            <th className="py-2 pr-3">Cantidad</th>
            <th className="py-2 pr-3"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-void-border/50 last:border-0">
              <td className="py-2 pr-3 font-mono text-slate-200">{o.pair}</td>
              <td className={`py-2 pr-3 font-bold ${o.side === "buy" ? "text-neon-green" : "text-neon-red"}`}>
                {o.side === "buy" ? "COMPRA" : "VENTA"}
              </td>
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

function HistoryTab({ history }: { history: ClosedTrade[] }) {
  const [filter, setFilter] = useState<"all" | "wins" | "losses">("all");
  const filtered = history.filter((t) => (filter === "all" ? true : filter === "wins" ? t.pnl > 0 : t.pnl <= 0));

  if (history.length === 0) return <EmptyState text="Todavía no cerraste ningún trade." />;

  return (
    <div>
      <div className="flex gap-1.5 mb-3">
        {(["all", "wins", "losses"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono border ${
              filter === f ? "border-neon-blue/50 text-neon-blue" : "border-void-border text-slate-500"
            }`}
          >
            {f === "all" ? "Todos" : f === "wins" ? "Ganadores" : "Perdedores"}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[720px]">
          <thead>
            <tr className="text-left text-slate-500 border-b border-void-border">
              <th className="py-2 pr-3">Fecha</th>
              <th className="py-2 pr-3">Par</th>
              <th className="py-2 pr-3">Lado</th>
              <th className="py-2 pr-3">Entrada</th>
              <th className="py-2 pr-3">Salida</th>
              <th className="py-2 pr-3">P&L</th>
              <th className="py-2 pr-3">Duración</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const durationMin = Math.round((t.closedAt - t.openedAt) / 60000);
              return (
                <tr key={t.id} className="border-b border-void-border/50 last:border-0">
                  <td className="py-2 pr-3 text-slate-400">{new Date(t.closedAt).toLocaleString("es-ES")}</td>
                  <td className="py-2 pr-3 font-mono text-slate-200">{t.pair}</td>
                  <td className={`py-2 pr-3 font-bold ${t.side === "buy" ? "text-neon-green" : "text-neon-red"}`}>
                    {t.side === "buy" ? "COMPRA" : "VENTA"}
                  </td>
                  <td className="py-2 pr-3 value-mono text-slate-300">{t.entryPrice.toFixed(pricePrecision(t.entryPrice))}</td>
                  <td className="py-2 pr-3 value-mono text-slate-300">{t.exitPrice.toFixed(pricePrecision(t.exitPrice))}</td>
                  <td className={`py-2 pr-3 value-mono font-semibold ${t.pnl >= 0 ? "text-neon-green" : "text-neon-red"}`}>
                    {formatUsd(t.pnl, 2)} ({t.pnlPercent >= 0 ? "+" : ""}
                    {t.pnlPercent.toFixed(2)}%)
                  </td>
                  <td className="py-2 pr-3 text-slate-500">{durationMin < 60 ? `${durationMin}m` : `${(durationMin / 60).toFixed(1)}h`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatsTab({ history, balance }: { history: ClosedTrade[]; balance: number }) {
  const initialBalance = balance - history.reduce((sum, t) => sum + t.pnl, 0);
  const stats = computeStats(history, initialBalance);

  if (history.length === 0) return <EmptyState text="Cierra tu primer trade para ver estadísticas." />;

  const curve = stats.balanceCurve;
  const minBal = Math.min(...curve.map((p) => p.balance));
  const maxBal = Math.max(...curve.map((p) => p.balance));
  const range = maxBal - minBal || 1;
  const points = curve
    .map((p, i) => `${(i / (curve.length - 1 || 1)) * 100},${100 - ((p.balance - minBal) / range) * 100}`)
    .join(" ");

  return (
    <div>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-24 mb-4">
        <polyline points={points.split(" ").map((p) => p.split(",").map(Number).join(",")).join(" ")} fill="none" stroke="#22c55e" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <Stat label="Balance" value={formatUsd(balance, 2)} />
        <Stat label="P&L total" value={formatUsd(stats.totalPnl, 2)} cls={stats.totalPnl >= 0 ? "text-neon-green" : "text-neon-red"} />
        <Stat label="Win rate" value={`${stats.winRate.toFixed(1)}%`} />
        <Stat label="Profit factor" value={stats.profitFactor === null ? "—" : stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2)} />
        <Stat label="Mejor trade" value={stats.bestTrade ? formatUsd(stats.bestTrade.pnl, 2) : "—"} cls="text-neon-green" />
        <Stat label="Peor trade" value={stats.worstTrade ? formatUsd(stats.worstTrade.pnl, 2) : "—"} cls="text-neon-red" />
        <Stat label="Racha actual" value={`${stats.currentStreak >= 0 ? "+" : ""}${stats.currentStreak}`} cls={stats.currentStreak >= 0 ? "text-neon-green" : "text-neon-red"} />
        <Stat label="Drawdown máximo" value={`${stats.maxDrawdownPercent.toFixed(1)}%`} cls="text-neon-red" />
      </div>
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
