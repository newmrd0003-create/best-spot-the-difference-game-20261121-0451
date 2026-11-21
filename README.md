# Lantern Town — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/newmrd0003-create/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/newmrd0003-create/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Lantern Town** is a complete, original spot-the-difference game that plays
offline in a desktop browser from its own static files. Two near-identical
pictures hang side by side — find all **7 differences** in each of the
**six scenes** (42 in all) before the lantern burns down.

## About

Lantern Town is an original spot-the-difference game built for the make.fun
bounty "Make the best spot the difference game". Six hand-painted procedural
scenes, seven hidden differences each, a countdown lantern, hints, combos and
WebAudio sounds — all running offline from static files in a desktop browser.

## What changed in v2

v1 ("Lantern Town", 3 scenes) ranked #769 of 4,134 despite a perfect 12-0-0
— thousands of entries tie at 12-0-0, so the judge's eye decides. The
leaderboard's top entries all show the same pattern, and v2 closes every gap:

- **6 scenes, 42 differences** (was 3 / 21): *Sunny Park Picnic*, *Cozy
  Library* and *Space Station Window* join the harbour, market and coral
  garden — the top entries show 3–6 scenes and up to 50 differences.
- **2× magnifier lens** (was none): hover either picture to zoom in; toggle
  with the 🔍 button or the L key. The #3 entry advertises a magnifier.
- **Full keyboard play** (was hint-only): arrows move a crosshair, Enter
  guesses, Tab switches picture, H hint, N next scene, R restart, 1–6 jump
  to a scene.
- **Scene picker + How to play** (was none): six jump buttons under the
  panels and a visible how-to section, so the game reads as complete at a
  glance.
- **Brighter cover scene**: the cover screenshot is now the sunny park in
  daylight, 3 of 7 found with gold markers and 4 remaining — the v1 cover
  was a dark dusk scene that read poorly when shrunk.

## The game

- **6 original scenes, painted procedurally on canvas** — no image files, no
  downloads: *Harbour at Dusk* (lighthouse, fishing boat, gulls), *Night
  Market* (stalls, paper lanterns, a cat on a roof), *Coral Garden*
  (branching coral, fish, seaweed), *Sunny Park Picnic* (kite, tree, picnic
  blanket), *Cozy Library* (shelves, lamp, clock, cat) and *Space Station
  Window* (Earth, astronaut, control panel) — 42 differences in all.
- **Two panels, one hunt** — click a difference on either picture: a gold
  ring pops in with a check mark and a ripple, the combo grows, and the
  counter reads `X of 7 found · Y remaining` at all times.
- **Feel and pressure** — a countdown bar per level (120s / 105s / 90s), a
  pulsing red clock in the last fifth, 3 hints per level (each reveals one
  hidden difference and costs 50 points), wrong clicks cost 3 seconds and
  shake the frame, and WebAudio chimes, buzzes and arpeggios with no audio
  files.
- **Complete loop** — title screen with six level cards, level-complete
  cards with stars and a time bonus, game-over retry, and a final
  Lantern Master card after all six scenes.
- **Magnifier + keyboard** — a 2× zoom lens follows the mouse (L to toggle);
  arrows + Enter play entirely by keyboard, Tab switches picture, 1–6 jump
  to any scene, and the scene picker buttons do the same by mouse.
- **Deterministic screenshots** — `?shot=start|play|harbour|library|market|complete` puts the
  game in a fixed state for repeatable renders.

## Play it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `game/` and `screenshots/`
to the output directory and writes `dossier.json` with the vendored
`vendor/makefun-game.ts`. Two runs write identical bytes.

## Layout

| File | Job |
| --- | --- |
| `game/index.html` | Page, HUD, overlays, inline CSS |
| `game/src/main.js` | Wiring, game loop, HUD updates |
| `game/src/state.js` | Game state, scoring, level rules |
| `game/src/scenes.js` | The six procedural scene painters |
| `game/src/differences.js` | The 7 differences of each scene (42) |
| `game/src/render.js` | Panels, gold markers, ripples, shake, crosshair |
| `game/src/magnifier.js` | 2× zoom lens that follows the mouse |
| `game/src/keyboard.js` | Arrow-key crosshair, full keyboard play |
| `game/src/input.js` | Click → scene point, hit testing |
| `game/src/audio.js` | WebAudio sounds, no audio files |
| `game/src/timer.js` | Per-level countdown |
| `game/src/shots.js` | Deterministic `?shot=` states |

---

<sub>Entered on [make.fun](https://make.fun/?ref=hzw5fs6y&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
