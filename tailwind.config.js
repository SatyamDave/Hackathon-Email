/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#000000',    // Pure black
          secondary: '#1a1a1a',  // Slightly lighter black
          accent: '#00ff00',     // Bright green
          muted: '#333333',      // Dark gray
          text: {
            primary: '#ffffff',   // White
            secondary: '#cccccc', // Light gray
            accent: '#00ff00'     // Green
          }
        }
      }
    },
  },
  plugins: [],
};
