/**
 * Centralized theme configuration for The Mom Notes
 * All colors, spacing, and design tokens are defined here to maintain consistency
 * and avoid hard-coded values throughout the codebase.
 */

export const colors = {
  primary: {
    50: 'var(--ruby-dust-50)',
    100: 'var(--ruby-dust-100)',
    200: 'var(--ruby-dust-200)',
    300: 'var(--ruby-dust-300)',
    400: 'var(--ruby-dust-400)',
    500: 'var(--ruby-dust-500)',
    600: 'var(--ruby-dust-600)',
    700: 'var(--ruby-dust-700)',
    800: 'var(--ruby-dust-800)',
  },
  text: {
    primary: 'var(--ruby-dust-text-on-primary)',
    interactive: 'var(--ruby-dust-text-interactive)',
  },
  focus: 'var(--ruby-dust-focus-ring)',
  secondary: {
    purple: '#9f7aea',
    green: '#48bb78',
  },
  gray: {
    400: '#cbd5e0',
    500: '#718096',
  },
};

export const spacing = {
  xs: 'px-2 py-1',
  sm: 'px-3 py-2',
  md: 'px-4 py-3',
  lg: 'px-6 py-4',
  xl: 'px-8 py-6',
};

export const badges = {
  owned: {
    base: 'border-green-200 text-green-700 bg-green-50',
    label: 'Owned by you',
  },
  shared: {
    base: 'border-purple-200 text-purple-700 bg-purple-50',
    labelPrefix: 'Shared with you',
  },
};

export const icons = {
  sizes: {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-12 h-12',
    '3xl': 'w-16 h-16',
    '4xl': 'w-20 h-20',
    '5xl': 'w-24 h-24',
  },
};

export const transitions = {
  fast: 'transition-all duration-150',
  normal: 'transition-all duration-200',
  slow: 'transition-all duration-300',
};

export const shadows = {
  card: 'shadow-md hover:shadow-lg',
  cardWithColor: 'shadow-md hover:shadow-lg hover:shadow-[var(--ruby-dust-100)]',
  button: 'shadow-lg transform hover:scale-105',
};

// Pre-built CSS class strings to avoid template literal issues
export const css = {
  gradientButton: 'bg-gradient-to-r from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] hover:from-[var(--ruby-dust-600)] hover:to-[var(--ruby-dust-800)] text-[var(--ruby-dust-text-on-primary)]',
  gradientButtonSecondary: 'bg-gradient-to-r from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] hover:from-[var(--ruby-dust-600)] hover:to-[var(--ruby-dust-800)] text-[var(--ruby-dust-text-on-primary)] shadow-lg transform hover:scale-105 transition-all duration-200',
  primaryButton: 'bg-[var(--ruby-dust-600)] hover:bg-[var(--ruby-dust-700)] text-[var(--ruby-dust-text-on-primary)]',
  pageGradient: 'min-h-screen bg-gradient-to-br from-[var(--ruby-dust-50)] via-white to-[var(--ruby-dust-50)]',
  editorBorder: 'focus-within:border-[var(--ruby-dust-300)] focus-within:ring-2 focus-within:ring-[var(--ruby-dust-300)] focus-within:ring-offset-2',
  cardHover: 'group h-full flex flex-col justify-between bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg hover:shadow-[var(--ruby-dust-100)] transition-all duration-200',
  tagBadge: 'text-xs bg-[var(--ruby-dust-50)] text-[var(--ruby-dust-700)] border-[var(--ruby-dust-200)] cursor-pointer hover:bg-[var(--ruby-dust-100)]',
};

// Animation configurations
export const animations = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
  variants: {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
  },
};

// Local storage keys
export const storageKeys = {
  user: 'momnotes_user',
  notes: 'momnotes_notes',
  noteVersions: 'momnotes_note_versions',
  dashboards: 'momnotes_dashboards',
  shares: 'momnotes_shares',
};
