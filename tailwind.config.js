/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Premium blue design system (user-directed restyle, 2026-07):
        // primary #0F3D91, secondary #3B82F6, light #EAF4FF, dark #0B1220.
        primary: {
          DEFAULT: '#0F3D91',
          50: '#EAF4FF',
          100: '#D8E8FD',
          200: '#B0CFFA',
          300: '#7FAEF4',
          400: '#2563EB',
          500: '#0F3D91',
          600: '#0D347C',
          700: '#0A2A64',
          800: '#0A1E45',
          900: '#0B1220',
        },
        secondary: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        background: '#FFFFFF',
      },
      borderRadius: {
        // 20–32px premium radii
        DEFAULT: '20px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Poppins', 'sans-serif'],
        editorial: ['"Barlow Condensed"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary':
          'linear-gradient(135deg, #0F3D91 0%, #2563EB 55%, #60A5FA 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0F3D91 0%, #0B1220 100%)',
        'gradient-accent': 'linear-gradient(135deg, #2563EB 0%, #0F3D91 100%)',
      },
      boxShadow: {
        glass: '0 20px 60px rgba(15, 61, 145, 0.08)',
        'glass-lg': '0 30px 80px rgba(15, 61, 145, 0.14)',
      },
      backdropBlur: {
        glass: '18px',
      },
    },
  },
  plugins: [],
};
