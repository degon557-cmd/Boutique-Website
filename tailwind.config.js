/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'soft-blue': {
          '50': '#f0f7ff',
          '100': '#e0f0ff',
          '200': '#c2e2ff',
          '300': '#94d1ff',
          '400': '#61baff',
          '500': '#3b9eff',
          '600': '#1e83ff',
          '700': '#0f6fff',
          '800': '#175ad8',
          '900': '#1849a9',
          '950': '#112c66',
        },
      }
    }
  },
  plugins: [],
}
