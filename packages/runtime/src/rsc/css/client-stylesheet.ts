'use client'

import { type Breakpoints, type Stylesheet, type ResolvedStyle } from '@makeswift/controls'
import { resolvedStyleToCss } from '../../runtimes/react/resolve-style'
import { cssObjectToString } from '../utils/css-string-utils'

export function createClientStylesheet(
  breakpoints: Breakpoints,
  elementKey: string,
  onStyleUpdate: (elementKey: string, propName: string, css: string) => void
): Stylesheet {
  let styleCounter = 0

  const generateClassName = (elementKey?: string, propName?: string, counter?: number): string => {
    const parts = ['makeswift-rsc']
    if (elementKey) parts.push(elementKey)
    if (propName) parts.push(propName)
    if (counter !== undefined) parts.push(counter.toString())
    return parts.join('-')
  }

  return {
    breakpoints(): Breakpoints {
      return breakpoints
    },

    defineStyle(style: ResolvedStyle): string {
      const className = generateClassName(elementKey, undefined, ++styleCounter)

      try {
        const cssObject = resolvedStyleToCss(breakpoints, style)
        const cssString = cssObjectToString(cssObject, className)
        // For top-level styles, we could optionally notify the style runtime here
        // but typically only child styles trigger updates
        return className
      } catch (error) {
        return 'makeswift-rsc-error'
      }
    },

    child(propName: string): Stylesheet {
      let childStyleCounter = 0

      return {
        breakpoints(): Breakpoints {
          return breakpoints
        },

        defineStyle(style: ResolvedStyle): string {
          const className = generateClassName(elementKey, propName, ++childStyleCounter)

          try {
            const cssObject = resolvedStyleToCss(breakpoints, style)
            const cssString = cssObjectToString(cssObject, className)
            onStyleUpdate(elementKey, propName, cssString)
            return className
          } catch (error) {
            return 'makeswift-rsc-error'
          }
        },

        child(childPropName: string): Stylesheet {
          const nestedPropName = `${propName}.${childPropName}`
          return createClientStylesheet(breakpoints, elementKey, onStyleUpdate).child(nestedPropName)
        },
      }
    },
  }
}