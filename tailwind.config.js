/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray': '#B2B2B2',
        "dusk": "#3D3D3D",
        'shadow': "#141414",
        'dark': "#0A0A0A",
        'green': "#00f8b7",
        "darkGreen": "#003627"
      },
    },
  },
  plugins: [],
}