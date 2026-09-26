import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette - Modern Obsidian & Cyan
        primary: {
          DEFAULT: '#0f111a',
          light: '#181b2a',
          dark: '#090a0f',
        },
        accent: {
          DEFAULT: '#00d4aa',
          light: '#33debb',
          dark: '#00a882',
          glow: 'rgba(0, 212, 170, 0.15)',
        },
        xp: {
          DEFAULT: '#ffd700',
          light: '#ffe033',
        },
        danger: {
          DEFAULT: '#ff4757',
          light: '#ff6b81',
          glow: 'rgba(255, 71, 87, 0.15)',
        },
        success: {
          DEFAULT: '#2ed573',
          light: '#7bed9f',
          glow: 'rgba(46, 213, 115, 0.15)',
        },
        warning: {
          DEFAULT: '#ffa502',
          light: '#ffc048',
        },
        surface: {
          DEFAULT: '#161926',
          light: '#23283b',
          lighter: '#2f364f',
          glass: 'rgba(22, 25, 38, 0.75)',
        },
        muted: {
          DEFAULT: '#8f9ba8',
          light: '#b0bac7',
          dark: '#58616d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(0, 212, 170, 0.3)',
        'glow-lg': '0 0 40px -10px rgba(0, 212, 170, 0.4)',
        'glow-xp': '0 0 25px -5px rgba(255, 215, 0, 0.35)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'bounce-once': 'bounce 0.5s ease-in-out',
        shake: 'shake 0.4s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'streak-glow': 'streakGlow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
        streakGlow: {
          '0%, 100%': { boxShadow: '0 0 5px #ff6b35' },
          '50%': { boxShadow: '0 0 20px #ff6b35, 0 0 40px #ff6b35' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
