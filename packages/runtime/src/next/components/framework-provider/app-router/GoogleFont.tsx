import { type Font } from '../../../../client'
import { GoogleFontClient } from './GoogleFontClient'
import { getGoogleFontsCssForFonts } from './fetch-google-fonts-css'

type GoogleFontProps = {
  fonts: Font[]
  siteId: string | null
}

export async function GoogleFont({ fonts, siteId }: GoogleFontProps) {
  // Fetch CSS on the server
  const inlineCss = await getGoogleFontsCssForFonts(fonts)

  console.log('server component inline css', inlineCss)

  // Pass to client component
  return <GoogleFontClient fonts={fonts} siteId={siteId} inlineCss={inlineCss} />
}
