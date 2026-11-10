/**
 * Formats a single font family name so that it can be used
 * in a CSS `font-family` property. The inputted `fontFamily`
 * value is simply wrapped in quotes, unless it's a CSS variable.
 *
 * This is not applying comprehensive formatting based on all
 * of the rules in the CSS specification for `font-family`. For
 * example, it does not attempt to detect whether the inputted value
 * is a generic family name (generic family names are not supposed
 * to be quoted).
 *
 * This function should not be used on strings that represent a
 * comma-separated `font-family` value.
 *
 * From MDN:
 * "It is good practice to quote font family names that contain
 * white space, digits, or punctuation characters other than hyphens."
 */
export function formatFontFamilyName(fontFamily: string) {
  return fontFamily.toLowerCase().startsWith('var(') ? fontFamily : `"${fontFamily}"`
}
