module.exports = {
  purge: ['./pages/**/*.tsx', './components/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#63B9ED',
        'primary-dark': '#3A97CF',
        accent: '#F87089',
        success: '#6DE3C4',
        error: '#DE7F3A',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
