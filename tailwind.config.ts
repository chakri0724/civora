import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14150f",
        paper: "#f6f4ec",
        card: "#fffdf7",
        line: "#e4e0cf",
        muted: "#6b6a5c",
        amber: "#e8a13a",
        escalate: "#c0492e",
        resolved: "#3f7d54",
        ladder: "#2b4a6f",
        verify: "#2f6f8f",
        sev: {
          low: "#6b8f5a",
          mod: "#c8973a",
          high: "#c0492e",
          crit: "#8b2e6f",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
