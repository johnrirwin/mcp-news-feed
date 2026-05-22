/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#10131a',
        accent: {
          purple: '#7c5cff',
          blue: '#48a6ff',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        public: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        technical: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      boxShadow: {
        'public-glass': '0 24px 80px rgba(2, 6, 23, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'public-glow': '0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 34px rgba(91, 77, 255, 0.22), 0 18px 42px rgba(2, 6, 23, 0.42)',
        'public-cta': '0 18px 45px rgba(86, 72, 255, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.16)',
      },
    },
  },
  plugins: [],
}
