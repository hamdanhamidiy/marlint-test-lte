import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        marine: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9dffd",
          300: "#7cc4fa",
          400: "#36a3f5",
          500: "#0c85e5",
          600: "#0066cc",
          700: "#0051a3",
          800: "#054586",
          900: "#0b3a6f",
          950: "#07254a",
        },
        navy: {
          800: "#0f172a",
          900: "#0B192C",
          950: "#060e1a",
        },
        ocean: {
          deep: "#0B192C",
          surface: "#1E3E62",
          light: "#00ADB5",
          glow: "#00FFF5",
        },
        gold: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        surface: {
          primary: "#08080c",
          elevated: "#111118",
          card: "#16161e",
          border: "#1e1e28",
        }
      },
      fontFamily: {
        sans: [
          "var(--font-outfit)",
          "Outfit",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
        heading: [
          "var(--font-outfit)",
          "Outfit",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
        mono: [
          "var(--font-outfit)",
          "Outfit",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace"
        ],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;

