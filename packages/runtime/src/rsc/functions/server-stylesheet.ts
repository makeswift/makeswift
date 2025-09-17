import 'server-only'

import { type Breakpoints, type Stylesheet, type ResolvedStyle } from '@makeswift/controls'
import { getCSSCollector } from '../css/css-collector'
import { resolvedStyleToCss } from '../../runtimes/react/resolve-style'
import { cssObjectToString } from '../utils/css-string-utils'

export function createServerStylesheet(breakpoints: Breakpoints): Stylesheet {
  let styleCounter = 0

  return {
    breakpoints(): Breakpoints {
      return breakpoints
    },

    defineStyle(style: ResolvedStyle): string {
      const className = `makeswift-rsc-${++styleCounter}`

      const cssObject = resolvedStyleToCss(breakpoints, style)
      const cssString = cssObjectToString(cssObject, className)

      const cssCollector = getCSSCollector()
      cssCollector.collect(className, cssString)

      console.log(`[RSC Stylesheet] Generated class: ${className}`)
      console.log(`[RSC Stylesheet] CSS: ${cssString}`)

      return className
    },

    child(_id: string): Stylesheet {
      // For child stylesheets, we can just return a new instance
      // In a full implementation, this might have scoped naming
      return createServerStylesheet(breakpoints)
    },
  }
}
