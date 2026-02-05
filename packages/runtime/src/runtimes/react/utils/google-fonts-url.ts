import { type Site } from '../../../api'

export type Font = { family: string; variants: string[] }

const GOOGLE_FONTS_BASE = 'https://fonts.googleapis.com/css'

export function getGoogleFontsParamFromFonts(fonts: Font[]): string {
  return fonts
    .map(({ family, variants }) => `${family.replace(/ /g, '+')}:${variants.join()}`)
    .join('|')
}

export function getGoogleFontsParamFromSite(site: Site): string {
  return site.googleFonts.edges
    .filter((edge): edge is NonNullable<typeof edge> => edge != null)
    .map(({ activeVariants, node: { family, variants } }) => {
      const activeVariantSpecifiers = variants
        .filter(variant =>
          activeVariants.some(activeVariant => activeVariant.specifier === variant.specifier),
        )
        .map(variant => variant.specifier)
        .join()
      return `${family.replace(/ /g, '+')}:${activeVariantSpecifiers}`
    })
    .join('|')
}

export function getGoogleFontsUrl(param: string): string {
  if (param === '') return ''
  return `${GOOGLE_FONTS_BASE}?family=${param}&display=swap`
}
