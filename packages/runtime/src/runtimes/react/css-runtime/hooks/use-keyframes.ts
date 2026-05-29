import { generateClassName } from '../utils'
import React from 'react'
import { MakeswiftStyle } from '../components/makeswift-style'
import { useStylesContext } from './use-styles-context'
import { KeyframesData } from '../types'

export function useKeyframes(cssBody: string): {
  keyframesName: string
  styleElement: React.ReactElement
} {
  const { classNamePrefix, stylesRegistry } = useStylesContext()
  const keyframesNamePrefix = `${classNamePrefix}-animation`
  const keyframesName = generateClassName({
    data: cssBody,
    classNamePrefix: keyframesNamePrefix,
  })
  const cssString = `@keyframes ${keyframesName} { ${cssBody} }`
  const styleData: KeyframesData = {
    keyframesName,
    css: cssString,
  }
  stylesRegistry.setKeyframes(styleData)

  const styleElement = React.createElement(MakeswiftStyle, {
    href: keyframesName,
    css: cssString,
  })

  return {
    keyframesName,
    styleElement,
  }
}
