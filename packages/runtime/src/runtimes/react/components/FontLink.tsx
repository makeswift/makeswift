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

type FontLinkProps = {
  fonts: Font[]
  siteId: string | null
}

export function FontLink({ fonts, siteId }: FontLinkProps) {
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
