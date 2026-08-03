import { useEffect, useMemo, useState } from "react";
import type { BinanceCandle } from "../../../lib/binance/types";
import { fetchCachedCandles } from "../../../lib/arcade/historicalCandles";
import { HISTORICAL_CRASHES, type HistoricalCrash } from "../../../data/crashes";
import { ArcadeChart } from "../ArcadeChart";
import { GameHeader } from "../GameHeader";
import { GameResultScreen } from "../GameResultScreen";
import { HowToPlayBox } from "../HowToPlayBox";

const TOTAL_ROUNDS = 8;
const DAY_MS = 24 * 60 * 60 * 1000;

function buildRoundOrder(): HistoricalCrash[] {
  const shuffled = [...HISTORICAL_CRASHES].sort(() => Math.random() - 0.5);
  const extra = [...HISTORICAL_CRASHES].sort(() => Math.random() - 0.5).slice(0, TOTAL_ROUNDS - shuffled.length);
  return [...shuffled, ...extra].slice(0, TOTAL_ROUNDS);
}

export function crashOptionLabel(c: HistoricalCrash): string {
  return `${c.name} (${c.asset})`;
}

function buildOptions(correct: HistoricalCrash): HistoricalCrash[] {
  const distractorPool = HISTORICAL_CRASHES.filter((c) => c.id !== correct.id);
  const shuffled = [...distractorPool].sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [...shuffled, correct];
  return options.sort(() => Math.random() - 0.5);
}

interface Props {
  onExit: () => void;
  onFinish: (result: { scorePercent: number; streak: number }) => void;
}

export function QueCrashEs({ onExit, onFinish }: Props) {
  const [sessionKey, setSessionKey] = useState(0);
  const order = useMemo(() => buildRoundOrder(), [sessionKey]);

  const [round, setRound] = useState(0);
  const [candles, setCandles] = useState<BinanceCandle[]>([]);
  const [options, setOptions] = useState<HistoricalCrash[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [reported, setReported] = useState(false);

  const current = order[round]!;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setSelected(null);
    setOptions(buildOptions(current));

    async function load() {
      const peakTime = new Date(`${current.startDate}-01T00:00:00Z`).getTime();
      const startTime = peakTime - 25 * DAY_MS;
      const endTime = peakTime + 150 * DAY_MS;
      try {
        const result = await fetchCachedCandles(`${current.asset}USDT`, "1d", startTime, endTime);
        if (!cancelled) {
          setCandles(result);
          setLoading(false);
          if (result.length < 20) setError("No hay suficiente histórico para este período.");
        }
      } catch {
        if (!cancelled) {
          setError("No se pudo cargar el histórico de este crash.");
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, sessionKey]);

  function choose(id: string) {
    if (selected) return;
    setSelected(id);
    const isCorrect = id === current.id;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
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
    if (isLast) {
      setFinished(true);
      return;
    }
    setRound((r) => r + 1);
  }

  const scorePercent = Math.round((correctCount / TOTAL_ROUNDS) * 100);

  if (finished) {
    if (!reported) {
      setReported(true);
      onFinish({ scorePercent, streak: maxStreak });
    }
    return (
      <GameResultScreen
        scorePercent={scorePercent}
        headline="¿Qué Crash Es? completado"
        detail={`${correctCount} de ${TOTAL_ROUNDS} crashes identificados correctamente`}
        onRetry={() => {
          setSessionKey((k) => k + 1);
          setRound(0);
          setCorrectCount(0);
          setStreak(0);
          setMaxStreak(0);
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
        title="¿Qué Crash Es?"
        onExit={onExit}
        right={<span className="text-xs font-mono text-slate-400">RONDA {round + 1}/{TOTAL_ROUNDS} · ACIERTOS {correctCount}</span>}
      />

      {round === 0 && !selected && (
        <HowToPlayBox
          steps={[
            "Se muestra un gráfico real de BTC o TRX sin fechas ni precios visibles — solo la forma del movimiento.",
            "Elegí, entre 4 opciones, a qué crash histórico de cripto corresponde.",
            "8 rondas en total, con contexto (caída % y retorno a 12 meses) revelado después de cada respuesta.",
          ]}
          lesson="Te familiariza con la forma y magnitud de los grandes crashes de Bitcoin y TRON — para reconocer 'esto ya pasó antes' cuando el mercado se desploma."
        />
      )}

      {loading && <div className="text-sm text-slate-500 py-16 text-center">Cargando gráfico histórico…</div>}
      {error && <div className="text-sm text-neon-red py-16 text-center">{error}</div>}

      {!loading && !error && (
        <>
          <p className="text-sm text-slate-300 mb-2">Sin fechas ni precios visibles — solo la forma del gráfico. ¿Qué crash es?</p>
          <ArcadeChart candles={candles} height={300} hideScales disableInteraction />

          <div className="grid sm:grid-cols-2 gap-2 mt-4">
            {options.map((option) => {
              const isCorrectOption = option.id === current.id;
              let cls = "border-void-border text-slate-300 hover:border-slate-600";
              if (selected) {
                if (isCorrectOption) cls = "border-neon-green/60 bg-neon-green/10 text-neon-green";
                else if (option.id === selected) cls = "border-neon-red/60 bg-neon-red/10 text-neon-red";
                else cls = "border-void-border text-slate-500";
              }
              return (
                <button
                  key={option.id}
                  onClick={() => choose(option.id)}
                  disabled={!!selected}
                  className={`text-left px-4 py-2.5 rounded-lg text-sm border transition-colors ${cls}`}
                >
                  {crashOptionLabel(option)}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400 mb-3">
                {crashOptionLabel(current)}: caída de {current.dropPercent}% desde {current.startDate}
                {current.return12m !== null ? ` · 12 meses después: ${current.return12m > 0 ? "+" : ""}${current.return12m}%` : ""}
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
