import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#121a2b',
          light: '#1a2740',
          dark: '#0b1220',
        },
        accent: {
          DEFAULT: '#00d4aa',
          light: '#3ce6c0',
          dark: '#00a882',
        },
        xp: {
          DEFAULT: '#f0c14e',
          light: '#ffd76a',
        },
        danger: '#ff4757',
        success: '#2ed573',
        warning: '#ffa502',
        surface: '#162235',
        'surface-light': '#243553',
        muted: '#8b97ab',
        ink: '#e8eef7',
      },
      fontFamily: {
        sans: ['Figtree', 'Segoe UI', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Figtree', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        panel: '0 12px 40px rgba(0,0,0,0.28)',
      },
      animation: {
        'bounce-once': 'bounce 0.5s ease-in-out',
        shake: 'shake 0.4s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rise-in': 'riseIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'rise-in-delay': 'riseIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both',
        'rise-in-late': 'riseIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.24s both',
        'pan-slow': 'panSlow 28s ease-in-out infinite alternate',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        panSlow: {
          '0%': { transform: 'scale(1.08) translate3d(0, 0, 0)' },
          '100%': { transform: 'scale(1.12) translate3d(-2%, -1%, 0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
