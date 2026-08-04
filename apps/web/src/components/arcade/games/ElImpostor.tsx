import { useEffect, useMemo, useRef, useState } from "react";
import type { BinanceCandle } from "../../../lib/binance/types";
import { fetchCachedCandles, randomHistoricalWindow } from "../../../lib/arcade/historicalCandles";
import { generateRandomWalkCandles } from "../../../lib/arcade/randomWalk";
import { ArcadeChart } from "../ArcadeChart";
import { GameHeader } from "../GameHeader";
import { GameResultScreen } from "../GameResultScreen";
import { HowToPlayBox } from "../HowToPlayBox";

const TOTAL_ROUNDS = 6;
const POOL_SIZE = 9;
const SPAN_MS = 40 * 60 * 60 * 1000;
const TIME_LIMIT_MS = 12000;

interface Props {
  onExit: () => void;
  onFinish: (result: { scorePercent: number; streak: number }) => void;
}

interface RoundPanel {
  candles: BinanceCandle[];
  isFake: boolean;
}

export function ElImpostor({ onExit, onFinish }: Props) {
  const [sessionKey, setSessionKey] = useState(0);
  const [pool, setPool] = useState<BinanceCandle[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    async function load() {
      const results: BinanceCandle[][] = [];
      for (let i = 0; i < POOL_SIZE; i++) {
        for (let attempt = 0; attempt < 3; attempt++) {
          const { startTime, endTime } = randomHistoricalWindow(SPAN_MS);
          try {
            const c = await fetchCachedCandles("BTCUSDT", "1h", startTime, endTime);
            if (c.length >= 20) {
              results.push(c);
              break;
            }
          } catch {
            // try again
          }
        }
      }
      if (!cancelled) {
        setPool(results);
        setLoading(false);
        if (results.length < 3) setError("No se pudo cargar suficiente histórico. Prueba de nuevo.");
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [sessionKey]);

  const [round, setRound] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [panels, setPanels] = useState<RoundPanel[] | null>(null);
  const [fakeSlot, setFakeSlot] = useState(0);
  const [resolved, setResolved] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [timeLeftMs, setTimeLeftMs] = useState(TIME_LIMIT_MS);
  const [finished, setFinished] = useState(false);
  const [reported, setReported] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (pool.length < 3 || panels || finished) return;
    const indexes = [...pool.keys()];
    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexes[i], indexes[j]] = [indexes[j]!, indexes[i]!];
    }
    const [a, b, c] = indexes;
    const real1 = pool[a!]!;
    const real2 = pool[b!]!;
    const fake = generateRandomWalkCandles(pool[c!]!);
    const slot = Math.floor(Math.random() * 3);
    const built: RoundPanel[] = [
      { candles: real1, isFake: false },
      { candles: real2, isFake: false },
    ];
    built.splice(slot, 0, { candles: fake, isFake: true });
    setPanels(built.slice(0, 3));
    setFakeSlot(slot);
    setResolved(null);
    setTimeLeftMs(TIME_LIMIT_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, panels, finished, round]);

  useEffect(() => {
    if (!panels || resolved) return;
    timerRef.current = setInterval(() => {
      setTimeLeftMs((t) => {
        if (t <= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          setResolved("timeout");
          setStreak(0);
          setAttempts((a) => a + 1);
          return 0;
        }
        return t - 100;
      });
    }, 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [panels, resolved]);

  function pick(slot: number) {
    if (!panels || resolved) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const isCorrect = slot === fakeSlot;
    setResolved(isCorrect ? "correct" : "wrong");
    setAttempts((a) => a + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
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
    setPanels(null);
    setResolved(null);
    if (isLast) {
      setFinished(true);
      return;
    }
    setRound((r) => r + 1);
  }

  const scorePercent = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

  if (finished) {
    if (!reported) {
      setReported(true);
      onFinish({ scorePercent, streak: maxStreak });
    }
    return (
      <GameResultScreen
        scorePercent={scorePercent}
        headline="El Impostor completado"
        detail={`${correct} de ${TOTAL_ROUNDS} rondas · racha máxima ${maxStreak}`}
        onRetry={() => {
          setSessionKey((k) => k + 1);
          setPool([]);
          setRound(0);
          setAttempts(0);
          setCorrect(0);
          setStreak(0);
          setMaxStreak(0);
          setPanels(null);
          setResolved(null);
          setFinished(false);
          setReported(false);
        }}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="panel p-5">
      <GameHeader
        title="El Impostor"
        onExit={onExit}
        right={<span className="text-xs font-mono text-slate-400">RONDA {round + 1}/{TOTAL_ROUNDS} · ACIERTOS {correct}</span>}
      />

      {round === 0 && !resolved && (
        <HowToPlayBox
          steps={[
            "Vas a ver 3 gráficos lado a lado. Dos son tramos reales de BTC, uno es 100% ruido aleatorio generado por computadora.",
            "Haz clic en el gráfico que crees que es el impostor antes de que se acabe el tiempo.",
            "6 rondas en total — sin fechas ni precios visibles, solo la forma del gráfico cuenta.",
          ]}
          lesson="Te enseña a distinguir estructura real de mercado (tendencias, momentum) del puro ruido — clave para no ver patrones donde no los hay."
        />
      )}

      {loading && <div className="text-sm text-slate-500 py-16 text-center">Cargando histórico de mercado…</div>}
      {error && <div className="text-sm text-neon-red py-16 text-center">{error}</div>}

      {!loading && !error && panels && (
        <>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-300">Uno de estos 3 gráficos es 100% ruido aleatorio. Encontralo.</p>
            <div className="h-1.5 w-24 bg-void-soft rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${timeLeftMs / TIME_LIMIT_MS < 0.3 ? "bg-neon-red" : "bg-neon-gold"}`}
                style={{ width: `${(timeLeftMs / TIME_LIMIT_MS) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {panels.map((p, i) => (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={!!resolved}
                className={`rounded-lg border p-2 text-left transition-colors ${
                  resolved
                    ? p.isFake
                      ? "border-neon-red/60 bg-neon-red/5"
                      : "border-void-border opacity-60"
                    : "border-void-border hover:border-neon-blue/50"
                }`}
              >
                <div className="text-[10px] font-mono text-slate-600 mb-1">GRÁFICO {i + 1}</div>
                <ArcadeChart candles={p.candles} height={160} hideScales disableInteraction />
                {resolved && p.isFake && <div className="text-[11px] font-mono text-neon-red mt-1">IMPOSTOR (aleatorio)</div>}
              </button>
            ))}
          </div>

          {resolved && (
            <div className="mt-4 text-center">
              <div className={`text-lg font-bold mb-1 ${resolved === "correct" ? "text-neon-green" : "text-neon-red"}`}>
                {resolved === "correct" ? "¡Correcto!" : resolved === "timeout" ? "Se acabó el tiempo" : "Incorrecto"}
              </div>
              <button onClick={next} className="px-5 py-2 rounded-lg text-sm font-mono border border-neon-blue/40 text-neon-blue">
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
