import { generateClassName } from '../utils'
import { CSSObject } from '@emotion/serialize'
import React from 'react'
import clsx from 'clsx'
import { useStylesContext } from './use-styles-context'
import { ClassStyleData } from '../types'
import { toCssStatements } from '../serialize-css'
import { MakeswiftStyle } from '../components/makeswift-style'

/**
 * Generates a css class name and corresponding style element based on the provided
 * styles object.
 *
 * This is intended to be used for "uncontrolled" (not editable in Makeswift) styles
 * such as those defined inline in builtin components.
 */
export function useStyle(style: CSSObject) {
  const { classNamePrefix, stylesRegistry } = useStylesContext()
  const className = generateClassName({
    data: JSON.stringify(style),
    classNamePrefix,
  })
  const { css } = toCssStatements(style, className)
  const styleData: ClassStyleData = {
    className,
    css,
    cssObject: style,
  }
  stylesRegistry.setUncontrolledClassStyle(styleData)
  const styleElement = React.createElement(MakeswiftStyle, {
    key: className,
    href: className,
    css,
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
    styleElements,
  }
}
