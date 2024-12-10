module.exports = {
  mode: "jit",
  content: [
    "./src/**/**/*.{js,ts,jsx,tsx,html,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,html,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: { lg: { max: "1049px" }, tab: {max: "770px"}, md: { max: "1220px" }, lap: { max: "1360px" }, xs: { max: "300px" }, sm: { max: "699px" }, xl: { max: "1440px" }, "2xl": { max: "1920px" },  desktop: {max: "1000px"}, "4k": "1801px" },
    extend: {
      colors: {
        gray: {
          100: "#f2f2f2",
          300: "#dedede",
          400: "#bfbfbf",
          600: "#848484",
          900: "#141414",
          "600_01": "#7a7a7a",
          "900_33": "#14141433",
          "900_01": "#242424",
          "900_3f": "#1414143f",
          "400_01": "#b3b3b3",
        },
        black: {
          900: "#0f0f0f",
          "900_7f": "#0000007f",
          "900_a5": "#000000a5",
          "900_26": "#00000026",
        },
        blue_gray: { 100: "#d9d9d9", 900: "#333333" },
        white: { A700: "#ffffff" },
      },
      fontFamily: { hauora: "Hauora", hauoraSemiBold: "Hauora-SemiBold", hauoraBold: "Hauora-bold" },
      boxShadow: { bs: "4px 4px  4px 0px #00000026" },
      backgroundImage: {
        gradient: "linear-gradient(180deg ,#14141433,#14141433)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
