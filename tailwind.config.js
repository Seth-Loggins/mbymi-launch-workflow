/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // BBD brand palette — sourced from JW_BBD_Brand Style Guide_v1.pdf
      colors: {
        brand: {
          navy: '#1D203F',     // Yankees Blue — primary dark
          pink: '#E1228C',     // Neon Pink — primary CTA / progress
          aqua: '#83CCBD',     // Pearl Aqua — success / positive
          saffron: '#F89A2A',  // Deep Saffron — warning / accent
          orange: '#F65556',   // Sunset Orange — danger
          paper: '#F4F2F2',    // Anti-Flash White — page background
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'system-ui', 'sans-serif'],
        sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(29, 32, 63, 0.06), 0 4px 12px rgba(29, 32, 63, 0.06)',
        elevated: '0 4px 16px rgba(29, 32, 63, 0.10), 0 12px 32px rgba(29, 32, 63, 0.08)',
      },
    },
  },
  plugins: [],
};
