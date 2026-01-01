/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        spiritual: {
          blue: {
            light: '#60a5fa',
            DEFAULT: '#3b82f6',
            dark: '#1e40af',
          },
          gold: {
            light: '#fbbf24',
            DEFAULT: '#f59e0b',
            dark: '#d97706',
          },
          lotus: {
            pink: '#f9a8d4',
            purple: '#c084fc',
          },
          sacred: {
            saffron: '#fb923c',
            cream: '#fef3c7',
          }
        },
      },
      backgroundImage: {
        'gradient-spiritual': 'linear-gradient(135deg, #3b82f6 0%, #f59e0b 100%)',
        'gradient-serene': 'linear-gradient(to bottom, #dbeafe, #fef3c7)',
        'gradient-divine': 'linear-gradient(135deg, #60a5fa 0%, #fbbf24 50%, #f9a8d4 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
