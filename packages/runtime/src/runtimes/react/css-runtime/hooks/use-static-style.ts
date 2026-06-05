import { ReactNode, useCallback } from "react"
import { generateClassName, toCss } from "../css-runtime"
import { useCssId } from "../../hooks/use-css-id"
import { CSSObject } from "@emotion/serialize"
import { StaticStyle } from "../components/StaticStyle"
import React from "react"

export type StaticStyleResult = {
  className: string
  renderStaticStyle: () => ReactNode
}

export function useStaticStyle(style: CSSObject): StaticStyleResult {
  const id = useCssId()
  const className = generateClassName(undefined, id)
  const css = toCss(style, className)
  const renderStaticStyle = useCallback(() => {
    return React.createElement(StaticStyle, { className, css })
  }, [className, css])
  return {
    className,
    renderStaticStyle,
  }
}