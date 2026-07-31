import type { ReactNode } from "react";
import { ExportPdfButton } from "./ExportPdfButton";

export function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && <p className="text-slate-400 text-sm mt-1.5 max-w-2xl leading-relaxed">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {right}
        <ExportPdfButton />
      </div>
    </div>
  );
}
