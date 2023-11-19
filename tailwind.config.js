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
        'lightGray': '#A2A2A2',
        "dusk": "#3D3D3D",
        "dawn": "#202020",
        'shadow': "#141414",
        'dark': "#0A0A0A",
        'green': "#00f8b7",
        "darkGreen": "#003627"
      },
      fontFamily: {
        'sans': ['Jakarta Sans Plus', 'sans'],
        'number': ['Space Mono', 'sans']
      },
    },
  },
  plugins: [],
}