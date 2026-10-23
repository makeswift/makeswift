import { type GetFontsAPI } from '../../../client'
import { CustomFontFaces } from './CustomFontFaces'
import { GoogleFontLink } from './GoogleFontLink'

type Props = {
  fonts: GetFontsAPI
}

export function MakeswiftFonts({ fonts }: Props) {
  return (
    <>
      <GoogleFontLink fonts={fonts.googleFonts} siteId={fonts.siteId} />
      <CustomFontFaces variants={fonts.customFontVariants} siteId={fonts.siteId} />
    </>
  )
}
