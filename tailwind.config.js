/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      colors: {
        background: '#050505',
      },
      animation: {
        'blob': "blob 15s infinite alternate ease-in-out",
        'float': "float 6s ease-in-out infinite",
        'pulse-slow': "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)", opacity: 0.8 },
          "33%": { transform: "translate(5vw, -10vh) scale(1.2)", opacity: 0.6 },
          "66%": { transform: "translate(-10vw, 5vh) scale(0.9)", opacity: 0.9 },
          "100%": { transform: "translate(0px, 0px) scale(1)", opacity: 0.8 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        }
      }
    },
  },
  plugins: [],
}
