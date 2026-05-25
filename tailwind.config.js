/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'var(--tg-theme-bg-color, #0f1117)',
          card: 'var(--tg-theme-secondary-bg-color, #1a1d27)',
          elevated: '#222633',
        },
        accent: {
          DEFAULT: 'var(--tg-theme-button-color, #3b82f6)',
          text: 'var(--tg-theme-button-text-color, #ffffff)',
        },
        tg: {
          hint: 'var(--tg-theme-hint-color, #8b92a8)',
          text: 'var(--tg-theme-text-color, #f1f3f9)',
          link: 'var(--tg-theme-link-color, #60a5fa)',
        },
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.35)',
        glow: '0 0 20px rgba(59, 130, 246, 0.25)',
      },
    },
  },
  plugins: [],
}
