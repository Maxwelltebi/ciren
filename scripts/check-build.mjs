import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const read = path => readFileSync(path, 'utf8');
const site = JSON.parse(read('src/data/site.json'));
const document = new JSDOM(read('dist/index.html')).window.document;
assert.ok(document.querySelector('#root'), 'React root exists');
assert.ok(document.querySelector('script[type="module"][src^="/assets/"]'), 'Bundled Vite entry exists');
assert.equal(document.querySelector('meta[name="robots"]')?.content ?? null, site.noindex ? 'noindex, nofollow' : null);
assert.equal(read('dist/robots.txt'), `User-agent: *\n${site.noindex ? 'Disallow: /' : 'Allow: /'}\n`);

for (const link of document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]')) {
  assert.ok(link.getAttribute('href').startsWith('/'), 'Icons resolve at every route');
  assert.ok(existsSync(`dist${link.getAttribute('href')}`), 'Icon copied to production');
}
for (const file of readdirSync('src/data').filter(file => file.endsWith('.json'))) {
  for (const match of read(`src/data/${file}`).matchAll(/"(\/assets\/[^"\s]+)"/g)) {
    assert.ok(existsSync(`dist${match[1]}`), `${file}: ${match[1]} exists`);
  }
}
for (const element of document.querySelectorAll('script[src], link[rel="stylesheet"]')) {
  const path = element.getAttribute('src') ?? element.getAttribute('href');
  if (path.startsWith('/')) assert.ok(existsSync(`dist${path}`), `Built dependency ${path} exists`);
}
// Full-size originals belong in assets-src/; `npm run images` makes the web copies.
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? walk(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`]);
for (const file of walk('dist/assets').filter(file => /\.(webp|png|jpe?g|gif)$/i.test(file))) {
  assert.ok(statSync(file).size <= 300 * 1024, `${file} is over 300 KB: add it to assets-src/ and run npm run images`);
}
const images = JSON.parse(read('src/data/images.json'));
for (const [src, { srcset }] of Object.entries(images)) {
  for (const candidate of srcset.split(', ')) {
    const path = candidate.split(' ')[0];
    assert.ok(existsSync(`dist${path}`), `${src}: srcset file ${path} exists`);
  }
}
const hero = JSON.parse(read('src/data/home.json')).hero.image;
assert.ok(document.querySelector(`link[rel="preload"][as="image"][href="${hero}"]`), 'Home hero image is preloaded');
assert.ok(images[hero], 'Home hero image has generated sizes');

const netlify = read('netlify.toml');
assert.match(netlify, /from = "\/\*"[\s\S]*to = "\/index.html"[\s\S]*status = 200/);
const vercel = JSON.parse(read('vercel.json'));
assert.equal(vercel.framework, 'vite');
assert.ok(vercel.rewrites.some(rule => rule.destination === '/index.html'));
assert.ok(vercel.headers.some(rule => rule.headers.some(header => header.value.includes('immutable'))), 'Vercel caches hashed bundles');
assert.match(netlify, /for = "\/assets\/index-\*"[\s\S]*immutable/, 'Netlify caches hashed bundles');
console.log('Production entry, metadata, robots, content assets, image budget, hero preload, caching, and SPA hosting fallbacks passed.');
