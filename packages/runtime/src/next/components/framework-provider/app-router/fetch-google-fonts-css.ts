import { type Font } from '../../../../client'
import { getGoogleFontsParamFromFonts } from '../../../../runtimes/react/utils/google-fonts-url'

// Simple in-memory cache for fetched CSS
const cssCache = new Map<string, { css: string; timestamp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export async function fetchGoogleFontsCss(fontParam: string): Promise<string | null> {
  if (fontParam === '') return null

  // Check cache
  const cached = cssCache.get(fontParam)
  const now = Date.now()
  
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.css
  }

  // Fetch from Google Fonts
  try {
    const response = await fetch(
      `https://fonts.googleapis.com/css?family=${fontParam}&display=swap`,
      {
        next: { revalidate: 86400 }, // Next.js cache for 24 hours
      }
    )

    if (!response.ok) {
      console.warn(`Failed to fetch Google Fonts CSS: ${response.status}`)
      return null
    }

    const css = await response.text()
    
    // Cache the result
    cssCache.set(fontParam, { css, timestamp: now })
    
    return css
  } catch (error) {
    console.warn('Failed to fetch Google Fonts CSS:', error)
    return null
  }
}

export async function getGoogleFontsCssForFonts(fonts: Font[]): Promise<string | null> {
  const fontParam = getGoogleFontsParamFromFonts(fonts)
  return fetchGoogleFontsCss(fontParam)
}
