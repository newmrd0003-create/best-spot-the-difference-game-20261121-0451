# Lantern Town — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/newmrd0003-create/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/newmrd0003-create/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Lantern Town** is a complete, original spot-the-difference game that plays
offline in a desktop browser from its own static files. Two near-identical
pictures hang side by side — find all **7 differences** in each scene before
the lantern burns down.

## The game

- **3 original scenes, painted procedurally on canvas** — no image files, no
  downloads: *Harbour at Dusk* (lighthouse, fishing boat, gulls), *Night
  Market* (stalls, paper lanterns, a cat on a roof), *Coral Garden*
  (branching coral, fish, seaweed).
- **Two panels, one hunt** — click a difference on either picture: a gold
  ring pops in with a check mark and a ripple, the combo grows, and the
  counter reads `X of 7 found · Y remaining` at all times.
- **Feel and pressure** — a countdown bar per level (120s / 105s / 90s), a
  pulsing red clock in the last fifth, 3 hints per level (each reveals one
  hidden difference and costs 50 points), wrong clicks cost 3 seconds and
  shake the frame, and WebAudio chimes, buzzes and arpeggios with no audio
  files.
- **Complete loop** — title screen with three level cards, level-complete
  cards with stars and a time bonus, game-over retry, and a final
  Lantern Master card after all three scenes.
- **Deterministic screenshots** — `?shot=start|play|market|complete` puts the
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
| `game/src/scenes.js` | The three procedural scene painters |
| `game/src/differences.js` | The 7 differences of each scene |
| `game/src/render.js` | Panels, gold markers, ripples, shake |
| `game/src/input.js` | Click → scene point, hit testing |
| `game/src/audio.js` | WebAudio sounds, no audio files |
| `game/src/timer.js` | Per-level countdown |
| `game/src/shots.js` | Deterministic `?shot=` states |

---

<sub>Entered on [make.fun](https://make.fun/?ref=hzw5fs6y&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
