import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

// Palette validée en Phase 10 (E0) — cf. docs/DECISIONS.md et le plan d'implémentation d'E0.
// Les 7 couleurs thématiques sont la source de vérité en base (Theme.colorHex) ; elles sont
// dupliquées ici uniquement pour les usages statiques (ex. légendes, documentation visuelle).
// Un badge/carte lié à un Theme précis doit utiliser Theme.colorHex en style inline, pas ces
// classes statiques, pour rester cohérent si un admin modifie une couleur en base.
const themeColors = {
  sport: "#F97316",
  ecologie: "#16A34A",
  citoyennete: "#2563EB",
  sante: "#E11D48",
  art: "#A855F7",
  science: "#0891B2",
  avenir: "#CA8A04",
};

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4F46E5",
          50: "#EEF2FF",
          600: "#4F46E5",
          700: "#4338CA",
        },
        theme: themeColors,
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#0F172A",
            primary: {
              DEFAULT: "#4F46E5",
              foreground: "#FFFFFF",
            },
          },
        },
      },
    }),
  ],
};

export default config;
