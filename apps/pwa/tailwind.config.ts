import type { Config } from 'tailwindcss';
import { tailwindThemeExtend } from '../../packages/ui/src/tokens';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      ...tailwindThemeExtend,
      animation: {
        'bounce-once': 'bounce 0.5s ease-in-out',
        shake: 'shake 0.4s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
