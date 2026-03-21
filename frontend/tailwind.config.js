/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Outfit"', 'system-ui', 'sans-serif'],
        'sans': ['"Outfit"', 'system-ui', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        'accent': '#00E59B',
        'accent-bright': '#00FFB2',
        'accent-dim': '#00B878',
        'cyan': '#00D4FF',
        'violet': '#B18CFF',
        'rose': '#FF6B8A',
        'amber': '#FFB800',
        'danger': '#FF4D6A',
        'warning': '#FFB800',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'counter': 'counter 1.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-in-up': 'slideInUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        glowPulse: { '0%,100%': { opacity: '0.4' }, '50%': { opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        borderGlow: { '0%,100%': { borderColor: 'rgba(0,229,155,0.1)' }, '50%': { borderColor: 'rgba(0,229,155,0.4)' } },
        slideInLeft: { '0%': { opacity: '0', transform: 'translateX(-20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        slideInUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        scan: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(200%)' } },
      },
    },
  },
  plugins: [],
};