import { CSSObject } from "@emotion/serialize";
import { generateClassName, toCss } from "../css-runtime";
import { useRef } from "react";
import { HoistedStyle } from "../components/HoistedStyle";
import React from "react";

export function useLegacyControlledStyle(
  style: CSSObject,
  elementKey: string,
  propName: string,
  options: { precedence?: string, classNamePrefix?: string } = {},
) {
  const className = generateClassName(
    elementKey,
    propName,
    options.classNamePrefix,
  )

  const counterRef = useRef(0)
  const contentHashRef = useRef<string | null>(null)
  const { css, contentHash } = toCss(style, className)
  if (contentHashRef.current !== contentHash) {
    counterRef.current += 1
    contentHashRef.current = contentHash
  }
  const href = `${className}-${counterRef.current}`
  const styleElement = React.createElement(HoistedStyle, {
    href,
    css,
    precedence: options.precedence,
  })

  return {
    className,
    styleElement,
  }
}
