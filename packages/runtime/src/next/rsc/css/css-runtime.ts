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

// Unified class name generation
function generateClassName(elementKey?: string, propPath?: string, counter?: number): string {
  const parts = ['makeswift-rsc']
  if (elementKey) parts.push(elementKey)
  if (propPath) parts.push(propPath.replace(/\./g, '-'))
  if (counter !== undefined) parts.push(counter.toString())
  return parts.join('-')
}

// Style processing with callbacks
function processStyle(
  style: ResolvedStyle,
  breakpoints: Breakpoints,
  className: string,
  onStyleGenerated?: (className: string, css: string, elementKey?: string, propPath?: string) => void,
  elementKey?: string,
  propPath?: string
): string {
  try {
    const cssObject = resolvedStyleToCss(breakpoints, style)
    const cssString = cssObjectToString(cssObject, className)

    if (onStyleGenerated) {
      onStyleGenerated(className, cssString, elementKey, propPath)
    }

    return className
  } catch (error) {
    console.warn('[CSS Runtime] Error processing style:', error)
    return 'makeswift-rsc-error'
  }
}

// Unified stylesheet engine that handles both server and client modes
export class StylesheetEngine implements Stylesheet {
  private styleCounter = 0

  constructor(
    private breakpointsData: Breakpoints,
    private elementKey?: string,
    private basePropPath?: string,
    private onStyleGenerated?: (className: string, css: string, elementKey?: string, propPath?: string) => void
  ) {}

  breakpoints(): Breakpoints {
    return this.breakpointsData
  }

  defineStyle(style: ResolvedStyle): string {
    const className = generateClassName(this.elementKey, this.basePropPath, ++this.styleCounter)
    return processStyle(
      style,
      this.breakpointsData,
      className,
      this.onStyleGenerated,
      this.elementKey,
      this.basePropPath
    )
  }

  child(propName: string): Stylesheet {
    const childPropPath = this.basePropPath ? `${this.basePropPath}.${propName}` : propName
    return new StylesheetEngine(
      this.breakpointsData,
      this.elementKey,
      childPropPath,
      this.onStyleGenerated
    )
  }
}

// Factory functions for creating stylesheets
export function createStylesheet(
  breakpoints: Breakpoints,
  elementKey?: string,
  onStyleGenerated?: (className: string, css: string, elementKey?: string, propPath?: string) => void
): Stylesheet {
  return new StylesheetEngine(breakpoints, elementKey, undefined, onStyleGenerated)
}

// Client-specific stylesheet with style update callback
export function createClientStylesheet(
  breakpoints: Breakpoints,
  elementKey: string,
  onStyleUpdate: (elementKey: string, propPath: string, css: string) => void
): Stylesheet {
  const handleStyleGenerated = (_className: string, css: string, elementKey?: string, propPath?: string) => {
    if (elementKey && propPath) {
      onStyleUpdate(elementKey, propPath, css)
    }
  }

  return new StylesheetEngine(breakpoints, elementKey, undefined, handleStyleGenerated)
}