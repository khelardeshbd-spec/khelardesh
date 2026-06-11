import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Prothoma', 'Kalpurush', 'Hind Siliguri', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
        'source-serif': ['Source Serif 4', 'serif'],
        'noto-bengali': ['Noto Serif Bengali', 'serif'],
        'hind': ['Hind Siliguri', 'sans-serif'],
      },
      colors: {
        'bg-page': 'var(--bg-page)',
        'bg-surface': 'var(--bg-surface)',
        'ink': 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        'ink-ghost': 'var(--ink-ghost)',
        'ink-border': 'var(--ink-border)',
        'live-red': 'var(--live-red)',
      },
    },
  },
  plugins: [],
};

export default config;
