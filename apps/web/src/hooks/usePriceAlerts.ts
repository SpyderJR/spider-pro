import { useEffect, useState } from "react";
import { usePriceAlertsStore, type PriceAlert } from "../store/priceAlertsStore";

/**
 * Checks the current pair's active alerts against the live price on every tick. This only runs
 * while the user has that pair open in the Terminal — there's no background/server-side
 * monitoring, so an alert on a pair you're not currently viewing won't fire until you come back
 * to it. That scope limit is stated in the UI copy, not left implicit.
 */
export function usePriceAlerts(pair: string, currentPrice: number | null) {
  const alerts = usePriceAlertsStore((s) => s.alerts);
  const markTriggered = usePriceAlertsStore((s) => s.markTriggered);
  const [justTriggered, setJustTriggered] = useState<PriceAlert | null>(null);

  useEffect(() => {
    if (currentPrice === null) return;
    const active = alerts.filter((a) => a.pair === pair && !a.triggered);
    for (const alert of active) {
      const crossed = alert.direction === "above" ? currentPrice >= alert.targetPrice : currentPrice <= alert.targetPrice;
      if (!crossed) continue;
      markTriggered(alert.id);
      setJustTriggered(alert);
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(`${pair.replace("USDT", "/USDT")} ${alert.direction === "above" ? "superó" : "cayó por debajo de"} ${alert.targetPrice}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPrice, pair]);

  return {
    alertsForPair: alerts.filter((a) => a.pair === pair && !a.triggered),
    justTriggered,
    dismissTriggered: () => setJustTriggered(null),
  };
}
