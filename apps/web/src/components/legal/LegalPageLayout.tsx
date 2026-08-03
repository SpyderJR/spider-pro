import type { ReactNode } from "react";
import { PublicHeader } from "../public/PublicHeader";
import { PublicFooter } from "../public/PublicFooter";

const LAST_UPDATED = "3 de agosto de 2026";

export function LegalPageLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-xs font-mono text-slate-500 mb-10">Última actualización: {LAST_UPDATED}</p>
        <div className="space-y-8">{children}</div>
        <div className="mt-12 pt-6 border-t border-void-border">
          <p className="text-xs text-slate-500 italic leading-relaxed">
            Este documento es una plantilla informativa preparada para SPIDER PRO y no constituye asesoría
            legal.
          </p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

export function LegalSection({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
      <div className="bg-neon-blue/5 border border-neon-blue/20 rounded-lg px-3 py-2 mb-3">
        <span className="text-[10px] font-mono font-bold text-neon-blue tracking-widest mr-2">EN CORTO</span>
        <span className="text-sm text-slate-300">{summary}</span>
      </div>
      <div className="text-sm text-slate-400 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
