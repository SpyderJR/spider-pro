import { useEffect, useRef } from "react";
import * as Comlink from "comlink";
import type { LayoutInputNode, LayoutNode } from "../lib/meme/forceLayout";
import type { BubbleLayoutWorkerApi } from "../workers/bubbleLayout.worker";

export function useBubbleLayout() {
  const workerRef = useRef<Worker>();
  const apiRef = useRef<Comlink.Remote<BubbleLayoutWorkerApi>>();

  useEffect(() => {
    const worker = new Worker(new URL("../workers/bubbleLayout.worker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;
    apiRef.current = Comlink.wrap<BubbleLayoutWorkerApi>(worker);
    return () => worker.terminate();
  }, []);

  async function computeLayout(nodes: LayoutInputNode[], width: number, height: number): Promise<LayoutNode[]> {
    if (!apiRef.current) throw new Error("Bubble layout worker not ready yet");
    return apiRef.current.layout(nodes, width, height);
  }

  return { computeLayout };
}
