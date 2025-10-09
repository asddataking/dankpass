import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'rgb(234 246 255)',
          primary: 'rgb(46 134 255)',
          ink: 'rgb(14 23 38)',
          subtle: 'rgb(107 122 144)',
          card: 'rgb(255 255 255)',
          success: 'rgb(43 196 138)',
          warn: 'rgb(255 200 97)',
          error: 'rgb(255 93 93)'
        },
        // Keep legacy colors for gradual migration
        'dp-dark': '#08121E',
        'dp-blue': {
          100: '#E8F3FF',
          300: '#7FB6F1',
          500: '#1F7AD4',
          600: '#175A9C',
          800: '#0B1B2B'
        },
        'dp-mint': '#6EE7B7',
        'dp-lime': '#A3E635',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Manrope', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'Outfit', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(14,23,38,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
