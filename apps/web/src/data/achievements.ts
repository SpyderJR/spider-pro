import type { ArcadeGameId } from "./arcadeGames";

export interface ArcadeStats {
  totalGamesPlayed: number;
  totalXp: number;
  dailyStreak: number;
  gameStats: Record<
    ArcadeGameId,
    { plays: number; bestScorePercent: number; bestStreak: number; record: number; flagCount: number; secondaryFlagCount: number }
  >;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (s: ArcadeStats) => boolean;
}

const g = (s: ArcadeStats, id: ArcadeGameId) => s.gameStats[id];

export const ACHIEVEMENTS: Achievement[] = [
  { id: "primer-juego", name: "Primeros Pasos", description: "Jugá tu primer juego del Arcade.", icon: "🎮", check: (s) => s.totalGamesPlayed >= 1 },
  { id: "seis-juegos", name: "Explorador", description: "Probá los 7 juegos al menos una vez.", icon: "🗺", check: (s) => Object.values(s.gameStats).every((g) => g.plays >= 1) },
  { id: "diez-partidas", name: "Habitué", description: "Jugá 10 partidas en total.", icon: "🔟", check: (s) => s.totalGamesPlayed >= 10 },
  { id: "cincuenta-partidas", name: "Veterano del Arcade", description: "Jugá 50 partidas en total.", icon: "🏅", check: (s) => s.totalGamesPlayed >= 50 },
  { id: "cien-partidas", name: "Leyenda del Arcade", description: "Jugá 100 partidas en total.", icon: "👑", check: (s) => s.totalGamesPlayed >= 100 },

  { id: "sube-baja-racha-5", name: "Ojo Entrenado", description: "Conseguí una racha de 5 aciertos en Sube o Baja.", icon: "🔥", check: (s) => g(s, "sube-o-baja").bestStreak >= 5 },
  { id: "sube-baja-racha-10", name: "Lector de Velas", description: "Conseguí una racha de 10 aciertos en Sube o Baja.", icon: "🕯", check: (s) => g(s, "sube-o-baja").bestStreak >= 10 },
  { id: "sube-baja-perfecto", name: "Vidente", description: "Terminá una partida de Sube o Baja con 90% o más de aciertos.", icon: "🔮", check: (s) => g(s, "sube-o-baja").bestScorePercent >= 90 },

  { id: "fractal-primera-caza", name: "Cazador Novato", description: "Encontrá tu primer fractal en Caza el Fractal.", icon: "〽", check: (s) => g(s, "caza-el-fractal").plays >= 1 && g(s, "caza-el-fractal").bestScorePercent > 0 },
  { id: "fractal-experto", name: "Cazador Experto", description: "Conseguí 80% o más de aciertos en Caza el Fractal.", icon: "🎯", check: (s) => g(s, "caza-el-fractal").bestScorePercent >= 80 },
  { id: "fractal-record", name: "Ojo de Halcón", description: "Conseguí una racha de 8 fractales sin fallar.", icon: "🦅", check: (s) => g(s, "caza-el-fractal").bestStreak >= 8 },

  { id: "impostor-primero", name: "Detective", description: "Detectá tu primer impostor.", icon: "🔍", check: (s) => g(s, "el-impostor").plays >= 1 && g(s, "el-impostor").bestScorePercent > 0 },
  { id: "impostor-experto", name: "Detector de Ruido", description: "Conseguí 80% o más de aciertos en El Impostor.", icon: "🎭", check: (s) => g(s, "el-impostor").bestScorePercent >= 80 },

  { id: "sl-primero", name: "Primer Escudo", description: "Completá tu primera ronda de Stop Loss Perfecto.", icon: "🛡", check: (s) => g(s, "stop-loss-perfecto").plays >= 1 },
  { id: "sl-experto", name: "Gestor de Riesgo", description: "Conseguí 80% o más de puntaje en Stop Loss Perfecto.", icon: "🧮", check: (s) => g(s, "stop-loss-perfecto").bestScorePercent >= 80 },

  { id: "crash-primero", name: "Historiador Novato", description: "Adiviná tu primer crash histórico.", icon: "📉", check: (s) => g(s, "que-crash-es").plays >= 1 && g(s, "que-crash-es").bestScorePercent > 0 },
  { id: "crash-experto", name: "Historiador Cripto", description: "Conseguí 6 de 8 o más en ¿Qué Crash Es?", icon: "📚", check: (s) => g(s, "que-crash-es").bestScorePercent >= 75 },

  { id: "sobrevive-primero", name: "Sobreviviente", description: "Terminá una partida de Sobrevive los 20 sin llegar a $0.", icon: "💀", check: (s) => g(s, "sobrevive-los-20").plays >= 1 && g(s, "sobrevive-los-20").record > 0 },
  { id: "sobrevive-2000", name: "Interés Compuesto", description: "Terminá Sobrevive los 20 con más de $2000.", icon: "💰", check: (s) => g(s, "sobrevive-los-20").record >= 2000 },
  { id: "sobrevive-perfecto", name: "Disciplina de Hierro", description: "Terminá Sobrevive los 20 con 90% o más de puntaje.", icon: "⛓", check: (s) => g(s, "sobrevive-los-20").bestScorePercent >= 90 },

  { id: "racha-diaria-3", name: "Constancia", description: "Completá el desafío diario 3 días seguidos.", icon: "📅", check: (s) => s.dailyStreak >= 3 },
  { id: "racha-diaria-7", name: "Una Semana Spider", description: "Completá el desafío diario 7 días seguidos.", icon: "🕷", check: (s) => s.dailyStreak >= 7 },
  { id: "racha-diaria-30", name: "Hábito de Trader", description: "Completá el desafío diario 30 días seguidos.", icon: "🏆", check: (s) => s.dailyStreak >= 30 },

  { id: "xp-1000", name: "Mil Puntos", description: "Acumulá 1000 XP en el Arcade.", icon: "⭐", check: (s) => s.totalXp >= 1000 },
  { id: "xp-5000", name: "Cinco Mil Puntos", description: "Acumulá 5000 XP en el Arcade.", icon: "🌟", check: (s) => s.totalXp >= 5000 },

  { id: "liquidacion-primera", name: "Mi Primera Liquidación", description: "Te liquidaron en La Liquidación. Mejor acá que con dinero real.", icon: "💥", check: (s) => g(s, "la-liquidacion").secondaryFlagCount >= 1 },
  { id: "liquidacion-30-dias", name: "Sobreviviente 30 Días", description: "Sobreviví los 30 días completos en La Liquidación.", icon: "🏝", check: (s) => g(s, "la-liquidacion").bestScorePercent >= 100 },
  { id: "liquidacion-bajo-apalancamiento", name: "Aprendiz de Palanca", description: "Terminá La Liquidación en ganancia usando solo 5x o menos en todas las rondas.", icon: "🎓", check: (s) => g(s, "la-liquidacion").flagCount >= 1 },
];

export function evaluateNewAchievements(stats: ArcadeStats, alreadyUnlocked: string[]): Achievement[] {
  const unlockedSet = new Set(alreadyUnlocked);
  return ACHIEVEMENTS.filter((a) => !unlockedSet.has(a.id) && a.check(stats));
}
