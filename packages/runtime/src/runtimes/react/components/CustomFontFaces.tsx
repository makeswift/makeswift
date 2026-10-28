'use client'

import { useMemo, useSyncExternalStore } from "react";
import { CustomFontVariant } from "../../../client";
import { useApiResourcesClient } from "../hooks/use-api-resources-client";
import { useIsInBuilder } from "../hooks/use-is-in-builder";
import { MakeswiftStyle } from "../css-runtime/components/makeswift-style";


type Props = {
  siteId: string
  customFontVariants: CustomFontVariant[]
}

export function CustomFontFaces({ siteId, customFontVariants }: Props) {
  const isInBuilder = useIsInBuilder()

  const client = useApiResourcesClient()
  const getSnapshot = () => (isInBuilder ? client.readSite(siteId) : null)
  const cachedSite = useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)

  // Remove check on cachedSite.customFontFamilies != null ?
  const variants = useMemo(() => {
    if (isInBuilder && cachedSite != null && cachedSite.customFontFamilies != null) {
      const activeVariants = cachedSite.customFontFamilies.flatMap(family => {
        return family.variants.filter(variant => variant.isActive).map(variant => ({
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

// TODO move portions of this into CSS runtime. Should be included in styles registry.
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
  const css = `@font-face {
    font-family: ${family};
    font-weight: ${weight};
    font-style: ${style};
    src: url(${fileUrl});
  }`
  return <MakeswiftStyle href={fileUrl} css={css}/>
}