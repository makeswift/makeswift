import { type CSSObject } from '@emotion/serialize'
import { useStylesContext } from './use-styles-context'
import { processCss, toRawCss } from '../serialize-css'
import { MakeswiftStylePrecedence } from '../types'
import { MakeswiftStyle } from '../components/makeswift-style'
import React from 'react'

export function useCssReset({ styles }: { styles: Array<CSSObject> }) {
  const { enableCssReset, stylesRegistry } = useStylesContext()
  if (!enableCssReset) return { styleElement: null }
  const { content: rawContent, contentHash } = toRawCss(styles)
  let styleData = stylesRegistry.getCssResets().get(contentHash)
  if (styleData == null) {
    const css = processCss({ content: rawContent })
    styleData = {
      css,
      cssObjects: styles,
      contentHash,
    }
    stylesRegistry.setCssReset(styleData)
  }
  const css = processCss({ content: rawContent })
  const href = `makeswift-css-reset-${contentHash}`

  const styleElement = React.createElement(MakeswiftStyle, {
    key: contentHash,
    href: href,
    css,
    precedence: MakeswiftStylePrecedence.RESET,
  })
  return {
    styleElement,
  }
}
