// audio.js — one clear job: every sound the game makes, from WebAudio.
//
// No audio file is loaded: each effect is a few oscillators through one
// gain node, created lazily on the first user gesture so browsers allow it.
// Sound can be muted; the mute state lives here, not in the game state.

// createAudio() — the sound board: a lazily-built AudioContext plus mute.
export function createAudio() {
  return { context: null, muted: false };
}

// ensureContext(audio) — build the AudioContext on first use, resume it.
function ensureContext(audio) {
  if (!audio.context) {
    const Ctor = window.AudioContext ?? window.webkitAudioContext;
    if (!Ctor) return null;
    audio.context = new Ctor();
  }
  if (audio.context.state === 'suspended') void audio.context.resume();
  return audio.context;
}

// tone(audio, freq, at, dur, type, vol) — one note starting `at` seconds in.
function tone(audio, freq, at, dur, type, vol) {
  const ctx = ensureContext(audio);
  if (!ctx || audio.muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const start = ctx.currentTime + at;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(vol, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

// playFound(audio) — the satisfying two-note chime on a found difference.
export function playFound(audio) {
  tone(audio, 660, 0, 0.16, 'sine', 0.22);
  tone(audio, 990, 0.09, 0.24, 'sine', 0.22);
  tone(audio, 1320, 0.18, 0.2, 'triangle', 0.1);
}

// playMiss(audio) — a dull low buzz for a wrong click.
export function playMiss(audio) {
  tone(audio, 140, 0, 0.18, 'sawtooth', 0.12);
  tone(audio, 110, 0.05, 0.2, 'sawtooth', 0.1);
}

// playHint(audio) — a soft high ping when a hint reveals a spot.
export function playHint(audio) {
  tone(audio, 1175, 0, 0.22, 'sine', 0.16);
}

// playClick(audio) — a quiet tick for buttons and UI.
export function playClick(audio) {
  tone(audio, 520, 0, 0.07, 'square', 0.06);
}

// playWin(audio) — a rising arpeggio for a cleared level.
export function playWin(audio) {
  [523, 659, 784, 1047].forEach((freq, i) => tone(audio, freq, i * 0.11, 0.3, 'triangle', 0.18));
}

// playLose(audio) — a falling line for time running out.
export function playLose(audio) {
  [392, 330, 262, 196].forEach((freq, i) => tone(audio, freq, i * 0.13, 0.3, 'triangle', 0.14));
}

// toggleMute(audio) — flip the mute flag; returns the new muted state.
export function toggleMute(audio) {
  audio.muted = !audio.muted;
  return audio.muted;
}
