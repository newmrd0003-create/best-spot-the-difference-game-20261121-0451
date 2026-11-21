// keyboard.js — one clear job: play the whole game from the keyboard.
//
// Arrow keys move a crosshair over the panels, Enter guesses at the
// crosshair, Tab switches panels, H asks for a hint, L toggles the
// magnifier, N jumps to the next scene, R restarts the level, and 1–6 jump
// straight to a scene. The crosshair itself is drawn by render.js from
// the state this file owns, so mouse players never see it.

// createCrosshair() — the crosshair: off until an arrow key is pressed.
export function createCrosshair() {
  return { x: 300, y: 220, panel: 'left', visible: false };
}

// moveCrosshair(crosshair, dx, dy) — nudge it, clamped inside the scene.
export function moveCrosshair(crosshair, dx, dy) {
  crosshair.visible = true;
  crosshair.x = Math.max(10, Math.min(590, crosshair.x + dx));
  crosshair.y = Math.max(10, Math.min(430, crosshair.y + dy));
}

// switchCrosshairPanel(crosshair) — hop the crosshair to the other picture.
export function switchCrosshairPanel(crosshair) {
  crosshair.panel = crosshair.panel === 'left' ? 'right' : 'left';
  crosshair.visible = true;
}

// attachKeyboard(crosshair, actions) — wire the keys. `actions` carries one
// small callback per key: onGuess(point), onHint(), onToggleLens(),
// onNextScene(), onRestart(), onJumpScene(index), onStart().
export function attachKeyboard(crosshair, actions) {
  document.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 48 : 14;
    if (event.key === 'ArrowLeft') {
      moveCrosshair(crosshair, -step, 0);
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      moveCrosshair(crosshair, step, 0);
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      moveCrosshair(crosshair, 0, -step);
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      moveCrosshair(crosshair, 0, step);
      event.preventDefault();
    } else if (event.key === 'Enter') {
      if (crosshair.visible) actions.onGuess({ x: crosshair.x, y: crosshair.y });
    } else if (event.key === 'Tab') {
      switchCrosshairPanel(crosshair);
      event.preventDefault();
    } else if (event.key === 'h' || event.key === 'H') {
      actions.onHint();
    } else if (event.key === 'l' || event.key === 'L') {
      actions.onToggleLens();
    } else if (event.key === 'n' || event.key === 'N') {
      actions.onNextScene();
    } else if (event.key === 'r' || event.key === 'R') {
      actions.onRestart();
    } else if (/^[1-6]$/.test(event.key)) {
      actions.onJumpScene(Number(event.key) - 1);
    }
  });
}
