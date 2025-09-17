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
        neon: {
          pink: "#ff0080",
          cyan: "#00ffff",
          purple: "#8000ff",
          green: "#00ff80",
        },
        dark: {
          bg: "#0a0a0a",
          surface: "#1a1a1a",
          border: "#2a2a2a",
        }
      },
      fontFamily: {
        'retro': ['var(--font-orbitron)', 'monospace'],
        'neon': ['var(--font-exo2)', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { 
            textShadow: '0 0 5px #ff0080, 0 0 10px #ff0080, 0 0 15px #ff0080',
            boxShadow: '0 0 5px #ff0080, 0 0 10px #ff0080, 0 0 15px #ff0080'
          },
          '100%': { 
            textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
            boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'neon-gradient': 'linear-gradient(135deg, #ff0080 0%, #8000ff 50%, #00ffff 100%)',
        'neon-gradient-horizontal': 'linear-gradient(90deg, #ff0080 0%, #00ffff 100%)',
        'grid-pattern': 'linear-gradient(rgba(255, 0, 128, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 128, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      }
    },
  },
  plugins: [],
};

export default config;
