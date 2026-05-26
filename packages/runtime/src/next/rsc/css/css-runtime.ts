import type { CSSObject } from '@emotion/serialize'
import { type Breakpoints, type Stylesheet, type ResolvedStyle, BoxDisplayModel } from '@makeswift/controls'
import { resolvedStyleToCss } from '../../../runtimes/react/resolve-style'
import { murmur3 } from 'murmurhash-js'
import { serialize, compile, stringify } from 'stylis'
import { serializeStyles as serializeEmotionStyles } from '@emotion/serialize'

/*
  Converts a styles object to a string, applying various transformations in the process.

  The output of this function is not a css string that is fit for being inserted into a style tag.
  Rather, it is a string that is fit for being handed off to a css preprocessor
*/
function serializeToIntermediateCSS(cssObject: CSSObject): string {
  /*
    If we decide to roll our own implementation, we'll need to handle some of the things
    that @emotion/serialize handled behind the scenes:
      - inserting units when required and missing (for example, if the CSS object contains { width: 100 })
      - handling logic for whether to comma-join certain values
      - decision of whether to support "implicit" ampersand prefixes for nested pseudoselectors (something
      that Emotion handles via a Stylis plugin passed to its cache, see: https://github.com/thysultan/stylis/issues/323#issuecomment-1870429099)
  */
  // const parts: string[] = []
  // for (const [key, value] of Object.entries(cssObject)) {
  //   if (value == null || value === '') continue
  //   if (typeof value === 'object' && !Array.isArray(value)) {
  //     const selector = key.startsWith('@') || key.startsWith('&') ? key : `&${key}`
  //     parts.push(`${selector} { ${serializeToIntermediateCSS(value as CSSObject)} }`)
  //   } else if (Array.isArray(value)) {
  //     if (value.length > 0) {
  //       parts.push(`${kebabCase(key)}: ${value.join(' ')};`)
  //     }
  //   } else {
  //     parts.push(`${kebabCase(key)}: ${value};`)
  //   }
  // }
  // return parts.join(' ')

  // Just utilizing `@emotion/serialize` for now
  return serializeEmotionStyles([cssObject]).styles
}

function cssObjectToString(cssObject: CSSObject, className: string): string {
  const intermediateCSS = serializeToIntermediateCSS(cssObject)
  const cssElementTree = compile(`.${className} { ${intermediateCSS}}`)
  const css = serialize(cssElementTree, stringify)
  return css
}

// function formatCSSProperty(property: string, value: any): string {
//   if (value == null || value === '') return ''

//   if (Array.isArray(value)) {
//     return value.length > 0 ? `${kebabCase(property)}: ${value.join(' ')};` : ''
//   }

//   return `${kebabCase(property)}: ${value};`
// }

// function kebabCase(str: string): string {
//   return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
// }

export function generateClassName(elementKey?: string, propName?: string, counter?: number): string {
  // const parts = ['makeswift-styled-element']
  // if (elementKey) parts.push(`-key-${elementKey}`)
  // if (propName) parts.push(`-prop-name-${propName}`)
  // if (counter !== undefined) parts.push(counter.toString())
  // return parts.join('-')

  return `ms-${murmur3(`${elementKey}-${propName}-${counter}`).toString(32)}`
}

export type OnStyleGenerated = ({
  className,
  css,
  elementKey,
  joinedPropPath,
  onBoxModelChange,
}: {
  className: string,
  css: string,
  elementKey?: string,
  joinedPropPath?: string,
  onBoxModelChange?: (boxModel: BoxDisplayModel | null) => void,
}) => void

// Unified stylesheet engine that handles both server and client modes
export class StylesheetEngine implements Stylesheet {
  private styleCounter = 0

  constructor(
    private breakpointsData: Breakpoints,
    private elementKey?: string,
    private propPath: readonly string[] = [],
    private onStyleGenerated?: OnStyleGenerated,
  ) {}

  breakpoints(): Breakpoints {
    return this.breakpointsData
  }

  defineStyle(style: ResolvedStyle, onBoxModelChange?: (boxModel: BoxDisplayModel | null) => void): string {
    const joinedPropPath = this.propPath.length > 0 ? this.propPath.join('.') : undefined
    const className = generateClassName(this.elementKey, joinedPropPath, ++this.styleCounter)

    const cssObject = resolvedStyleToCss(this.breakpointsData, style)
    const cssString = cssObjectToString(cssObject, className)

    this.onStyleGenerated?.({ className, css: cssString, elementKey: this.elementKey, joinedPropPath, onBoxModelChange })

    return className
  }

  child(propName: string): Stylesheet {
    return new StylesheetEngine(
      this.breakpointsData,
      this.elementKey,
      [...this.propPath, propName],
      this.onStyleGenerated,
    )
  }
}
