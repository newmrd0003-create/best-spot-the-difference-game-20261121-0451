// magnifier.js — one clear job: a 2x zoom lens that follows the mouse.
//
// Hover over either panel and a round lens shows the scene magnified two
// times, so a small difference can be inspected up close. The lens reads
// straight from the panel canvases, so it never needs an image file. It is
// off until the player turns it on (the 🔍 button or the L key), and it
// hides itself whenever the mouse leaves the panels.

const LENS_SIZE = 180;
const ZOOM = 2;
const SOURCE_SIZE = LENS_SIZE / ZOOM;

// createMagnifier(lensCanvas) — the lens state for one lens canvas element.
export function createMagnifier(lensCanvas) {
  lensCanvas.width = LENS_SIZE;
  lensCanvas.height = LENS_SIZE;
  return {
    canvas: lensCanvas,
    ctx: lensCanvas.getContext('2d'),
    enabled: false,
    visible: false,
  };
}

// setMagnifierEnabled(magnifier, on) — turn the lens on or off.
export function setMagnifierEnabled(magnifier, on) {
  magnifier.enabled = on;
  if (!on) hideMagnifier(magnifier);
  return magnifier.enabled;
}

// hideMagnifier(magnifier) — take the lens off the screen.
export function hideMagnifier(magnifier) {
  magnifier.visible = false;
  magnifier.canvas.parentElement.classList.add('hidden');
}

// showMagnifierAt(magnifier, sourceCanvas, event) — paint the zoomed patch
// under the mouse and park the lens beside the cursor.
export function showMagnifierAt(magnifier, sourceCanvas, event) {
  if (!magnifier.enabled) return;
  const rect = sourceCanvas.getBoundingClientRect();
  const scaleX = sourceCanvas.width / rect.width;
  const scaleY = sourceCanvas.height / rect.height;
  const sx = (event.clientX - rect.left) * scaleX;
  const sy = (event.clientY - rect.top) * scaleY;
  const ctx = magnifier.ctx;
  ctx.clearRect(0, 0, LENS_SIZE, LENS_SIZE);
  ctx.save();
  ctx.beginPath();
  ctx.arc(LENS_SIZE / 2, LENS_SIZE / 2, LENS_SIZE / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(
    sourceCanvas,
    sx - SOURCE_SIZE / 2,
    sy - SOURCE_SIZE / 2,
    SOURCE_SIZE,
    SOURCE_SIZE,
    0,
    0,
    LENS_SIZE,
    LENS_SIZE,
  );
  ctx.restore();
  ctx.strokeStyle = '#ffd76a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(LENS_SIZE / 2, LENS_SIZE / 2, LENS_SIZE / 2 - 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 215, 106, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(LENS_SIZE / 2 - 14, LENS_SIZE / 2);
  ctx.lineTo(LENS_SIZE / 2 + 14, LENS_SIZE / 2);
  ctx.moveTo(LENS_SIZE / 2, LENS_SIZE / 2 - 14);
  ctx.lineTo(LENS_SIZE / 2, LENS_SIZE / 2 + 14);
  ctx.stroke();
  const lens = magnifier.canvas.parentElement;
  lens.classList.remove('hidden');
  magnifier.visible = true;
  const x = Math.min(window.innerWidth - LENS_SIZE - 8, event.clientX + 24);
  const y = Math.min(window.innerHeight - LENS_SIZE - 8, event.clientY + 24);
  lens.style.left = `${Math.max(8, x)}px`;
  lens.style.top = `${Math.max(8, y)}px`;
}

// attachMagnifier(magnifier, leftCanvas, rightCanvas) — follow the mouse
// over both panels; the lens shows whichever panel the mouse is on.
export function attachMagnifier(magnifier, leftCanvas, rightCanvas) {
  for (const canvas of [leftCanvas, rightCanvas]) {
    canvas.addEventListener('mousemove', (event) => showMagnifierAt(magnifier, canvas, event));
    canvas.addEventListener('mouseleave', () => hideMagnifier(magnifier));
  }
}
