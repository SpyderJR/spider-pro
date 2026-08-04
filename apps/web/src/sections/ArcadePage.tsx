import { useEffect, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { ARCADE_GAMES, type ArcadeGameId } from "../data/arcadeGames";
import { ACHIEVEMENTS, type Achievement } from "../data/achievements";
import { useArcadeStore } from "../store/arcadeStore";
import { SubeOBaja } from "../components/arcade/games/SubeOBaja";
import { CazaElFractal } from "../components/arcade/games/CazaElFractal";
import { ElImpostor } from "../components/arcade/games/ElImpostor";
import { StopLossPerfecto } from "../components/arcade/games/StopLossPerfecto";
import { QueCrashEs } from "../components/arcade/games/QueCrashEs";
import { SobreviveLos20 } from "../components/arcade/games/SobreviveLos20";
import { LaLiquidacion } from "../components/arcade/games/LaLiquidacion";
import { usePublishContext } from "../hooks/usePublishContext";

type GameFinishResult = { scorePercent: number; streak: number; record?: number; flag?: boolean; secondaryFlag?: boolean };

const GAME_COMPONENTS: Record<ArcadeGameId, ComponentType<{ onExit: () => void; onFinish: (r: GameFinishResult) => void }>> = {
  "sube-o-baja": SubeOBaja,
  "caza-el-fractal": CazaElFractal,
  "el-impostor": ElImpostor,
  "stop-loss-perfecto": StopLossPerfecto,
  "que-crash-es": QueCrashEs,
  "sobrevive-los-20": SobreviveLos20,
  "la-liquidacion": LaLiquidacion,
};

const DOLLAR_RECORD_GAMES: ArcadeGameId[] = ["sobrevive-los-20", "la-liquidacion"];

function recordLabel(gameId: ArcadeGameId, stat: { bestScorePercent: number; record: number; plays: number }): string {
  if (stat.plays === 0) return "Sin jugar";
  if (DOLLAR_RECORD_GAMES.includes(gameId)) return `Récord: $${stat.record.toFixed(0)}`;
  return `Récord: ${stat.bestScorePercent}%`;
}

export function ArcadePage() {
  const store = useArcadeStore();
  const [activeGame, setActiveGame] = useState<ArcadeGameId | null>(null);
  const [toast, setToast] = useState<{ xp: number; achievements: Achievement[] } | null>(null);

  useEffect(() => {
    store.ensureDailyChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  usePublishContext("arcade", {
    xpTotal: store.xp,
    nivel: store.levelProgress().name,
    juegosJugados: Object.values(store.gameStats).reduce((s, g) => s + g.plays, 0),
    rachaDiaria: store.dailyStreak,
  });

  function handleFinish(gameId: ArcadeGameId, result: GameFinishResult) {
    const { xpGained, newAchievements } = store.recordGameResult(gameId, result);
    setToast({ xp: xpGained, achievements: newAchievements });
  }

  if (activeGame) {
    const GameComponent = GAME_COMPONENTS[activeGame];
    return (
      <div>
        {toast && <AchievementToast xp={toast.xp} achievements={toast.achievements} />}
        <GameComponent onExit={() => setActiveGame(null)} onFinish={(r) => handleFinish(activeGame, r)} />
      </div>
    );
  }

  const level = store.levelProgress();
  const weakest = store.weakestSkill();
  const dailyGame = store.dailyChallenge ? ARCADE_GAMES.find((g) => g.id === store.dailyChallenge!.gameId) : null;

  return (
    <div>
      {toast && <AchievementToast xp={toast.xp} achievements={toast.achievements} />}

      <SectionHeader title="Spider Arcade" subtitle="7 minijuegos de 1 a 3 minutos para entrenar tu ojo de trader. Ganas XP, subes de nivel y desbloqueas logros." />

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <div className="panel p-4 sm:col-span-1">
          <div className="text-[10px] font-mono text-slate-500 mb-1">NIVEL</div>
          <div className="value-mono text-lg font-bold text-neon-green mb-2">{level.name}</div>
          <div className="h-2 bg-void-soft rounded-full overflow-hidden mb-1">
            <div className="h-full bg-neon-green transition-all" style={{ width: `${level.progressPercent}%` }} />
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            {store.xp} XP {level.xpForNextLevel !== null && `· faltan ${level.xpForNextLevel - level.xpIntoLevel} para el siguiente nivel`}
          </div>
        </div>

        <div className="panel p-4 sm:col-span-2 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[10px] font-mono text-slate-500 mb-1">
              DESAFÍO DE HOY {store.dailyChallenge?.completed && <span className="text-neon-green">✓ COMPLETADO</span>}
            </div>
            <div className="text-sm text-white font-medium">
              {dailyGame ? `${dailyGame.icon} ${dailyGame.name} — XP x2` : "Cargando…"}
            </div>
            <div className="text-[11px] text-neon-gold font-mono mt-0.5">🔥 Racha diaria: {store.dailyStreak} {store.dailyStreak === 1 ? "día" : "días"}</div>
          </div>
          {dailyGame && !store.dailyChallenge?.completed && (
            <button
              onClick={() => setActiveGame(dailyGame.id)}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-neon-gold/10 border border-neon-gold/40 text-neon-gold shrink-0"
            >
              Jugar ahora
            </button>
          )}
        </div>
      </div>

      {weakest && (
        <div className="panel p-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-sm text-slate-300">
            Tu habilidad más débil por ahora es <span className="text-white font-medium">{weakest.skill}</span>.
          </div>
          <Link to={weakest.skillPage} className="text-xs font-mono px-3 py-1.5 rounded-md border border-neon-blue/40 text-neon-blue">
            Repasar {weakest.skill} →
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {ARCADE_GAMES.map((game) => {
          const stat = store.gameStats[game.id];
          return (
            <div key={game.id} className="panel p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{game.icon}</span>
                <h3 className="font-bold text-white">{game.name}</h3>
              </div>
              <p className="text-xs text-slate-400 flex-1 mb-3">{game.description}</p>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-3">
                <span>{game.duration}</span>
                <span className="text-neon-gold">{recordLabel(game.id, stat)}</span>
              </div>
              <button
                onClick={() => setActiveGame(game.id)}
                className="w-full py-2 rounded-lg text-sm font-bold bg-neon-green/10 border border-neon-green/40 text-neon-green"
              >
                JUGAR
              </button>
            </div>
          );
        })}
      </div>

      <div className="mb-2">
        <h2 className="text-lg font-bold text-white mb-1">Logros</h2>
        <p className="text-xs text-slate-500 mb-3">{store.achievementsUnlocked.length} de {ACHIEVEMENTS.length} desbloqueados</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = store.achievementsUnlocked.includes(a.id);
          return (
            <div key={a.id} className={`panel p-3 flex items-center gap-3 ${unlocked ? "" : "opacity-40"}`}>
              <span className="text-xl">{unlocked ? a.icon : "🔒"}</span>
              <div>
                <div className={`text-xs font-bold ${unlocked ? "text-neon-gold" : "text-slate-500"}`}>{a.name}</div>
                <div className="text-[11px] text-slate-500">{a.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      <Disclaimer text="Los juegos del Arcade usan datos históricos reales de mercado, pero son simulaciones educativas. Ningún resultado dentro del juego es asesoría financiera (NFA)." />
    </div>
  );
}

function AchievementToast({ xp, achievements }: { xp: number; achievements: Achievement[] }) {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-xs">
      <div className="panel p-3 border border-neon-green/40 bg-void-soft/95 backdrop-blur">
        <div className="text-xs font-mono text-neon-green">+{xp} XP</div>
      </div>
      {achievements.map((a) => (
        <div key={a.id} className="panel p-3 border border-neon-gold/40 bg-void-soft/95 backdrop-blur flex items-center gap-2">
          <span className="text-xl">{a.icon}</span>
          <div>
            <div className="text-[10px] font-mono text-neon-gold">LOGRO DESBLOQUEADO</div>
            <div className="text-xs font-bold text-white">{a.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
