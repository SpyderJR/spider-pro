import { useMemo } from "react";
import type { Timeframe } from "@spider/types";
import { rsi, macd, sma, detectCross, compositeSignal, type CompositeSignal } from "@spider/indicators";
import { useMultiKlines } from "../../hooks/useMultiKlines";
import type { SelectedToken } from "../../store/indicatorConfigStore";

const CONFLUENCE_TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1d"];

const SIGNAL_STYLE: Record<CompositeSignal, { label: string; cls: string; dot: string }> = {
  bullish: { label: "ALCISTA", cls: "text-neon-green", dot: "bg-neon-green" },
  neutral: { label: "NEUTRAL", cls: "text-neon-gold", dot: "bg-neon-gold" },
  bearish: { label: "BAJISTA", cls: "text-neon-red", dot: "bg-neon-red" },
};

export function MultiTimeframeConfluence({ token }: { token: SelectedToken }) {
  const queries = useMultiKlines(token.symbol, CONFLUENCE_TIMEFRAMES, 120, token.coingeckoId);

  const rows = useMemo(() => {
    return CONFLUENCE_TIMEFRAMES.map((tf, i) => {
      const data = queries[i]?.data;
      if (!data || data.candles.length < 30) return { tf, ready: false as const };

      const closes = data.candles.map((c) => c.close);
      const rsiValues = rsi(closes, 14);
      const macdValues = macd(closes, 12, 26, 9);
      const sma20 = sma(closes, 20);
      const sma50 = sma(closes, 50);
      const cross = detectCross(sma20, sma50);

      const lastRsi = rsiValues.at(-1) ?? null;
      const lastMacd = macdValues.at(-1) ?? null;
      const lastPrice = closes.at(-1) ?? null;

      const signal = compositeSignal({
        rsi: lastRsi,
        macdHistogram: lastMacd?.histogram ?? null,
        price: lastPrice,
        bollingerUpper: null,
        bollingerLower: null,
      });

      return { tf, ready: true as const, rsi: lastRsi, macdHist: lastMacd?.histogram ?? null, cross, signal };
    });
  }, [queries]);

  const readyRows = rows.filter((r) => r.ready) as Array<Extract<(typeof rows)[number], { ready: true }>>;
  const bullishCount = readyRows.filter((r) => r.signal === "bullish").length;
  const bearishCount = readyRows.filter((r) => r.signal === "bearish").length;
  const total = readyRows.length;

  const alignment: CompositeSignal =
    bullishCount > total / 2 ? "bullish" : bearishCount > total / 2 ? "bearish" : "neutral";

  return (
    <div>
      {total > 0 && (
        <div className={`panel border p-4 mb-5 flex items-center justify-between ${
          alignment === "bullish"
            ? "border-neon-green/40 bg-neon-green/5"
            : alignment === "bearish"
              ? "border-neon-red/40 bg-neon-red/5"
              : "border-neon-gold/40 bg-neon-gold/5"
        }`}>
          <div>
            <div className="text-xs font-mono tracking-widest text-slate-500 mb-1">
              ALINEACIÓN ENTRE TEMPORALIDADES
            </div>
            <div className={`text-lg font-bold ${SIGNAL_STYLE[alignment].cls}`}>
              {bullishCount > bearishCount ? bullishCount : bearishCount}/{total} en {SIGNAL_STYLE[alignment].label.toLowerCase()}
            </div>
          </div>
          <div className="flex gap-1.5">
            {readyRows.map((r) => (
              <span key={r.tf} className={`w-2.5 h-2.5 rounded-full ${SIGNAL_STYLE[r.signal].dot}`} title={r.tf} />
            ))}
          </div>
        </div>
      )}

      <div className="panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-void-border bg-void-soft/50">
              <th className="py-2.5 px-4">Temporalidad</th>
              <th className="py-2.5 px-4">RSI</th>
              <th className="py-2.5 px-4">MACD Hist.</th>
              <th className="py-2.5 px-4">Cruce SMA20/50</th>
              <th className="py-2.5 px-4 text-right">Señal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.tf} className="border-b border-void-border/50 last:border-0">
                <td className="py-3 px-4 font-mono text-slate-200">{row.tf}</td>
                {row.ready ? (
                  <>
                    <td
                      className={`py-3 px-4 value-mono ${
                        row.rsi === null ? "text-slate-600" : row.rsi > 70 ? "text-neon-red" : row.rsi < 30 ? "text-neon-green" : "text-slate-300"
                      }`}
                    >
                      {row.rsi !== null ? row.rsi.toFixed(1) : "—"}
                    </td>
                    <td
                      className={`py-3 px-4 value-mono ${
                        row.macdHist === null ? "text-slate-600" : row.macdHist >= 0 ? "text-neon-green" : "text-neon-red"
                      }`}
                    >
                      {row.macdHist !== null ? row.macdHist.toFixed(row.macdHist < 1 ? 5 : 2) : "—"}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {row.cross === "golden_cross" ? "Golden Cross" : row.cross === "death_cross" ? "Death Cross" : "—"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`badge ${SIGNAL_STYLE[row.signal].cls} border-current/30`}>
                        {SIGNAL_STYLE[row.signal].label}
                      </span>
                    </td>
                  </>
                ) : (
                  <td colSpan={4} className="py-3 px-4 text-slate-600 text-xs">
                    Cargando…
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 mt-4">
        Cuantas más temporalidades cortas y largas coincidan en la misma dirección, mayor confluencia —
        una señal de 5m que contradice la de 1h suele ser más frágil que una alineada con la tendencia
        superior.
      </p>
    </div>
  );
}
