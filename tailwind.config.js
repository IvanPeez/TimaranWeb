/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    
    extend: {
      fontFamily:{
        generalSans: ['General Sans', 'sans-serif'],
        title: ['"Baskervville"', 'serif'],
        titleAlt: ['"Bodoni Moda"', 'serif'],
      },
      colors: {
        primary: "#2F3148",  // Color negro corporativo
        secondary: "#FFD700", // Color blanco corporativo
        linkColor: "#4286F4",    // Color dorado (ejemplo)
        grayDark: "#4C4C4C",
        grayLight: "#CDCDCD",
        // Paleta del catálogo de esencias
        champagne: {
          DEFAULT: "#D8BC8A",
          light: "#EDDCB9",
          dark: "#A2814A",
        },
        ink: {
          DEFAULT: "#0A0A0B",
          soft: "#111113",
          card: "#17171A",
          line: "#26262B",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "tray-in": {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "tray-in": "tray-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
}

