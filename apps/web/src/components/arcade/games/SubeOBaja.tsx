import { useMemo, useState } from "react";
import { ArcadeChart } from "../ArcadeChart";
import { GameHeader } from "../GameHeader";
import { GameResultScreen } from "../GameResultScreen";
import { HowToPlayBox } from "../HowToPlayBox";
import { useRandomHistoricalCandles } from "../../../hooks/useRandomHistoricalCandles";

const VISIBLE_START = 30;
const TOTAL_ROUNDS = 20;
const START_LIVES = 3;

interface Props {
  onExit: () => void;
  onFinish: (result: { scorePercent: number; streak: number }) => void;
}

export function SubeOBaja({ onExit, onFinish }: Props) {
  const [sessionKey, setSessionKey] = useState(0);
  const { candles, loading, error } = useRandomHistoricalCandles({
    interval: "1h",
    spanMs: (VISIBLE_START + TOTAL_ROUNDS) * 60 * 60 * 1000,
    minCandles: VISIBLE_START + TOTAL_ROUNDS,
    refreshKey: sessionKey,
  });

  const [round, setRound] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [lastResult, setLastResult] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);
  const [reported, setReported] = useState(false);

  const visibleCandles = useMemo(() => candles.slice(0, VISIBLE_START + round), [candles, round]);
  const nextCandle = candles[VISIBLE_START + round];

  function guess(direction: "up" | "down") {
    if (!nextCandle || lastResult !== null) return;
    const actualUp = nextCandle.close >= nextCandle.open;
    const isCorrect = (direction === "up") === actualUp;

    setLastResult(isCorrect ? "correct" : "wrong");
    setAttempts((a) => a + 1);
    if (isCorrect) {
      const multiplier = Math.min(streak + 1, 5);
      setPoints((p) => p + 10 * multiplier);
      setCorrect((c) => c + 1);
      setStreak((s) => {
        const next = s + 1;
        setMaxStreak((m) => Math.max(m, next));
        return next;
      });
    } else {
      setStreak(0);
      setLives((l) => l - 1);
    }
  }

  function next() {
    const willEnd = lives <= 0 || round + 1 >= TOTAL_ROUNDS;
    setLastResult(null);
    if (willEnd) {
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
        headline={lives <= 0 ? "Te quedaste sin vidas" : "¡Completaste las 20 rondas!"}
        detail={`${correct} de ${attempts} predicciones correctas · racha máxima ${maxStreak} · ${points} puntos`}
        onRetry={() => {
          setSessionKey((k) => k + 1);
          setRound(0);
          setAttempts(0);
          setLives(START_LIVES);
          setCorrect(0);
          setStreak(0);
          setMaxStreak(0);
          setPoints(0);
          setLastResult(null);
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
        title="Sube o Baja"
        onExit={onExit}
        right={
          <span className="text-xs font-mono text-slate-400">
            RONDA {round + 1}/{TOTAL_ROUNDS} · {"❤️".repeat(lives)} · {points} PTS
          </span>
        }
      />

      {round === 0 && lastResult === null && (
        <HowToPlayBox
          steps={[
            "Mira el gráfico y predice si la PRÓXIMA vela va a cerrar arriba o abajo del cierre actual.",
            "Tienes 3 vidas — cada error te quita una. El juego termina a las 20 rondas o cuando te quedas sin vidas.",
            "Encadenar aciertos activa un multiplicador de puntos por racha.",
          ]}
          lesson="Te entrena a leer el momentum y el contexto de las últimas velas antes de que el movimiento se confirme."
        />
      )}

      {loading && <div className="text-sm text-slate-500 py-16 text-center">Cargando histórico de mercado…</div>}
      {error && <div className="text-sm text-neon-red py-16 text-center">{error}</div>}

      {!loading && !error && (
        <>
          <ArcadeChart candles={visibleCandles} height={320} disableInteraction />

          <div className="mt-4 flex items-center justify-center gap-3">
            {lastResult === null ? (
              <>
                <button
                  onClick={() => guess("down")}
                  className="px-6 py-3 rounded-lg text-sm font-bold bg-neon-red/10 border border-neon-red/40 text-neon-red"
                >
                  ▼ Baja
                </button>
                <button
                  onClick={() => guess("up")}
                  className="px-6 py-3 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green"
                >
                  ▲ Sube
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className={`text-lg font-bold mb-2 ${lastResult === "correct" ? "text-neon-green" : "text-neon-red"}`}>
                  {lastResult === "correct" ? "¡Correcto!" : "Incorrecto"}
                </div>
                <button onClick={next} className="px-5 py-2 rounded-lg text-sm font-mono border border-neon-blue/40 text-neon-blue">
                  Siguiente vela →
                </button>
              </div>
            )}
          </div>

          {streak >= 2 && lastResult === null && (
            <div className="text-center text-[11px] font-mono text-neon-gold mt-3">
              🔥 Racha de {streak} — multiplicador x{Math.min(streak + 1, 5)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
