/** @type {import('tailwindcss').Config} */

const baseFontSize = 10

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          default: "#E91675",
          button: "#E01470",
          dark: "#AF1058",
          80: "#ED4591",
          60: "#F273AC",
          40: "#F6A2C8",
          20: "#FBD0E3",
          background: "#FFF0F7",
        },
        secondary: {
          aquamarine: "#58F5AA",
          aquamarineDark: "#42B880",
          aquamarineLight: "#EEFEF7",
          keylime: "#EEF98E",
          keylimeDark: "#B3BB6B",
          keylimeLight: "#FDFEF1",
        },
        states: {
          error: "#E91649",
          errorDark: "#AF1137",
          errorLight: "#FDE8F1",
          success: "#22B080",
          successDark: "#198460",
          successLight: "#C0F3E2",
          pending: "#ECB529",
          pendingDark: "#BF8E11",
          pendingLight: "#FAECCA",
        },
        title:{
          active: "#022C45",
        },
        body:{
          primary: "#35566A",
          secondary: "#67808F",
        },
        placeholder: "#9AABB5",
        line: "#CCD5DA",
        background: "#F5F7F8",
      },
      fontFamily: {
        helvetica: ['var(--font-helvetica)'],
        ginto: ['var(--font-ginto)'],
      },
      spacing: () => ({
        ...Array.from({ length: 96 }, (_, index) => index * 0.5)
          .filter((i) => i)
          .reduce(
            (acc, i) => ({ ...acc, [i]: `${i / (baseFontSize / 4)}rem` 		 }),
            {}
          ),
      }),
      borderRadius: {
        '4xl': '2.4rem',
      },
      backgroundImage: {
        'logo-pattern': "url('/public/logos/maskgroup.svg')",
      }
    },
  },
  plugins: [],
}
