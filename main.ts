// Lantern Town — Spot the Difference: the entry program (Node 22, stdlib only).
//
// It hands the game in: it copies this repository's game/ and screenshots/
// beside this file into /output (or $MAKEFUN_OUTPUT_DIR outside the grader)
// and writes /output/dossier.json with the vendored make.fun library, so the
// judge can read the game from its screenshots and its source outline.
//
// The copy is deterministic: directory entries are walked in sorted order
// and file bytes are copied verbatim, so two runs write identical bytes.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Pre-flight: refuse to hand in a broken tree instead of writing a dossier
// for it. The gate would refuse it anyway; failing here says why, now.
const gameIndex = join(here, 'game', 'index.html');
if (!existsSync(gameIndex)) throw new Error(`missing game/index.html at ${gameIndex}`);
const shotsDir = join(here, 'screenshots');
if (existsSync(shotsDir)) {
  const shots = readdirSync(shotsDir).filter((name) => !name.startsWith('.'));
  if (shots.length === 0 || shots.length > 4) {
    throw new Error(`expected 1-4 screenshots, found ${shots.length}`);
  }
}

// copyTreeSorted(src, dst) — a recursive copy that visits entries in
// sorted name order, so the output layout never depends on readdir order.
function copyTreeSorted(src, dst) {
  mkdirSync(dst, { recursive: true });
  for (const name of readdirSync(src).sort()) {
    const from = join(src, name);
    const to = join(dst, name);
    if (statSync(from).isDirectory()) copyTreeSorted(from, to);
    else cpSync(from, to);
  }
}

mkdirSync(out, { recursive: true });
copyTreeSorted(join(here, 'game'), join(out, 'game'));
if (existsSync(join(here, 'screenshots'))) {
  copyTreeSorted(join(here, 'screenshots'), join(out, 'screenshots'));
}

// The scorer's own caps (from the kit's gate): only text_max_bytes shapes
// the dossier bytes; the rest refuse an entry the scorer would refuse —
// more than 4 screenshots or one over 256 KiB, more than 993 files in
// game/ or 48 MiB of game files in all, or a path under game/ over 1000
// bytes. game/ counts beside /output's own 1000-entry cap, its screenshots/
// and dossier.json.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

console.log(`Lantern Town handed in to ${out}`);

// countTree(dir) — [files, bytes] under a directory, for the summary line.
function countTree(dir) {
  let files = 0;
  let bytes = 0;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      const [f, b] = countTree(path);
      files += f;
      bytes += b;
    } else {
      files += 1;
      bytes += statSync(path).size;
    }
  }
  return [files, bytes];
}

const [gameFiles, gameBytes] = countTree(join(out, 'game'));
const [shotFiles, shotBytes] = existsSync(join(out, 'screenshots'))
  ? countTree(join(out, 'screenshots'))
  : [0, 0];
const dossierBytes = statSync(join(out, 'dossier.json')).size;
console.log(
  `game/ ${gameFiles} files ${gameBytes} bytes · ` +
    `screenshots/ ${shotFiles} files ${shotBytes} bytes · ` +
    `dossier.json ${dossierBytes} bytes`,
);
