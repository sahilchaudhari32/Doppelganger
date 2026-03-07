/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0B0B0F',
          secondary: '#121218',
        },
        chrome: {
          50: '#FFFFFF',
          100: '#EDEDED',
          200: '#E8E8E8',
          300: '#C7C7C7',
          400: '#C0C0C0',
          500: '#9E9E9E',
          600: '#8C8C8C',
          700: '#7A7A7A',
        },
        neon: {
          cyan: '#00F0FF',
          purple: '#7B61FF',
          pink: '#FF2EA6',
          blue: '#2D8CFF',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'chrome-gradient': 'linear-gradient(180deg, #FFFFFF, #C7C7C7, #8C8C8C, #E8E8E8)',
        'neon-gradient': 'linear-gradient(90deg, #00F0FF, #7B61FF, #FF2EA6)',
        'glass-panel': 'rgba(255, 255, 255, 0.05)',
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.8)',
        'neon-purple': '0 0 10px rgba(123, 97, 255, 0.8)',
        'neon-pink': '0 0 10px rgba(255, 46, 166, 0.8)',
      }
    },
  },
  plugins: [],
}
