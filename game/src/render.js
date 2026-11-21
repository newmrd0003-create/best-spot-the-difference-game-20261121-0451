// render.js — one clear job: paint both panels and the markers on them.
//
// Each frame the left panel is painted with no differences and the right
// panel with all seven, then the found markers are drawn on both: a gold
// ring that pops in, a check mark, and a fading ripple. A hinted difference
// gets a pulsing ring instead. A wrong click shakes the frame briefly.

import { SCENE_SIZE, differencesFor } from './differences.js';

// createRenderer(left, right) — the per-frame painter for the two canvases.
export function createRenderer(left, right) {
  left.width = SCENE_SIZE.width;
  left.height = SCENE_SIZE.height;
  right.width = SCENE_SIZE.width;
  right.height = SCENE_SIZE.height;
  return {
    left,
    right,
    leftCtx: left.getContext('2d'),
    rightCtx: right.getContext('2d'),
    popAt: new Map(),
    rippleAt: new Map(),
    shakeUntil: 0,
    crosshair: null,
  };
}

// setCrosshair(renderer, crosshair) — the keyboard crosshair to draw, if any.
export function setCrosshair(renderer, crosshair) {
  renderer.crosshair = crosshair;
}

// drawCrosshair(ctx, crosshair) — a gold crosshair at the keyboard cursor.
function drawCrosshair(ctx, crosshair) {
  ctx.save();
  ctx.strokeStyle = '#ffd76a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(crosshair.x, crosshair.y, 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(crosshair.x - 28, crosshair.y);
  ctx.lineTo(crosshair.x - 10, crosshair.y);
  ctx.moveTo(crosshair.x + 10, crosshair.y);
  ctx.lineTo(crosshair.x + 28, crosshair.y);
  ctx.moveTo(crosshair.x, crosshair.y - 28);
  ctx.lineTo(crosshair.x, crosshair.y - 10);
  ctx.moveTo(crosshair.x, crosshair.y + 10);
  ctx.lineTo(crosshair.x, crosshair.y + 28);
  ctx.stroke();
  ctx.restore();
}

// allDiffIds(sceneId) — the Set of every difference id, for the right panel.
function allDiffIds(sceneId) {
  return new Set(differencesFor(sceneId).map((d) => d.id));
}

// markFound(renderer, diffId) — start the pop + ripple animation for a find.
export function markFound(renderer, diffId) {
  const now = performance.now();
  renderer.popAt.set(diffId, now);
  renderer.rippleAt.set(diffId, now);
}

// shake(renderer) — jolt both panels for 180 ms after a wrong click.
export function shake(renderer) {
  renderer.shakeUntil = performance.now() + 180;
}

// drawMarker(ctx, diff, pop) — one gold ring + check at a found spot.
// `pop` is 0..1: the ring grows from the centre in the first 180 ms.
function drawMarker(ctx, diff, pop) {
  const ease = 1 - Math.pow(1 - Math.min(1, pop), 3);
  const r = diff.r * (0.4 + 0.6 * ease);
  ctx.save();
  ctx.globalAlpha = 0.35 + 0.65 * ease;
  // One bold gold ring, then a big thick check — no inner ring, so the
  // mark reads as a check at a glance instead of a swirl.
  ctx.strokeStyle = '#ffd76a';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#fff3c4';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(diff.x - 12, diff.y + 1);
  ctx.lineTo(diff.x - 3, diff.y + 10);
  ctx.lineTo(diff.x + 14, diff.y - 10);
  ctx.stroke();
  ctx.restore();
}

// drawRipple(ctx, diff, age) — an expanding, fading ring after a find.
function drawRipple(ctx, diff, age) {
  const t = Math.min(1, age / 600);
  if (t >= 1) return;
  ctx.save();
  ctx.globalAlpha = (1 - t) * 0.7;
  ctx.strokeStyle = '#ffd76a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, diff.r + t * 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// drawHintRing(ctx, diff, now) — a pulsing ring that points at the hinted spot.
function drawHintRing(ctx, diff, now) {
  const pulse = 0.5 + 0.5 * Math.sin(now / 180);
  ctx.save();
  ctx.globalAlpha = 0.55 + 0.35 * pulse;
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, diff.r + 6 + pulse * 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// renderFrame(renderer, state, scene) — paint one frame of the current level.
export function renderFrame(renderer, state, scene) {
  const now = performance.now();
  const diffs = differencesFor(scene.id);
  const shakeMs = Math.max(0, renderer.shakeUntil - now);
  const dx = shakeMs > 0 ? (Math.random() - 0.5) * 7 : 0;
  const dy = shakeMs > 0 ? (Math.random() - 0.5) * 7 : 0;

  for (const [ctx, changed, side] of [
    [renderer.leftCtx, new Set(), 'left'],
    [renderer.rightCtx, allDiffIds(scene.id), 'right'],
  ]) {
    ctx.save();
    ctx.clearRect(0, 0, SCENE_SIZE.width, SCENE_SIZE.height);
    ctx.translate(dx, dy);
    scene.painter(ctx, changed);
    for (const diff of diffs) {
      if (!state.found.has(diff.id)) continue;
      const popAge = now - (renderer.popAt.get(diff.id) ?? now);
      drawMarker(ctx, diff, popAge / 180);
      const rippleAge = now - (renderer.rippleAt.get(diff.id) ?? now);
      drawRipple(ctx, diff, rippleAge);
    }
    if (state.hinted) {
      const hinted = diffs.find((d) => d.id === state.hinted);
      if (hinted && !state.found.has(hinted.id)) drawHintRing(ctx, hinted, now);
    }
    if (renderer.crosshair?.visible && renderer.crosshair.panel === side) {
      drawCrosshair(ctx, renderer.crosshair);
    }
    ctx.restore();
  }
}
