/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#05060a",
          soft: "#0a0d14",
          panel: "#0e121b",
          border: "#1b2230",
        },
        neon: {
          green: "#39ff9c",
          red: "#ff3b5c",
          blue: "#3ba8ff",
          gold: "#ffcf4d",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "neon-green": "0 0 12px rgba(57, 255, 156, 0.35)",
        "neon-red": "0 0 12px rgba(255, 59, 92, 0.35)",
        "neon-blue": "0 0 12px rgba(59, 168, 255, 0.35)",
        "neon-gold": "0 0 12px rgba(255, 207, 77, 0.35)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "radar-sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "dash-flow": {
          "0%": { strokeDashoffset: "24" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "radar-sweep": "radar-sweep 6s linear infinite",
        "dash-flow": "dash-flow 1s linear infinite",
        "border-spin": "radar-sweep 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
