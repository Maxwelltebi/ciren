# CIReN — Campus Innovation & Research Network

A Vite + React + TypeScript website. The four pages and their existing design
have been migrated from Eleventy to React components.

## Get started

Use Node 22.12+ (the repo's `.nvmrc` selects Node 22), or Node 24+.

```sh
npm install
npm run dev
```

Open the local URL Vite prints, normally http://localhost:5173.
Edits update automatically. On Windows PowerShell, use `npm.cmd` instead of
`npm` if your execution policy blocks `npm.ps1`.

```sh
npm run build       # TypeScript check and production output in dist/
npm run preview     # Serve the production build locally
npm run lint        # ESLint, TypeScript and React rules
npm test            # React interaction tests in jsdom
npm run test:watch  # Keep tests running while editing
npm run verify      # Lint, tests, production build, and output checks
```

## Where to edit

```text
index.html                 Vite's HTML entry, fonts and default metadata
vite.config.ts             React plugin and site metadata/robots generation
src/
  main.tsx                 Mount React and BrowserRouter
  App.tsx                  Routes, shared layout and application dialog
  index.css                Tailwind entry and shared animations/styles
  components/              Header, footer, home sections, cards, forms, dialogs
  pages/
    HomePage.tsx           /
    ProgramsPage.tsx       /programs/
    PapersPage.tsx         /papers/
    SupportPage.tsx        /support/
  hooks/useCarousel.ts     Carousel measurements and scroll controls
  lib/forms.ts             Conditional-field dependency resolution
  types/content.ts         Shared content/form interfaces
  data/                    Editable JSON copy and settings
  test/                    Page and interaction tests
public/
  assets/images/           Logos and photographs; served at /assets/images/...
scripts/check-build.mjs    Check built metadata, assets and hosting fallbacks
```

The standard Vite entry files are at the root and in `src/`. `components/`,
`pages/`, and `data/` are ordinary folders organized for this site's needs.
No Nunjucks, Eleventy data conventions, or global `window.ciren*` scripts remain.
The migration plan and architectural tradeoffs are recorded in `MIGRATION.md`.

| Change | File |
| --- | --- |
| Logo, favicon, search indexing | `src/data/site.json` |
| Homepage copy and images | `src/data/home.json` |
| Statistics | `src/data/stats.json` |
| Testimonials | `src/data/testimonials.json` |
| Programs and case study | `src/data/programs.json` |
| Event galleries and photo captions | `src/data/gallery.json` |
| Publications | `src/data/papers.json` |
| Application fields and endpoint | `src/data/applyForm.json` |
| Support fields and payment links | `src/data/supportForm.json` |
| Footer labels and social icon markup | `src/data/footer.json` |
| Header navigation | `src/components/Header.tsx` |
| Page layout | Matching `.tsx` file in `src/pages/` |

Your working-copy `site.json` values were retained at `src/data/site.json`.
Images now go in `public/assets/images/`, even where older JSON comments
refer to `src/assets/images/`. Image URLs remain `/assets/images/filename.jpg`.

Most content is plain JSON text. Some existing home/footer copy contains trusted
HTML (`<strong>`, `<br>`, SVG, or entities such as `&amp;`). `RichText.tsx` renders
that repository-authored content. Do not pass user input or external API data to
it without sanitizing it first.

## Editing React

### Event gallery photos

The Programs page gallery currently contains **CIReN Mini Hackathon x MLH**.
Its four clearly labelled dummy images are in
`public/assets/images/events/ciren-mini-hackathon-mlh/` (`photo-01.jpg` through
`photo-04.jpg`). Replace those files with your own JPG photos to reuse their URLs.
If you use different names or formats, update the `src` paths in
`src/data/gallery.json`. Replace each placeholder `alt` and `caption` there too;
captions are optional. The first image is the event's cover.

Add or remove entries in an event's `photos` array to change its stack. To add
another event, add an object with a unique `id`, `name`, and `photos` array.
Each photo uses `{ "src": "/assets/images/events/your-event/photo.jpg", "alt":
"Describe the photo", "caption": "Optional caption" }`. No component edits are
needed. Empty events display “Photos coming soon”.

Opening a card starts at its first photo. Swipe horizontally, use the arrow
keys while the photo stack is focused, or select Next photo. After the last
photo the viewer stops and offers View again. Escape and the backdrop close it.
The former inspiration/case-study section is no longer displayed.

### Components and routes

A component returns JSX: use `className` for CSS classes, `{value}` for dynamic
text, and event props such as `onClick` for behavior. Styles use the existing
Tailwind 3 utilities and `src/index.css`; no Tailwind version migration is needed.

To add a page, create `src/pages/YourPage.tsx`, import it into `src/App.tsx`, and
add a `<Route path="/your-page" element={<YourPage />} />`. Add its title to
`RouteEffects` and link to it with React Router's `<Link to="/your-page/">`.
The shared header, footer, newsletter, and Apply dialog already surround routes.
Home-section links use `/#about-us`, so they work from other pages.

## Forms and existing preview content

Application and support forms share `ContentForm.tsx`. Define fields in JSON;
`showWhen: { "field": "controller_name", "equals": ["value"] }` controls a
conditional field. Hidden fields are disabled, excluded from validation and
FormData, and retain their entered values while switching branches.

- A nonempty `action` sends a multipart `POST` with `Accept: application/json`.
  Use an endpoint that supports browser submissions and the site's CORS origin.
- With an empty `action` and `demoMode: true`, the current preview shows a local
  confirmation and sends nothing. Both existing forms retain this setting.
- With an empty `action` and `demoMode: false`, the form explicitly reports that
  details were not sent. Configure an endpoint and disable demo mode at launch.
- `notifyEmail` is a note for configuring your form provider, not an email
  delivery integration. Client-side JSON is public; do not put secrets in it.
- The newsletter retains its original local confirmation; it has no backend.
- Payment URLs and case-study/testimonial content include preview placeholders.
  Search and several footer/social/legal links are still original placeholders.
  This migration does not add a search service, payment integration, or mailing list.

Dialogs support Escape, backdrop/close buttons, focus trapping and focus return.
React owns the menu, flip cards, carousel, conditional fields, and status messages.

## Production and hosting

`npm run build` creates `dist/`. Netlify and Vercel configuration is included,
with SPA fallback routing so direct visits and refreshes at `/programs/`,
`/papers/`, and `/support/` load correctly. For another static host, serve real
files normally and rewrite other page requests to `/index.html`.

This is a client-rendered SPA: the page body requires JavaScript. The initial
HTML includes the default title, description, favicons and preview indexing
controls; React sets per-page titles. If server-rendered content becomes a
requirement for search indexing, add prerendering/SSR deliberately.

`src/data/site.json` controls both the initial robots meta tag and `robots.txt`.
Keep `noindex: true` for previews; set it to false and rebuild at launch. Favicon
paths are normalized to root-relative URLs, including your existing SVG path.

No deployment is performed by these scripts. The historical design export
remains in `reference/original.html` and is not part of the Vite bundle.

## Validation

Tests exercise routes, links, program cards, all testimonial dialogs, focus and
keyboard handling, menu dismissal, carousel wiring, form branching and payment
panels, validation, demo/unconfigured endpoints, POST success, duplicate-submit
prevention, and error recovery. jsdom does not render pixels; these checks do
not claim screenshot or cross-browser visual parity.

The project follows the [Vite React TypeScript conventions](https://vite.dev/guide/).
