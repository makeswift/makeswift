import { murmur3 } from "murmurhash-js";
import { defaultClassNamePrefix } from "../css-runtime";
import { useMemo } from "react";
import { HoistedStyle } from "../components/HoistedStyle";
import React from "react";

export const keyframesNamePrefix = `${defaultClassNamePrefix}-animation`

function generateKeyframesName(cssBody: string) : string {
  return `${keyframesNamePrefix}-${murmur3(cssBody).toString(36)}`
}

export function useKeyframes(cssBody: string): { keyframesName: string, styleElement: React.ReactElement } {
  const keyframesName = generateKeyframesName(cssBody)
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
