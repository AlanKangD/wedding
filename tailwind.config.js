/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wedding-bg': '#fdfbf7',
        'wedding-text': '#2c2c2c',
        'wedding-accent': '#a3907c',
        'wedding-secondary': '#e6e2dd',
      },
      fontFamily: {
        'serif': ['Noto Serif KR', 'serif'],
      },
    },
  },
  plugins: [],
}

