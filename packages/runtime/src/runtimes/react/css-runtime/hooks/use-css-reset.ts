import { type CSSObject } from '@emotion/serialize'
import { useStylesContext } from './use-styles-context'
import { processCss, toRawCss } from '../serialize-css'
import { MakeswiftStylePrecedence } from '../types'
import { MakeswiftStyle } from '../components/makeswift-style'
import React from 'react'

export function useCssReset({ styles }: { styles: Array<CSSObject> }) {
  const { enableCssReset, forceImportant, stylesRegistry } = useStylesContext()
  if (!enableCssReset) return { styleElement: null }

  const { content: rawContent, contentHash } = toRawCss(styles, { forceImportant })
  let styleData = stylesRegistry.getCssResets().get(contentHash)
  if (styleData == null) {
    styleData = {
      css: processCss({ content: rawContent, forceImportant }),
      cssObjects: styles,
      contentHash,
    }

    stylesRegistry.setCssReset(styleData)
  }

  const styleElement = React.createElement(MakeswiftStyle, {
    key: contentHash,
    href: `makeswift-css-reset-${contentHash}`,
    css: styleData.css,
    precedence: MakeswiftStylePrecedence.RESET,
  })

  return {
    styleElement,
  }
}
