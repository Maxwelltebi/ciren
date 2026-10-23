// Rendered widths for responsive images. PAGE_INTRO is also read by the hero
// preload in vite.config.ts, which only works when the two match exactly.
export const HALF_WIDTH = "(max-width: 640px) 100vw, min(50vw, 600px)";
export const PAGE_INTRO = HALF_WIDTH;
