import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-green-100', 'text-green-700',
    'bg-red-100', 'text-red-700',
    'bg-blue-100', 'text-blue-700',
    'bg-amber-100', 'text-amber-700',
    'bg-purple-100', 'text-purple-700',
    'bg-navy-100', 'text-navy-700',
    'bg-gold-100', 'text-gold-700',
    'border-l-navy-500', 'border-l-gold-500',
    'border-l-green-600', 'border-l-red-500',
    'border-l-blue-600',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  'rgb(236 242 250)',
          100: 'rgb(207 221 239)',
          200: 'rgb(163 191 221)',
          300: 'rgb(108 152 196)',
          400: 'rgb(63 109 163)',
          500: 'rgb(30 58 95)',
          600: 'rgb(23 45 74)',
          700: 'rgb(17 34 54)',
          800: 'rgb(12 24 41)',
          900: 'rgb(7 16 28)',
        },
        gold: {
          50:  'rgb(253 249 240)',
          100: 'rgb(248 238 213)',
          300: 'rgb(220 192 130)',
          400: 'rgb(210 172 90)',
          500: 'rgb(201 168 76)',
          600: 'rgb(171 140 58)',
          700: 'rgb(140 113 42)',
        },
        surface: {
          DEFAULT:     'rgb(255 255 255)',
          secondary:   'rgb(248 247 244)',
          tertiary:    'rgb(240 237 230)',
          border:      'rgb(229 224 216)',
          borderHover: 'rgb(210 200 185)',
        },
        dark: {
          bg:     'rgb(15 23 42)',
          card:   'rgb(17 24 39)',
          border: 'rgb(31 41 55)',
        },
        success: 'rgb(22 163 74)',
        warning: 'rgb(245 158 11)',
        error:   'rgb(220 38 38)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        heading: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        urdu:    ['var(--font-noto-urdu)', 'serif'],
        mono:    ['var(--font-jetbrains)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontWeight: {
        '600': '600',
        '700': '700',
        '800': '800',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':       { transform: 'scale(1.15)', opacity: '0.7' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'pulse-ring':     'pulse-ring 2s ease-in-out infinite',
        'fade-up':        'fade-up 0.5s ease-out forwards',
        'fade-in':        'fade-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
