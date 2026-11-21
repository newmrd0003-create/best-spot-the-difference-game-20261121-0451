// timer.js — one clear job: the per-level countdown.
//
// The timer is driven by wall-clock deltas, never by frame counts, so the
// bar drains at the same speed on any machine. It only ticks while the
// game is on the playing screen, and it freezes while an overlay is up.

// createTimer() — a timer that has not started yet.
export function createTimer() {
  return { lastTick: 0, running: false };
}

// startTimer(timer) — begin (or resume) counting from now.
export function startTimer(timer) {
  timer.lastTick = performance.now();
  timer.running = true;
}

// stopTimer(timer) — freeze the countdown.
export function stopTimer(timer) {
  timer.running = false;
}

// tickTimer(timer, state) — drain state.timeLeft by the real elapsed time.
// Returns true the moment the countdown reaches zero.
export function tickTimer(timer, state) {
  if (!timer.running) return false;
  const now = performance.now();
  const elapsed = (now - timer.lastTick) / 1000;
  timer.lastTick = now;
  state.timeLeft = Math.max(0, state.timeLeft - elapsed);
  return state.timeLeft <= 0;
}

// timeFraction(state) — 0..1 of the level's time still left, for the bar.
export function timeFraction(state, scene) {
  return Math.max(0, Math.min(1, state.timeLeft / scene.timeLimit));
}

// formatTime(seconds) — "1:47" style, for the HUD clock.
export function formatTime(seconds) {
  const total = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
}

// isLowTime(state, scene) — true in the last fifth of the level: the bar
// turns red and the clock pulses, so the pressure is felt, not just read.
export function isLowTime(state, scene) {
  return state.timeLeft <= scene.timeLimit * 0.2;
}
