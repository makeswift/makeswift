'use client'

import { useMemo } from 'react'

import { type CustomFontVariant } from '../../../client'
import { useIsInBuilder } from '../hooks/use-is-in-builder'
import { useCachedSite } from '../hooks/use-cached-site'

import { getCustomFontFaceRules, getCustomFontVariantsFromSite } from '../utils/custom-font-face'
import { PageStyle } from './page/head-tags'
import { generateClassName } from '../css-runtime/utils'
import { MakeswiftStylePrecedence } from '../css-runtime/types'

type Props = {
  variants: CustomFontVariant[]
  siteId: string | null
}

export function CustomFontFaces({ variants, siteId }: Props) {
  const isInBuilder = useIsInBuilder()

  const site = useCachedSite(isInBuilder ? siteId : null)

  const rules = useMemo(
    () =>
      getCustomFontFaceRules(
        (site != null ? getCustomFontVariantsFromSite(site) : null) ?? variants,
      ),
    [site, variants],
  )

  // Each rule is its own style, keyed by its CSS, so React renders a rule once even when
  // `MakeswiftFonts` and `PageHead` render different sets of fonts
  return (
    <>
      {rules.map(rule => {
        const href = generateClassName({ data: rule, classNamePrefix: 'makeswift-custom-font' })

        return (
          <PageStyle key={href} precedence={MakeswiftStylePrecedence.MEDIUM} href={href}>
            {rule}
          </PageStyle>
        )
      })}
    </>
  )
}
