import { murmur3 } from "murmurhash-js";
import { defaultClassNamePrefix } from "../css-runtime";
import { useMemo } from "react";
import { HoistedStyle } from "../components/HoistedStyle";
import React from "react";
import { useStylesContext } from "./use-styles-context";

function generateKeyframesName(cssBody: string, keyframeNamePrefix?: string) : string {
  const prefix = keyframeNamePrefix ?? defaultClassNamePrefix
  return `${prefix}-animation-${murmur3(cssBody).toString(36)}`
}

export function useKeyframes(cssBody: string): { keyframesName: string, styleElement: React.ReactElement } {
  const { classNamePrefix: keyframeNamePrefix } = useStylesContext()
  const keyframesName = generateKeyframesName(cssBody, keyframeNamePrefix)
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
