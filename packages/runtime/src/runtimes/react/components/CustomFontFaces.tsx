'use client'

import { useMemo, useSyncExternalStore } from 'react'
import { CustomFontVariant } from '../../../client'
import { useApiResourcesClient } from '../hooks/use-api-resources-client'
import { useIsInBuilder } from '../hooks/use-is-in-builder'
import { useFontFace } from '../css-runtime/hooks/use-font-face'
import { CSSObject } from '@emotion/serialize'

type Props = {
  siteId: string
  customFontVariants: CustomFontVariant[]
}

export function CustomFontFaces({ siteId, customFontVariants }: Props) {
  const isInBuilder = useIsInBuilder()

  const client = useApiResourcesClient()
  const getSnapshot = () => (isInBuilder ? client.readSite(siteId) : null)
  const cachedSite = useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)

  const variants = useMemo(() => {
    if (isInBuilder && cachedSite != null && cachedSite.customFontFamilies != null) {
      const activeVariants = cachedSite.customFontFamilies.flatMap(family => {
        return family.variants
          .filter(variant => variant.isActive)
          .map(variant => ({
            id: variant.id,
            family: family.family,
            weight: variant.weight,
            style: variant.style,
            fileUrl: variant.fontFileUrl,
            fileFormat: variant.fileFormat,
          }))
      })
      return activeVariants
    }
    return customFontVariants
  }, [isInBuilder, cachedSite, customFontVariants])

  return (
    <>
      {variants.map(variant => (
        <FontFace
          key={variant.id}
          family={variant.family}
          weight={variant.weight}
          style={variant.style}
          fileUrl={variant.fileUrl}
        />
      ))}
    </>
  )
}

function FontFace({
  family,
  weight,
  style,
  fileUrl,
}: {
  family: string
  weight: number
  style: string
  fileUrl: string
}) {
  const styles: CSSObject = {
    fontFamily: family,
    fontWeight: weight,
    fontStyle: style,
    src: `url(${fileUrl})`,
  }
  const { styleElement } = useFontFace({ styles })
  return styleElement
}
