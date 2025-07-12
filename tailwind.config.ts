import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          light: '#2dd4bf', // teal-400
          DEFAULT: '#14b8a6', // teal-500
          dark: '#0d9488', // teal-600
        },
        secondary: {
          light: '#e2e8f0', // slate-200
          DEFAULT: '#94a3b8', // slate-400
          dark: '#64748b', // slate-500
        },
        accent: {
          DEFAULT: '#f59e0b', // amber-500
          hover: '#d97706', // amber-600
        },
        lightBg: '#f8fafc', // slate-50
        cardBg: '#ffffff',
        textBase: '#1e293b', // slate-800
        textMuted: '#475569', // slate-600
        textLight: '#94a3b8', // slate-400
        borderBase: '#e2e8f0', // slate-200
        focusRing: '#2dd4bf', // teal-400 (primary-light)
        danger: {
          light: '#fecaca', // red-200
          DEFAULT: '#ef4444', // red-500
          dark: '#dc2626', // red-600
        },
        success: {
          light: '#d1fae5', // green-200
          DEFAULT: '#10b981', // green-500
          dark: '#059669', // green-600
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #14b8a6, #0d9488)', // teal-500 to teal-600
        'gradient-primary-hover': 'linear-gradient(to right, #0d9488, #0f766e)', // teal-600 to teal-700
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config
