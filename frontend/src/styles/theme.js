/**
 * Centralized theme — Caribbean luxury travel club.
 * Luminous porcelain pearl, vibrant lagoon teal, champagne gold, deep sapphire navy.
 * Consumed by tailwind.config.js.
 */
const slate = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
  950: '#020617',
};

const green = {
  50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7', 400: '#34D399',
  500: '#10B981', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B',
};

const red = {
  50: '#FFF1F2', 100: '#FFE4E6', 200: '#FECDD3', 300: '#FDA4AF', 400: '#FB7185',
  500: '#F43F5E', 600: '#E11D48', 700: '#BE123C', 800: '#9F1239', 900: '#881337',
};

const amber = {
  50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D', 400: '#FBBF24',
  500: '#F59E0B', 600: '#D97706', 700: '#B45309', 800: '#92400E', 900: '#78350F',
};

const colors = {
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
    700: '#824B1D', // Rich warm luxury saddle brown
    800: '#6B3B15',
    900: '#522B0E',
  },
  gold: {
    50: '#FDFBF5',
    100: '#FAF3D7',
    200: '#F5E4A8',
    300: '#EECD6E',
    400: '#E5B73E',
    500: '#D4A017', // Luminous, radiant luxury gold
    600: '#B8840D',
    700: '#8F6306',
    800: '#664402',
  },
  sand: {
    50: '#FAF8F5', // Warm luxury linen alabaster
    100: '#F3EFEA', // Soft warm surface
    200: '#E6DFD5', // Subtle warm border
    300: '#D2C7B8', // Divider
  },
  slate,
  emerald: green,
  rose: red,
  amber,
  success: green,
  danger: red,
  warning: amber,
};

const radius = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
};

module.exports = { colors, radius };

