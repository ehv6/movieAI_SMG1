/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      textShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.8)',
        'md': '0 2px 4px rgba(0, 0, 0, 0.8)',
        'lg': '0 2px 8px rgba(0, 0, 0, 0.9)',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.text-shadow-sm': {
          'text-shadow': '0 1px 2px rgba(0, 0, 0, 0.8)',
        },
        '.text-shadow-md': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.8)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 2px 8px rgba(0, 0, 0, 0.9)',
        },
      })
    },
  ],
}
