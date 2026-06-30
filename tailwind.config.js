
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./lib/**/*.{js,ts,jsx,tsx}"
],
  // ... باقي الإعدادات زي ماهي
  theme: {
    extend: {
      // ... (كل الإعدادات موجودة)
    }
  },
  plugins: [require("tailwindcss-animate")],
}