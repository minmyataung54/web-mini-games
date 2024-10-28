/** @type {import('tailwindcss').Config} */
import flattenColorPalette from 'tailwindcss/src/util/flattenColorPalette';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex:{
        '10r':'-10',
      },
      fontSize: {'3xl': ['32px', {
          lineHeight: '48px',
          letterSpacing: '-0.02em',
        }],
      },
      colors: {
        primary: {
          light: '#293CD3',
          dark: '#151F6D',
        },
        secondary: {
          light: '#E5C401',
          dark: '#C27501',
        },
      },
      textShadow: {
        'border': '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
      },
    },
    fontFamily :{
      gabarito: ["gabarito","sans-serif"],
    }
  },
  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-border': (value) => ({
            '--text-shadow-color': value,
            '--text-shadow-size': '1px',
            'color': 'white',
            'text-shadow': `
              calc(var(--text-shadow-size) * 1) calc(var(--text-shadow-size) * 1) 0 var(--text-shadow-color),
              calc(var(--text-shadow-size) * -1) calc(var(--text-shadow-size) * -1) 0 var(--text-shadow-color),
              calc(var(--text-shadow-size) * 1) calc(var(--text-shadow-size) * -1) 0 var(--text-shadow-color),
              calc(var(--text-shadow-size) * -1) calc(var(--text-shadow-size) * 1) 0 var(--text-shadow-color),
              calc(var(--text-shadow-size) * 1) 0 0 var(--text-shadow-color),
              calc(var(--text-shadow-size) * -1) 0 0 var(--text-shadow-color),
              0 calc(var(--text-shadow-size) * -1) 0 var(--text-shadow-color),
              0 calc(var(--text-shadow-size) * 1) 0 var(--text-shadow-color)
            `,
          }),
        },
        {
          values: flattenColorPalette(theme('colors')),
          type: 'color',
        }
      );
    },
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.text-border': {
          textShadow: theme('textShadow.border'),
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
}
