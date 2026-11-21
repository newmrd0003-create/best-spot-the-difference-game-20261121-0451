// differences.js — one clear job: describe every difference of every scene.
//
// A difference is a spot that is NOT the same on the two panels. Each entry
// carries its hit position in scene coordinates (the scene canvas is
// 600 x 440), its click radius, and a short human label used by the hint
// toast and the level-complete recap. The actual changed drawing lives in
// scenes.js, keyed by the same `id`.
//
// Fair-but-not-obvious rule the set follows: every change is one of
// "something vanished", "something appeared", "a colour flipped" or "a
// shape changed" — never a whole panel redraw, never a pixel-size tweak.

export const SCENE_SIZE = { width: 600, height: 440 };

export const DIFFERENCES = {
  harbour: [
    { id: 'lighthouse-lamp', x: 300, y: 78, r: 26, label: 'the lighthouse lamp went dark' },
    { id: 'gull-vanished', x: 118, y: 74, r: 26, label: 'a gull vanished from the sky' },
    { id: 'flag-colour', x: 402, y: 196, r: 26, label: 'the boat flag changed colour' },
    { id: 'buoy-vanished', x: 478, y: 348, r: 26, label: 'the red buoy is gone' },
    { id: 'stripe-colour', x: 300, y: 158, r: 26, label: 'the lighthouse stripe changed colour' },
    { id: 'star-vanished', x: 92, y: 46, r: 24, label: 'a star faded out of the dusk' },
    { id: 'cabin-window', x: 372, y: 252, r: 26, label: 'the cabin window changed shape' },
  ],
  market: [
    { id: 'lantern-colour', x: 148, y: 108, r: 26, label: 'a paper lantern changed colour' },
    { id: 'sign-symbol', x: 300, y: 128, r: 26, label: 'the stall sign shows another symbol' },
    { id: 'cat-vanished', x: 436, y: 186, r: 26, label: 'the cat on the roof is gone' },
    { id: 'bunting-flag', x: 208, y: 62, r: 24, label: 'a bunting flag is missing' },
    { id: 'apple-count', x: 352, y: 296, r: 26, label: 'one apple left the basket' },
    { id: 'bulb-dark', x: 486, y: 84, r: 24, label: 'a string-light bulb went dark' },
    { id: 'awning-stripe', x: 104, y: 208, r: 26, label: 'the awning stripe changed colour' },
  ],
  coral: [
    { id: 'fish-stripes', x: 152, y: 152, r: 28, label: 'the blue fish lost a stripe' },
    { id: 'starfish-vanished', x: 428, y: 342, r: 26, label: 'the starfish is gone from the sand' },
    { id: 'coral-colour', x: 252, y: 292, r: 28, label: 'the coral changed colour' },
    { id: 'bubble-count', x: 306, y: 92, r: 26, label: 'a bubble rose away' },
    { id: 'shell-vanished', x: 92, y: 356, r: 26, label: 'the shell vanished from the sand' },
    { id: 'seaweed-frond', x: 508, y: 262, r: 26, label: 'the seaweed grew an extra frond' },
    { id: 'fish-direction', x: 384, y: 186, r: 26, label: 'the little yellow fish turned around' },
  ],
};

// differencesFor(sceneId) — the seven differences of one scene, in order.
export function differencesFor(sceneId) {
  return DIFFERENCES[sceneId] ?? [];
}

// differenceCount(sceneId) — how many differences a scene hides (always 7).
export function differenceCount(sceneId) {
  return differencesFor(sceneId).length;
}
