// state.js — one clear job: hold the whole game state and its rules.
//
// State is plain data plus small pure helpers, so the renderer, the input
// handler and the shot presets can all read it without owning it. Nothing
// here touches the DOM or a canvas.

import { SCENES, sceneById } from './scenes.js';
import { differencesFor } from './differences.js';

// Screens the game can be on.
export const SCREENS = {
  START: 'start',
  PLAYING: 'playing',
  LEVEL_COMPLETE: 'level-complete',
  GAME_OVER: 'game-over',
  ALL_COMPLETE: 'all-complete',
};

// POINTS — the scoring table, kept in one place so a balance tweak is one edit.
export const POINTS = {
  FIND: 100,
  COMBO_STEP: 25,
  HINT_COST: 50,
  TIME_BONUS_PER_SECOND: 5,
  WRONG_CLICK_SECONDS: 3,
};

// createState() — a fresh game: level 1, nothing found, no score yet.
export function createState() {
  return {
    screen: SCREENS.START,
    levelIndex: 0,
    score: 0,
    combo: 0,
    bestCombo: 0,
    found: new Set(),
    hintsLeft: 3,
    hinted: null,
    timeLeft: SCENES[0].timeLimit,
    levelBonus: 0,
    stars: 0,
    totalFound: 0,
    wrongClicks: 0,
    message: '',
    messageAt: 0,
  };
}

// currentScene(state) — the catalogue entry of the level being played.
export function currentScene(state) {
  return SCENES[state.levelIndex] ?? SCENES[0];
}

// startLevel(state, index) — reset the per-level fields for a fresh level.
export function startLevel(state, index) {
  state.levelIndex = index;
  state.screen = SCREENS.PLAYING;
  state.found = new Set();
  state.hintsLeft = 3;
  state.hinted = null;
  state.combo = 0;
  state.timeLeft = currentScene(state).timeLimit;
  state.levelBonus = 0;
  state.stars = 0;
  state.message = '';
}

// foundCount(state) — how many differences of this level are found.
export function foundCount(state) {
  return state.found.size;
}

// remainingCount(state) — how many differences of this level are still hidden.
export function remainingCount(state) {
  return differencesFor(currentScene(state).id).length - state.found.size;
}

// isLevelDone(state) — true once every difference of the level is found.
export function isLevelDone(state) {
  return remainingCount(state) === 0;
}

// registerFind(state, diffId) — score one found difference, grow the combo.
export function registerFind(state, diffId) {
  state.found.add(diffId);
  state.combo += 1;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  const gained = POINTS.FIND + (state.combo - 1) * POINTS.COMBO_STEP;
  state.score += gained;
  state.totalFound += 1;
  return gained;
}

// registerMiss(state) — a wrong click breaks the combo and costs time.
export function registerMiss(state) {
  state.combo = 0;
  state.wrongClicks += 1;
  state.timeLeft = Math.max(0, state.timeLeft - POINTS.WRONG_CLICK_SECONDS);
}

// useHint(state) — spend one hint, or return null when none are left.
export function useHint(state) {
  if (state.hintsLeft <= 0) return null;
  const unfound = differencesFor(currentScene(state).id).filter((d) => !state.found.has(d.id));
  if (unfound.length === 0) return null;
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - POINTS.HINT_COST);
  state.hinted = unfound[0].id;
  return unfound[0];
}

// finishLevel(state) — time bonus and stars for a cleared level.
export function finishLevel(state) {
  state.levelBonus = Math.round(state.timeLeft) * POINTS.TIME_BONUS_PER_SECOND;
  state.score += state.levelBonus;
  const scene = currentScene(state);
  const fraction = state.timeLeft / scene.timeLimit;
  state.stars = fraction > 0.5 ? 3 : fraction > 0.2 ? 2 : 1;
  state.screen = state.levelIndex + 1 >= SCENES.length ? SCREENS.ALL_COMPLETE : SCREENS.LEVEL_COMPLETE;
}

// nextLevel(state) — move on after a level-complete screen.
export function nextLevel(state) {
  startLevel(state, state.levelIndex + 1);
}

// sceneById re-exported for callers that only import state.
export { sceneById };
