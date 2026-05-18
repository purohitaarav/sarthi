/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F2FCF5',
          100: '#E3F9E9',
          200: '#14532D',
          300: '#14532D',
          400: '#14532D',
          500: '#14532D',
          600: '#14532D',
          700: '#14532D',
          800: '#14532D',
          900: '#14532D',
        },
        spiritual: {
          blue: {
            light: '#E3F9E9',
            DEFAULT: '#041e0eff',
            dark: '#092c17ff',
          },
          gold: {
            light: '#F5F5F4',
            DEFAULT: '#57534E',
            dark: '#292524',
          },
          lotus: {
            pink: '#E7E5E4',
            purple: '#D6D3D1',
          },
          sacred: {
            saffron: '#F2FCF5',
            cream: '#FAFAF9',
          }
        },
        gray: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },
      backgroundImage: {
        'gradient-spiritual': 'linear-gradient(135deg, #FAFAF9 0%, #FAFAF9 100%)',
        'gradient-serene': 'linear-gradient(to bottom, #FAFAF9, #FAFAF9)',
        'gradient-divine': 'linear-gradient(135deg, #FAFAF9 0%, #FAFAF9 100%)',
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
