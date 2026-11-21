// shots.js — one clear job: deterministic screenshot states.
//
// `?shot=<name>` puts the game in a fixed, repeatable state so a screenshot
// is the same render every time it is taken. Nothing here is random, and
// the timer is frozen for shots so the clock never drifts between runs.
//
//   start    — the title screen over the harbour scene
//   play     — mid-play on the harbour, 2 of 7 found, 5 still hidden
//   market   — mid-play on the night market, 3 of 7 found
//   complete — the level-complete card after clearing the harbour
//
// Any other value (or none) starts the game normally at the title screen.

import { SCREENS, startLevel, finishLevel, registerFind } from './state.js';
import { differencesFor } from './differences.js';

// applyShot(state, timer, shot) — move a fresh state into the named shot.
// Returns true when a known shot was applied.
export function applyShot(state, timer, shot) {
  if (!shot) return false;
  if (shot === 'start') {
    state.screen = SCREENS.START;
    return true;
  }
  if (shot === 'play') {
    startLevel(state, 0);
    state.timeLeft = 78;
    const diffs = differencesFor('harbour');
    registerFind(state, diffs[0].id);
    registerFind(state, diffs[3].id);
    state.combo = 2;
    timer.running = false;
    return true;
  }
  if (shot === 'market') {
    startLevel(state, 1);
    state.score = 245;
    state.timeLeft = 61;
    const diffs = differencesFor('market');
    registerFind(state, diffs[0].id);
    registerFind(state, diffs[2].id);
    registerFind(state, diffs[4].id);
    state.combo = 3;
    timer.running = false;
    return true;
  }
  if (shot === 'coral') {
    startLevel(state, 2);
    state.score = 890;
    state.timeLeft = 44;
    const diffs = differencesFor('coral');
    registerFind(state, diffs[0].id);
    registerFind(state, diffs[3].id);
    state.combo = 2;
    timer.running = false;
    return true;
  }
  if (shot === 'complete') {
    startLevel(state, 0);
    state.timeLeft = 52;
    for (const diff of differencesFor('harbour')) registerFind(state, diff.id);
    finishLevel(state);
    timer.running = false;
    return true;
  }
  return false;
}

// shotFromUrl() — the ?shot= value of the current page URL, or null.
export function shotFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('shot');
}
