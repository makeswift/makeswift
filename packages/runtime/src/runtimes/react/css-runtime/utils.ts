import { CSSObject } from "@emotion/serialize";
import { murmur3 } from 'murmurhash-js'
import { DEFAULT_CSS_CLASS_NAME_PREFIX, DEFAULT_CSS_PRECEDENCE } from "./constants";
import { StylesRegistry } from "./styles-registry";

export function generateClassName({ data, classNamePrefix }: { data: string, classNamePrefix?: string }): string {
  const prefix = classNamePrefix ?? DEFAULT_CSS_CLASS_NAME_PREFIX
  return `${prefix}-${murmur3(data).toString(36)}`
}

/**
 * Builds a CSSObject that reverts all declarations from the inputted CSSObject
 */
export function toRevertObject(styles: CSSObject): CSSObject {
  const result: CSSObject = {}
  for (const [key, value] of Object.entries(styles)) {
    if (value == null) continue
    if (Array.isArray(value)) {
      if (value.length === 0) continue
      if (value.every(arrayItem => typeof arrayItem === 'object')) {
        // example allowed by CSSObject: '&:hover': [{ color: 'red' }, { fontSize: 12 }]
        result[key] = value.map(arrayItem => toRevertObject(arrayItem))
      } else {
        // Array of non-object primitives
        result[key] = 'revert'
      }
    } else if (typeof value === 'object') {
      result[key] = toRevertObject(value as CSSObject)
    } else {
      result[key] = 'revert'
    }
  }
  return result
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
export function styleTagHtml({
  hrefValues,
  precedence,
  css
}: {
  hrefValues: string[],
  precedence?: string,
  css: string
}) {
  const href = hrefValues.join(' ') // Intentional, matches how React hoisting combines `href` values
  return `<style data-href="${href}" data-precedence="${precedence ?? DEFAULT_CSS_PRECEDENCE}">${css}</style>`
}
