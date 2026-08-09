import { type CSSObject } from '@emotion/serialize'
import { useStylesContext } from './use-styles-context'
import { processCss, toRawCss } from '../serialize-css'
import { BaseStylesData, MakeswiftStylePrecedence } from '../types'
import React from 'react'
import { MakeswiftStyle } from '../components/makeswift-style'

export function useBaseStyles({ styles }: { styles: CSSObject }) {
  const { stylesRegistry } = useStylesContext()
  const { content: rawContent, contentHash } = toRawCss([styles])
  const css = processCss({ content: rawContent })
  const styleData: BaseStylesData = {
    css,
    cssObject: styles,
    contentHash,
  }
  stylesRegistry.setBaseStyles(styleData)
  const href = `makeswift-base-styles-${contentHash}`
  const styleElement = React.createElement(MakeswiftStyle, {
    key: contentHash,
    href: href,
    css,
    precedence: MakeswiftStylePrecedence.HIGH,
  })
  return {
    styleElement,
  }
}
