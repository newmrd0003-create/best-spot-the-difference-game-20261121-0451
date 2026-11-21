// main.js — one clear job: wire the game together and run its loop.
//
// This file owns the DOM: it finds the canvases and HUD elements, connects
// state + timer + audio + input + render, and drives requestAnimationFrame.
// The game rules live in state.js, the pictures in scenes.js, the sounds in
// audio.js — this file only glues them.

import { createState, SCREENS, currentScene, startLevel, foundCount, remainingCount, isLevelDone, registerFind, registerMiss, useHint, finishLevel, nextLevel, POINTS } from './state.js';
import { createTimer, startTimer, stopTimer, tickTimer, timeFraction, formatTime, isLowTime } from './timer.js';
import { createAudio, playFound, playMiss, playHint, playClick, playWin, playLose, toggleMute } from './audio.js';
import { createRenderer, renderFrame, markFound, shake, setCrosshair } from './render.js';
import { attachPanelClicks, hitTest } from './input.js';
import { createMagnifier, attachMagnifier, setMagnifierEnabled } from './magnifier.js';
import { createCrosshair, attachKeyboard } from './keyboard.js';
import { differencesFor } from './differences.js';
import { SCENES } from './scenes.js';
import { applyShot, shotFromUrl } from './shots.js';

const $ = (id) => document.getElementById(id);

const state = createState();
const timer = createTimer();
const audio = createAudio();
const renderer = createRenderer($('panel-left'), $('panel-right'));
const magnifier = createMagnifier($('lens-canvas'));
const crosshair = createCrosshair();
setCrosshair(renderer, crosshair);

let toastTimer = 0;

// showToast(text) — a one-line message under the panels, auto-cleared.
function showToast(text) {
  const el = $('toast');
  el.textContent = text;
  el.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('visible'), 2600);
}

// updateHud() — refresh every HUD number from the state, once a frame.
function updateHud() {
  const scene = currentScene(state);
  $('hud-level').textContent = `Level ${state.levelIndex + 1} of ${SCENES.length} · ${scene.title}`;
  $('hud-score').textContent = `Score ${state.score}`;
  $('hud-combo').textContent = state.combo > 1 ? `Combo ×${state.combo}` : '';
  $('hud-counter').textContent = `${foundCount(state)} of ${differencesFor(scene.id).length} found · ${remainingCount(state)} remaining`;
  $('hud-time').textContent = formatTime(state.timeLeft);
  $('hud-time').classList.toggle('low', isLowTime(state, scene));
  $('hud-hints').textContent = `Hints ${state.hintsLeft}`;
  $('hud-hint-btn').disabled = state.hintsLeft <= 0 || state.screen !== SCREENS.PLAYING;
  const bar = $('time-bar');
  bar.style.width = `${timeFraction(state, scene) * 100}%`;
  bar.classList.toggle('low', isLowTime(state, scene));
  for (const btn of document.querySelectorAll('#scene-nav button')) {
    btn.classList.toggle('active', Number(btn.dataset.scene) === state.levelIndex);
  }
}

// showScreen(name) — switch which overlay card is visible.
function showScreen(name) {
  for (const screen of ['start', 'level-complete', 'game-over', 'all-complete']) {
    $(`screen-${screen}`).classList.toggle('hidden', screen !== name);
  }
  $('panels').classList.toggle('dimmed', name !== '');
}

// startGame() — from the title screen into level 1.
function startGame() {
  playClick(audio);
  startLevel(state, 0);
  startTimer(timer);
  showScreen('');
}

// jumpToScene(index) — jump straight to any scene, from any screen.
function jumpToScene(index) {
  if (index < 0 || index >= SCENES.length) return;
  playClick(audio);
  startLevel(state, index);
  startTimer(timer);
  showScreen('');
}

// toggleLens() — switch the magnifier on or off, button and key agree.
function toggleLens() {
  const on = setMagnifierEnabled(magnifier, !magnifier.enabled);
  $('btn-lens').textContent = on ? '🔍 Lens on' : '🔍 Lens off';
  $('btn-lens').classList.toggle('on', on);
  showToast(on ? 'Magnifier on — hover a picture to zoom in 2×.' : 'Magnifier off.');
}

// onPanelPoint(point) — one click on either panel, in scene coordinates.
function onPanelPoint(point) {
  if (state.screen !== SCREENS.PLAYING) return;
  const scene = currentScene(state);
  const diff = hitTest(point, differencesFor(scene.id), state.found);
  if (diff) {
    const gained = registerFind(state, diff.id);
    markFound(renderer, diff.id);
    playFound(audio);
    state.hinted = state.hinted === diff.id ? null : state.hinted;
    showToast(`Found it — ${diff.label}! +${gained} points`);
    if (isLevelDone(state)) {
      stopTimer(timer);
      finishLevel(state);
      playWin(audio);
      fillLevelComplete();
      showScreen(state.screen === SCREENS.ALL_COMPLETE ? 'all-complete' : 'level-complete');
    }
  } else {
    registerMiss(state);
    shake(renderer);
    playMiss(audio);
    showToast(`Not there — minus ${POINTS.WRONG_CLICK_SECONDS} seconds!`);
  }
}

// onHint() — spend a hint and point at one unfound difference.
function onHint() {
  if (state.screen !== SCREENS.PLAYING) return;
  const diff = useHint(state);
  if (!diff) {
    showToast(state.hintsLeft <= 0 ? 'No hints left this level.' : 'Nothing left to hint at!');
    return;
  }
  playHint(audio);
  showToast(`Hint: ${diff.label}. −${POINTS.HINT_COST} points.`);
}

// fillLevelComplete() — the stars, bonus and score of the cleared level.
function fillLevelComplete() {
  const scene = currentScene(state);
  $('complete-title').textContent = `${scene.title} cleared!`;
  $('complete-stars').textContent = '★'.repeat(state.stars) + '☆'.repeat(3 - state.stars);
  $('complete-detail').textContent =
    `All 7 differences found · time bonus +${state.levelBonus} · best combo ×${state.bestCombo} · score ${state.score}`;
}

// fillAllComplete() — the final card after the sixth level.
function fillAllComplete() {
  $('all-score').textContent = `Final score ${state.score} · ${state.totalFound} differences found · best combo ×${state.bestCombo}`;
}

// fillSceneNav() — the 1–6 scene buttons under the panels.
function fillSceneNav() {
  const nav = $('scene-nav');
  nav.innerHTML = '';
  for (const [i, scene] of SCENES.entries()) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.scene = String(i);
    btn.textContent = `${i + 1}. ${scene.title}`;
    btn.addEventListener('click', () => jumpToScene(i));
    nav.appendChild(btn);
  }
}

// fillStartScreen() — the three level cards on the title screen.
function fillStartScreen() {
  const list = $('level-list');
  list.innerHTML = '';
  for (const [i, scene] of SCENES.entries()) {
    const card = document.createElement('div');
    card.className = 'level-card';
    card.innerHTML = `<strong>${i + 1}. ${scene.title}</strong><span>7 differences · ${scene.timeLimit}s · ${scene.tip}</span>`;
    list.appendChild(card);
  }
}

// frame() — the loop: tick the timer, paint the panels, refresh the HUD.
function frame() {
  if (state.screen === SCREENS.PLAYING) {
    if (tickTimer(timer, state)) {
      stopTimer(timer);
      state.screen = SCREENS.GAME_OVER;
      playLose(audio);
      $('over-detail').textContent =
        `${remainingCount(state)} difference${remainingCount(state) === 1 ? '' : 's'} still hidden in ${currentScene(state).title}.`;
      showScreen('game-over');
    }
  }
  renderFrame(renderer, state, currentScene(state));
  updateHud();
  requestAnimationFrame(frame);
}

// Wire the buttons and the panels, then start.
$('btn-play').addEventListener('click', startGame);
$('btn-next').addEventListener('click', () => {
  playClick(audio);
  nextLevel(state);
  startTimer(timer);
  showScreen('');
});
$('btn-retry').addEventListener('click', () => {
  playClick(audio);
  startLevel(state, state.levelIndex);
  startTimer(timer);
  showScreen('');
});
$('btn-again').addEventListener('click', () => {
  playClick(audio);
  const fresh = createState();
  Object.assign(state, fresh);
  startLevel(state, 0);
  startTimer(timer);
  showScreen('');
});
$('hud-hint-btn').addEventListener('click', onHint);
$('btn-lens').addEventListener('click', toggleLens);
$('btn-mute').addEventListener('click', (event) => {
  const muted = toggleMute(audio);
  event.currentTarget.textContent = muted ? '🔇 Sound off' : '🔊 Sound on';
});
attachPanelClicks($('panel-left'), $('panel-right'), onPanelPoint);
attachMagnifier(magnifier, $('panel-left'), $('panel-right'));
attachKeyboard(crosshair, {
  onGuess: (point) => onPanelPoint(point),
  onHint,
  onToggleLens: toggleLens,
  onNextScene: () => {
    if (state.screen === SCREENS.PLAYING || state.screen === SCREENS.LEVEL_COMPLETE) jumpToScene(state.levelIndex + 1);
  },
  onRestart: () => {
    if (state.screen === SCREENS.PLAYING) jumpToScene(state.levelIndex);
  },
  onJumpScene: (index) => jumpToScene(index),
  onStart: () => {},
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && state.screen === SCREENS.START) startGame();
});

// Behind the overlays the harbour is always painted, so the title screen
// already shows the two panels and what the game is about.
fillStartScreen();
fillSceneNav();
if (!applyShot(state, timer, shotFromUrl())) {
  state.screen = SCREENS.START;
  showScreen('start');
} else if (state.screen === SCREENS.LEVEL_COMPLETE || state.screen === SCREENS.ALL_COMPLETE) {
  fillLevelComplete();
  fillAllComplete();
  showScreen(state.screen === SCREENS.ALL_COMPLETE ? 'all-complete' : 'level-complete');
} else if (state.screen === SCREENS.PLAYING) {
  showScreen('');
} else {
  showScreen('start');
}
fillAllComplete();
requestAnimationFrame(frame);
