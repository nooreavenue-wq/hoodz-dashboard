/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Custom Colors
        "accent-green": "#3bb5a5",
        "primary-gray": "#0000008f",
        "primary-blue": "#1b71a7",
        "light-primary-blue": "#E8F1F6",
        "primary-red": "#db2424",
        "primary-green": "#65b545",
        "primary-yellow": "#f5bd14",
        "light-gray": "#e8e8e8",
        "dark-gray": "#818181",
        "secondary-1": "#334A55",
        "foundation-accent-400": "#62C3B5",
        "foundation-accent-800": "#20635A",
        danger: "#ca0b00",
        muted: "#727272",

        "demin-primary-50": "#E8F1F6",
        "demin-primary-100": "#b8d3e3",
      },

      fontFamily: {
        generalSans: ["var(--font-uncut-sans)"],
        dmSans: ["var(--font-dm-sans)"],
      },
    },
  },
  plugins: [],
};
