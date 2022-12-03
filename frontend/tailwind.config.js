module.exports = {
  mode: 'jit',
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    safeList: ['grid-cols-[1fr,150px]', 'grid-rows-[64px,1fr,50px]']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
