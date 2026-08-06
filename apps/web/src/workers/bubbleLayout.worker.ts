import * as Comlink from "comlink";
import { computeBubbleLayout, type LayoutInputNode, type LayoutNode } from "../lib/meme/forceLayout";

function layout(nodes: LayoutInputNode[], width: number, height: number): LayoutNode[] {
  return computeBubbleLayout(nodes, width, height);
}

const api = { layout };
export type BubbleLayoutWorkerApi = typeof api;

Comlink.expose(api);
