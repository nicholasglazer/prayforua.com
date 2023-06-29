/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte}'],
  theme: {
    extend: {
      colors: {
        // miozu theme
        base1: '#232733',
        base2: '#2C3040',
        base3: '#3E4359',
        base4: '#565E78',
        base5: '#737E99',
        base6: '#D0D2DB',
        base7: '#F3F4F7',
        base8: '#FAFDFB',
        red: '#EB3137',
        orange: '#FF9837',
        green: '#6DD672',
        yellow: '#E8D176',
        blue: '#83D2FC',
        magenta: '#C974E6',
        peach: '#FF9982',
        cyan: '#40FFE2'
      }
    }
  },
  plugins: [require('daisyui')],
  // daisyUI config (optional - here are the default values)
  daisyui: {
    // themes: false, //true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
    themes: [
      {
        mytheme: {
          primary: '#ff9982',
          secondary: '#f6d860',
          accent: '#83D2FC',
          neutral: '#D0D2DB',
          'base-100': '#FAFDF8'
        }
      }
    ],
    darkTheme: 'dark', // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true // Shows info about daisyUI version and used config in the console when building your CSS
  }
};
