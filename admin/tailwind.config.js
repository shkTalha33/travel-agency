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
          950: '#0E1318', // Deep obsidian charcoal
          900: '#171D25', // Rich dark slate charcoal
          850: '#202731', // Charcoal steel
          800: '#2A3340', // Dark slate
          700: '#3B4656', // Slate charcoal
          600: '#525F73', // Muted charcoal
          500: '#6B7A90',
        },
        ocean: {
          50: '#FCF2F3',
          100: '#F9E4E6',
          200: '#F4CDD2',
          300: '#ECA8B1',
          400: '#DF7987',
          500: '#C94D5E',
          600: '#AA303E', // Primary Brand Color
          700: '#8E2532',
          800: '#76212C',
          900: '#641F27',
        },
        gold: {
          50: '#FFFDF5',
          100: '#FEF7DA',
          200: '#FCEAB2',
          300: '#F8D879',
          400: '#F1C244',
          500: '#D99B16', // Vibrant celebratory gold spark
          600: '#B87B0B',
          700: '#8E5806',
          800: '#673D03',
        },
        sand: {
          50: '#FAFAFB', // Crisp clean luxury pearl
          100: '#F3F4F6', // Soft slate surface
          200: '#E5E7EB', // Subtle border
          300: '#D1D5DB', // Divider
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
