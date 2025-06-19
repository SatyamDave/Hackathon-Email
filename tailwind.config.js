/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#0A0A0A',    // Slightly softer black
          secondary: '#141414',   // Rich dark gray
          accent: {
            DEFAULT: '#10B981',   // Emerald green
            hover: '#059669',     // Darker emerald for hover
            muted: '#064E3B'      // Muted emerald for subtle accents
          },
          muted: '#222222',      // Subtle dark gray
          surface: '#1A1A1A',    // Card/surface background
          border: '#2A2A2A',     // Subtle borders
          text: {
            primary: '#F9FAFB',   // Off-white
            secondary: '#9CA3AF',  // Muted gray
            accent: '#10B981'     // Emerald green
          }
        }
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(16, 185, 129, 0.25)',  // Subtle green glow
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-subtle': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
