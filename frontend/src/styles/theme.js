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

