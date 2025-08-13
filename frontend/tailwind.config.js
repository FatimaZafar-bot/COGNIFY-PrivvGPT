/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", 
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        jersey: ["'Jersey 20'", 'sans-serif'],
        inter: ["Inter", 'sans-serif'],
      },
    },
  },
  plugins: [],
}
