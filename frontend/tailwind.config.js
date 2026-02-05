/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
      },
      colors: {
        background: "#080808",
        glass: "rgba(255, 255, 255, 0.05)",
        "glass-border": "rgba(255, 255, 255, 0.1)",
        accent: "#00FF7F", // Tribe Green / GreenCheck
        plug: "#FF3B3F",   // The Plug Red
        citizen: "#1E90FF" // Citizen Blue
      },
      backgroundImage: {
        'vibrant-gradient': 'linear-gradient(135deg, #080808 0%, #1a1a1a 100%)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
