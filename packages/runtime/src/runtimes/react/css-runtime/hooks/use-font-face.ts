import { CSSObject } from '@emotion/serialize'
import { useStylesContext } from './use-styles-context'
import { processCss, toRawCss } from '../serialize-css'
import { MakeswiftStylePrecedence } from '../types'
import { MakeswiftStyle } from '../components/makeswift-style'
import React from 'react'

export function useFontFace({ styles }: { styles: CSSObject }) {
  const { stylesRegistry } = useStylesContext()
  const { content: rawCssBody, contentHash } = toRawCss([styles])
  let styleData = stylesRegistry.getFontFaces().get(contentHash)
  if (styleData == null) {
    const rawCss = `@font-face { ${rawCssBody} }`
    // We don't read/utilize `forceImportant` from styles context because
    // `!important` cannot be used in at-rule blocks (`@font-face`)
    const css = processCss({ content: rawCss, forceImportant: false })
    styleData = {
      contentHash,
      css,
      cssObject: styles,
    }
    stylesRegistry.setFontFace(styleData)
  }
  const href = `makeswift-font-face-${contentHash}`
  const styleElement = React.createElement(MakeswiftStyle, {
    key: contentHash,
    href,
    css: styleData.css,
    precedence: MakeswiftStylePrecedence.MEDIUM,
  })
  return {
    styleElement,
  }
}
