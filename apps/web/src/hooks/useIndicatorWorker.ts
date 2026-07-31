import { useEffect, useRef, useState } from "react";
import * as Comlink from "comlink";
import type { Candle, IndicatorConfig } from "@spider/types";
import type { IndicatorsWorkerApi, IndicatorResult } from "../workers/indicators.worker";

export function useIndicatorWorker(candles: Candle[] | undefined, config: IndicatorConfig) {
  const workerRef = useRef<Worker>();
  const apiRef = useRef<Comlink.Remote<IndicatorsWorkerApi>>();
  const [result, setResult] = useState<IndicatorResult | null>(null);
  const [isComputing, setIsComputing] = useState(false);

  useEffect(() => {
    const worker = new Worker(new URL("../workers/indicators.worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;
    apiRef.current = Comlink.wrap<IndicatorsWorkerApi>(worker);
    return () => worker.terminate();
  }, []);

  useEffect(() => {
    if (!candles || candles.length === 0 || !apiRef.current) {
      setResult(null);
      return;
    }
    let cancelled = false;
    setIsComputing(true);
    apiRef.current
      .computeIndicators(candles, config)
      .then((r) => {
        if (!cancelled) setResult(r);
      })
      .finally(() => {
        if (!cancelled) setIsComputing(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candles, JSON.stringify(config)]);

  return { result, isComputing };
}
