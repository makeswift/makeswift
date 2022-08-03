const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./pages/**/*.{html,ts,js,ts,tsx}', './components/**/*.{html,ts,js,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Chivo', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        green: '#335510',
      },
    },
  },
  plugins: [],
}
