/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zupit: {
          50: '#fdf2f2',
          100: '#fde8e8',
          500: '#9c1c21',
          600: '#87181c',
          700: '#731418',
          800: '#5e1013',
          900: '#4a0d0f',
        },
      },
    },
  },
  plugins: [],
};

