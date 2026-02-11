/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10b981",
        secondary: "#8b5cf6",
        danger: "#ef4444",
        warning: "#f59e0b",
        success: "#10b981"
      }
    }
  },
  plugins: []
}
