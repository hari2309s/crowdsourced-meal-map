/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Food center type colors
    "bg-blue-600",
    "bg-green-600",
    "bg-orange-400",
    "bg-purple-500",
    "bg-rose-500",
    "bg-stone-200",
    "text-white",
    "text-stone-800",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
