import { generateClassName } from "../css-runtime";
import { useMemo } from "react";
import { HoistedStyle } from "../components/HoistedStyle";
import React from "react";
import { useStylesContext } from "./use-styles-context";

export function useKeyframes(cssBody: string): { keyframesName: string, styleElement: React.ReactElement } {
  const { classNamePrefix } = useStylesContext()
  const keyframeNamePrefix = `${classNamePrefix}-animation`
  const keyframesName = generateClassName({
    data: cssBody,
    classNamePrefix: keyframeNamePrefix,
  })
  const cssString = `@keyframes ${keyframesName} { ${cssBody} }`

  const styleElement = useMemo(() => {
    return React.createElement(HoistedStyle, {
      href: keyframesName,
      css: cssString,
      precedence: 'default',
    })
  }, [keyframesName, cssString])

  return {
    keyframesName,
    styleElement,
  }
}
