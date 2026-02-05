'use client'

import { useEffect, useState } from 'react'

import { type GoogleFont } from '../../../client'
import { useFrameworkContext } from './hooks/use-framework-context'
import { type SiteVersion } from '../../../api/site-version'

type MakeswiftFontsProps = {
  siteVersion: SiteVersion | null
}

/**
 * Client component that fetches Google Fonts from the Makeswift API
 * (proxied by the Makeswift API handler) and renders a <link> tag to load them.
 *
 * NOTE: This is a demo implementation that demonstrates the FOUT (Flash of Unstyled Text)
 * problem with client-side font loading. Because this component:
 * 1. Renders with no fonts initially (during SSR)
 * 2. Fetches fonts in useEffect (after hydration)
 * 3. Only then adds the <link> tag
 * 
 * This component also has the problem of not rerendering on addition of Google fonts
 * in the builder.
 *
 * A better solution is to include fonts in the snapshot data so they can be
 * rendered server-side (similar to what's done for Makeswift pages).
 */
export function MakeswiftFonts({ siteVersion }: MakeswiftFontsProps) {
  const [fonts, setFonts] = useState<GoogleFont[]>([])
  const [error, setError] = useState<string | null>(null)
  const { versionedFetch } = useFrameworkContext()

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await versionedFetch(siteVersion)('/api/makeswift/google-fonts')

        if (!response.ok) {
          throw new Error(`Failed to fetch fonts: ${response.status}`)
        }

        const data: GoogleFont[] = await response.json()
        setFonts(data)
      } catch (err) {
        console.error('MakeswiftFonts: Error fetching Google Fonts:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    fetchFonts()
  }, [siteVersion, versionedFetch])

  if (error) {
    console.warn('MakeswiftFonts: Failed to load fonts:', error)
    return null
  }

  if (fonts.length === 0) {
    return null
  }

  const fontFamilyParam = fonts
    .map(({ family, variants }) => {
      const encodedFamily = family.replace(/ /g, '+')
      const variantList = variants.join(',')
      return `${encodedFamily}:${variantList}`
    })
    .join('|')

  return (
    <link
      rel="stylesheet"
      href={`https://fonts.googleapis.com/css?family=${fontFamilyParam}&display=swap`}
    />
  )
}
