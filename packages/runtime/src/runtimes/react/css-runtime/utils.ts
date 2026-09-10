import { murmur3 } from 'murmurhash-js'
import { DEFAULT_CSS_CLASS_NAME_PREFIX, DEFAULT_CSS_PRECEDENCE } from './constants'
import { StylesRegistry } from './styles-registry'
import { MakeswiftStyle } from './components/makeswift-style'
import { ComponentProps } from 'react'
import { ControlledStyleData } from './types'

export function generateClassName({
  data,
  classNamePrefix,
}: {
  data: string
  classNamePrefix?: string
}): string {
  const prefix = classNamePrefix ?? DEFAULT_CSS_CLASS_NAME_PREFIX
  return `${prefix}-${murmur3(data).toString(36)}`
}

export function createMakeswiftStylesRegistry(): StylesRegistry {
  return new StylesRegistry()
}

/**
 * Creates an html string of a style element in the format that React's hoisting mechanism
 * would create.
 *
 * If that format is not matched, then client-side React will not recognize
 * the `<style>` elements derived from the string returned below, and will hoist new
 * (duplicate) `<style>` elements during hydration.
 */
export function styleTagHtml({ href, precedence, css }: ComponentProps<typeof MakeswiftStyle>) {
  return `<style data-href="${href}" data-precedence="${precedence ?? DEFAULT_CSS_PRECEDENCE}">${css}</style>`
}

export function getControlledStylePrecedence(styleData: ControlledStyleData): string {
  return styleData.className
}
