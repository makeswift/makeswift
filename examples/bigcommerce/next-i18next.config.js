module.exports = {
  i18n: {
    defaultLocale: 'en-US',
    locales: ['en-US', 'es'],
  },
  localePath:
    typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
}
