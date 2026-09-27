export const colors = {
  primary: {
    DEFAULT: '#161616',
    light: '#1f1f1f',
    dark: '#111111',
  },
  accent: {
    DEFAULT: '#e85d04',
    light: '#f48c06',
    dark: '#c2410c',
  },
  xp: {
    DEFAULT: '#ca8a04',
    light: '#eab308',
  },
  danger: {
    DEFAULT: '#dc2626',
    light: '#ef4444',
  },
  success: {
    DEFAULT: '#16a34a',
    light: '#22c55e',
  },
  warning: {
    DEFAULT: '#d97706',
    light: '#f59e0b',
  },
  surface: {
    DEFAULT: '#1c1c1c',
    light: '#262626',
    lighter: '#333333',
    glass: '#1c1c1c',
  },
  muted: {
    DEFAULT: '#a3a3a3',
    light: '#d4d4d4',
    dark: '#737373',
  },
} as const;

export const fontFamily = {
  sans: ['"IBM Plex Sans"', 'Segoe UI', 'system-ui', 'sans-serif'],
  mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
} as const;

export const borderRadius = {
  xl: '0.75rem',
  '2xl': '0.875rem',
  '3xl': '1rem',
} as const;

export const boxShadow = {
  glow: 'none',
  'glow-lg': 'none',
  'glow-xp': 'none',
  'glow-sm': 'none',
  glass: '0 1px 0 rgba(255,255,255,0.04)',
} as const;

export const tailwindThemeExtend = {
  colors,
  fontFamily,
  borderRadius,
  boxShadow,
} as const;

export const tokens = {
  color: {
    bg: colors.primary.dark,
    surface: colors.surface.DEFAULT,
    surfaceLight: colors.surface.light,
    text: '#f5f5f4',
    muted: colors.muted.DEFAULT,
    accent: colors.accent.DEFAULT,
  },
  font: {
    sans: fontFamily.sans.join(', '),
    mono: fontFamily.mono.join(', '),
  },
} as const;
