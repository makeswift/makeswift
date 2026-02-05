import { type Font, getGoogleFontsParamFromFonts, getGoogleFontsUrl } from '../../utils/google-fonts-url'
import { FontLink } from './FontLink'

type GoogleFontProps = {
  fonts: Font[]
  siteId: string | null
}

export async function GoogleFonts({ fonts, siteId }: GoogleFontProps) {
  const fontParam = getGoogleFontsParamFromFonts(fonts)
  const fontUrl = getGoogleFontsUrl(fontParam)

  if (fontUrl === '') return <FontLink fonts={fonts} siteId={siteId} />

  let inlineCss: string | null = null
  try {
    const response = await fetch(fontUrl)
    if (response.ok) {
      inlineCss = await response.text()
    }
  } catch (error) {
    console.error('Failed to fetch Google Fonts:', error)
  }

  return (
    <>
      {inlineCss != null ? (
        <style
          data-makeswift-google-font=""
          dangerouslySetInnerHTML={{ __html: inlineCss }}
        />
      ) : (
        <link
          rel="stylesheet"
          href={fontUrl}
          data-makeswift-google-font=""
        />
      )}
      <FontLink fonts={fonts} siteId={siteId} />
    </>
  )
}
