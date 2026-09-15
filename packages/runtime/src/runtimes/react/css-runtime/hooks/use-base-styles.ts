import { type CSSObject } from '@emotion/serialize'
import { useStylesContext } from './use-styles-context'
import { processCss, toRawCss } from '../serialize-css'
import { MakeswiftStylePrecedence } from '../types'
import React from 'react'
import { MakeswiftStyle } from '../components/makeswift-style'

export function useBaseStyles({ styles }: { styles: CSSObject }) {
  const { stylesRegistry } = useStylesContext()
  const { content: rawContent, contentHash } = toRawCss([styles])
  let styleData = stylesRegistry.getBaseStyles().get(contentHash)
  if (styleData == null) {
    const css = processCss({ content: rawContent })
    styleData = {
      css,
      cssObject: styles,
      contentHash,
    }
    stylesRegistry.setBaseStyles(styleData)
  }
  const href = `makeswift-base-styles-${contentHash}`
  const styleElement = React.createElement(MakeswiftStyle, {
    key: contentHash,
    href: href,
    css: styleData.css,
    precedence: MakeswiftStylePrecedence.HIGH,
  })
  return {
    styleElement,
  }
}
