/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zupit: {
          50: '#fdf2f2',
          100: '#fde8e8',
          500: '#961E1E',
          600: '#831717',
          700: '#6f1313',
          800: '#5c1010',
          900: '#480c0c',
        },
      },
    },
  },
  plugins: [],
};
