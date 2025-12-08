import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sbc: {
          bg: "#050816",
          bgSoft: "#0b1020",
          gold: "#d4af37",
          goldSoft: "#f4d27a",
          text: "#f9fafb",
          muted: "#9ca3af",
          border: "#1f2933",
          error: "#f97373",
        },
      },
    },
  },
  plugins: [],
};
export default config;
