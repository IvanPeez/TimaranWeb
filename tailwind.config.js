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
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
}

