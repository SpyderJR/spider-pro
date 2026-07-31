import { useEffect, useState } from "react";
import type { Timeframe } from "@spider/types";
import { TIMEFRAME_SECONDS } from "../lib/timeframeDuration";

/** Ticks every second, returning seconds remaining until the currently-forming candle closes. */
export function useCandleCountdown(currentCandleOpenTime: number | undefined, timeframe: Timeframe) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (currentCandleOpenTime === undefined) {
      setSecondsLeft(null);
      return;
    }
    const duration = TIMEFRAME_SECONDS[timeframe];
    const closeTime = currentCandleOpenTime + duration;

    const tick = () => {
      const now = Date.now() / 1000;
      setSecondsLeft(Math.max(0, Math.round(closeTime - now)));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [currentCandleOpenTime, timeframe]);

  return secondsLeft;
}
