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
      colors:{
        "custom-bg" : "#F8F8FB",
        "custom-bg2":"#EAFBEE",
    },
    width:{
      "20p" : "20%",
      "35p":"35%",
      "30p":"30%",
      "21p":"21%",
      "15p":"15%",
      "16p":"16%",
      "17p":"17%",
      "80p":"80%",
      "60p":"60%"
    },
    height:{
      "18p":  "18%",
      "20p" : "20%",
      "25p":"25%",
      "30p":"30%",
    },
    screens:{
      "mb":{"max":"425px"}
    }
  },
},
  plugins: [],

}