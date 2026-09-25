import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette
        primary: {
          DEFAULT: '#1a1a2e',
          light: '#16213e',
          dark: '#0f0f1a',
        },
        accent: {
          DEFAULT: '#00d4aa',
          light: '#33debb',
          dark: '#00a882',
        },
        xp: {
          DEFAULT: '#ffd700',
          light: '#ffe033',
        },
        danger: '#ff4757',
        success: '#2ed573',
        warning: '#ffa502',
        surface: '#1e1e3a',
        'surface-light': '#2a2a4a',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'bounce-once': 'bounce 0.5s ease-in-out',
        'shake': 'shake 0.4s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'streak-glow': 'streakGlow 2s ease-in-out infinite',
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
      },
    },
  },
  plugins: [],
};

export default config;
