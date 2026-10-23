// Turns the full-size originals in assets-src/ into web-sized WebP files in
// public/assets/ (same folders, same names, .webp), plus smaller widths for
// srcset. Run `npm run images` after adding or replacing an image, then point
// the content JSON at the .webp path. Originals are never deployed.
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import sharp from 'sharp';

const SOURCE = 'assets-src';
const OUTPUT = 'public/assets';
const MANIFEST = 'src/data/images.json';
const WIDTHS = [480, 960, 1600];
// Logos (anything with transparency) never show wider than ~200px.
const LOGO_WIDTH = 480;

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );
const toUrl = file => '/' + relative('public', file).replaceAll('\\', '/');

const manifest = {};
const written = new Set();
for (const file of walk(SOURCE).filter(file => /\.(png|jpe?g|webp)$/i.test(file))) {
  const meta = await sharp(file).metadata();
  const maxWidth = Math.min(meta.width, meta.hasAlpha ? LOGO_WIDTH : WIDTHS.at(-1));
  // Skip a step that would be within 20% of the next one up: not worth a request.
  const widths = [...WIDTHS.filter(width => width < maxWidth * 0.8), maxWidth];
  const base = join(OUTPUT, relative(SOURCE, file)).replace(/\.[^.]+$/, '');
  mkdirSync(dirname(base), { recursive: true });
  const variants = [];
  for (const width of widths) {
    const out = width === maxWidth ? `${base}.webp` : `${base}-${width}.webp`;
    await sharp(file)
      .rotate()
      .resize({ width })
      .webp({ quality: meta.hasAlpha ? 90 : 78, effort: 6 })
      .toFile(out);
    written.add(out);
    variants.push(`${toUrl(out)} ${width}w`);
  }
  manifest[toUrl(`${base}.webp`)] = {
    width: maxWidth,
    height: Math.round((meta.height * maxWidth) / meta.width),
    srcset: variants.join(', '),
  };
}

// Drop WebP files left behind by renamed or removed originals.
for (const file of walk(OUTPUT).filter(file => file.endsWith('.webp'))) {
  if (!written.has(file)) rmSync(file);
}
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${written.size} WebP files for ${Object.keys(manifest).length} images.`);
