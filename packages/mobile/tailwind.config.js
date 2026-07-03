/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          primary: 'var(--theme-primary)',
          secondary: 'var(--theme-secondary)',
          text: 'var(--theme-text)',
        },
      },
    },
  },
  plugins: [],
};
