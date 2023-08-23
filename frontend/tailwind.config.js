/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  mode: "jite",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Avenir"],
      },
      colors: {
        dark: "#18202e",
        text: "#3a4d69",
        accent: "#ffd000",
        primary: "#455D7A",
        body: "#000a19",
      },
      boxShadow: {
        sidebarItem: "0 0 10px #d9113a",
      },
      backgroundImage: {
        card: "url('/card-bg.png')",
        table: "url('/table-bg.svg')",
        diceNotSelected: "url('/dice-not-selected.svg')",
        diceHover: "url('/dice-hover.svg')",
        diceSelected: "url('/dice-selected.svg')",
      },
      backgroundSize: {
        fill: "100% 100%",
      },
      screens: {
        xs: "500px",
        xxs: "450px",
      },
    },
  },
  plugins: [],
};
