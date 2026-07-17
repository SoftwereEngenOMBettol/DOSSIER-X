const preset = require("../../packages/ui/tailwind.preset.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
