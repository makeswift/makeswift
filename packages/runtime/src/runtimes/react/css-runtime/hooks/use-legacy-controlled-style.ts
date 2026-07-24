import { CSSObject } from "@emotion/serialize";
import { generateClassName } from "../utils";
import React from "react";
import { useStylesContext } from "./use-styles-context";
import { ControlledStyles } from "../components/controlled-styles";
import { toCss } from "../serialize-css";

export function useLegacyControlledStyle(
  style: CSSObject,
  elementKey: string,
  propName: string,
) {
  const { classNamePrefix, stylesRegistry } = useStylesContext()

  /*
    Namespaced separately from styles for modern control instances in order to avoid
    unintentionally attempting to render the corresponding style elements twice.

    (style elements for modern control instances are rendered after prop resolution
    for the respective element)
  */
  const namespace = `${elementKey}-legacy-${propName}`
  const className = generateClassName({
    data: `${elementKey}-${propName}`,
    classNamePrefix,
  })

  const { css, contentHash } = toCss(style, className)

  const controlledStyleData = stylesRegistry.createOrUpdateControlledStyleData({
    namespace,
    className,
    data: {
      className,
      css,
      cssObject: style,
      contentHash,
      elementKey,
      joinedPropPath: propName,
      onBoxModelChange: undefined
    }
  })

  const styleElement = React.createElement(ControlledStyles, {
    classNameToStyles: new Map([[className, controlledStyleData]]),
  })

  return {
    className,
    styleElement,
  }
}
