import type { CSSObject } from '@emotion/serialize'
import { type Breakpoints, type Stylesheet, type ResolvedStyle, BoxDisplayModel } from '@makeswift/controls'
import { resolvedStyleToCss } from '../../../runtimes/react/resolve-style'

function cssObjectToString(cssObject: CSSObject, className: string): string {
  const cssRules: string[] = []
  const mediaRules: string[] = []
  const baseStyles: Record<string, any> = {}

  Object.entries(cssObject).forEach(([property, value]) => {
    if (property.startsWith('@media')) {
      const mediaQueryStyles = value as CSSObject
      const mediaCSS = Object.entries(mediaQueryStyles)
        .map(([prop, val]) => formatCSSProperty(prop, val))
        .filter(Boolean)
        .join(' ')

      if (mediaCSS) {
        mediaRules.push(`${property} { .${className} { ${mediaCSS} } }`)
      }
    } else {
      baseStyles[property] = value
    }
  })

  const baseCSS = Object.entries(baseStyles)
    .map(([prop, val]) => formatCSSProperty(prop, val))
    .filter(Boolean)
    .join(' ')

  if (baseCSS) {
    cssRules.push(`.${className} { ${baseCSS} }`)
  }

  cssRules.push(...mediaRules)
  return cssRules.join('\n')
}

function formatCSSProperty(property: string, value: any): string {
  if (value == null || value === '') return ''

  if (Array.isArray(value)) {
    return value.length > 0 ? `${kebabCase(property)}: ${value.join(' ')};` : ''
  }

  return `${kebabCase(property)}: ${value};`
}

function kebabCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
}

// TODO look into shortening
// TODO break this up in a way that some construction logic can be shared with client-css for polling box models
export function generateClassName(elementKey?: string, propName?: string, counter?: number): string {
  const parts = ['makeswift-styled-element']
  if (elementKey) parts.push(`-key-${elementKey}`)
  if (propName) parts.push(`-prop-name-${propName}`)
  if (counter !== undefined) parts.push(counter.toString())
  return parts.join('-')
}

export type OnStyleGenerated = (
  className: string,
  css: string,
  elementKey?: string,
  propName?: string,
  onBoxModelChange?: (boxModel: BoxDisplayModel | null) => void,
) => void

// Unified stylesheet engine that handles both server and client modes
export class StylesheetEngine implements Stylesheet {
  private styleCounter = 0

  constructor(
    private breakpointsData: Breakpoints,
    private elementKey?: string,
    private basePropName?: string,
    private onStyleGenerated?: OnStyleGenerated,
  ) {}

  breakpoints(): Breakpoints {
    return this.breakpointsData
  }

  defineStyle(style: ResolvedStyle, onBoxModelChange?: (boxModel: BoxDisplayModel | null) => void): string {
    const className = generateClassName(this.elementKey, this.basePropName, ++this.styleCounter)

    const cssObject = resolvedStyleToCss(this.breakpointsData, style)
    const cssString = cssObjectToString(cssObject, className)

    this.onStyleGenerated?.(className, cssString, this.elementKey, this.basePropName, onBoxModelChange)

    return className
  }

  child(propName: string): Stylesheet {
    return new StylesheetEngine(
      this.breakpointsData,
      this.elementKey,
      propName,
      this.onStyleGenerated,
    )
  }
}
