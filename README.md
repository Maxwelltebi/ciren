# CIReN — Campus Innovation & Research Network

Static landing page. Restructured from a single 516-line `code.html` export into
templates, data and assets **without changing a single pixel of output**.

No framework at runtime: the build emits plain HTML, one stylesheet and one
small script. Deployable to any static host.

## Commands

```bash
npm install
npm run dev      # Eleventy dev server + Tailwind watch
npm run build    # writes dist/
npm run verify   # proves the build still matches the original design
```

`npm run build` must run before `verify` (it compares against `dist/`).

## Layout

```
src/
  index.njk                    home page content
  programs.njk                 /programs/ page
  papers.njk                   /papers/ page
  _includes/
    layout.njk                 <head> + shared header, footer, dialogs, scripts
    sections/                  one file per band of the page
      header.njk
      hero.njk                 dark hero; includes stats-marquee
      stats-marquee.njk        the scrolling metrics strip
      what-we-do.njk
      testimonies.njk          carousel shell + controls
      connect.njk              dark panel; includes newsletter + footer
      newsletter.njk
      footer.njk
    partials/                  repeated blocks, rendered from data
      testimonial-card.njk
      testimonial-modal.njk      the click-to-open dialog
      apply-modal.njk            membership application dialog
      case-study-modal.njk       the case study behind CIReN
      flip-card.njk              flipping card (societies + events)
      stat-item.njk
      footer-column.njk
      social-icon.njk
  _data/                       content — edit these, not the markup
    testimonials.json          6 cards
    stats.json                 6 marquee metrics
    footer.json                3 nav columns + 5 social links
    applyForm.json             application fields + POST endpoint
    programs.json              Programs page copy, cards, case study
    papers.json                publications list
  css/main.css                 Tailwind entry + the original keyframes
  js/modal.js                  shared dialog behaviour (focus trap, Escape)
  js/carousel.js               the testimonial carousel
  js/testimonial-modal.js      fills + opens the testimonial dialog
  js/apply-modal.js            application form submit handling
  js/programs.js               flip cards + case study dialog
  assets/images/               9 images, pulled local
tools/
  verify.mjs                   static parity harness (see below)
  behaviour.mjs                real-DOM behaviour test
  asset-map.json               original image URL -> local path
  js-deviations.json           declared changes to carousel.js
  dom-deviations.json          declared changes to the markup
reference/
  original.html                the frozen original; do not edit
```

To change a testimonial, a metric or a footer link, edit the JSON in `_data/`.
The markup for those lives in exactly one place.

**Adding a page.** Drop a `.njk` file in `src/` with `layout: layout.njk` and a
`permalink`. The header, footer, dialogs and scripts come from the layout, so a
new page only holds its own content. Link to home-page sections with a
root-relative anchor (`/#about-us`), never a bare `#about-us` — the header is
shared, and a bare fragment silently does nothing on every other page. Check 4
enforces this.

## Features added on top of the original

- **Click a testimonial card to open it in a dialog.** The cards clamp their
  quote to four lines and all six are cut off; the dialog shows the full text
  alongside the photo, badge, name and university. Content is read out of the
  clicked card rather than duplicated, so there is one copy of the copy.
  Cards are now keyboard-reachable (`tabindex`, `role="button"`, Enter/Space),
  the dialog traps focus and returns it to the card that opened it, and it
  closes on Escape, the close button, or a backdrop click.

  Markup: `_includes/partials/testimonial-modal.njk` (included at page level —
  the testimonies section is `overflow-hidden`, so a dialog nested inside it
  would be clipped). Behaviour: `js/testimonial-modal.js`.

- **The header's Apply button opens a membership application form.** Fields are
  defined in `_data/applyForm.json` — add, remove or reorder them there and the
  dialog follows; nothing about the markup needs touching. Supports text, email,
  select and textarea, with native browser validation.

  **The form branches.** The first question asks whether the applicant wants to
  *Join CIReN* or *Host a campus club*. Club applications stay short (7 fields);
  joining adds two open questions — motivation, and their tech journey so far.
  Branching is declared in the data, not the code:

  ```json
  "showWhen": { "field": "application_type", "equals": ["Join CIReN"] }
  ```

  A hidden conditional field is also **disabled**, and that matters: a hidden
  field that is still `required` makes the browser refuse to submit and try to
  focus something invisible, so the form dies with no message the visitor can
  see. Disabling takes it out of validation and out of the submitted payload,
  while keeping anything already typed if they switch back.

  **The form has no destination yet.** `applyForm.json` has an empty `action`,
  and while it is empty the dialog tells the applicant plainly that their
  application was *not* sent, rather than showing a fake confirmation. Set
  `action` to a Formspree / Netlify Forms / Google Forms endpoint to make it
  live; the submit handler already posts and reports success or failure.

Both dialogs share `js/modal.js` for focus trapping, Escape, backdrop clicks,
scroll locking and focus restoration.

## How parity is guaranteed

`npm run verify` is not a smoke test — it makes six groups of assertions:

1. **DOM parity.** The built page's `<body>`, with comments and `<script>`
   stripped and whitespace collapsed, is compared character-for-character
   against `reference/original.html`. Image URLs are projected through
   `tools/asset-map.json` first, so localising the assets doesn't mask a real
   change. Any divergence is reported with surrounding context.
2. **Extracted assets are byte-identical.** `carousel.js` still matches the
   original inline `<script>`, and `main.css` still contains the original
   `<style>` block verbatim.
3. **Every class resolves.** Templating moved class names into JSON, where
   Tailwind's scanner only sees them because `_data` is in the content globs.
   A missing rule is invisible in a DOM diff, so all 347 classes used are
   checked against the compiled stylesheet directly.

4. **The shipped JavaScript parses.** `node --check` on every file in `src/js`
   and `dist/js`. Checks 1–3 only compare text, and a syntax error passes all
   of them while every listener on the page silently fails to attach — which
   is exactly how one broken edit shipped: dead arrows, frozen dots, no error
   anywhere but the browser console.
5. **The dialog actually behaves.** `tools/behaviour.mjs` loads the built page
   into a real DOM (jsdom), runs the real shipped scripts, and drives them:
   clicking and Enter open it, the right content is copied, focus moves in and
   comes back, Escape and the backdrop close it, all six cards open distinct
   content.
6. **The carousel is still wired.** Both arrows are asserted to call `scrollBy`
   on the deck, so a future change cannot quietly kill them again.
8. **The branching works.** Both extra questions are asserted hidden and
   disabled before a choice is made and for club hosts, revealed and required
   for joiners, and — checked via `FormData` — a club application submits 7
   fields while a join submits 9.
7. **The apply dialog behaves.** Opens from the header, renders every field in
   `applyForm.json` with a matching label, marks required fields, and — with no
   endpoint configured — states the application was not sent instead of faking
   success. This caught a real bug: `form.action` resolves to the document URL
   when the attribute is absent, so the "no endpoint" branch never ran.

Deliberate changes are declared, not waved through: `tools/js-deviations.json`
and `tools/dom-deviations.json` record each one with its rationale and are
replayed onto the original. Anything *undeclared* still fails.

Run it after any change to the markup, data, or scripts.

## Deliberately preserved quirks

These are faults in the original design. They are kept because fixing them
would change how the page looks, which was out of scope:

- **`rotate-5` and `rotate-8` do nothing.** Tailwind's rotate scale is
  0,1,2,3,6,12,45,90,180. Testimonial cards 5 and 6 have never been rotated,
  in the original either. `verify.mjs` allow-lists them explicitly.
- **The hero photo and the "What We Do" photo are the same image**, served
  from two different URLs in the original. Now one file.
- **Two testimonial portraits are reused.** Nour El-Din uses Kofi Mensah's
  photo; Mamadou Diop uses Amina Bello's.
- **All 33 links are `href="#"`.** No real destinations exist yet.
- **The newsletter form is a stub** — inline `onsubmit` with an `alert()`.
  It collects a name and email and does nothing with them.
- **The testimonials are placeholder content.** Named people at named
  universities with specific claims ("published in IEEE Access"). They read as
  real endorsements and must be replaced with consented ones before launch.

## Changed from the original

One behavioural fix, recorded in `tools/js-deviations.json` and replayed by
`verify.mjs`, so any *undeclared* edit to `carousel.js` still fails the harness:

- **The page no longer jumps to the testimonials on load.** The original
  centred the deck with `cards[2].scrollIntoView(...)`, but that scrolls every
  scrollable ancestor — including the page — so first load and every refresh
  dumped you at the carousel. Now it sets `deck.scrollLeft`, which can only
  move the deck. It also runs immediately instead of on `window.load` (the
  script is deferred, so layout is ready) and syncs the active dot, which the
  markup hardcoded to dot 2 while the code centres card 3.

And three changes with no visible effect at all:

- The Tailwind browser CDN was replaced with a compiled stylesheet. Still
  Tailwind v3, with the same `forms` and `container-queries` plugins.
- The 13 remote `googleusercontent` image URLs (temporary, expiring) were
  downloaded. They were only 9 distinct files.
- Four Google Font families — Outfit, Rubik, Inter, Roboto Slab — were
  removed. They were downloaded but never used; Outfit is named in `main.css`
  but overridden by the inline style on `<body>`, so it has never rendered.
  Playfair Display and Plus Jakarta Sans remain, now in one request.

## Dummy content to replace before production

Every placeholder notice has been removed so the site previews as finished.
Nothing on screen now tells a visitor that this content is provisional, so the
list below is the only record of what is still fake.

- **`applyForm.json` — `demoMode: true`, no `action`.** THE MOST IMPORTANT ONE.
  Submitting the application form shows "Thank you. Your application has been
  received." and sends nothing anywhere. If this ships, real applicants will
  believe they have applied. Set `action` to a real endpoint and `demoMode` to
  false. `verify` asserts the two agree with each other.
- **`papers.json`** — all three papers are template rows: titles, authors and
  `example.com` URLs are stand-ins.
- **`programs.json` — `inspiration.caseStudy.body`** — dummy prose.
- **`programs.json`** — society and event card images are reused photos from
  the existing set.

Each of these files carries a `_comment_dummy` (or `_comment_demoMode`) key
naming what needs replacing.

## Content still needed

- **The case study is placeholder text.** `programs.json` →
  `inspiration.caseStudy.body` (one string per paragraph). While
  `isPlaceholder` is true the dialog shows a visible amber notice, so the
  placeholder cannot be mistaken for the real thing. Set it to false once the
  real text is in.
- **The research paper has no URL.** `programs.json` →
  `inspiration.paperUrl`. While empty the button renders explicitly disabled
  with "The paper link has not been added yet" rather than as a dead control.
  Setting it turns the button into a real external link with
  `target="_blank"` and `rel="noopener noreferrer"`.
- **The application form has no endpoint** (see above).
- **The papers list is template rows, not real papers.** `papers.json` →
  `papers`. Each entry takes `title`, `authors` (one string, formatted however
  you cite), `year`, and an optional `url` — when a URL is present the title
  becomes an external link, when absent it renders as plain text rather than a
  dead one. Set `isPlaceholder` to false once real entries are in; an empty
  array renders a proper empty state rather than a heading over nothing.

## Known issues not yet addressed

Each changes behaviour, so each is its own decision:

- The six carousel dot buttons are empty, so they have no accessible name.
- The 28-second marquee ignores `prefers-reduced-motion` (WCAG 2.2.2).
- Carousel arrows scroll by 75% of a card width, so repeated clicks drift out
  of alignment with the snap points; the active dot is derived from a scroll
  ratio rather than from which card is actually centred, so it drifts too.
- The dot click handler still uses `scrollIntoView`, so it can nudge the page
  vertically. Much less disruptive than the load-time case that was fixed — it
  only fires on a deliberate click, when the carousel is already on screen —
  but it is the same underlying issue.
- No meta description, Open Graph tags or favicon. `<title>` still reads
  "CIReN Header & Hero Section".
- The footer copyright says 2025.
- The newsletter form (separate from the application form) is still the
  original `alert()` stub.
- Donate in the header is still `href="#"`.
- The header has no mobile nav at all: the `<nav>` is `hidden md:flex`, so on
  narrow screens there is no way to reach Programs or About Us. This predates
  the restructure.
- Programs card photos are placeholders drawn from the existing image set —
  two are testimonial portraits reused. Swap the `image` values in
  `programs.json` before production.
