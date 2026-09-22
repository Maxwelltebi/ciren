# Migration to Vite + React + TypeScript

## Scope and inventory

Replace Eleventy/Nunjucks and global DOM scripts with a conventional Vite React
TypeScript application. Preserve the existing visual design, four routes (`/`,
`/programs/`, `/papers/`, `/support/`), content, assets, conditional forms,
testimonial carousel, dialogs, mobile navigation, and flip cards.

The working copy of `src/_data/site.json` contains user edits. Move that exact
content to `src/data/site.json`; do not replace it with the Git version.

## Implementation sequence

1. Add root `index.html`, `vite.config.ts`, standard referenced TypeScript
   configs, ESLint, and Vite npm scripts. Retain Tailwind 3 and its plugins to
   preserve existing styling.
2. Put `main.tsx`, `App.tsx`, and `index.css` in `src/`; organize React code in
   `components/`, `pages/`, and `hooks/`. Use React Router for existing URLs.
3. Move JSON content to `src/data/`, introduce shared TypeScript content types,
   and move static images to `public/assets/images/` without changing URLs.
4. Implement interactive behavior with React state, events, and lifecycle
   cleanup. Keep forms' conditional fields out of validation and submissions
   while hidden. Preserve configured endpoints and explicit demo settings.
5. Preserve build-time favicon and robots metadata, add SPA fallback rules to
   the existing Netlify/Vercel configuration, and document the editing workflow.
6. Replace Eleventy-specific tests with React interaction and content coverage;
   run type checking, lint, tests, and a production build. Remove obsolete
   templates/scripts only after their replacements are present.

## Verification and tradeoffs

Verify route content, all testimonials and program cards, dialog keyboard and
focus behavior, mobile navigation, carousel controls, form branching, demo /
unconfigured / successful / failed submissions, and asset/robots output.
This becomes a client-rendered SPA: static hosting needs fallback routing and
page content requires JavaScript. Keep preview noindex metadata in initial HTML.
The existing newsletter, payment destinations, search control, footer links and
placeholder content are not new backend integrations; document their status.

Reference: https://vite.dev/guide/ (React TypeScript template, root HTML entry,
and dev/build/preview commands).

## Completed

- Replaced the Eleventy build and all templates/global scripts with React and
  TypeScript; retained the existing Tailwind 3 styling.
- Confirmed all nine JSON files were copied byte for byte before removing the
  old data directory, including the user's uncommitted site settings.
- Added 21 interaction tests, strict TypeScript checks, lint, production output
  checks, and Netlify/Vercel SPA fallbacks.
- Preserved original design exports in `reference/`; removed obsolete tooling.
- Documented the edit locations, client-rendering tradeoff, and existing demo
  forms/placeholder integrations in README. Visual browser parity is not claimed.
