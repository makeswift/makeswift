'use client'

import { useMemo, useSyncExternalStore } from 'react'

import { type Font } from '../../../client'
import { type Site } from '../../../api'
import { useIsInBuilder } from '../hooks/use-is-in-builder'
import { useMakeswiftHostApiClient } from '../host-api-client'

import {
  getGoogleFontsParamFromFonts,
  getGoogleFontsParamFromSite,
  getGoogleFontsUrl,
} from '../utils/google-fonts-url'
import { PageLink } from './page/head-tags'

type Props = {
  fonts: Font[]
  siteId: string | null
}

/**
 * This is experimental, and some of the logic here is duplicated in the `PageHead` component.
 * 
 * For now we want to avoid putting this on the critical path for rendering Makeswift pages, so we haven't
 * deduplicated the two.
 */
export function GoogleFontLink({ fonts, siteId }: Props) {
  const isInBuilder = useIsInBuilder()

  const site = useCachedSite(isInBuilder ? siteId : null)

  const fontFamilyParamValue = useMemo(() => {
    if (isInBuilder && site != null) {
      return getGoogleFontsParamFromSite(site)
    }
    return getGoogleFontsParamFromFonts(fonts)
  }, [isInBuilder, site, fonts])

  const url = getGoogleFontsUrl(fontFamilyParamValue)
  if (url === '') {
    return null
  }

  return (
    <PageLink precedence="medium" rel="stylesheet" href={url} />
  )
}

function useCachedSite(siteId: string | null): Site | null {
  const client = useMakeswiftHostApiClient()
  const getSnapshot = () => (siteId == null ? null : client.readSite(siteId))

  return useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)
}
