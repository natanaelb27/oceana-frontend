/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  corePlugins: {
    aspectRatio: false,
  },
  theme: {
    extend: {
      gridTemplateColumns: {
        tiles: 'repeat(var(--columns), 1fr)',
      },
      gridTemplateRows: {
        tiles: 'repeat(var(--rows), 1fr)',
      },
      keyframes: {
        'background-pan': {
          from: { 'background-position': '0% center' },
          to: { 'background-position': '-200% center' },
        },
      },
      animation: { 'background-pan': 'background-pan 10s linear infinite' },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('daisyui'),
  ],
};
