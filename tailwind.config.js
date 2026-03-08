/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        shell: {
          950: '#06080d',
          900: '#0b0f17',
          850: '#111827',
          800: '#161f2b',
          700: '#273447',
          600: '#3c5271',
          500: '#62a0ea',
          400: '#8ec5ff',
          300: '#b5dbff',
        },
        accent: {
          lime: '#8fe388',
          amber: '#f6c86d',
          red: '#ff7b72',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        window: '0 18px 50px rgba(0, 0, 0, 0.45)',
        glass: '0 12px 30px rgba(4, 8, 15, 0.28)',
      },
      backgroundImage: {
        desktop:
          'radial-gradient(circle at top left, rgba(98,160,234,0.18), transparent 28%), radial-gradient(circle at bottom right, rgba(143,227,136,0.12), transparent 24%), linear-gradient(180deg, #0a0d12 0%, #111827 48%, #0c1016 100%)',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 1.1s step-end infinite',
      },
    },
  },
  plugins: [],
};
