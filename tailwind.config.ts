import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-hero": "#000000",
        "bg-light": "#E6E4F0",
        "bg-dark": "#0A0A0A",
        "accent-lime": "#D9FF5C",
        "accent-purple": "#5A2DC9",
        "accent-yellow": "#F7C73D",
        "text-muted": "#9A98A8",
        "eyebrow-blue": "#6A6FFF",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.25em",
        tight: "-0.02em",
      },
      lineHeight: {
        display: "0.9",
        "display-relaxed": "0.95",
      },
      borderRadius: {
        card: "16px",
        "card-lg": "24px",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "expo-in-out": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
