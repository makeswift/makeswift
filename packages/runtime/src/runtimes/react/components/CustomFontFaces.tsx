'use client'

import { useMemo, useSyncExternalStore } from 'react'
import { murmur3 } from 'murmurhash-js'

import { type CustomFontVariant } from '../../../client'
import { type Site } from '../../../api'
import { useIsInBuilder } from '../hooks/use-is-in-builder'
import { useApiResourcesClient } from '../hooks/use-api-resources-client'

import { getCustomFontFaceCss, getCustomFontVariantsFromSite } from '../utils/custom-font-face'
import { PageStyle } from './page/head-tags'
import { MakeswiftStylePrecedence } from '../css-runtime/types'

type Props = {
  variants: CustomFontVariant[]
  siteId: string | null
}

export function CustomFontFaces({ variants, siteId }: Props) {
  const isInBuilder = useIsInBuilder()

  const site = useCachedSite(isInBuilder ? siteId : null)

  const css = useMemo(() => {
    const siteVariants = isInBuilder && site != null ? getCustomFontVariantsFromSite(site) : null
    return getCustomFontFaceCss(siteVariants ?? variants)
  }, [isInBuilder, site, variants])

  if (css === '') {
    return null
  }

  // The `href` is derived from the CSS, so React dedupes identical rules rendered by both
  // `MakeswiftFonts` and `PageHead`
  return (
    <PageStyle
      precedence={MakeswiftStylePrecedence.MEDIUM}
      href={`makeswift-custom-fonts-${murmur3(css).toString(36)}`}
    >
      {css}
    </PageStyle>
  )
}

function useCachedSite(siteId: string | null): Site | null {
  const client = useApiResourcesClient()
  const getSnapshot = () => (siteId == null ? null : client.readSite(siteId))

  return useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)
}
