let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!audioCtx) audioCtx = new AudioCtor();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

/**
 * Synthesized click — a quick downward pitch sweep (the "tick") layered with a
 * soft low thump (the "body") — no audio asset to ship, and a touch of pitch
 * randomization keeps rapid clicking from sounding mechanical/repetitive.
 */
export function playClickSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const variance = 0.94 + Math.random() * 0.12;

    const tick = ctx.createOscillator();
    const tickGain = ctx.createGain();
    tick.type = "sine";
    tick.frequency.setValueAtTime(950 * variance, now);
    tick.frequency.exponentialRampToValueAtTime(240 * variance, now + 0.08);
    tickGain.gain.setValueAtTime(0, now);
    tickGain.gain.linearRampToValueAtTime(0.16, now + 0.004);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    tick.connect(tickGain);
    tickGain.connect(ctx.destination);
    tick.start(now);
    tick.stop(now + 0.11);

    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thump.type = "sine";
    thump.frequency.setValueAtTime(150 * variance, now);
    thumpGain.gain.setValueAtTime(0, now);
    thumpGain.gain.linearRampToValueAtTime(0.11, now + 0.006);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    thump.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    thump.start(now);
    thump.stop(now + 0.09);
  } catch {
    // Web Audio unavailable in this environment — the click sound is a nice-to-have, never a hard requirement.
  }
}

/**
 * Order-fill chime — two ascending notes, distinct from the global click's downward sweep
 * so a filled order is recognizable by ear. Opt-in only (see `orderSoundEnabled` in
 * `terminalPreferencesStore`), unlike the click sound which plays unconditionally.
 */
export function playOrderFillSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [523.25, 783.99].forEach((freq, i) => {
      const start = now + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.14, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.24);
    });
  } catch {
    // Web Audio unavailable in this environment — never a hard requirement.
  }
}
