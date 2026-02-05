'use client'

import { useMemo, useSyncExternalStore } from 'react'

import { type Font } from '../../../client'
import { type Site } from '../../../api'
import { useIsInBuilder } from '../hooks/use-is-in-builder'
import { useMakeswiftHostApiClient } from '../host-api-client'

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
      return site.googleFonts.edges
        .filter((edge): edge is NonNullable<typeof edge> => edge != null)
        .map(({ activeVariants, node: { family, variants } }) => {
          const activeVariantSpecifiers = variants
            .filter(variant =>
              activeVariants.some(activeVariant => activeVariant.specifier === variant.specifier),
            )
            .map(variant => variant.specifier)
            .join()

          return `${family.replace(/ /g, '+')}:${activeVariantSpecifiers}`
        })
        .join('|')
    }

    return fonts
      .map(({ family, variants }) => {
        return `${family.replace(/ /g, '+')}:${variants.join()}`
      })
      .join('|')

  }, [isInBuilder, site, fonts])

  if (fontFamilyParamValue === '') {
    return null
  }

  return (
    <PageLink
      precedence="medium"
      rel="stylesheet"
      href={`https://fonts.googleapis.com/css?family=${fontFamilyParamValue}&display=swap`}
    />
  )
}

function useCachedSite(siteId: string | null): Site | null {
  const client = useMakeswiftHostApiClient()
  const getSnapshot = () => (siteId == null ? null : client.readSite(siteId))

  return useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)
}
