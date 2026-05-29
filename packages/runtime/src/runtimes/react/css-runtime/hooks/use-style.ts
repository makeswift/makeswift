import { generateClassName } from "../utils"
import { CSSObject } from "@emotion/serialize"
import { UncontrolledStyle } from "../components/uncontrolled-style"
import React from "react"
import clsx from "clsx"
import { useStylesContext } from "./use-styles-context"
import { UncontrolledStyleData } from "../types"
import { toCss } from "../serialize-css"

/**
 * Generates a css class name and corresponding style element based on the provided
 * styles object.
 * 
 * This is intended to be used for "uncontrolled" (not editable in Makeswift) styles
 * such as those defined inline in builtin components.
 */
export function useStyle(style: CSSObject, options: { precedence?: string } = {}) {
  const { classNamePrefix, stylesRegistry } = useStylesContext()
  const className = generateClassName({
    data: JSON.stringify(style),
    classNamePrefix,
  })
  const { css } = toCss(style, className)
  const styleData: UncontrolledStyleData = {
    css,
    cssObject: style
  }
  stylesRegistry.setStyle(className, styleData)
  const styleElement = React.createElement(UncontrolledStyle, {
    key: className,
    className,
    css,
    precedence: options.precedence
  })
  return {
    className,
    styleElement,
  }
}

/**
 * Supplements `useStyle` by providing call sites with a similarly-shaped successor to Emotion's `cx`
 * utility, which was used heavily by builtin components to "compose" class names through the following
 * pattern:
 * 
 * ```tsx
 * const className = cx(
 *   useStyle({ color: 'red' }),
 *   'class-name-A',
 *   'class-name-B',
 *   useStyle({ fontSize: 16 }),
 * )
 * ```
 * 
 * The new pattern using `composeStyles` looks like:
 * 
 * ```tsx
 * const { className, styleElements } = composeStyles(
 *   useStyle({ color: 'red' }),
 *   'class-name-A',
 *   'class-name-B',
 *   useStyle({ fontSize: 16 }),
 * )
 * ```
 * 
 * Followed by rendering `styleElements` alongside the element
 * where they're used:
 * 
 * ```tsx
 * return (
 *  <>
 *   {styleElements}
 *   <div
 *     {...props}
 *     className={className}>
 *   />
 *  </>
 * )
 * ```
 */
export function composeStyles(...args: Array<string | ReturnType<typeof useStyle> | undefined>) {
  const classNames: string[] = []
  const styleElements: React.ReactElement[] = []
  args.forEach(arg => {
    if (arg == null) return
    if (typeof arg === 'string') {
      classNames.push(arg)
    } else {
      classNames.push(arg.className)
      styleElements.push(arg.styleElement)
    }
  })
  const combinedClassName = clsx(classNames)
  return {
    className: combinedClassName,
    styleElements
  }
}
