import { useMemo, useState } from "react";
import { ArcadeChart, type ArcadePriceLine } from "../ArcadeChart";
import { GameHeader } from "../GameHeader";
import { GameResultScreen } from "../GameResultScreen";
import { useRandomHistoricalCandles } from "../../../hooks/useRandomHistoricalCandles";
import { detectFractals } from "../../../lib/fractals";
import { HowToPlayBox } from "../HowToPlayBox";

const VISIBLE = 30;
const REVEAL = 20;
const TOTAL_ROUNDS = 5;

interface Props {
  onExit: () => void;
  onFinish: (result: { scorePercent: number; streak: number }) => void;
}

type Side = "long" | "short";

function roundScore(entryPrice: number, slPrice: number, side: Side, structuralMatch: boolean, hit: boolean, endedInProfit: boolean) {
  const riskPercent = (Math.abs(entryPrice - slPrice) / entryPrice) * 100;
  let score = 60;
  let note = "";
  if (riskPercent < 0.3) {
    score -= 30;
    note = "Muy ajustado: quedó dentro del ruido normal del mercado.";
  } else if (riskPercent > 8) {
    score -= 30;
    note = "Demasiado amplio: arriesgas mucho más de lo necesario.";
  } else {
    note = "Distancia razonable respecto al precio de entrada.";
  }
  if (structuralMatch) {
    score += 25;
    note += " Coincide con un soporte/resistencia estructural (fractal) — excelente colocación técnica.";
  }
  if (hit) {
    score -= 10;
    note += " El SL se activó: cumplió su función y limitó la pérdida.";
  } else if (endedInProfit) {
    score += 15;
    note += " La operación sobrevivió y cerró en ganancia.";
  } else {
    note += " La operación sobrevivió pero cerró en pérdida no realizada.";
  }
  return { score: Math.max(0, Math.min(100, Math.round(score))), riskPercent, note };
}

export function StopLossPerfecto({ onExit, onFinish }: Props) {
  const [sessionKey, setSessionKey] = useState(0);
  const { candles, loading, error } = useRandomHistoricalCandles({
    interval: "1h",
    spanMs: (VISIBLE + REVEAL) * 60 * 60 * 1000,
    minCandles: VISIBLE + REVEAL,
    refreshKey: sessionKey,
  });

  const [round, setRound] = useState(0);
  const [side, setSide] = useState<Side>("long");
  const [slIndex, setSlIndex] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [roundResult, setRoundResult] = useState<{ score: number; riskPercent: number; note: string } | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [reported, setReported] = useState(false);

  const visibleCandles = useMemo(() => candles.slice(0, VISIBLE), [candles]);
  const entryPrice = visibleCandles.at(-1)?.close ?? 0;
  const fractals = useMemo(() => detectFractals(visibleCandles, 2), [visibleCandles]);

  const displayCandles = confirmed ? candles.slice(0, VISIBLE + REVEAL) : visibleCandles;

  const slPrice = useMemo(() => {
    if (slIndex === null) return null;
    const c = visibleCandles[slIndex];
    if (!c) return null;
    return side === "long" ? c.low : c.high;
  }, [slIndex, visibleCandles, side]);

  const slValid = slPrice !== null && (side === "long" ? slPrice < entryPrice : slPrice > entryPrice);

  function pickSl(index: number) {
    if (confirmed || index >= VISIBLE) return;
    setSlIndex(index);
  }

  function confirm() {
    if (!slValid || slPrice === null || slIndex === null) return;

    const structuralMatch = fractals.some((f) => {
      const wantedType = side === "long" ? "bullish" : "bearish";
      if (f.type !== wantedType) return false;
      return Math.abs(f.price - slPrice) / slPrice < 0.01;
    });

    const revealCandles = candles.slice(VISIBLE, VISIBLE + REVEAL);
    const hit = revealCandles.some((c) => (side === "long" ? c.low <= slPrice : c.high >= slPrice));
    const finalClose = revealCandles.at(-1)?.close ?? entryPrice;
    const endedInProfit = hit ? false : side === "long" ? finalClose > entryPrice : finalClose < entryPrice;

    const result = roundScore(entryPrice, slPrice, side, structuralMatch, hit, endedInProfit);
    setRoundResult(result);
    setConfirmed(true);
    setScores((s) => [...s, result.score]);
    if (result.score >= 70) {
      setStreak((s) => {
        const next = s + 1;
        setMaxStreak((m) => Math.max(m, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  }

  function next() {
    const isLast = round + 1 >= TOTAL_ROUNDS;
    setConfirmed(false);
    setRoundResult(null);
    setSlIndex(null);
    if (isLast) {
      setFinished(true);
      return;
    }
    setSide(Math.random() < 0.5 ? "long" : "short");
    setRound((r) => r + 1);
  }

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  if (finished) {
    if (!reported) {
      setReported(true);
      onFinish({ scorePercent: avgScore, streak: maxStreak });
    }
    return (
      <GameResultScreen
        scorePercent={avgScore}
        headline="Stop Loss Perfecto completado"
        detail={`Puntaje promedio en ${TOTAL_ROUNDS} operaciones · racha máxima ${maxStreak} rondas ≥70%`}
        onRetry={() => {
          setSessionKey((k) => k + 1);
          setRound(0);
          setSide(Math.random() < 0.5 ? "long" : "short");
          setSlIndex(null);
          setConfirmed(false);
          setRoundResult(null);
          setScores([]);
          setStreak(0);
          setMaxStreak(0);
          setFinished(false);
          setReported(false);
        }}
        onExit={onExit}
      />
    );
  }

  const priceLines: ArcadePriceLine[] = [{ price: entryPrice, color: "#3ba8ff", title: `ENTRADA ${side === "long" ? "▲" : "▼"}` }];
  if (slPrice !== null) priceLines.push({ price: slPrice, color: "#ef4444", title: "SL", style: 2 });

  return (
    <div className="panel p-5">
      <GameHeader
        title="Stop Loss Perfecto"
        onExit={onExit}
        right={<span className="text-xs font-mono text-slate-400">RONDA {round + 1}/{TOTAL_ROUNDS}</span>}
      />

      {round === 0 && !confirmed && (
        <HowToPlayBox
          steps={[
            "Se te da una entrada simulada (compra o venta) al cierre de la última vela visible.",
            "Haz clic en la vela donde colocarías tu stop loss — se marca en el precio bajo (long) o alto (short) de esa vela.",
            "Al confirmar se revelan las próximas 20 velas y te puntuamos 0-100 según distancia, confluencia con estructura y resultado real.",
          ]}
          lesson="Practica la colocación técnica de un stop loss — ni tan ajustado que te saque el ruido normal, ni tan lejos que arriesgues de más."
        />
      )}

      {loading && <div className="text-sm text-slate-500 py-16 text-center">Cargando histórico de mercado…</div>}
      {error && <div className="text-sm text-neon-red py-16 text-center">{error}</div>}

      {!loading && !error && (
        <>
          <p className="text-sm text-slate-300 mb-2">
            Entrada simulada en <span className={side === "long" ? "text-neon-green" : "text-neon-red"}>{side === "long" ? "COMPRA (long)" : "VENTA (short)"}</span> al cierre de la última vela.
            Haz clic en la vela donde colocarías el Stop Loss.
          </p>

          <ArcadeChart candles={displayCandles} priceLines={priceLines} onCandleClick={confirmed ? undefined : pickSl} height={340} />

          {!confirmed && (
            <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="text-xs font-mono text-slate-400">
                {slPrice !== null ? (
                  <>
                    SL: <span className="text-white">${slPrice.toFixed(4)}</span> · Riesgo:{" "}
                    <span className={slValid ? "text-neon-gold" : "text-neon-red"}>
                      {((Math.abs(entryPrice - slPrice) / entryPrice) * 100).toFixed(2)}%
                    </span>
                    {!slValid && <span className="text-neon-red"> — inválido para {side === "long" ? "compra" : "venta"}</span>}
                  </>
                ) : (
                  "Elige una vela para fijar el SL"
                )}
              </div>
              <button
                onClick={confirm}
                disabled={!slValid}
                className="px-5 py-2 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green disabled:opacity-30"
              >
                Confirmar SL
              </button>
            </div>
          )}

          {confirmed && roundResult && (
            <div className="mt-4 text-center">
              <div className={`text-lg font-bold mb-1 ${roundResult.score >= 70 ? "text-neon-green" : "text-neon-gold"}`}>
                {roundResult.score}/100
              </div>
              <p className="text-xs text-slate-400 mb-3 max-w-lg mx-auto">{roundResult.note}</p>
              <button onClick={next} className="px-5 py-2 rounded-lg text-sm font-mono border border-neon-blue/40 text-neon-blue">
                Siguiente operación →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
