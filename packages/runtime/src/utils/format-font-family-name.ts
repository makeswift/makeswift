const CSS_VARIABLE = /^\s*var\(/i
const QUOTE_OR_BACKSLASH = /["\\]/g
// eslint-disable-next-line no-control-regex -- matches the characters a CSS string cannot hold
const CONTROL_CHARACTER = /[\u0000-\u001f\u007f]/g

/**
 * Formats a single font family name so that it can be used in a CSS `font-family` property, by
 * wrapping it in a double-quoted CSS string. CSS variables are returned unchanged.
 *
 * Inside the string, `"` and `\` are escaped so they stay literal, and control characters such as
 * line breaks, which a CSS string cannot hold, are written as hex escapes. Without this, a name
 * containing them produces invalid CSS, names a different font, or ends the string early and lets
 * the rest of the name be read as CSS.
 *
 * Generic family names such as `serif` are quoted too, which makes them name a font rather than act
 * as a keyword. Callers pass names of specific fonts, so that is the intended result.
 *
 * This function should not be used on strings that represent a comma-separated `font-family`
 * value: commas are legal inside family names, so the whole input is treated as one name.
 *
 * The builder applies the same formatting to its font previews, so the two should stay in sync.
 */
export function formatFontFamilyName(fontFamily: string): string {
  if (CSS_VARIABLE.test(fontFamily)) return fontFamily

  const escaped = fontFamily
    .replace(QUOTE_OR_BACKSLASH, '\\$&')
    .replace(CONTROL_CHARACTER, char => `\\${char.charCodeAt(0).toString(16)} `)

  return `"${escaped}"`
}
