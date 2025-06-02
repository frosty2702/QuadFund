/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          jakarta: ['Plus Jakarta Sans', 'sans-serif'],
          pixel: ['"Press Start 2P"', 'cursive'],
          'press-start': ['"Press Start 2P"', 'cursive'],
        },
      },
    },
    plugins: [],
  };
  