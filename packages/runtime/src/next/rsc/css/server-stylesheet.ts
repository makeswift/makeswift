import 'server-only'

import { type Breakpoints, type Stylesheet, type ResolvedStyle } from '@makeswift/controls'
import { getCSSCollector } from './css-collector'
import { resolvedStyleToCss } from '../../../runtimes/react/resolve-style'
import { cssObjectToString } from './css-string-utils'

export function createServerStylesheet(breakpoints: Breakpoints, elementKey?: string): Stylesheet {
  const cssCollector = getCSSCollector()
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
        cssCollector.collect(className, cssString, elementKey)
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
            cssCollector.collect(className, cssString, elementKey, propName)
            return className
          } catch (error) {
            return 'makeswift-rsc-error'
          }
        },

        child(childPropName: string): Stylesheet {
          const nestedPropName = `${propName}.${childPropName}`
          return createServerStylesheet(breakpoints, elementKey).child(nestedPropName)
        },
      }
    },
  }
}
