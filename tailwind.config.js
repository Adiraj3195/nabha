/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Muted clinical blue — primary accent used sparingly across the app.
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          400: "#6D7FE0",
          500: "#4C5FD1",
          600: "#3B4FBF",
          700: "#3243A0",
        },
        // Status colors used consistently for triage / vitals severity.
        critical: { text: "#B42318", bg: "#FEF3F2", border: "#FECDCA" },
        warning: { text: "#B54708", bg: "#FFFAEB", border: "#FEDF89" },
        stable: { text: "#087443", bg: "#ECFDF3", border: "#ABEFC6" },
        info: { text: "#3243A0", bg: "#EEF2FF", border: "#C7D2FE" },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.05)",
      },
      borderRadius: {
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
};
