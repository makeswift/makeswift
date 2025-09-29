import type { CSSObject } from '@emotion/serialize'
import { type Breakpoints, type Stylesheet, type ResolvedStyle } from '@makeswift/controls'
import { resolvedStyleToCss } from '../../../runtimes/react/resolve-style'

// CSS object to string conversion
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

// Class name generation
export function generateClassName(elementKey?: string, propName?: string, counter?: number): string {
  const parts = ['makeswift-rsc']
  if (elementKey) parts.push(elementKey)
  if (propName) parts.push(propName)
  if (counter !== undefined) parts.push(counter.toString())
  return parts.join('-')
}

// Style processing with context callbacks
export function processStyle(
  style: ResolvedStyle,
  breakpoints: Breakpoints,
  className: string,
  onStyleGenerated?: (className: string, css: string, elementKey?: string, propName?: string) => void,
  elementKey?: string,
  propName?: string
): string {
  try {
    const cssObject = resolvedStyleToCss(breakpoints, style)
    const cssString = cssObjectToString(cssObject, className)

    if (onStyleGenerated) {
      onStyleGenerated(className, cssString, elementKey, propName)
    }

    return className
  } catch (error) {
    console.warn('[CSS Engine] Error processing style:', error)
    return 'makeswift-rsc-error'
  }
}

// Base stylesheet implementation
export class BaseStylesheet implements Stylesheet {
  private styleCounter = 0

  constructor(
    private breakpointsData: Breakpoints,
    private elementKey?: string,
    private onStyleGenerated?: (className: string, css: string, elementKey?: string, propName?: string) => void
  ) {}

  breakpoints(): Breakpoints {
    return this.breakpointsData
  }

  defineStyle(style: ResolvedStyle): string {
    const className = generateClassName(this.elementKey, undefined, ++this.styleCounter)
    return processStyle(
      style,
      this.breakpointsData,
      className,
      this.onStyleGenerated,
      this.elementKey
    )
  }

  child(propName: string): Stylesheet {
    return new ChildStylesheet(
      this.breakpointsData,
      this.elementKey,
      propName,
      this.onStyleGenerated
    )
  }
}

// Child stylesheet implementation
export class ChildStylesheet implements Stylesheet {
  private childStyleCounter = 0

  constructor(
    private breakpointsData: Breakpoints,
    private elementKey?: string,
    private propName?: string,
    private onStyleGenerated?: (className: string, css: string, elementKey?: string, propName?: string) => void
  ) {}

  breakpoints(): Breakpoints {
    return this.breakpointsData
  }

  defineStyle(style: ResolvedStyle): string {
    const className = generateClassName(this.elementKey, this.propName, ++this.childStyleCounter)
    return processStyle(
      style,
      this.breakpointsData,
      className,
      this.onStyleGenerated,
      this.elementKey,
      this.propName
    )
  }

  child(childPropName: string): Stylesheet {
    const nestedPropName = this.propName ? `${this.propName}.${childPropName}` : childPropName
    return new ChildStylesheet(
      this.breakpointsData,
      this.elementKey,
      nestedPropName,
      this.onStyleGenerated
    )
  }
}