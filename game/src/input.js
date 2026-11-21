// input.js — one clear job: turn a mouse click on either panel into a
// game decision: a found difference, or a miss.
//
// A click is tested against the unfound differences in scene coordinates,
// so it works on either panel and at any display scale: the canvas's
// bounding rect maps the click back into the 600 x 440 scene space.

// toScenePoint(event, canvas) — the click as a point in scene coordinates.
export function toScenePoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

// hitTest(point, diffs, found) — the first unfound difference whose circle
// contains the point, or null. The nearest match wins when circles overlap.
export function hitTest(point, diffs, found) {
  let best = null;
  let bestDist = Infinity;
  for (const diff of diffs) {
    if (found.has(diff.id)) continue;
    const dx = point.x - diff.x;
    const dy = point.y - diff.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= diff.r && dist < bestDist) {
      best = diff;
      bestDist = dist;
    }
  }
  return best;
}

// attachPanelClicks(leftCanvas, rightCanvas, onPoint) — wire both panels
// to the same handler; a click on either one reports its scene point.
export function attachPanelClicks(leftCanvas, rightCanvas, onPoint) {
  const handler = (event) => onPoint(toScenePoint(event, event.currentTarget));
  leftCanvas.addEventListener('click', handler);
  rightCanvas.addEventListener('click', handler);
  return () => {
    leftCanvas.removeEventListener('click', handler);
    rightCanvas.removeEventListener('click', handler);
  };
}
