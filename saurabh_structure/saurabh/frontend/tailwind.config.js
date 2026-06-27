/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          0: '#F5EFE4', // warm linen background
          1: '#EAE1CE', // warm cream card background
          2: '#DFD4B7', // input/hover background
          3: '#D4C79F', // active/border background
          4: '#C8B986', 
          5: '#BCAC6E',
        },
        gold: {
          DEFAULT: '#B08E4F', // deep gold for light backgrounds
          light: '#C8A96E', // original gold
          dark: '#8B6914',
          muted: 'rgba(176, 142, 79, 0.12)',
          subtle: 'rgba(176, 142, 79, 0.06)',
        },
        saffron: {
          DEFAULT: '#C37125', 
          light: '#E29E53',
        },
        cream: {
          DEFAULT: '#1C1A17', // dark charcoal for body text
          dark: '#1C1A17',
          muted: '#3D362E', // dark grey-brown
          faint: '#655A4E', // medium grey-brown
          ghost: '#928373', // light-medium grey-brown
        },
        border: {
          subtle: '#EAE1CE', 
          default: '#DFD4B7',
          light: '#D4C79F',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        accent: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #B08E4F 0%, #C8A96E 50%, #B08E4F 100%)',
        'gold-gradient-hover': 'linear-gradient(135deg, #C8A96E 0%, #B08E4F 50%, #8B6914 100%)',
      }
    }
  },
  plugins: []
};
