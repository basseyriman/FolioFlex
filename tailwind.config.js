/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          100: "var(--color-blue-100)",
          200: "var(--color-blue-200)",
          500: "var(--color-blue-500)",
        },
        green: {
          100: "var(--color-green-100)",
          200: "var(--color-green-200)",
          500: "var(--color-green-500)",
        },
        purple: {
          100: "var(--color-purple-100)",
          200: "var(--color-purple-200)",
          500: "var(--color-purple-500)",
        },
        pink: {
          100: "var(--color-pink-100)",
          200: "var(--color-pink-200)",
          500: "var(--color-pink-500)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    {
      pattern: /from-(blue|purple|green|pink)-(100|200|500)/,
    },
    {
      pattern: /to-(blue|purple|green|pink)-(100|200|500)/,
    },
  ],
};
