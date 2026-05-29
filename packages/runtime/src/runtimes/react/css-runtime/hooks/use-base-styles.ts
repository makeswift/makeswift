import { type CSSObject } from "@emotion/serialize";
import { useStylesContext } from "./use-styles-context";
import { toRawCss } from "../serialize-css";
import { BaseStylesData, MakeswiftStylePrecedence } from "../types";
import React from "react";
import { MakeswiftStyle } from "../components/makeswift-style";

export function useBaseStyles({ styles }: { styles: CSSObject }) {
  const { stylesRegistry } = useStylesContext()
  const { content, contentHash } = toRawCss([styles])
  const styleData: BaseStylesData = {
    css: content,
    cssObject: styles,
  }
  stylesRegistry.setBaseStyles(contentHash, styleData)
  const href = `makeswift-base-styles-${contentHash}`
  const styleElement = React.createElement(MakeswiftStyle, {
    key: contentHash,
    href: href,
    css: content,
    precedence: MakeswiftStylePrecedence.HIGH
  })
  return {
    styleElement
  }
}
