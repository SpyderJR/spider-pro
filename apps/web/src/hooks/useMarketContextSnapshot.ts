import { useMemo } from "react";
import { useFearGreed, useKlines, useMarketCoins } from "./useMarketData";
import { usePaperTradingStore } from "../lib/paperTrading/store";
import { buildMarketContextSnapshot } from "../lib/marketContext";

/**
 * Always-on market snapshot for the chat assistant — active regardless of which
 * page the user is viewing, since <ChatWidget> (which calls this) is mounted at
 * the app root, not inside any single route.
 */
export function useMarketContextSnapshot(): Record<string, unknown> {
  const coins = useMarketCoins();
  const fearGreed = useFearGreed();
  const btc4h = useKlines("BTC", "4h", 30);
  const btc1d = useKlines("BTC", "1d", 30);
  const { balance, positions, history } = usePaperTradingStore();

  return useMemo(
    () =>
      buildMarketContextSnapshot({
        coins: coins.data?.coins,
        fearGreed: fearGreed.data,
        btcCandles4h: btc4h.data?.candles,
        btcCandles1d: btc1d.data?.candles,
        balance,
        positions,
        history,
      }),
    [coins.data, fearGreed.data, btc4h.data, btc1d.data, balance, positions, history],
  );
}
