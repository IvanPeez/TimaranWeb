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
      }
     
    },
  },
  plugins: [],
}

