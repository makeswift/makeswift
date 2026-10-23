import { type Site } from '../../../api'
import { type CustomFontVariant } from '../../../client'

type FontFaceVariant = Pick<CustomFontVariant, 'family' | 'weight' | 'style' | 'fileUrl'>

export function getCustomFontVariantsFromSite(site: Site): FontFaceVariant[] | null {
  // A builder on an older version sends the site without its custom fonts
  if (site.customFontFamilies == null) return null

  return site.customFontFamilies.flatMap(({ family, variants }) =>
    variants
      .filter(variant => variant.isActive)
      .map(({ weight, style, fontFileUrl }) => ({ family, weight, style, fileUrl: fontFileUrl })),
  )
}

// Quotes a value as a CSS string. Escaping `<` keeps a value from closing the `<style>` element
// the rules render in.
function cssString(value: string): string {
  return `"${value.replace(/[\\"<\n\r\f]/g, char => `\\${char.charCodeAt(0).toString(16)} `)}"`
}

export function getCustomFontFaceCss(variants: FontFaceVariant[]): string {
  return variants
    .map(
      ({ family, weight, style, fileUrl }) =>
        `@font-face { font-family: ${cssString(family)}; src: url(${cssString(fileUrl)}); font-weight: ${weight}; font-style: ${style === 'italic' ? 'italic' : 'normal'}; font-display: swap; }`,
    )
    .join('\n')
}
