/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    colors: {
      "ash-gray": "#A9B0A2",
      olive: "#5D6351FF",
      "black-olive": "#21261AFF",
      "ash-gray-2": "#B1B7AA",
      "giants-orange": "#FF6629",
      white: "#FEFEFF",
      earth: "#C98728",
    },
    backgroundImage: {
      "hero-pattern": "url('/bg/contour.svg')",
    },
  },
  plugins: [],
};
