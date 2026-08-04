import { useEffect, useMemo, useRef, useState } from "react";
import { ArcadeChart, type ArcadeMarker } from "../ArcadeChart";
import { GameHeader } from "../GameHeader";
import { GameResultScreen } from "../GameResultScreen";
import { useRandomHistoricalCandles } from "../../../hooks/useRandomHistoricalCandles";
import { detectFractals, type FractalPoint } from "../../../lib/fractals";
import { detectBOS, type BosPoint } from "../../../lib/arcade/bos";
import { useArcadeStore } from "../../../store/arcadeStore";
import { HowToPlayBox } from "../HowToPlayBox";

const TOTAL_ROUNDS = 8;
const WINDOW_RADIUS = 14;
const START_TIME_MS = 10000;
const MIN_TIME_MS = 4500;

interface Target {
  index: number;
  type: "bullish" | "bearish";
}

interface Props {
  onExit: () => void;
  onFinish: (result: { scorePercent: number; streak: number }) => void;
}

export function CazaElFractal({ onExit, onFinish }: Props) {
  const bosUnlocked = useArcadeStore((s) => s.gameStats["caza-el-fractal"].bestScorePercent > 0);
  const [mode, setMode] = useState<"fractal" | "bos">("fractal");
  const [sessionKey, setSessionKey] = useState(0);
  const { candles, loading, error } = useRandomHistoricalCandles({
    interval: "4h",
    spanMs: 220 * 4 * 60 * 60 * 1000,
    minCandles: 200,
    refreshKey: `${sessionKey}-${mode}`,
  });

  const fractals = useMemo(() => detectFractals(candles, 2), [candles]);
  const decoys = useMemo(() => {
    const weak = detectFractals(candles, 1);
    const realIndexes = new Set(fractals.map((f) => f.index));
    return weak.filter((f) => !realIndexes.has(f.index));
  }, [candles, fractals]);
  const bosPoints = useMemo(() => detectBOS(candles, fractals), [candles, fractals]);

  const targets: Target[] = useMemo(() => {
    if (mode === "bos") return bosPoints.filter((b) => b.index > WINDOW_RADIUS && b.index < candles.length - WINDOW_RADIUS);
    return fractals.filter((f) => f.index > WINDOW_RADIUS && f.index < candles.length - WINDOW_RADIUS);
  }, [mode, bosPoints, fractals, candles.length]);

  const [round, setRound] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [current, setCurrent] = useState<Target | null>(null);
  const [resolved, setResolved] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [timeLeftMs, setTimeLeftMs] = useState(START_TIME_MS);
  const [finished, setFinished] = useState(false);
  const [reported, setReported] = useState(false);
  const usedIndexes = useRef(new Set<number>());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const timeLimit = Math.max(MIN_TIME_MS, START_TIME_MS - round * 700);

  useEffect(() => {
    if (targets.length === 0 || current || finished) return;
    const available = targets.filter((t) => !usedIndexes.current.has(t.index));
    const pool = available.length > 0 ? available : targets;
    const pick = pool[Math.floor(Math.random() * pool.length)]!;
    usedIndexes.current.add(pick.index);
    setCurrent(pick);
    setResolved(null);
    setTimeLeftMs(timeLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets, current, finished, round]);

  useEffect(() => {
    if (!current || resolved) return;
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
  }, [current, resolved]);

  const visibleCandles = useMemo(() => {
    if (!current) return [];
    return candles.slice(Math.max(0, current.index - WINDOW_RADIUS), current.index + WINDOW_RADIUS);
  }, [candles, current]);

  const offset = current ? Math.max(0, current.index - WINDOW_RADIUS) : 0;

  const revealMarkers: ArcadeMarker[] = useMemo(() => {
    if (!current || !resolved) return [];
    return [
      {
        index: current.index - offset,
        color: current.type === "bullish" ? "#22c55e" : "#ef4444",
        shape: current.type === "bullish" ? "arrowUp" : "arrowDown",
        position: current.type === "bullish" ? "belowBar" : "aboveBar",
        text: mode === "bos" ? "BOS" : "",
      },
    ];
  }, [current, resolved, offset, mode]);

  function handleClick(localIndex: number) {
    if (!current || resolved) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const globalIndex = localIndex + offset;
    const isCorrect = globalIndex === current.index;
    const isTrap = mode === "fractal" && decoys.some((d) => d.index === globalIndex);

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
      void isTrap;
    }
  }

  function next() {
    const isLast = round + 1 >= TOTAL_ROUNDS;
    setCurrent(null);
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
        headline={mode === "bos" ? "Modo Caza el BOS completado" : "Caza el Fractal completado"}
        detail={`${correct} de ${TOTAL_ROUNDS} rondas · racha máxima ${maxStreak}`}
        onRetry={() => {
          setSessionKey((k) => k + 1);
          usedIndexes.current.clear();
          setRound(0);
          setAttempts(0);
          setCorrect(0);
          setStreak(0);
          setMaxStreak(0);
          setCurrent(null);
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
        title={mode === "bos" ? "Caza el BOS" : "Caza el Fractal"}
        onExit={onExit}
        right={<span className="text-xs font-mono text-slate-400">RONDA {round + 1}/{TOTAL_ROUNDS} · ACIERTOS {correct}</span>}
      />

      {bosUnlocked && (
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => {
              setMode("fractal");
              usedIndexes.current.clear();
              setCurrent(null);
            }}
            className={`text-[11px] font-mono px-2.5 py-1 rounded-md border ${mode === "fractal" ? "border-neon-green/50 text-neon-green" : "border-void-border text-slate-500"}`}
          >
            FRACTALES
          </button>
          <button
            onClick={() => {
              setMode("bos");
              usedIndexes.current.clear();
              setCurrent(null);
            }}
            className={`text-[11px] font-mono px-2.5 py-1 rounded-md border ${mode === "bos" ? "border-neon-blue/50 text-neon-blue" : "border-void-border text-slate-500"}`}
          >
            🔓 BOS
          </button>
        </div>
      )}

      {round === 0 && !resolved && (
        <HowToPlayBox
          steps={[
            "Se muestra un tramo de gráfico ya cerrado. Haz clic en la vela que forma un fractal confirmado (alcista o bajista) antes de que se acabe el tiempo.",
            "Cuidado: hay velas 'trampa' que parecen extremos locales pero no cumplen la regla de 5 velas de un fractal real.",
            "El tiempo disponible se reduce en cada ronda — 8 rondas en total.",
          ]}
          lesson="Afila tu ojo para reconocer fractales de Bill Williams en tiempo real, la base de la lectura de estructura de mercado."
        />
      )}

      {loading && <div className="text-sm text-slate-500 py-16 text-center">Cargando histórico de mercado…</div>}
      {error && <div className="text-sm text-neon-red py-16 text-center">{error}</div>}

      {!loading && !error && current && (
        <>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-slate-300">
              Encuentra el {mode === "bos" ? "BOS" : "fractal"}{" "}
              <span className={current.type === "bullish" ? "text-neon-green" : "text-neon-red"}>
                {current.type === "bullish" ? "ALCISTA" : "BAJISTA"}
              </span>{" "}
              haciendo clic en la vela correcta.
            </p>
            <div className="h-1.5 w-24 bg-void-soft rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${timeLeftMs / timeLimit < 0.3 ? "bg-neon-red" : "bg-neon-gold"}`}
                style={{ width: `${(timeLeftMs / timeLimit) * 100}%` }}
              />
            </div>
          </div>

          <ArcadeChart candles={visibleCandles} markers={revealMarkers} onCandleClick={resolved ? undefined : handleClick} height={320} />

          {resolved && (
            <div className="mt-4 text-center">
              <div className={`text-lg font-bold mb-1 ${resolved === "correct" ? "text-neon-green" : "text-neon-red"}`}>
                {resolved === "correct" ? "¡Correcto!" : resolved === "timeout" ? "Se acabó el tiempo" : "Incorrecto"}
              </div>
              <p className="text-xs text-slate-500 mb-3">
                {mode === "bos"
                  ? "El BOS marcado es el cierre que rompió la última estructura confirmada."
                  : "El fractal marcado necesita 2 velas a cada lado más extremas que la central."}
              </p>
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
