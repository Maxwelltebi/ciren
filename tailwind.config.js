import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,json}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
        display: [
          '"Nichrome"',
          '"Inter Tight"',
          '"Inter"',
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [forms, containerQueries],
};
