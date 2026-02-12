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

const GOOGLE_FONT_LINK_ID = 'data-makeswift-google-font'

function useCachedSite(siteId: string | null): Site | null {
  const client = useMakeswiftHostApiClient()
  const getSnapshot = () => (siteId == null ? null : client.readSite(siteId))
  return useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)
}

type GoogleFontProps = {
  fonts: Font[]
  siteId: string | null
}

export function GoogleFont({ fonts, siteId }: GoogleFontProps) {
  const insertedServerHTML = useRef(false)
  const isInBuilder = useIsInBuilder()
  const site = useCachedSite(isInBuilder ? siteId : null)

  const fontFamilyParamValue = useMemo(() => {
    if (isInBuilder && site != null) {
      return getGoogleFontsParamFromSite(site)
    }
    return getGoogleFontsParamFromFonts(fonts)
  }, [isInBuilder, site, fonts])

  const urlFromProps = getGoogleFontsUrl(getGoogleFontsParamFromFonts(fonts))

  useServerInsertedHTML(() => {
    if (insertedServerHTML.current || urlFromProps === '') return
    insertedServerHTML.current = true
    return createElement('link', {
      rel: 'stylesheet',
      href: urlFromProps,
      [GOOGLE_FONT_LINK_ID]: '',
    })
  })

  useEffect(() => {
    const head = typeof document !== 'undefined' ? document.head : null
    if (head == null) return

    const href = getGoogleFontsUrl(fontFamilyParamValue)
    let link = head.querySelector(`[${GOOGLE_FONT_LINK_ID}]`) as HTMLLinkElement | null

    if (href === '') {
      link?.remove()
      return
    }

    if (link == null) {
      link = document.createElement('link')
      link.rel = 'stylesheet'
      link.setAttribute(GOOGLE_FONT_LINK_ID, '')
      head.appendChild(link)
    }
    link.href = href

    return () => {
      head.querySelector(`[${GOOGLE_FONT_LINK_ID}]`)?.remove()
    }
  }, [fontFamilyParamValue])

  return null
}
