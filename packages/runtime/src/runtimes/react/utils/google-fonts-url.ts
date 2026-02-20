import { type Site } from '../../../api'
import { type Font } from '../../../client'

/*
  Much of the logic here is a duplicate of what's done for font management in the
  `PageHead` component.

  Right now these utils are being used by an experimental component (`GoogleFontLink`)
  that we don't yet want to put on the critical path for rendering Makeswift pages.
*/

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
