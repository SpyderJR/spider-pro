import type { DiaryEntry } from "../../lib/diary/types";
import { buildBehavioralAlerts, type BehavioralAlertSeverity } from "../../lib/diary/behavioralStats";

const SEVERITY_STYLES: Record<BehavioralAlertSeverity, string> = {
  alta: "border-neon-red/40 bg-neon-red/5",
  media: "border-neon-gold/40 bg-neon-gold/5",
};

const SEVERITY_TITLE_COLOR: Record<BehavioralAlertSeverity, string> = {
  alta: "text-neon-red",
  media: "text-neon-gold",
};

export function BehavioralAlertsPanel({ entries }: { entries: DiaryEntry[] }) {
  const alerts = buildBehavioralAlerts(entries);
  if (alerts.length === 0) return null;

  return (
    <div className="panel p-5 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <h2 className="text-lg font-bold text-white">Auditoría de patrones</h2>
        <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 border border-void-border rounded px-1.5 py-0.5">
          DETECTADO POR REGLAS SOBRE TUS DATOS · NO ES IA
        </span>
      </div>
      <div className="space-y-2">
        {alerts.map((a) => (
          <div key={a.id} className={`rounded-lg border p-3 ${SEVERITY_STYLES[a.severity]}`}>
            <div className={`text-sm font-bold mb-1 ${SEVERITY_TITLE_COLOR[a.severity]}`}>{a.title}</div>
            <p className="text-xs text-slate-300 leading-relaxed">{a.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
