import { defaultClassNamePrefix, toCss } from "../css-runtime"
import { CSSObject } from "@emotion/serialize"
import { UncontrolledStyle } from "../components/UncontrolledStyle"
import React from "react"
import { murmur3 } from "murmurhash-js"
import clsx from "clsx"
import { useStylesContext } from "./use-styles-context"

// TODO rename file to 'uncontrolled-styles.ts'?

// TODO share parts of `generateClassName` with css runtime

/**
 * Unlike the class names generated for controlled styles, this class name is based on a hash of css content.
 * This is useful for deduplication of "uncontrolled" styles that are not subject to change in the way that
 * Makeswift-editable styles are.
 */
function generateClassName(styles: CSSObject, classNamePrefix?: string): string {
  const prefix = classNamePrefix ?? defaultClassNamePrefix
  return `${prefix}-${murmur3(JSON.stringify(styles)).toString(36)}`
}

export function useStyle(style: CSSObject, options: { precedence?: string } = {}) {
  const { classNamePrefix } = useStylesContext()
  const className = generateClassName(style, classNamePrefix)
  const { css } = toCss(style, className)
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