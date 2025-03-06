/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00FF00', // Couleur verte style "robot"
        background: '#000000', // Fond noir
        text: {
          primary: '#FFFFFF', // Texte blanc
          secondary: '#AAAAAA', // Texte gris
          disabled: '#555555', // Texte désactivé
        }
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'], // Style de police "courrier"
      },
      borderWidth: {
        '1': '1px',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
