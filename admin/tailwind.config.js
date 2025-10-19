/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sat-blue-light': '#ADD7F6',
        'sat-blue-medium': '#87BFFF',
        'sat-blue': '#3F8EFC',
        'sat-blue-dark': '#2667FF',
        'sat-navy': '#3B28CC',
      },
    },
  },
  plugins: [],
}