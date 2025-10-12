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
          bg: 'rgb(0 0 0)',           // Dark mode - Pure black
          primary: 'rgb(0 255 136)',   // Dark mode - Electric green
          ink: 'rgb(255 255 255)',     // Dark mode - White text
          subtle: 'rgb(156 163 175)',  // Dark mode - Gray-400
          card: 'rgb(17 17 17)',       // Dark mode - Dark gray cards
          success: 'rgb(0 255 136)',   // Electric green
          warn: 'rgb(255 200 97)',
          error: 'rgb(255 93 93)'
        },
        // Keep legacy colors for gradual migration
        'dp-dark': '#000000',
        'dp-blue': {
          100: '#1a1a1a',
          300: '#00ff88',
          500: '#00ff88',
          600: '#00cc6a',
          800: '#009955'
        },
        'dp-mint': '#00ff88',
        'dp-lime': '#00ff88',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', 'Space Grotesk', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.875rem', { lineHeight: '1.5' }],    // 14px
        sm: ['1rem', { lineHeight: '1.6' }],        // 16px
        base: ['1.125rem', { lineHeight: '1.75' }], // 18px (enlarged from 16px)
        lg: ['1.25rem', { lineHeight: '1.75' }],    // 20px (enlarged from 18px)
        xl: ['1.5rem', { lineHeight: '1.75' }],     // 24px (enlarged from 20px)
        '2xl': ['1.875rem', { lineHeight: '1.6' }], // 30px (enlarged from 24px)
        '3xl': ['2.25rem', { lineHeight: '1.5' }],  // 36px (enlarged from 30px)
        '4xl': ['3rem', { lineHeight: '1.4' }],     // 48px (enlarged from 36px)
        '5xl': ['3.75rem', { lineHeight: '1.3' }],  // 60px (enlarged from 48px)
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
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
