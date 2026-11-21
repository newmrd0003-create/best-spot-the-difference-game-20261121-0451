// scenes.js — one clear job: paint the three original scenes.
//
// Every scene is drawn procedurally on a 600 x 440 canvas, with no image
// file anywhere. Each painter takes (ctx, changed): `changed` is a Set of
// difference ids whose CHANGED version must be drawn, so the left panel is
// painted with an empty set and the right panel with all seven ids. A
// difference is always drawn at the same place in both panels — only its
// look changes — so the two pictures stay near-identical by construction.

import { SCENE_SIZE } from './differences.js';

const W = SCENE_SIZE.width;
const H = SCENE_SIZE.height;

// circle(ctx, x, y, r, fill) — filled disc, the smallest drawing verb.
function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// ellipse(ctx, x, y, rx, ry, fill) — filled ellipse.
function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

// vGradient(ctx, stops) — a vertical linear gradient over the whole scene.
function vGradient(ctx, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  for (const [at, colour] of stops) g.addColorStop(at, colour);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

// gull(ctx, x, y, scale, colour) — a tiny two-stroke gull in the sky.
function gull(ctx, x, y, scale, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.5 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11 * scale, y);
  ctx.quadraticCurveTo(x - 4 * scale, y - 8 * scale, x, y);
  ctx.quadraticCurveTo(x + 4 * scale, y - 8 * scale, x + 11 * scale, y);
  ctx.stroke();
}

// star(ctx, x, y, r, colour) — a four-point sparkle.
function star(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

// ---------------------------------------------------------------- harbour

export function drawHarbour(ctx, changed) {
  // Dusk sky: indigo at the top melting into ember orange at the horizon.
  vGradient(ctx, [[0, '#1b2350'], [0.45, '#4a3a72'], [0.62, '#c96f4a'], [0.66, '#e8a35c']]);
  // Low sun, half-sunk behind the sea line.
  circle(ctx, 470, 252, 34, '#ffd98a');
  circle(ctx, 470, 252, 46, 'rgba(255, 217, 138, 0.25)');
  // Stars, one of which is a difference.
  star(ctx, 180, 34, 5, '#ffffff');
  star(ctx, 250, 58, 4, '#ffeec2');
  star(ctx, 40, 110, 4, '#ffffff');
  star(ctx, 540, 40, 5, '#ffffff');
  if (!changed.has('star-vanished')) star(ctx, 92, 46, 7, '#ffeec2');
  // Gulls. One gull is a difference: it only flies in the left picture.
  if (!changed.has('gull-vanished')) gull(ctx, 118, 74, 1, '#10142e');
  gull(ctx, 170, 100, 0.8, '#10142e');
  gull(ctx, 60, 130, 0.7, '#10142e');
  // Sea: a gradient that fills only the water band, never the sky.
  const sea = ctx.createLinearGradient(0, 262, 0, H);
  sea.addColorStop(0, '#27355e');
  sea.addColorStop(1, '#101a38');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 262, W, H - 262);
  ctx.strokeStyle = 'rgba(255, 190, 120, 0.35)';
  ctx.lineWidth = 2;
  for (const [y, x0, x1] of [[290, 30, 150], [310, 380, 520], [340, 60, 220], [380, 330, 540], [410, 20, 180]]) {
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
  }
  // Sun glitter on the water.
  ctx.fillStyle = 'rgba(255, 217, 138, 0.4)';
  for (let i = 0; i < 5; i++) ctx.fillRect(448 + i * 6, 272 + i * 16, 44 - i * 6, 3);

  // Lighthouse on its rock, left of centre.
  ctx.fillStyle = '#3a3f66';
  ctx.beginPath();
  ctx.moveTo(238, 262);
  ctx.lineTo(362, 262);
  ctx.lineTo(342, 236);
  ctx.lineTo(258, 236);
  ctx.closePath();
  ctx.fill();
  // Tower.
  ctx.fillStyle = '#f2ead8';
  ctx.beginPath();
  ctx.moveTo(282, 236);
  ctx.lineTo(318, 236);
  ctx.lineTo(312, 92);
  ctx.lineTo(288, 92);
  ctx.closePath();
  ctx.fill();
  // The stripe: crimson on the left, teal on the right.
  ctx.fillStyle = changed.has('stripe-colour') ? '#2f8f83' : '#c0392b';
  ctx.beginPath();
  ctx.moveTo(284, 176);
  ctx.lineTo(316, 176);
  ctx.lineTo(314, 140);
  ctx.lineTo(286, 140);
  ctx.closePath();
  ctx.fill();
  // Lamp room and lamp.
  ctx.fillStyle = '#2c2f4a';
  ctx.fillRect(280, 66, 40, 28);
  if (changed.has('lighthouse-lamp')) {
    ctx.fillStyle = '#20223a';
    ctx.fillRect(286, 70, 28, 20);
  } else {
    ctx.fillStyle = '#ffe27a';
    ctx.fillRect(286, 70, 28, 20);
    ctx.fillStyle = 'rgba(255, 226, 122, 0.28)';
    ctx.beginPath();
    ctx.moveTo(286, 80);
    ctx.lineTo(180, 60);
    ctx.lineTo(180, 100);
    ctx.lineTo(286, 82);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(314, 80);
    ctx.lineTo(430, 58);
    ctx.lineTo(430, 102);
    ctx.lineTo(314, 82);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#2c2f4a';
  ctx.beginPath();
  ctx.moveTo(276, 66);
  ctx.lineTo(324, 66);
  ctx.lineTo(312, 52);
  ctx.lineTo(288, 52);
  ctx.closePath();
  ctx.fill();

  // Fishing boat, right of centre, riding low on the water.
  ctx.fillStyle = '#5d2f24';
  ctx.beginPath();
  ctx.moveTo(336, 268);
  ctx.lineTo(452, 268);
  ctx.lineTo(432, 296);
  ctx.lineTo(356, 296);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7a4030';
  ctx.fillRect(336, 268, 116, 6);
  // Cabin with its window: round on the left, square on the right.
  ctx.fillStyle = '#8a4f38';
  ctx.fillRect(352, 236, 52, 32);
  if (changed.has('cabin-window')) {
    ctx.fillStyle = '#ffe9a8';
    ctx.fillRect(366, 244, 16, 16);
  } else {
    circle(ctx, 374, 252, 9, '#ffe9a8');
  }
  // Mast and flag: scarlet on the left, teal on the right.
  ctx.fillStyle = '#3a241c';
  ctx.fillRect(400, 182, 5, 88);
  ctx.fillStyle = changed.has('flag-colour') ? '#2f8f83' : '#d64533';
  ctx.beginPath();
  ctx.moveTo(405, 186);
  ctx.lineTo(438, 194);
  ctx.lineTo(405, 206);
  ctx.closePath();
  ctx.fill();

  // Red buoy, bobbing far right — gone from the right picture.
  if (!changed.has('buoy-vanished')) {
    circle(ctx, 478, 348, 12, '#c0392b');
    ctx.fillStyle = '#f2ead8';
    ctx.fillRect(472, 344, 12, 5);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.ellipse(478, 362, 20, 4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// ----------------------------------------------------------------- market

export function drawMarket(ctx, changed) {
  // Night sky over the market square.
  vGradient(ctx, [[0, '#141a3d'], [0.5, '#232a55'], [1, '#3a2c52']]);
  star(ctx, 60, 40, 5, '#ffeec2');
  star(ctx, 560, 30, 4, '#ffffff');
  star(ctx, 330, 26, 4, '#ffeec2');
  // Cobblestones.
  ctx.fillStyle = '#4a4460';
  ctx.fillRect(0, 360, W, 80);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 2;
  for (let x = 0; x < W; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 360);
    ctx.lineTo(x - 20, 440);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, 400);
  ctx.lineTo(W, 400);
  ctx.stroke();

  // String lights sagging across the top, with bunting below them.
  ctx.strokeStyle = '#0c0f22';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.quadraticCurveTo(300, 96, 600, 30);
  ctx.stroke();
  const flagColours = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db'];
  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    const x = 20 + t * 560;
    const y = 30 + Math.sin(t * Math.PI) * 52;
    // One bunting flag is missing from the right picture.
    if (changed.has('bunting-flag') && i === 4) continue;
    ctx.fillStyle = flagColours[i % 4];
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x + 10, y);
    ctx.lineTo(x, y + 22);
    ctx.closePath();
    ctx.fill();
  }
  // Bulbs along the same wire; one is dark on the right.
  for (let i = 0; i < 9; i++) {
    const t = (i + 0.5) / 9;
    const x = 30 + t * 540;
    const y = 32 + Math.sin(t * Math.PI) * 50 + 8;
    if (changed.has('bulb-dark') && i === 7) {
      circle(ctx, x, y, 6, '#3a3f5e');
    } else {
      circle(ctx, x, y, 6, '#ffd76a');
      circle(ctx, x, y, 11, 'rgba(255, 215, 106, 0.25)');
    }
  }

  // Three stalls. Left stall: striped awning, right stall: plain awning.
  drawStall(ctx, 40, 200, 150, '#8e44ad', 'left');
  drawStall(ctx, 235, 190, 170, '#c0392b', 'centre');
  drawStall(ctx, 440, 200, 130, '#2471a3', 'right');
  // The left awning stripe flips colour on the right.
  ctx.fillStyle = changed.has('awning-stripe') ? '#2f8f83' : '#f1c40f';
  ctx.fillRect(58, 208, 18, 26);
  ctx.fillRect(94, 208, 18, 26);
  ctx.fillRect(130, 208, 18, 26);

  // Hanging paper lantern by the left stall: red on the left, green on the right.
  const lanternColour = changed.has('lantern-colour') ? '#27ae60' : '#e74c3c';
  ctx.strokeStyle = '#0c0f22';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(148, 84);
  ctx.lineTo(148, 96);
  ctx.stroke();
  ellipse(ctx, 148, 116, 18, 22, lanternColour);
  ctx.fillStyle = '#f1c40f';
  ctx.fillRect(142, 92, 12, 6);
  ctx.fillRect(142, 134, 12, 6);

  // Wooden sign above the centre stall: a crescent on the left, a star on the right.
  ctx.fillStyle = '#6e4a1f';
  ctx.fillRect(262, 108, 76, 38);
  ctx.fillStyle = '#f5e6c8';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(changed.has('sign-symbol') ? '★' : '☾', 300, 128);

  // The cat asleep on the right stall roof — gone from the right picture.
  if (!changed.has('cat-vanished')) {
    ctx.fillStyle = '#1c1c28';
    ellipse(ctx, 436, 186, 22, 10, '#1c1c28');
    circle(ctx, 452, 178, 8, '#1c1c28');
    ctx.beginPath();
    ctx.moveTo(446, 172);
    ctx.lineTo(448, 162);
    ctx.lineTo(452, 171);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(454, 172);
    ctx.lineTo(457, 162);
    ctx.lineTo(459, 171);
    ctx.closePath();
    ctx.fill();
  }

  // Basket of apples on the centre stall counter: three on the left, two on the right.
  ctx.fillStyle = '#7a4a21';
  ctx.beginPath();
  ctx.ellipse(352, 306, 34, 12, 0, 0, Math.PI);
  ctx.fill();
  circle(ctx, 334, 292, 10, '#d64533');
  circle(ctx, 352, 288, 10, '#d64533');
  if (!changed.has('apple-count')) circle(ctx, 370, 292, 10, '#d64533');
  // A few jars and a lantern glow on the counters.
  circle(ctx, 90, 300, 9, '#f1c40f');
  circle(ctx, 118, 300, 9, '#2ecc71');
  circle(ctx, 500, 300, 9, '#e67e22');
}

// drawStall(ctx, x, y, w, colour, kind) — one market stall with awning,
// counter and a warm glow spilling from inside.
function drawStall(ctx, x, y, w, colour, kind) {
  ctx.fillStyle = '#2c2118';
  ctx.fillRect(x + 8, y + 90, w - 16, 150);
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(x, y + 34);
  ctx.lineTo(x + w, y + 34);
  ctx.lineTo(x + w - 12, y);
  ctx.lineTo(x + 12, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 220, 130, 0.35)';
  ctx.fillRect(x + 8, y + 34, w - 16, 6);
  ctx.fillStyle = '#5d3a1a';
  ctx.fillRect(x, y + 90, w, 14);
  ctx.fillStyle = '#ffd76a';
  ctx.fillRect(x + 14, y + 120, w - 28, 60);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let i = 0; i < 3; i++) ctx.fillRect(x + 22 + i * 34, y + 128, 20, 44);
  if (kind === 'centre') {
    ctx.fillStyle = '#f5e6c8';
    ctx.font = 'bold 15px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPICES', x + w / 2, y + 118);
  }
}

// ------------------------------------------------------------------ coral

export function drawCoral(ctx, changed) {
  // Sunlit water: teal at the top, deep blue at the sand.
  vGradient(ctx, [[0, '#1f8fa8'], [0.55, '#14658f'], [1, '#0b3a5e']]);
  // Light rays from the surface.
  ctx.fillStyle = 'rgba(255, 255, 220, 0.10)';
  for (const [x, tilt] of [[80, 40], [220, -30], [380, 50], [520, -40]]) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 60, 0);
    ctx.lineTo(x + 60 + tilt, 330);
    ctx.lineTo(x + tilt, 330);
    ctx.closePath();
    ctx.fill();
  }
  // Bubbles rising: one fewer on the right.
  const bubbles = [[306, 92, 8], [322, 120, 5], [290, 130, 6], [340, 80, 4]];
  bubbles.forEach(([x, y, r], i) => {
    if (changed.has('bubble-count') && i === 0) return;
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  });
  // Sand floor.
  ctx.fillStyle = '#e8d29a';
  ctx.fillRect(0, 330, W, 110);
  ctx.fillStyle = '#d9c184';
  for (let i = 0; i < 14; i++) ellipse(ctx, 30 + i * 42, 372 + (i % 3) * 18, 16, 4, '#d9c184');

  // Branching coral, pink on the left, orange on the right.
  const coralColour = changed.has('coral-colour') ? '#e67e22' : '#ff6b9d';
  drawBranch(ctx, 252, 330, coralColour, 0);
  drawBranch(ctx, 232, 330, coralColour, -0.5);
  drawBranch(ctx, 274, 330, coralColour, 0.5);
  circle(ctx, 252, 292, 10, coralColour);

  // Blue fish with stripes: three stripes on the left, two on the right.
  drawFish(ctx, 152, 152, 46, '#3a9bdc', -1);
  ctx.fillStyle = '#123a5e';
  ctx.fillRect(136, 132, 5, 40);
  ctx.fillRect(152, 132, 5, 40);
  if (!changed.has('fish-stripes')) ctx.fillRect(168, 132, 5, 40);

  // Little yellow fish: swims left on the left, right on the right.
  drawFish(ctx, 384, 186, 34, '#f1c40f', changed.has('fish-direction') ? 1 : -1);

  // Seaweed: the tall frond on the far right grows an extra frond.
  drawSeaweed(ctx, 508, 330, '#2ecc71');
  if (changed.has('seaweed-frond')) drawSeaweed(ctx, 528, 330, '#27ae60');
  drawSeaweed(ctx, 60, 330, '#27ae60');

  // Starfish on the sand — gone from the right picture.
  if (!changed.has('starfish-vanished')) drawStarfish(ctx, 428, 342, '#ff8c42');
  // Shell on the sand — gone from the right picture.
  if (!changed.has('shell-vanished')) {
    ctx.fillStyle = '#f5e6c8';
    ctx.beginPath();
    ctx.arc(92, 356, 14, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d9a05b';
    ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(92, 356);
      ctx.lineTo(92 + i * 10, 344);
      ctx.stroke();
    }
  }
  // A small purple fish for depth, identical on both panels.
  drawFish(ctx, 470, 120, 26, '#9b59b6', 1);
}

// drawBranch(ctx, x, y, colour, lean) — one coral branch leaning sideways.
function drawBranch(ctx, x, y, colour, lean) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + lean * 30, y - 40, x + lean * 55, y - 70);
  ctx.stroke();
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(x + lean * 28, y - 36);
  ctx.quadraticCurveTo(x + lean * 55, y - 50, x + lean * 70, y - 66);
  ctx.stroke();
}

// drawFish(ctx, x, y, len, colour, dir) — a simple fish; dir -1 faces left.
function drawFish(ctx, x, y, len, colour, dir) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, len / 2, len / 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - dir * len / 2, y);
  ctx.lineTo(x - dir * (len / 2 + 16), y - len / 5);
  ctx.lineTo(x - dir * (len / 2 + 16), y + len / 5);
  ctx.closePath();
  ctx.fill();
  circle(ctx, x + dir * len / 5, y - 3, 3, '#101820');
}

// drawSeaweed(ctx, x, y, colour) — one wavy frond rising from the sand.
function drawSeaweed(ctx, x, y, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x - 14, y - 40, x + 6, y - 78);
  ctx.stroke();
}

// drawStarfish(ctx, x, y, colour) — a five-armed starfish.
function drawStarfish(ctx, x, y, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
    const px = x + Math.cos(a) * 16;
    const py = y + Math.sin(a) * 16;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
    const mid = a + Math.PI / 5;
    ctx.lineTo(x + Math.cos(mid) * 7, y + Math.sin(mid) * 7);
  }
  ctx.closePath();
  ctx.fill();
  circle(ctx, x, y, 4, '#e67e22');
}

// SCENES — the catalogue the rest of the game reads: id, title, subtitle,
// painter, time limit in seconds, and a short tip shown on the start card.
export const SCENES = [
  {
    id: 'harbour',
    title: 'Harbour at Dusk',
    subtitle: 'Seven lanterns of difference hide in the harbour light.',
    painter: drawHarbour,
    timeLimit: 120,
    tip: 'Check the lighthouse first — it keeps two secrets.',
  },
  {
    id: 'market',
    title: 'Night Market',
    subtitle: 'The stalls are buzzing. Seven things are not the same.',
    painter: drawMarket,
    timeLimit: 105,
    tip: 'Count the apples, then count the bulbs.',
  },
  {
    id: 'coral',
    title: 'Coral Garden',
    subtitle: 'Under the water, seven small things changed.',
    painter: drawCoral,
    timeLimit: 90,
    tip: 'The fish are honest — one of them is lying.',
  },
];

// sceneById(id) — the catalogue entry for one scene id.
export function sceneById(id) {
  return SCENES.find((scene) => scene.id === id) ?? SCENES[0];
}
