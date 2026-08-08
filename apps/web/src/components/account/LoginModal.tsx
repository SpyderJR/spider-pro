import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

const CONSENT_KEY = "spider-legal-consent-accepted";
const MIN_PASSWORD_LENGTH = 6;

type Mode = "google" | "email";
type EmailMode = "signin" | "signup";

const inputClass =
  "w-full mb-2 px-3 py-2 rounded-lg bg-void-soft border border-void-border text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-green/50";

export function LoginModal({ onClose }: { onClose: () => void }) {
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signUpWithPassword = useAuthStore((s) => s.signUpWithPassword);
  const signInWithPassword = useAuthStore((s) => s.signInWithPassword);
  const [accepted, setAccepted] = useState(() => localStorage.getItem(CONSENT_KEY) === "1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("google");
  const [emailMode, setEmailMode] = useState<EmailMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    localStorage.setItem(CONSENT_KEY, "1");
    const { error: err } = await signInWithGoogle();
    setLoading(false);
    if (err) setError(err);
    // en éxito, Supabase redirige a Google — no hay más que hacer acá
  }

  async function handleEmailSubmit() {
    setError(null);
    if (emailMode === "signup" && password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    localStorage.setItem(CONSENT_KEY, "1");
    const { error: err } =
      emailMode === "signup" ? await signUpWithPassword(email, password) : await signInWithPassword(email, password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    if (emailMode === "signup") setAwaitingConfirmation(true);
    else onClose();
  }

  const emailFormValid =
    email.trim().length > 3 &&
    password.length >= MIN_PASSWORD_LENGTH &&
    (emailMode === "signin" || password === confirmPassword);

  if (awaitingConfirmation) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative max-w-sm w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-void-border bg-void-panel p-7 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_60px_-20px_rgba(0,0,0,0.75)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-2xl opacity-60"
            style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(57,255,156,0.10), transparent)" }}
          />
          <div className="relative flex flex-col items-center text-center">
            <img src="/logo.png" alt="Spider" className="w-12 h-12 rounded-xl object-cover shadow-neon-green mb-3" />
            <span className="font-mono font-bold text-white text-base tracking-tight mb-2">Revisa tu correo</span>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Te enviamos un enlace de confirmación a <strong className="text-white">{email}</strong>. Ábrelo para
              activar tu cuenta — después podrás iniciar sesión con tu correo y contraseña desde cualquier
              dispositivo.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg text-sm font-mono font-bold border border-neon-green/50 text-neon-green bg-neon-green/10 hover:bg-neon-green/20 transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="relative max-w-sm w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-void-border bg-void-panel p-7 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_60px_-20px_rgba(0,0,0,0.75)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-2xl opacity-60"
          style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(57,255,156,0.10), transparent)" }}
        />

        <div className="relative flex flex-col items-center text-center mb-5">
          <img src="/logo.png" alt="Spider" className="w-12 h-12 rounded-xl object-cover shadow-neon-green mb-3" />
          <span className="font-mono font-bold text-white text-base tracking-tight">Iniciar sesión</span>
          <p className="text-xs text-slate-500 leading-relaxed mt-1.5 max-w-[26rem]">
            Totalmente opcional — Spider Pro funciona completo sin cuenta. Solo agrega respaldo en la
            nube y sincronización entre tus dispositivos.
          </p>
        </div>

        <div className="flex gap-1.5 mb-4 p-1 rounded-lg bg-void-soft border border-void-border">
          <button
            onClick={() => {
              setMode("google");
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-md text-xs font-mono font-bold transition-colors ${
              mode === "google" ? "bg-neon-green/15 text-neon-green" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Google
          </button>
          <button
            onClick={() => {
              setMode("email");
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-md text-xs font-mono font-bold transition-colors ${
              mode === "email" ? "bg-neon-green/15 text-neon-green" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Correo y contraseña
          </button>
        </div>

        {mode === "email" && (
          <>
            <div className="flex gap-3 mb-3 text-xs font-mono">
              <button
                onClick={() => {
                  setEmailMode("signin");
                  setError(null);
                }}
                className={emailMode === "signin" ? "text-white font-bold" : "text-slate-500 hover:text-slate-300"}
              >
                Iniciar sesión
              </button>
              <span className="text-slate-700">·</span>
              <button
                onClick={() => {
                  setEmailMode("signup");
                  setError(null);
                }}
                className={emailMode === "signup" ? "text-white font-bold" : "text-slate-500 hover:text-slate-300"}
              >
                Crear cuenta
              </button>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className={inputClass}
              autoComplete="email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={`Contraseña (mínimo ${MIN_PASSWORD_LENGTH} caracteres)`}
              className={inputClass}
              autoComplete={emailMode === "signup" ? "new-password" : "current-password"}
            />
            {emailMode === "signup" && (
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu contraseña"
                className={inputClass}
                autoComplete="new-password"
              />
            )}
            {emailMode === "signup" && password.length > 0 && password.length < MIN_PASSWORD_LENGTH && (
              <p className="text-[11px] text-slate-500 mb-1">Mínimo {MIN_PASSWORD_LENGTH} caracteres.</p>
            )}
            {emailMode === "signup" && confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="text-[11px] text-neon-red mb-1">Las contraseñas no coinciden.</p>
            )}
          </>
        )}

        <label className="flex items-start gap-2.5 mb-4 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 accent-neon-green"
          />
          <span className="text-xs text-slate-400 leading-relaxed">
            He leído y acepto los{" "}
            <a href="/terminos" target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline">
              Términos y Condiciones
            </a>
            , la{" "}
            <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline">
              Política de Privacidad
            </a>{" "}
            y el{" "}
            <a href="/riesgo" target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline">
              Aviso de Riesgo
            </a>
            .
          </span>
        </label>

        {error && <p className="text-xs text-neon-red mb-3">{error}</p>}

        {(() => {
          const submitDisabled = !accepted || loading || (mode === "email" && !emailFormValid);
          const showGlow = mode === "google" && !submitDisabled;
          return (
            <div className={`relative rounded-lg ${showGlow ? "p-[1.5px] overflow-hidden" : ""}`}>
              {showGlow && (
                <div
                  className="absolute inset-[-60%] animate-border-spin"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, #39ff9c 35deg, transparent 90deg, transparent 360deg)",
                  }}
                />
              )}
              <button
                onClick={mode === "google" ? handleGoogle : handleEmailSubmit}
                disabled={submitDisabled}
                className={`relative w-full py-2.5 rounded-lg text-sm font-mono font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  showGlow
                    ? "bg-void-panel text-neon-green hover:bg-neon-green/10"
                    : "border border-neon-green/50 text-neon-green bg-neon-green/10 hover:bg-neon-green/20"
                }`}
              >
                {loading
                  ? "Procesando…"
                  : mode === "google"
                    ? "Continuar con Google"
                    : emailMode === "signup"
                      ? "Crear cuenta"
                      : "Iniciar sesión"}
              </button>
            </div>
          );
        })()}
        <button onClick={onClose} className="w-full mt-3 py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  );
}
