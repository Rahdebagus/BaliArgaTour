/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens — docs/04_DESIGN_SYSTEM.md
        primary: {
          DEFAULT: '#0F5E9C',
          50: '#EAF3FA',
          100: '#CFE3F2',
          200: '#9FC7E5',
          300: '#6FABD8',
          400: '#3F8FCB',
          500: '#0F5E9C',
          600: '#0C4B7D',
          700: '#09385E',
          800: '#06253E',
          900: '#03121F',
        },
        secondary: {
          DEFAULT: '#FFC72C',
          50: '#FFF9EA',
          100: '#FFF0C9',
          200: '#FFE290',
          300: '#FFD458',
          400: '#FFC72C',
          500: '#F5B300',
          600: '#C28E00',
          700: '#8F6900',
          800: '#5C4400',
          900: '#291F00',
        },
        background: '#F8FBFF',
      },
      borderRadius: {
        // 16px base radius per design system
        DEFAULT: '16px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0F5E9C 0%, #3F8FCB 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0F5E9C 0%, #06253E 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FFC72C 0%, #F5B300 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(15, 94, 156, 0.12)',
        'glass-lg': '0 20px 60px rgba(15, 94, 156, 0.18)',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
};
