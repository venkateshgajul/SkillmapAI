/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Mono', 'monospace'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#080B14',
          900: '#0D1526',
          800: '#111D35',
          700: '#162140',
        },
        acid: {
          DEFAULT: '#B5FF4D',
          dim: '#8FCC3A',
        },
        cyan: {
          glow: '#00D4FF',
        },
        slate: {
          glow: '#1E2D4A',
        }
      },
      boxShadow: {
        'acid': '0 0 20px rgba(181,255,77,0.3)',
        'cyan': '0 0 20px rgba(0,212,255,0.3)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
      }
    }
  },
  plugins: []
};
