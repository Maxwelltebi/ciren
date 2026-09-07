// Proves the built page still renders the same DOM as the frozen baseline,
// and that every class it uses actually exists in the compiled stylesheet.
//
// Scripts are compared separately, not inline: extracting the carousel IIFE to
// its own file is an intended structural change, so the DOM check ignores
// <script> elements and a dedicated check asserts the JS is byte-identical.
// Comments never render, so they are stripped too.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const BASE = "reference/original.html";
const BUILT = "dist/index.html";
const CSS = "dist/css/main.css";
const SRC_CSS = "src/css/main.css";
const JS = "src/js/carousel.js";
const ASSET_MAP = "tools/asset-map.json";
const JS_DEV = "tools/js-deviations.json";
const DOM_DEV = "tools/dom-deviations.json";

// Classes that are not Tailwind utilities, so they never appear in the
// compiled stylesheet as their own rule.
const NOT_UTILITIES = new Set([
  "carousel-card", // targeted by carousel.js
  "animate-marquee", // defined by hand in main.css
  "hide-scrollbar", // defined by hand in main.css
  "group", // Tailwind marker class, emits no rule
]);

// Classes the ORIGINAL page also lacked. Tailwind v3's rotate scale is
// 0,1,2,3,6,12,45,90,180 - so rotate-5 and rotate-8 were dead on arrival and
// cards 5 and 6 have never actually rotated. Preserved deliberately: emitting
// them would change the design's appearance.
const DEAD_IN_ORIGINAL = new Set(["rotate-5", "rotate-8"]);

// Every built page, so a second page's classes and anchors are checked too.
const htmlPages = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((e) => {
    const full = join(dir, e);
    return statSync(full).isDirectory()
      ? htmlPages(full)
      : e.endsWith(".html")
        ? [full]
        : [];
  });
};

const bodyOf = (s) => {
  const a = s.indexOf(">", s.indexOf("<body")) + 1;
  return s.slice(a, s.lastIndexOf("</body>"));
};

const norm = (s) =>
  s
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();

// Text nodes only - tags and attributes removed. Used to report how far the
// copy has drifted from the original design, which is expected once real
// content lands and is therefore informational rather than a failure.
const textOf = (s) =>
  (s.match(/>[^<]+</g) || [])
    .map((t) => t.slice(1, -1).trim())
    .filter(Boolean);

// Structure only - every text node emptied, so tags, attributes and classes
// still have to match exactly. This is what stays worth guarding once the
// placeholder copy starts being replaced: a layout or styling regression will
// still fail here, while editing a heading will not.
const structureOf = (s) => norm(s).replace(/>[^<]*</g, "><");

const baseRaw = readFileSync(BASE, "utf8");
const builtRaw = readFileSync(BUILT, "utf8");

// The 13 remote images were pulled local (and de-duplicated: they were only 9
// distinct files). Project the baseline's URLs through the same map so the DOM
// comparison comes down to markup rather than asset location.
const assetMap = existsSync(ASSET_MAP)
  ? JSON.parse(readFileSync(ASSET_MAP, "utf8"))
  : {};
let baseMapped = baseRaw;
for (const [url, local] of Object.entries(assetMap))
  baseMapped = baseMapped.split(url).join(local);

// Declared markup changes are replayed onto the baseline, so the rest of the
// page is still held to the original byte-for-byte.
const domDeviations = existsSync(DOM_DEV)
  ? JSON.parse(readFileSync(DOM_DEV, "utf8"))
  : [];
const staleDomDeviations = [];
for (const d of domDeviations) {
  // A deviation whose anchor is gone is a stale record, not a pass.
  if (!baseMapped.includes(d.from)) staleDomDeviations.push(d);
  baseMapped = baseMapped.split(d.from).join(d.to);
}

// The testimonial dialog is new markup with no counterpart in the baseline. It
// is appended after every section, so cutting the built body at its opening
// tag leaves exactly the original page to compare.
const MODAL_MARK = '<div id="testimonial-modal"';
const builtBody = bodyOf(builtRaw);
const builtTrimmed = builtBody.includes(MODAL_MARK)
  ? builtBody.slice(0, builtBody.indexOf(MODAL_MARK))
  : builtBody;
// Every dialog is appended after the sections, so cutting at the first one
// removes them all.

const base = norm(bodyOf(baseMapped));
const built = norm(builtTrimmed);

let ok = true;
const pass = (c, label) => {
  if (!c) ok = false;
  console.log(`${c ? "PASS " : "FAIL "} ${label}`);
};

console.log("=== 1. DOM parity (scripts and comments excluded) ===");
console.log(`baseline : ${base.length.toLocaleString()} chars`);
console.log(`built    : ${built.length.toLocaleString()} chars`);
for (const d of staleDomDeviations)
  pass(false, `stale DOM deviation, anchor not found: ${d.reason}`);
for (const d of domDeviations)
  console.log(`  declared change: ${d.reason}`);
if (built !== bodyOf(builtRaw))
  console.log(`  excluded from comparison: the testimonial dialog (new markup)`);
const baseStruct = structureOf(bodyOf(baseMapped));
const builtStruct = structureOf(builtTrimmed);

if (baseStruct === builtStruct) {
  pass(true, "structure matches the original design (tags, attributes, classes)");
} else {
  ok = false;
  let i = 0;
  while (
    i < baseStruct.length &&
    i < builtStruct.length &&
    baseStruct[i] === builtStruct[i]
  )
    i++;
  console.log(`FAIL  structural divergence at char ${i.toLocaleString()}`);
  console.log(`  baseline: ...${baseStruct.slice(Math.max(0, i - 90), i + 90)}...`);
  console.log(`  built   : ...${builtStruct.slice(Math.max(0, i - 90), i + 90)}...`);
}

// Copy changes are expected from here on, so they are reported, not failed.
const baseText = textOf(base);
const builtText = textOf(built);
const changed = baseText.filter((t, i) => builtText[i] !== t).length;
if (base === built) {
  console.log("  copy is still identical to the original design");
} else {
  console.log(
    `  copy has moved on from the original design in ~${changed} place(s) - expected as real content lands`,
  );
}
console.log("");

console.log("=== 2. extracted assets match the original inline blocks ===");
const inlineJs = /<script>([\s\S]*?)<\/script>/.exec(baseRaw)[1].trim();

// carousel.js is the original script plus a recorded set of deliberate fixes.
// Replaying those onto the original must reproduce the file exactly, so any
// edit that is NOT declared in js-deviations.json still fails this check.
const deviations = existsSync(JS_DEV)
  ? JSON.parse(readFileSync(JS_DEV, "utf8"))
  : [];
let expectedJs = inlineJs;
for (const d of deviations) {
  if (!expectedJs.includes(d.from)) {
    ok = false;
    console.log(`FAIL  a recorded deviation no longer matches the original`);
  }
  expectedJs = expectedJs.replace(d.from, d.to);
}
pass(
  existsSync(JS) && readFileSync(JS, "utf8").trim() === expectedJs.trim(),
  deviations.length
    ? `carousel.js = original + ${deviations.length} recorded deviation(s)`
    : "carousel.js is byte-identical to the original inline script",
);
for (const d of deviations) console.log(`        - ${d.reason}`);
const inlineCss = /<style>([\s\S]*?)<\/style>/.exec(baseRaw)[1].trim();
pass(
  existsSync(SRC_CSS) && readFileSync(SRC_CSS, "utf8").includes(inlineCss),
  "main.css contains the original <style> block verbatim",
);
console.log("");

// Templating moved class names out of the markup and into JSON data, where
// Tailwind's scanner can only see them if _data is in the content globs. A
// missing rule is invisible in the DOM diff, so it is checked directly.
console.log("=== 3. every class used is present in the compiled CSS ===");
if (!existsSync(CSS)) {
  console.log("SKIP  no compiled CSS yet\n");
} else {
  const css = readFileSync(CSS, "utf8");
  const pages = htmlPages("dist");
  const classes = new Set();
  for (const page of pages) {
    const html = readFileSync(page, "utf8");
    for (const m of html.matchAll(/class="([^"]*)"/g))
      for (const c of m[1].split(/\s+/)) if (c) classes.add(c);
  }
  console.log(`  scanning ${pages.length} built page(s)`);

  const esc = (c) => c.replace(/[^a-zA-Z0-9_-]/g, (ch) => "\\" + ch);
  const missing = [];
  for (const c of classes) {
    if (NOT_UTILITIES.has(c) || DEAD_IN_ORIGINAL.has(c)) continue;
    if (!css.includes("." + esc(c))) missing.push(c);
  }
  console.log(`  ${classes.size} distinct classes used`);
  console.log(
    `  ${NOT_UTILITIES.size} non-utility, ${DEAD_IN_ORIGINAL.size} dead in original (skipped)`,
  );
  pass(missing.length === 0, `all remaining classes resolve in main.css`);
  if (missing.length) console.log(`      missing: ${missing.join(", ")}`);
}

// In-page navigation is only as good as its targets. A typo in an anchor is
// silent: the link just does nothing.
console.log("\n=== 4. in-page anchors resolve ===");
{
  let broken = [];
  let dead = 0;
  const frags = [];
  for (const page of htmlPages("dist")) {
    const html = readFileSync(page, "utf8");
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    const pageFrags = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    frags.push(...pageFrags);
    broken.push(...[...new Set(pageFrags)].filter((f) => !ids.has(f)));
    dead += (html.match(/href="#"/g) || []).length;
  }
  // Root-relative anchors (/#frag) come from shared chrome and must resolve on
  // the home page, not the page they appear on.
  const homeIds = new Set(
    [...readFileSync(BUILT, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]),
  );
  for (const page of htmlPages("dist")) {
    const html = readFileSync(page, "utf8");
    for (const m of html.matchAll(/href="\/#([^"]+)"/g)) {
      frags.push("/" + m[1]);
      if (!homeIds.has(m[1])) broken.push("/" + m[1]);
    }
  }
  broken = [...new Set(broken)];

  if (frags.length === 0) console.log("  no in-page anchors yet");
  for (const f of [...new Set(frags)])
    console.log(`  #${f} -> ${broken.indexOf(f) === -1 ? "resolves" : "MISSING"}`);
  pass(broken.length === 0, "every in-page anchor points at an element that exists");
  console.log(`  ${dead} link(s) still href="#" (no destination decided yet)`);
}

// Checks 1-4 only compare text. A syntax error in the script passes all of
// them while every listener on the page silently fails to attach - which is
// exactly how a broken edit once shipped: dead arrows, frozen dots, and no
// error anywhere except the browser console.
console.log("\n=== 5. shipped JavaScript actually parses ===");
const jsFiles = [
  ...(existsSync("src/js") ? readdirSync("src/js") : []).map((f) => `src/js/${f}`),
  ...(existsSync("dist/js") ? readdirSync("dist/js") : []).map((f) => `dist/js/${f}`),
].filter((f) => f.endsWith(".js"));
for (const f of jsFiles) {
  if (!existsSync(f)) {
    console.log(`SKIP  ${f} not built yet`);
    continue;
  }
  try {
    execFileSync(process.execPath, ["--check", f], { stdio: "pipe" });
    pass(true, `${f} parses`);
  } catch (e) {
    pass(false, `${f} has a syntax error`);
    console.log(
      "      " + String(e.stderr).split("\n").slice(0, 4).join("\n      "),
    );
  }
}

process.exit(ok ? 0 : 1);
