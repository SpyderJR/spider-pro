import type { ContentBlock } from "../../../content/academy/types";
import { CadenaDeBloques } from "../diagrams/CadenaDeBloques";
import { CustodiaWallet } from "../diagrams/CustodiaWallet";
import { EscalonesTick } from "../diagrams/EscalonesTick";
import { RuidoVsATR } from "../diagrams/RuidoVsATR";
import { CruceDeMedias } from "../diagrams/CruceDeMedias";
import { AnatomiaDeVela } from "../diagrams/AnatomiaDeVela";

type Data = Extract<ContentBlock, { type: "diagramaSVG" }>;

const REGISTRY: Record<string, () => JSX.Element> = {
  "cadena-de-bloques": CadenaDeBloques,
  "custodia-wallet": CustodiaWallet,
  "escalones-tick": EscalonesTick,
  "ruido-vs-atr": RuidoVsATR,
  "cruce-de-medias": CruceDeMedias,
  "anatomia-de-vela": AnatomiaDeVela,
};

export function DiagramaSVG({ data }: { data: Data }) {
  const Diagram = REGISTRY[data.diagrama];
  if (!Diagram) return null;
  return (
    <div className="bg-void-soft rounded-xl p-4 border border-void-border">
      <Diagram />
      {data.caption && <p className="text-xs text-slate-500 text-center mt-2">{data.caption}</p>}
    </div>
  );
}
