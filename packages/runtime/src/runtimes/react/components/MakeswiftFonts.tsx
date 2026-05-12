import { type GetFontsAPI } from '../../../client'
import { GoogleFontLink } from './GoogleFontLink'

type Props = {
  fonts: GetFontsAPI
}

export function MakeswiftFonts({ fonts }: Props) {
  return <GoogleFontLink fonts={fonts.googleFonts} siteId={fonts.siteId} />
}
