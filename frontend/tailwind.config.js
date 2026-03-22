/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primaryBtn: "rgb(var(--bg-primary-btn) / <alpha-value>)",
          secondaryBtn: "rgb(var(--bg-secondary-btn) / <alpha-value>)",
          main: "rgb(var(--bg-main) / <alpha-value>)",
          surface: "rgb(var(--bg-surface) / <alpha-value>)",
          tag: "rgb(var(--bg-tag) / <alpha-value>)",
        },
        text: {
          primaryBtn: "rgb(var(--text-primary-btn) / <alpha-value>)",
          secondaryBtn: "rgb(var(--text-secondary-btn) / <alpha-value>)",
          primary: "rgb(var(--text-primary) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary) / <alpha-value>)",
          tag: "rgb(var(--text-tag) / <alpha-value>)",
        },
        border: {
          soft: "rgb(var(--border-soft) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
