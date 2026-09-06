/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: src/js is scanned deliberately. carousel.js assigns Tailwind classes
  // as strings (the active-dot state: bg-[#0B0F19], ring-[#40b830]/40, ...).
  // The CDN resolved those at runtime; a compiled build only emits classes it
  // finds by scanning. Drop this glob and the active dot silently loses style.
  content: [
    "./src/**/*.njk",
    "./src/**/*.html",
    "./src/js/**/*.js",
    // Data files hold literal class names (card rotations, stat colours).
    // Templates interpolate them, so the scanner can only find them here.
    "./src/_data/**/*.json",
  ],
  theme: { extend: {} },
  // Mirrors the CDN's "?plugins=forms,container-queries".
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
