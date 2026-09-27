<h1 align="center">CIReN — Campus Innovation & Research Network</h1>

<h3 align="center">A campus research and innovation website built with React and TypeScript</h3>

<p align="center">
  Explore CIReN's societies, browse event photos, and discover ways to join or support student research and innovation.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&amp;logo=typescript&amp;logoColor=white" alt="TypeScript 5.9.3" />
  <img src="https://img.shields.io/badge/React-19.3.0-149ECA?style=flat&amp;logo=react&amp;logoColor=white" alt="React 19.3.0" />
  <img src="https://img.shields.io/badge/Vite-7.3.6-646CFF?style=flat&amp;logo=vite&amp;logoColor=white" alt="Vite 7.3.6" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.19-06B6D4?style=flat&amp;logo=tailwindcss&amp;logoColor=white" alt="Tailwind CSS 3.4.19" />
</p>

---

## Overview

**CIReN** is the public-facing website for the Campus Innovation & Research Network. Built with **React and TypeScript**, it introduces students and supporters to the network's societies, activities, and opportunities, bringing **program information, event photography, and participation forms** into one place.

The implementation uses **page components and editable JSON content** within a standard Vite application. React Router connects four pages, shared components provide navigation and interactive dialogs, and files in `public/assets/` supply the photographs and partner logos. Vite produces a static bundle for deployment.

## Features

| Area | Implemented behavior |
| --- | --- |
| Home | Network introduction, societies, partner logos, event recap, and member story cards. |
| Programs | Society details, participation pathway, activities, FAQs, and event gallery. |
| Event gallery | Layered photo cards open a dialog; horizontal swipes, arrow keys, or buttons advance through an event. The final image leads to a replay option. |
| Papers | A research introduction and **Coming Soon...** publication status. |
| Support | Funding priorities, ways to contribute, and a conditional support form. |
| Applications | A shared application dialog with fields that change according to the application type. |
| Interaction | Responsive navigation, focus-managed dialogs, carousel controls, and reduced-motion behavior for the partner strip and photo viewer. |

The gallery currently contains seven photographs from **CIReN Mini Hackathon x MLH**. The partner strip displays Major League Hacking, AmaliTech, and Central University.

## Tech Stack

Versions below reflect `package-lock.json`.

| Concern | Technology | Purpose |
| --- | --- | --- |
| Language | TypeScript 5.9.3 | Typed components, content definitions, and form logic. |
| Interface | React 19.3.0 | Pages, state, and reusable components. |
| Routing | React Router | Client-side routes and section navigation. |
| Tooling | Vite 7.3.6 | Development server and production bundling. |
| Styling | Tailwind CSS 3.4.19 and CSS | Utilities, responsive layouts, and editorial styling. |
| Tests | Vitest 4.1.11, Testing Library, jsdom | Component and interaction checks. |
| Quality | ESLint, TypeScript, Prettier | Linting, type checking, and formatting. |

## Project Structure
#Campus Innovation & Research Network (CIReN)

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
index.html                    HTML entry, default metadata, and fonts
vite.config.ts                React integration and robots/favicon generation
src/
  main.tsx                    React entry and BrowserRouter
  App.tsx                     Routes, shared layout, and application dialog
  pages/                      Home, Programs, Papers, and Support
  components/                 Sections, navigation, forms, cards, and dialogs
  data/                       Editable JSON content and configuration
  hooks/                      Carousel behavior
  lib/forms.ts                Conditional-field dependency logic
  types/                      Content, form, and gallery interfaces
  index.css                   Tailwind entry and shared styles
  styles/editorial.css        Page layout and editorial styles
  test/                       Component and interaction tests
public/assets/                Partner logos and other public assets
  images/                     Site photographs and branding
    events/                   Event gallery photographs
scripts/check-build.mjs       Production metadata, assets, and routing checks
reference/                    Historical HTML design exports
netlify.toml                  Netlify build and SPA fallback
vercel.json                   Vercel build and SPA fallback
MIGRATION.md                  Eleventy-to-React migration notes
```

This project uses Vite's React + TypeScript entry structure. Its previous Eleventy templates are no longer part of the runtime; see [MIGRATION.md](MIGRATION.md) for the migration decisions.

## Quick Start

Use **Node.js 22.12 or later within Node 22, or Node.js 24+**, with npm. The `.nvmrc` selects Node 22.

1. Open a terminal in the repository root, alongside `package.json`.
2. Install the locked dependencies:

   ```sh
   npm ci
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Open the URL printed by Vite, normally `http://localhost:5173`. The homepage should load, with changes updating as you edit.

On Windows PowerShell, use `npm.cmd` in place of `npm` if execution policy blocks `npm.ps1`. No environment file or backend service is required to run the current preview.

## How It Works

`src/main.tsx` mounts the application inside `BrowserRouter`. `src/App.tsx` chooses the page, updates page titles, handles section scrolling, and surrounds the routes with shared navigation, footer, newsletter, and the application dialog.

Pages combine JSON content with reusable React sections. Public asset URLs start with `/assets/`; Vite copies the corresponding files from `public/assets/` into the build without changing those paths.

`ContentForm.tsx` renders JSON-defined fields. A field's `showWhen` rule determines whether it is visible. Hidden fields retain their values when switching branches, but are disabled and excluded from validation and submission. Configured forms send multipart `POST` requests and handle pending, success, and error states.

The gallery reads event objects from `src/data/gallery.json`. Each event's first photo becomes its cover; opening the event starts a finite photo stack. The viewer supports horizontal swipes, keyboard navigation when the stack is focused, and explicit next/finish controls. Shared dialogs handle focus trapping, Escape, and returning focus to the opener.

## Results and Limitations

The repository implements four routes and includes automated interaction tests plus a production-output checker. The tests use jsdom: they do not establish screenshot accuracy, cross-browser rendering, or performance benchmarks.

The current site remains a preview in several respects:

- Application and support endpoints are empty. With `demoMode: true`, a form displays a local confirmation without sending data; without demo mode, it reports that the form is not connected.
- The newsletter displays a local alert and does not subscribe visitors to a mailing list.
- Payment links require review and configuration before accepting contributions.
- Member quotations currently contain “Testimony coming soon” text, and papers have not been published on the site.
- `site.json` sets `noindex: true`, blocking search indexing through metadata and `robots.txt`.
- Page bodies are client-rendered and require JavaScript. Server rendering and prerendering are not implemented.

## Usage

### Find the right file to edit

| Change | Source |
| --- | --- |
| Logo, favicons, search indexing | `src/data/site.json` |
| Hero, newsletter, and other homepage content | `src/data/home.json` |
| Overview, benefits, pathways, and FAQ content | `src/data/editorial.json` |
| Partner names and logos | `src/data/partners.json` |
| Member names, images, and quotations | `src/data/testimonials.json` |
| Society and event descriptions | `src/data/programs.json` |
| Gallery events, photo order, and alt text | `src/data/gallery.json` |
| Publication status | `src/data/papers.json` |
| Application fields and endpoint | `src/data/applyForm.json` |
| Support priorities, fields, and payment settings | `src/data/supportForm.json` |
| Navigation and footer links | `src/components/Header.tsx`, `src/components/Footer.tsx` |
| Page layout and page-specific copy | `src/pages/` and the corresponding section components |
| Brand and layout styling | `tailwind.config.js`, `src/index.css`, `src/styles/editorial.css` |

Not all copy comes from JSON; sections such as `About.tsx` contain their own text. The retained `footer.json` does not drive the current footer.

### Update the event gallery

The existing event photos are in `public/assets/images/events/ciren-mini-hackathon-mlh/`, named `mlh-hack1.jpg` through `mlh-hack7.jpg`.

To add an event, put its photos in a new folder under `public/assets/images/events/` and append an object to the `events` array in `src/data/gallery.json`. Use a unique `id`, an event `name`, and a `photos` array. Each photo requires `src` and descriptive `alt` text; `caption` is optional. Use root-relative `/assets/images/events/...` URLs. Array order controls the cover and viewing order, so component changes are unnecessary. An empty photo array displays “Photos coming soon”.

### Add a page

Create a component in `src/pages/`, register its route in `src/App.tsx`, and add its title to `RouteEffects`. Use React Router's `Link` for internal navigation. Shared navigation and dialogs already sit outside the page routes.

## Configuration

| Setting | Current behavior and configuration |
| --- | --- |
| `site.noindex` | Defaults to `true`. Set to `false` and rebuild when the site is ready for indexing. |
| `site.logo`, favicon fields | Public image URLs. Empty optional favicon values omit the corresponding tags. |
| Form `action` | Empty by default. Set to an endpoint accepting browser multipart POST requests with `Accept: application/json`. |
| Form `demoMode` | Allows a local success preview when no endpoint exists. Set to `false` for launch and configure `action`. |
| Field `showWhen` | Uses a controlling field name and an `equals` array to select when a field appears. |
| `notifyEmail` | Provider-configuration information only; it does not itself deliver email. |

A form endpoint must permit requests from the site's origin. Client-side JSON is public, so credentials belong in the receiving service, not in these files. Some repository content is rendered as trusted HTML through `RichText.tsx`; do not pass untrusted input to it without sanitization.

## Development and Deployment

Run commands from the repository root:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run lint` | Check TypeScript and React source with ESLint. |
| `npm test` | Run Vitest interaction tests. |
| `npm run test:watch` | Run tests while editing. |
| `npm run build` | Run TypeScript checks and create `dist/`. |
| `npm run preview` | Serve the existing production build locally. |
| `npm run verify` | Run lint, tests, build, and `scripts/check-build.mjs`. |

Tests cover routes, navigation, dialogs, form branching and submission, and gallery interactions. The output checker checks bundled entry files, favicon paths, robots settings, JSON-referenced assets, and hosting fallback configuration. Run `npm run verify` before delivering code changes.

Netlify and Vercel configuration is included. Both use `npm run build` and publish `dist/`, with fallback routing for direct visits to `/programs/`, `/papers/`, and `/support/`. On another static host, serve real files normally and rewrite application routes to `/index.html`.

The build scripts do not publish the site. Before deployment, configure form delivery and payment destinations, replace preview quotations, review indexing settings, and check the actual layout in desktop and mobile browsers.

## Contributing and License

For changes, keep editable content in the relevant data files where supported, reuse shared components, and run the verification command. Describe user-visible changes and validation when submitting work for review.

No license file is included in this repository. Do not assume an open-source license applies to the code, event photographs, or partner branding.

## Acknowledgements

The site represents CIReN and features photography from CIReN Mini Hackathon x MLH. Partner names and logos identify Major League Hacking, AmaliTech, and Central University; their branding remains associated with the respective organizations.

The page organization was informed by Forge's Launch site while retaining CIReN's story, colors, and event gallery. This README follows the repository's [showcase format](repo_format.md).
