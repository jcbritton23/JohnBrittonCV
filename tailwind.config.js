/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#1e3a8a',
        'secondary-blue': '#3b82f6',
        'secondary-gold': '#f59e0b',
        primary: {
          blue: '#1e3a8a',
          'blue-light': '#3b82f6',
        },
        secondary: {
          gold: '#f59e0b',
        },
        text: {
          primary: '#111827',
          secondary: '#6b7280',
        },
        surface: {
          DEFAULT: '#f8fafc',
          border: '#e5e7eb',
        },
        semantic: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0,0,0,.05)',
        'DEFAULT': '0 4px 6px -1px rgba(0,0,0,.1)',
        'lg': '0 10px 15px -3px rgba(0,0,0,.1)',
        'xl': '0 20px 25px -5px rgba(0,0,0,.1)',
      }
    },
  },
  plugins: [],
} 