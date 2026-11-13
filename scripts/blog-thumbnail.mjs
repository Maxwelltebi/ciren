// Draws a black-and-white stick-figure illustration for a blog post that has no
// photograph of its own, and saves it as a PNG original in assets-src/ so
// `npm run images` turns it into WebP like every other image.
//
//   node scripts/blog-thumbnail.mjs --slug my-post --scene coding
//   node scripts/blog-thumbnail.mjs --list
//
// The canvas is 1600x1200. Everything that matters sits inside x 380-1220 and
// y 170-1030, so it survives both the 3:4 showroom card and the 16:9 article
// crop. The slug seeds a slight hand-drawn wobble, so two posts with the same
// scene still differ.
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { parseArgs } from 'node:util';
import sharp from 'sharp';

const W = 1600;
const H = 1200;
const GROUND = 960;
const INK = '#111';
const STROKE = 9;

const SCENES = {
  coding: 'two people at laptops with code floating above (building, software, hackathons)',
  presenting: 'one person pointing at a rising chart, two listening (talks, results, demo days)',
  discussion: 'three people talking with speech bubbles (meetings, feedback, panels)',
  idea: 'a person under a glowing lightbulb, a friend pointing at it (ideas, starting out)',
  research: 'a person with a magnifying glass over papers, another reading (research, papers)',
  celebrate: 'three people cheering with a trophy and confetti (wins, launches, awards)',
  mentoring: 'a standing mentor guiding a seated student at a laptop (mentoring, learning)',
  community: 'a row of five people waving (community, clubs, welcome posts, events)',
};

const { values: args } = parseArgs({
  options: {
    slug: { type: 'string' },
    scene: { type: 'string' },
    out: { type: 'string' },
    list: { type: 'boolean' },
  },
});

if (args.list || !args.slug || !args.scene) {
  console.log('Scenes:');
  for (const [name, use] of Object.entries(SCENES)) console.log(`  ${name.padEnd(11)} ${use}`);
  console.log('\nUsage: node scripts/blog-thumbnail.mjs --slug <post-slug> --scene <scene> [--out file.png]');
  process.exit(args.list ? 0 : 1);
}
if (!SCENES[args.scene]) {
  console.error(`Unknown scene "${args.scene}". Run with --list to see the scenes.`);
  process.exit(1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(args.slug)) {
  console.error('The slug must be lowercase words joined by hyphens, e.g. inside-the-hackathon.');
  process.exit(1);
}

// A small seeded random generator, so the same slug always draws the same picture.
let seed = [...args.slug].reduce((h, c) => (Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0), 2166136261);
const rand = () => {
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const wob = (n = 3) => (rand() - 0.5) * 2 * n;
const r1 = n => Math.round(n * 10) / 10;

// A line through the points with a little wobble on each bend.
const line = (pts, w = STROKE) =>
  `<polyline points="${pts.map(([x, y]) => `${r1(x + wob())},${r1(y + wob())}`).join(' ')}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const circle = (x, y, r, fill = 'none', w = STROKE) =>
  `<circle cx="${r1(x + wob(2))}" cy="${r1(y + wob(2))}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="${w}"/>`;
const rect = (x, y, w, h, fill = 'none', sw = STROKE, rx = 6) =>
  `<rect x="${r1(x + wob(2))}" y="${r1(y + wob(2))}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>`;

// Poses in figure units: 100 units tall, origin between the feet, y up is negative.
const POSES = {
  stand: { head: [0, -88], neck: [0, -78], hip: [0, -42],
    armL: [[0, -72], [-9, -58], [-13, -44]], armR: [[0, -72], [9, -58], [13, -44]],
    legL: [[0, -42], [-6, -21], [-9, 0]], legR: [[0, -42], [6, -21], [9, 0]] },
  cheer: { head: [0, -88], neck: [0, -78], hip: [0, -42],
    armL: [[0, -72], [-12, -84], [-17, -101]], armR: [[0, -72], [12, -84], [17, -101]],
    legL: [[0, -42], [-8, -21], [-12, 0]], legR: [[0, -42], [8, -21], [12, 0]] },
  wave: { head: [0, -88], neck: [0, -78], hip: [0, -42],
    armL: [[0, -72], [-9, -58], [-13, -44]], armR: [[0, -72], [13, -80], [16, -98]],
    legL: [[0, -42], [-6, -21], [-9, 0]], legR: [[0, -42], [6, -21], [9, 0]] },
  // Both hands together above the head, lifting something.
  lift: { head: [0, -88], neck: [0, -78], hip: [0, -42],
    armL: [[0, -72], [-13, -84], [-8, -100]], armR: [[0, -72], [13, -84], [8, -100]],
    legL: [[0, -42], [-8, -21], [-12, 0]], legR: [[0, -42], [8, -21], [12, 0]] },
  point: { head: [0, -88], neck: [0, -78], hip: [0, -42],
    armL: [[0, -72], [-8, -58], [-11, -44]], armR: [[0, -72], [15, -76], [30, -84]],
    legL: [[0, -42], [-6, -21], [-9, 0]], legR: [[0, -42], [6, -21], [9, 0]] },
  think: { head: [0, -88], neck: [0, -78], hip: [0, -42],
    armL: [[0, -72], [-2, -58], [9, -60]], armR: [[0, -72], [12, -64], [5, -79]],
    legL: [[0, -42], [-6, -21], [-9, 0]], legR: [[0, -42], [6, -21], [9, 0]] },
  talk: { head: [0, -88], neck: [0, -78], hip: [0, -42],
    armL: [[0, -72], [-9, -58], [-13, -44]], armR: [[0, -72], [12, -62], [22, -66]],
    legL: [[0, -42], [-6, -21], [-9, 0]], legR: [[0, -42], [6, -21], [9, 0]] },
  hold: { head: [0, -88], neck: [0, -78], hip: [0, -42],
    armL: [[0, -72], [7, -60], [16, -64]], armR: [[0, -72], [10, -58], [18, -62]],
    legL: [[0, -42], [-6, -21], [-9, 0]], legR: [[0, -42], [6, -21], [9, 0]] },
  // Seated on a stool, facing right, hands out to a keyboard.
  type: { head: [0, -80], neck: [0, -70], hip: [0, -36],
    armL: [[0, -64], [9, -50], [22, -50]], armR: [[0, -64], [11, -52], [24, -52]],
    legL: [[0, -36], [16, -36], [16, 0]], legR: [[0, -36], [19, -36], [20, 0]] },
};

// Draws a figure with its feet at (x, y). `face` 1 looks right, -1 looks left.
function figure(x, y, pose, { s = 5.2, face = 1 } = {}) {
  const p = POSES[pose];
  const at = ([u, v]) => [x + u * s * face, y + v * s];
  const parts = [
    line([p.neck, p.hip].map(at)),
    line(p.armL.map(at)),
    line(p.armR.map(at)),
    line(p.legL.map(at)),
    line(p.legR.map(at)),
    circle(...at(p.head), 9.5 * s, '#fff'),
  ];
  return parts.join('');
}

const ground = () => line([[300, GROUND], [1300, GROUND]], 6);
const SEATED = 4.6; // scale of a seated figure
const DESK = GROUND - 210; // desk top: just under a seated figure's hands
// A stool under a seated figure whose hip is at x.
const stool = x => {
  const top = GROUND - 36 * SEATED;
  return line([[x - 40, top], [x + 40, top]]) + line([[x, top], [x, GROUND]]) + line([[x - 35, GROUND], [x + 35, GROUND]]);
};
const seated = (x, face) => stool(x) + figure(x, GROUND, 'type', { s: SEATED, face });
const table = (x1, x2, top = GROUND - 250) =>
  line([[x1, top], [x2, top]]) + line([[x1 + 30, top], [x1 + 30, GROUND]]) + line([[x2 - 30, top], [x2 - 30, GROUND]]);
// A laptop on a surface at (x, top); its screen stands on the `side` edge (1 right, -1 left).
const laptop = (x, top, side) =>
  line([[x - 55, top - 4], [x + 55, top - 4]], 8) + line([[x + 55 * side, top - 4], [x + 80 * side, top - 100]], 8);
// A rounded speech bubble with a tail from its bottom edge down to (tailX, tailY).
const bubble = (x, y, w, h, tailX, tailY, inner = '') => {
  const a = Math.max(x + 40, Math.min(tailX - 25, x + w - 90));
  const b = a + 50;
  const bottom = y + h;
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="28" fill="#fff" stroke="${INK}" stroke-width="${STROKE}"/>` +
    // White wedge hides the bubble's edge where the tail joins it.
    `<polygon points="${a + 5},${bottom - 6} ${b - 5},${bottom - 6} ${tailX},${tailY}" fill="#fff"/>` +
    line([[a, bottom], [tailX, tailY], [b, bottom]]) +
    inner
  );
};
const dots = (x, y) => [0, 1, 2].map(i => `<circle cx="${x + i * 34}" cy="${y}" r="8" fill="${INK}"/>`).join('');
const codeMark = (x, y, k = 1) =>
  line([[x - 30 * k, y - 30 * k], [x - 60 * k, y], [x - 30 * k, y + 30 * k]]) +
  line([[x + 30 * k, y - 30 * k], [x + 60 * k, y], [x + 30 * k, y + 30 * k]]) +
  line([[x + 12 * k, y - 38 * k], [x - 12 * k, y + 38 * k]]);
const bulb = (x, y) =>
  circle(x, y, 62) + line([[x - 24, y + 58], [x - 24, y + 92], [x + 24, y + 92], [x + 24, y + 58]]) +
  line([[x - 20, y + 110], [x + 20, y + 110]]) +
  [[-1, 0], [1, 0], [-0.7, -0.7], [0.7, -0.7], [0, -1]].map(([u, v]) => line([[x + u * 92, y + v * 92], [x + u * 128, y + v * 128]], 8)).join('');
const confetti = () =>
  Array.from({ length: 26 }, () => {
    const x = 400 + rand() * 800;
    const y = 190 + rand() * 260;
    const a = rand() * 180;
    return `<rect x="${r1(x)}" y="${r1(y)}" width="14" height="30" rx="3" fill="${rand() > 0.5 ? INK : '#fff'}" stroke="${INK}" stroke-width="5" transform="rotate(${r1(a)} ${r1(x + 7)} ${r1(y + 15)})"/>`;
  }).join('');
const trophy = (x, y) =>
  `<path d="M${x - 60},${y} h120 v40 a60,60 0 0 1 -120,0 z" fill="#fff" stroke="${INK}" stroke-width="${STROKE}" stroke-linejoin="round"/>` +
  line([[x - 60, y + 20], [x - 95, y + 20], [x - 85, y + 60], [x - 50, y + 75]]) +
  line([[x + 60, y + 20], [x + 95, y + 20], [x + 85, y + 60], [x + 50, y + 75]]) +
  line([[x, y + 100], [x, y + 140]]) + line([[x - 45, y + 145], [x + 45, y + 145]]);
const paper = (x, y, a = 0) =>
  `<g transform="rotate(${a} ${x + 70} ${y + 90})">${rect(x, y, 140, 180, '#fff', 7, 4)}${[40, 75, 110, 145].map(v => line([[x + 25, y + v], [x + 115, y + v]], 6)).join('')}</g>`;

const scenes = {
  coding: () =>
    ground() + table(540, 1060, DESK) +
    seated(450, 1) + laptop(615, DESK, 1) +
    seated(1150, -1) + laptop(985, DESK, -1) +
    codeMark(800, 400, 1.6) + line([[640, 290], [700, 290]], 8) + line([[900, 500], [960, 500]], 8),
  presenting: () =>
    ground() +
    rect(390, 250, 430, 330, '#fff') + line([[605, 580], [570, GROUND]]) + line([[605, 580], [640, GROUND]]) +
    line([[440, 520], [440, 440], [530, 440], [530, 520]], 7) + line([[570, 520], [570, 380], [660, 380], [660, 520]], 7) +
    line([[700, 520], [700, 310], [780, 310], [780, 520]], 7) + line([[425, 520], [790, 520]], 7) +
    figure(930, GROUND, 'point', { face: -1 }) +
    figure(1070, GROUND, 'stand', { s: 4.6, face: -1 }) + figure(1200, GROUND, 'think', { s: 4.4, face: -1 }),
  discussion: () =>
    ground() +
    figure(560, GROUND, 'talk') + figure(800, GROUND, 'think', { face: -1 }) + figure(1040, GROUND, 'talk', { face: -1 }) +
    bubble(430, 220, 300, 150, 520, 430, dots(530, 295)) +
    bubble(880, 200, 300, 150, 1000, 420, line([[945, 260], [1110, 260]], 8) + line([[945, 310], [1060, 310]], 8)),
  idea: () =>
    ground() + figure(700, GROUND, 'cheer') + bulb(700, 290) +
    figure(1000, GROUND, 'point', { s: 4.8, face: -1 }),
  research: () =>
    ground() + table(420, 900) +
    paper(480, 520, -8) + paper(620, 530, 6) +
    // The glass over the papers, its handle in the reader's hand.
    circle(770, 560, 70, 'rgba(255,255,255,0.55)') + line([[820, 610], [912, 628]], 18) +
    figure(1000, GROUND, 'hold', { face: -1 }) +
    figure(1150, GROUND, 'hold', { s: 4.6 }) +
    rect(1215, 600, 70, 92, '#fff', 7, 3) + line([[1250, 600], [1250, 692]], 6),
  celebrate: () =>
    ground() + confetti() +
    figure(560, GROUND, 'cheer', { s: 4.8 }) + figure(800, GROUND, 'lift') + figure(1040, GROUND, 'cheer', { s: 4.8, face: -1 }) +
    trophy(800, GROUND - 100 * 5.2 - 150),
  mentoring: () =>
    ground() + table(680, 1040, DESK) +
    seated(1130, -1) + laptop(970, DESK, -1) +
    figure(560, GROUND, 'point') +
    bubble(470, 220, 260, 140, 560, 410, codeMark(600, 290, 0.7)),
  community: () =>
    ground() +
    [430, 600, 800, 1000, 1170].map((x, i) =>
      figure(x, GROUND, ['wave', 'cheer', 'wave', 'cheer', 'wave'][i], { s: [4.5, 4.9, 5.3, 4.9, 4.5][i], face: i > 2 ? -1 : 1 }),
    ).join(''),
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#fff"/>
${scenes[args.scene]()}
</svg>`;

const out = args.out ?? `assets-src/images/blog/${args.slug}.png`;
mkdirSync(dirname(out), { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(out);
console.log(`Wrote ${out} (${args.scene}). Run \`npm run images\` to build /assets/images/blog/${args.slug}.webp.`);
