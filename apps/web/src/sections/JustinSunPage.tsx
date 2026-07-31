import { SectionHeader } from "../components/SectionHeader";
import { Disclaimer } from "../components/Disclaimer";
import { usePublishContext } from "../hooks/usePublishContext";
import { JUSTIN_SUN_PROFILE } from "../data/justinSun";

export function JustinSunPage() {
  usePublishContext("justin-sun", { name: JUSTIN_SUN_PROFILE.name });

  return (
    <div>
      <SectionHeader
        title="Justin Sun"
        subtitle="Perfil biográfico del fundador de TRON — trayectoria, hitos y controversias, en tono neutral."
      />

      <div className="panel p-5 mb-6">
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
          <div>
            <span className="text-slate-500">Nombre: </span>
            <span className="text-slate-200">{JUSTIN_SUN_PROFILE.name}</span>
          </div>
          <div>
            <span className="text-slate-500">Nacimiento: </span>
            <span className="text-slate-200">{JUSTIN_SUN_PROFILE.born}</span>
          </div>
          <div>
            <span className="text-slate-500">Educación: </span>
            <span className="text-slate-200">{JUSTIN_SUN_PROFILE.education}</span>
          </div>
          <div>
            <span className="text-slate-500">Rol: </span>
            <span className="text-slate-200">{JUSTIN_SUN_PROFILE.role}</span>
          </div>
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-4">Trayectoria e hitos</div>
        <div className="space-y-3">
          {JUSTIN_SUN_PROFILE.timeline.map((t, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-14 shrink-0 text-xs font-mono text-neon-gold">{t.year}</div>
              <div className="text-sm text-slate-300 border-b border-void-border/50 pb-3 flex-1">
                {t.event}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-3">Controversias</div>
        <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
          {JUSTIN_SUN_PROFILE.controversies.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      <div className="panel p-5">
        <div className="font-semibold text-white mb-3">Cifras clave</div>
        <dl className="text-sm space-y-2">
          {JUSTIN_SUN_PROFILE.figures.map((f) => (
            <div key={f.label} className="flex justify-between border-b border-void-border/50 pb-2">
              <dt className="text-slate-500">{f.label}</dt>
              <dd className="text-slate-300 text-right max-w-[60%]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Disclaimer text="Este perfil es informativo y de tono neutral. No refleja la posición de Spider Pro sobre disputas legales en curso." />
    </div>
  );
}
