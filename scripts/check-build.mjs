import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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
const netlify = read('netlify.toml');
assert.match(netlify, /from = "\/\*"[\s\S]*to = "\/index.html"[\s\S]*status = 200/);
const vercel = JSON.parse(read('vercel.json'));
assert.equal(vercel.framework, 'vite');
assert.ok(vercel.rewrites.some(rule => rule.destination === '/index.html'));
console.log('Production entry, metadata, robots, content assets, and SPA hosting fallbacks passed.');
