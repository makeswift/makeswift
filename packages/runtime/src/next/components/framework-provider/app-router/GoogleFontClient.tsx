'use client'

import { createElement, useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { useServerInsertedHTML } from 'next/navigation'

import { type Font } from '../../../../client'
import { type Site } from '../../../../api'
import {
  getGoogleFontsParamFromFonts,
  getGoogleFontsParamFromSite,
  getGoogleFontsUrl,
} from '../../../../runtimes/react/utils/google-fonts-url'
import { useMakeswiftHostApiClient } from '../../../../runtimes/react/host-api-client'
import { useIsInBuilder } from '../../../../runtimes/react/hooks/use-is-in-builder'

const GOOGLE_FONT_STYLE_ID = 'data-makeswift-google-font'

function useCachedSite(siteId: string | null): Site | null {
  const client = useMakeswiftHostApiClient()
  const getSnapshot = () => (siteId == null ? null : client.readSite(siteId))
  return useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)
}

type GoogleFontClientProps = {
  fonts: Font[]
  siteId: string | null
  inlineCss: string | null
}

export function GoogleFontClient({ fonts, siteId, inlineCss }: GoogleFontClientProps) {
  const insertedServerHTML = useRef(false)
  const isInBuilder = useIsInBuilder()
  const site = useCachedSite(isInBuilder ? siteId : null)

  const fontFamilyParamValue = useMemo(() => {
    if (isInBuilder && site != null) {
      return getGoogleFontsParamFromSite(site)
    }
    return getGoogleFontsParamFromFonts(fonts)
  }, [isInBuilder, site, fonts])

  const fontParamFromProps = getGoogleFontsParamFromFonts(fonts)

  // Track what the server rendered so we can detect changes on the client
  const serverRenderedParamRef = useRef(fontParamFromProps)

  useServerInsertedHTML(() => {
    if (insertedServerHTML.current || fontParamFromProps === '') return
    insertedServerHTML.current = true

    // If we have inlined CSS, use a <style> tag
    if (inlineCss) {
      return createElement('style', {
        [GOOGLE_FONT_STYLE_ID]: '',
        dangerouslySetInnerHTML: { __html: inlineCss },
      })
    }

    // Fallback to <link>
    const url = getGoogleFontsUrl(fontParamFromProps)
    if (url === '') return null

    return createElement('link', {
      rel: 'stylesheet',
      href: url,
      [GOOGLE_FONT_STYLE_ID]: '',
    })
  })

  // Client-side: manage fonts in DOM (for builder updates and client navigation)
  useEffect(() => {
    const head = typeof document !== 'undefined' ? document.head : null
    if (head == null) return

    const href = getGoogleFontsUrl(fontFamilyParamValue)
    let element = head.querySelector(`[${GOOGLE_FONT_STYLE_ID}]`) as
      | HTMLLinkElement
      | HTMLStyleElement
      | null

    if (href === '') {
      element?.remove()
      return
    }

    // If fonts haven't changed from what the server rendered, leave the
    // server-inserted element (possibly a <style> with inlined CSS) alone.
    if (element != null && fontFamilyParamValue === serverRenderedParamRef.current) {
      return
    }

    // Fonts have changed (e.g. in the builder) or there's no element yet
    // (e.g. client-side navigation). Use a <link> since we can't inline
    // new CSS from the client.
    if (element != null) {
      element.remove()
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.setAttribute(GOOGLE_FONT_STYLE_ID, '')
    head.appendChild(link)

    // Update the ref so subsequent changes are detected correctly
    serverRenderedParamRef.current = fontFamilyParamValue

    return () => {
      head.querySelector(`[${GOOGLE_FONT_STYLE_ID}]`)?.remove()
    }
  }, [fontFamilyParamValue])

  return null
}
