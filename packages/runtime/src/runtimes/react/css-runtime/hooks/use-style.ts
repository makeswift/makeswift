import { useCallback } from "react"
import { toCss } from "../css-runtime"
import { CSSObject } from "@emotion/serialize"
import { UncontrolledStyle } from "../components/UncontrolledStyle"
import React from "react"
import { murmur3 } from "murmurhash-js"


// TODO will remove this file before initial PR...

// TODO would need to share parts of `generateClassName` with css runtime

/**
 * Unlike the class names generated for controlled styles, this class name is based on a hash of css content.
 * This is useful for deduplication of "uncontrolled" styles that are not subject to change in the way that
 * Makeswift-editable styles are.
 */
function generateClassName(styles: CSSObject): string {
  return `ms-${murmur3(JSON.stringify(styles)).toString(36)}`
}

export function useStyle(style: CSSObject, options: { precedence?: string } = {}) {
  const className = generateClassName(style)
  const css = toCss(style, className)
  const renderStaticStyle = useCallback(() => {
    return React.createElement(UncontrolledStyle, {
      className,
      css,
      precedence: options.precedence
    })
  }, [className, css, options.precedence])
  return {
    className,
    renderStaticStyle,
  }
}