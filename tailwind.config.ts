import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        krishi: {
          green: {
            50: "#ECFDF5",
            100: "#D1FAE5",
            200: "#A7F3D0",
            300: "#6EE7B7",
            400: "#34D399",
            500: "#10B981", // Brand Green
            600: "#059669",
            700: "#047857",
            800: "#065F46",
            900: "#064E3B",
            950: "#022c22",
          },
          earth: {
            50: "#FFFBEB",
            100: "#FEF3C7",
            200: "#FDE68A",
            300: "#FCD34D",
            400: "#F59E0B",
            500: "#D97706",
            600: "#B45309",
            700: "#92400E", // Brand Earth Brown
            800: "#78350F",
            900: "#451A03",
          },
          sky: {
            50: "#EFF6FF",
            100: "#DBEAFE",
            200: "#BFDBFE",
            300: "#93C5FD",
            400: "#60A5FA",
            500: "#3B82F6", // Brand Sky Blue
            600: "#2563EB",
            700: "#1D4ED8",
            800: "#1E40AF",
            900: "#1E3A8A",
          },
          dark: {
            card: "#0d1f18",
            surface: "#07140f",
            border: "#183b2e",
            muted: "#132d23",
          }
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        hindi: ["var(--font-noto-sans-devanagari)", "Noto Sans Devanagari", "sans-serif"],
      },
      animation: {
        "float": "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 15px rgba(16, 185, 129, 0.4))" },
          "50%": { opacity: "0.85", filter: "drop-shadow(0 0 25px rgba(16, 185, 129, 0.7))" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
