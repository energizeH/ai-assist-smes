import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        deep: {
          DEFAULT: '#0a0f1e',
          50: '#1e293b',
          100: '#111827',
          200: '#0f172a',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          strong: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.1)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        accent: {
          blue: '#3b82f6',
          'blue-light': '#60a5fa',
          violet: '#7c3aed',
          'violet-light': '#a855f7',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6, #7c3aed)',
        'gradient-hero': 'linear-gradient(135deg, #0a0f1e 0%, #1e1b4b 40%, #0a0f1e 100%)',
        'gradient-cta': 'linear-gradient(135deg, #3b82f6, #a855f7)',
        'gradient-card': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(124, 58, 237, 0.1))',
        'gradient-success': 'linear-gradient(135deg, #10b981, #34d399)',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-violet': '0 0 20px rgba(124, 58, 237, 0.15)',
        'glow-strong': '0 0 40px rgba(59, 130, 246, 0.2)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 6s ease infinite',
      },
    },
  },
  plugins: [],
}
export default config
