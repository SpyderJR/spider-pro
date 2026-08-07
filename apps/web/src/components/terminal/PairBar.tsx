import type { Ticker24h } from "../../lib/binance/types";
import { formatUsd, formatPercent, pricePrecision } from "../../lib/format";
import { PairSearchBox } from "./PairSearchBox";

const QUICK_PAIRS = ["BTCUSDT", "TRXUSDT"];

export function PairBar({
  pair,
  onPairChange,
  ticker,
  connected,
  balance,
  dayPnl,
  lastTickUp,
}: {
  pair: string;
  onPairChange: (pair: string) => void;
  ticker: Ticker24h | null;
  connected: boolean;
  balance: number;
  dayPnl: number;
  lastTickUp: boolean | null;
}) {
  const price = ticker?.lastPrice ?? null;
  const changeUp = (ticker?.priceChangePercent ?? 0) >= 0;

  return (
    <div className="panel p-4 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 flex-wrap">
            {QUICK_PAIRS.map((p) => (
              <button
                key={p}
                onClick={() => onPairChange(p)}
                className={`px-3 py-1.5 rounded-lg text-sm font-mono border transition-colors ${
                  pair === p
                    ? "border-neon-green/50 text-neon-green bg-neon-green/5"
                    : "border-void-border text-slate-400 hover:border-slate-600"
                }`}
              >
                {p.replace("USDT", "/USDT")}
              </button>
            ))}
            {!QUICK_PAIRS.includes(pair) && (
              <span className="px-3 py-1.5 rounded-lg text-sm font-mono border border-neon-green/50 text-neon-green bg-neon-green/5">
                {pair.replace("USDT", "/USDT")}
              </span>
            )}
            <PairSearchBox onSelect={onPairChange} />
          </div>

          <div>
            <div
              className={`value-mono text-2xl font-bold transition-colors ${
                lastTickUp === null ? "text-white" : lastTickUp ? "text-neon-green" : "text-neon-red"
              }`}
            >
              {price !== null ? formatUsd(price, pricePrecision(price)) : "—"}
            </div>
            <div className={`value-mono text-xs ${changeUp ? "text-neon-green" : "text-neon-red"}`}>
              {ticker ? formatPercent(ticker.priceChangePercent) : "—"} (24h)
            </div>
          </div>

          <div className="hidden sm:flex gap-4 text-xs value-mono">
            <div>
              <div className="text-slate-500">Máx 24h</div>
              <div className="text-slate-300">{ticker ? formatUsd(ticker.highPrice, pricePrecision(ticker.highPrice)) : "—"}</div>
            </div>
            <div>
              <div className="text-slate-500">Mín 24h</div>
              <div className="text-slate-300">{ticker ? formatUsd(ticker.lowPrice, pricePrecision(ticker.lowPrice)) : "—"}</div>
            </div>
            <div>
              <div className="text-slate-500">Vol 24h</div>
              <div className="text-slate-300">{ticker ? ticker.volume.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "—"}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-500">BALANCE</div>
            <div className="value-mono text-sm text-white">{formatUsd(balance, 2)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-500">P&L DEL DÍA</div>
            <div className={`value-mono text-sm font-semibold ${dayPnl >= 0 ? "text-neon-green" : "text-neon-red"}`}>
              {dayPnl >= 0 ? "+" : ""}
              {formatUsd(dayPnl, 2)}
            </div>
          </div>
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-neon-green animate-pulse" : "bg-neon-red"}`} title={connected ? "Conectado" : "Reconectando…"} />
        </div>
      </div>
    </div>
  );
}
