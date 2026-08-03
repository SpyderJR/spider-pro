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
        subtitle="Perfil biográfico completo del fundador de TRON — orígenes, trayectoria, relaciones en el ecosistema, arte, el litigio con la SEC y su vínculo con World Liberty Financial, en tono neutral."
      />

      <div className="panel border border-neon-blue/30 bg-neon-blue/5 p-4 mb-6">
        <p className="text-xs text-slate-300 leading-relaxed">
          Esta página cubre a una persona pública real, incluyendo un litigio legal en curso. No incluye fotografías —
          no tenemos una fuente verificada para atribuir imágenes reales a esta persona, así que preferimos no
          fabricarlas. El contenido biográfico más personal (infancia, familia) se basa en lo que Sun mismo ha
          compartido públicamente, no en verificación independiente.
        </p>
      </div>

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
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🌱</span>
          <div className="font-semibold text-white">{JUSTIN_SUN_PROFILE.origins.title}</div>
        </div>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          {JUSTIN_SUN_PROFILE.origins.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mt-3 italic">{JUSTIN_SUN_PROFILE.origins.note}</p>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-4">Trayectoria e hitos</div>
        <div className="space-y-3">
          {JUSTIN_SUN_PROFILE.timeline.map((t, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-32 sm:w-40 shrink-0 text-xs font-mono text-neon-gold">{t.year}</div>
              <div className="text-sm text-slate-300 border-b border-void-border/50 pb-3 flex-1">{t.event}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="font-semibold text-white mb-4">Relaciones en el ecosistema</div>
        <div className="grid sm:grid-cols-2 gap-4">
          {JUSTIN_SUN_PROFILE.relationships.map((r) => (
            <div key={r.name} className="bg-void-soft rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{r.icon}</span>
                <span className="text-sm font-bold text-white">{r.name}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{r.summary}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🎨</span>
          <div className="font-semibold text-white">{JUSTIN_SUN_PROFILE.art.title}</div>
        </div>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          {JUSTIN_SUN_PROFILE.art.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="panel p-5 mb-6 border border-neon-red/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">⚖️</span>
          <div className="font-semibold text-white">{JUSTIN_SUN_PROFILE.legalSituation.title}</div>
        </div>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed mb-3">
          {JUSTIN_SUN_PROFILE.legalSituation.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="text-[11px] text-neon-gold bg-neon-gold/5 border border-neon-gold/20 rounded-lg p-3">
          {JUSTIN_SUN_PROFILE.legalSituation.caveat}
        </p>
      </div>

      <div className="panel p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🧠</span>
          <div className="font-semibold text-white">{JUSTIN_SUN_PROFILE.intelligence.title}</div>
        </div>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          {JUSTIN_SUN_PROFILE.intelligence.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🔭</span>
          <div className="font-semibold text-white">{JUSTIN_SUN_PROFILE.vision.title}</div>
        </div>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          {JUSTIN_SUN_PROFILE.vision.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
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

      <div className="panel p-5 mb-6">
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

      <Disclaimer text="Este perfil es informativo y de tono neutral. Cubre litigios en curso y afiliaciones políticas de forma descriptiva, sin tomar posición. No refleja la posición de Spider Pro sobre disputas legales o políticas — verificá siempre fuentes de noticias actualizadas para el estado más reciente de los temas legales mencionados." />
    </div>
  );
}
