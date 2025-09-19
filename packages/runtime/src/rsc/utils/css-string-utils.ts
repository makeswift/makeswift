import type { CSSObject } from '@emotion/serialize'

// Convert CSSObject to CSS string for server-side rendering
export function cssObjectToString(cssObject: CSSObject, className: string): string {
  const cssRules: string[] = []
  const mediaRules: string[] = []

  // Process base styles
  const baseStyles: Record<string, any> = {}

  Object.entries(cssObject).forEach(([property, value]) => {
    if (property.startsWith('@media')) {
      // Handle media queries
      const mediaQueryStyles = value as CSSObject
      const mediaCSS = Object.entries(mediaQueryStyles)
        .map(([prop, val]) => formatCSSProperty(prop, val))
        .filter(Boolean)
        .join(' ')

      if (mediaCSS) {
        mediaRules.push(`${property} { .${className} { ${mediaCSS} } }`)
      }
    } else {
      // Regular CSS property
      baseStyles[property] = value
    }
  })

  // Generate base class styles
  const baseCSS = Object.entries(baseStyles)
    .map(([prop, val]) => formatCSSProperty(prop, val))
    .filter(Boolean)
    .join(' ')

  if (baseCSS) {
    cssRules.push(`.${className} { ${baseCSS} }`)
  }

  // Add media query rules
  cssRules.push(...mediaRules)

  return cssRules.join('\n')
}

// Format a single CSS property for server-side CSS string generation
function formatCSSProperty(property: string, value: any): string {
  if (value == null || value === '') return ''

  if (Array.isArray(value)) {
    return value.length > 0 ? `${kebabCase(property)}: ${value.join(' ')};` : ''
  }

  return `${kebabCase(property)}: ${value};`
}

// Convert camelCase to kebab-case for CSS property names
function kebabCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
}
