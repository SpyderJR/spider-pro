import { usePaperTradingStore } from "../paperTrading/store";
import { useFuturesStore } from "../../store/futuresStore";
import { useArcadeStore } from "../../store/arcadeStore";
import type { ArcadeGameId } from "../../data/arcadeGames";

export interface AcademyChallenge {
  id: string;
  label: string;
  /** Se re-evalúa cada vez que cambia el store relevante — 100% reglas, sin IA. */
  isMet: () => boolean;
}

function riskPercentOfTrade(entry: number, stopLoss: number | null, quantity: number, balanceAtRisk: number): number | null {
  if (stopLoss === null || balanceAtRisk <= 0) return null;
  const riskAmount = Math.abs(entry - stopLoss) * quantity;
  return (riskAmount / balanceAtRisk) * 100;
}

export const ACADEMY_CHALLENGES: Record<string, AcademyChallenge> = {
  "terminal-open-low-risk": {
    id: "terminal-open-low-risk",
    label: "Abre una posición spot en la Terminal con stop loss a ≤2% de riesgo de tu cuenta.",
    isMet: () => {
      const { positions, history, balance } = usePaperTradingStore.getState();
      const all = [...positions, ...history];
      return all.some((p) => {
        const pct = riskPercentOfTrade(p.entryPrice, p.stopLoss, p.quantity, balance);
        return pct !== null && pct <= 2;
      });
    },
  },
  "terminal-close-in-profit": {
    id: "terminal-close-in-profit",
    label: "Cierra un trade en la Terminal con ganancia (spot o futuros).",
    isMet: () => {
      const spotWin = usePaperTradingStore.getState().history.some((t) => t.pnl > 0);
      const futuresWin = useFuturesStore.getState().history.some((t) => t.pnl > 0);
      return spotWin || futuresWin;
    },
  },
  "arcade-streak-10-sube-o-baja": {
    id: "arcade-streak-10-sube-o-baja",
    label: "Consigue una racha de 10 aciertos seguidos en \"Sube o Baja\".",
    isMet: () => {
      const gameId: ArcadeGameId = "sube-o-baja";
      return (useArcadeStore.getState().gameStats[gameId]?.bestStreak ?? 0) >= 10;
    },
  },
  "arcade-survive-20-low-risk": {
    id: "arcade-survive-20-low-risk",
    label: "Sobrevive las 20 rondas de \"Sobrevive los 20\" arriesgando poco por ronda.",
    isMet: () => {
      const gameId: ArcadeGameId = "sobrevive-los-20";
      const stat = useArcadeStore.getState().gameStats[gameId];
      return (stat?.bestScorePercent ?? 0) >= 100;
    },
  },
  "terminal-futures-open": {
    id: "terminal-futures-open",
    label: "Abre una posición en modo Futuros de la Terminal.",
    isMet: () => {
      const { positions, history } = useFuturesStore.getState();
      return positions.length > 0 || history.length > 0;
    },
  },
  "arcade-la-liquidacion-played": {
    id: "arcade-la-liquidacion-played",
    label: "Juega una partida completa de \"La Liquidación\" en el Arcade.",
    isMet: () => {
      const gameId: ArcadeGameId = "la-liquidacion";
      return (useArcadeStore.getState().gameStats[gameId]?.plays ?? 0) > 0;
    },
  },
};

/** Se suscribe a los stores que pueden afectar cualquier reto y llama a `onChange` cuando algo cambia. */
export function subscribeToChallengeSources(onChange: () => void): () => void {
  const un1 = usePaperTradingStore.subscribe(onChange);
  const un2 = useFuturesStore.subscribe(onChange);
  const un3 = useArcadeStore.subscribe(onChange);
  return () => {
    un1();
    un2();
    un3();
  };
}
