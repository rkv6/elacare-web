module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: "#064e3b",
          900: "#134e4a",
          800: "#155e75",
        },
        "agri-green": "#064e3b",
        "agri-white": "#ffffff",
        "agri-gray": "#f3f4f6",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
