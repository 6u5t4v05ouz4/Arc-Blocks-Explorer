/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'arc-dark': '#0a0a0a',
        'arc-gray': '#1a1a1a',
        'arc-gray-light': '#2a2a2a',
        'arc-primary': '#3b82f6',
        'arc-primary-hover': '#2563eb',
      },
    },
  },
  plugins: [],
}

