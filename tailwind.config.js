/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0f7',
          100: '#b3d1e8',
          200: '#80b2d9',
          300: '#4d93ca',
          400: '#3B6C92',
          500: '#205781',
          600: '#1a4769',
          700: '#143651',
          800: '#0e2539',
          900: '#081421',
        },
        accent: '#2861b8',
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.12)',
        'large': '0 8px 30px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}
