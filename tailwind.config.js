/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        // FOROZ native brand ramp, derived from the logo mark:
        // royal-blue ring (#3f5cab) -> deep indigo swoosh (#2a2e7a) -> navy corner (#1e2a52),
        // with a cornflower highlight (#5b7bd0). Both `purple` and `indigo` are
        // remapped to this ramp so existing accent classes pick up the brand color.
        brand: {
          50: '#eef2fb',
          100: '#d9e1f6',
          200: '#b3c3ec',
          300: '#8aa1df',
          400: '#5b7bd0',
          500: '#3f5cab',
          600: '#334a95',
          700: '#2a2e7a',
          800: '#242765',
          900: '#1e2a52',
        },
        purple: {
          50: '#eef2fb',
          100: '#d9e1f6',
          200: '#b3c3ec',
          300: '#8aa1df',
          400: '#5b7bd0',
          500: '#3f5cab',
          600: '#334a95',
          700: '#2a2e7a',
          800: '#242765',
          900: '#1e2a52',
        },
        indigo: {
          50: '#eef2fb',
          100: '#d9e1f6',
          200: '#b3c3ec',
          300: '#8aa1df',
          400: '#5b7bd0',
          500: '#3f5cab',
          600: '#334a95',
          700: '#2a2e7a',
          800: '#242765',
          900: '#1e2a52',
        }
      }
    },
  },
  plugins: [],
}