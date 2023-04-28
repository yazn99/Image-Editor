/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#081925',
        'dark-blue-2': '#132A3A',
        'dark-blue-3': '#112634',
        'white': '#F6F7F7',
        'accent': '#74BDE0',
        'light-accent': '#C9E0F5',
        'dark-blue-1': '#132A3A',
      },
    },
  },
  plugins: [],
}

