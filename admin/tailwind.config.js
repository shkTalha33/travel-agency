/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#190F0A', // Deep roasted espresso mocha
          900: '#28170F', // Rich dark saddle coffee
          850: '#351E13', // Deep warm chocolate
          800: '#442618', // Dark chestnut
          700: '#5A3320', // Warm roasted coffee
          600: '#703F27', // Rich mahogany
        },
        ocean: {
          50: '#FDF8F3',
          100: '#F7EDE1',
          200: '#EED9C3',
          300: '#DFBD98',
          400: '#CD9B6C',
          500: '#B87B42',
          600: '#9E602A',
          700: '#824B1D',
          800: '#6B3B15',
          900: '#522B0E',
        },
        gold: {
          50: '#FDFBF5',
          100: '#FAF3D7',
          200: '#F5E4A8',
          300: '#EECD6E',
          400: '#E5B73E',
          500: '#D4A017', // Radiant Luxury Gold
          600: '#B8840D',
          700: '#8F6306',
          800: '#664402',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F3EFEA',
          200: '#E6DFD5',
          300: '#D2C7B8',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
