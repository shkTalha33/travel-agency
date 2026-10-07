const { colors } = require('./src/styles/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 8px -2px rgba(10, 25, 47, 0.035), 0 1px 2px rgba(10, 25, 47, 0.025)',
        card: '0 4px 14px -6px rgba(10, 25, 47, 0.045), 0 1px 4px rgba(10, 25, 47, 0.03)',
        elevated: '0 8px 20px -8px rgba(10, 25, 47, 0.055), 0 2px 6px rgba(10, 25, 47, 0.035)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'slide-down': { from: { opacity: '0', transform: 'translateY(-12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
        scroll: {
          to: {
            transform: 'translate(calc(-50% - 0.5rem))',
          },
        },
        meteor: {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': {
            transform: 'rotate(215deg) translateX(-600px)',
            opacity: '0',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.55s ease-out both',
        'slide-up': 'slide-up 0.65s ease-out both',
        'slide-down': 'slide-down 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.4s ease-out both',
        scroll: 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
        'meteor-effect': 'meteor 5s linear infinite',
      },
    },
  },
  plugins: [],
};
