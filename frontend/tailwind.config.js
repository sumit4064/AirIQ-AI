/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        aqi: {
          good: '#10B981',
          satisfactory: '#84CC16',
          moderate: '#F59E0B',
          poor: '#F97316',
          verypoor: '#EF4444',
          severe: '#7C3AED',
        }
      }
    },
  },
  plugins: [],
}
