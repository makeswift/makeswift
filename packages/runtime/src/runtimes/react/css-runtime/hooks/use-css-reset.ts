import { type CSSObject } from '@emotion/serialize'
import { useStylesContext } from './use-styles-context'
import { toRawCss } from '../serialize-css'
import { CssResetData, MakeswiftStylePrecedence } from '../types'
import { MakeswiftStyle } from '../components/makeswift-style'
import React from 'react'

export function useCssReset({ styles }: { styles: Array<CSSObject> }) {
  const { enableCssReset, stylesRegistry } = useStylesContext()
  if (!enableCssReset) return { styleElement: null }
  const { content, contentHash } = toRawCss(styles)

  const styleData: CssResetData = {
    css: content,
    cssObjects: styles,
    contentHash,
  }
  stylesRegistry.setCssReset(styleData)
  const href = `makeswift-css-reset-${contentHash}`

  const styleElement = React.createElement(MakeswiftStyle, {
    key: contentHash,
    href: href,
    css: content,
    precedence: MakeswiftStylePrecedence.RESET,
  })
  return {
    styleElement,
  }
}
