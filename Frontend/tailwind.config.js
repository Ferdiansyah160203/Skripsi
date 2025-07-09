// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Ganti default jadi Poppins
      },
      screens: {
        xs: '475px', // Extra small breakpoint
      },
    },
  },
  plugins: [],
}
