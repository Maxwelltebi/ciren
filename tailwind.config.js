import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,json}"],
  theme: { extend: {} },
  plugins: [forms, containerQueries],
};
