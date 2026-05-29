import { generateClassName } from "../utils";
import React, { useMemo } from "react";
import { MakeswiftStyle } from "../components/makeswift-style";
import { useStylesContext } from "./use-styles-context";

export function useKeyframes(cssBody: string): { keyframesName: string, styleElement: React.ReactElement } {
  const { classNamePrefix, stylesRegistry } = useStylesContext()
  const keyframesNamePrefix = `${classNamePrefix}-animation`
  const keyframesName = generateClassName({
    data: cssBody,
    classNamePrefix: keyframesNamePrefix,
  })
  const cssString = `@keyframes ${keyframesName} { ${cssBody} }`
  stylesRegistry.setKeyframes(keyframesName, cssString)

  const styleElement = useMemo(() => {
    return React.createElement(MakeswiftStyle, {
      href: keyframesName,
      css: cssString,
    })
  }, [keyframesName, cssString])

  return {
    keyframesName,
    styleElement,
  }
}
