import { type Breakpoints, type Stylesheet, type ResolvedStyle } from '@makeswift/controls'
import { resolvedStyleToCss } from '../../../runtimes/react/resolve-style'
import { cssObjectToString } from './css-string-utils'

// Unified CSS collection interface
export interface CSSCollector {
  collect(className: string, css: string, elementKey?: string, propName?: string): void
}

// Client-side style update interface
export interface StyleUpdater {
  updateStyle(elementKey: string, propName: string, css: string): void
}

// Unified stylesheet factory
export interface StylesheetFactory {
  createStylesheet(
    breakpoints: Breakpoints,
    elementKey?: string,
    context?: { collector?: CSSCollector; updater?: StyleUpdater }
  ): Stylesheet
}

// Shared className generation logic
export function generateClassName(elementKey?: string, propName?: string, counter?: number): string {
  const parts = ['makeswift-rsc']
  if (elementKey) parts.push(elementKey)
  if (propName) parts.push(propName)
  if (counter !== undefined) parts.push(counter.toString())
  return parts.join('-')
}

// Shared style definition logic
export function defineStyleWithContext(
  style: ResolvedStyle,
  breakpoints: Breakpoints,
  className: string,
  context?: { collector?: CSSCollector; updater?: StyleUpdater },
  elementKey?: string,
  propName?: string
): string {
  try {
    const cssObject = resolvedStyleToCss(breakpoints, style)
    const cssString = cssObjectToString(cssObject, className)

    // Collect for server-side rendering
    if (context?.collector) {
      context.collector.collect(className, cssString, elementKey, propName)
    }

    // Update for client-side dynamic styling
    if (context?.updater && elementKey && propName) {
      context.updater.updateStyle(elementKey, propName, cssString)
    }

    return className
  } catch (error) {
    console.warn('[CSS Engine] Error processing style:', error)
    return 'makeswift-rsc-error'
  }
}

// Unified stylesheet implementation
export class UnifiedStylesheet implements Stylesheet {
  private styleCounter = 0

  constructor(
    private breakpointsData: Breakpoints,
    private elementKey?: string,
    private context?: { collector?: CSSCollector; updater?: StyleUpdater }
  ) {}

  breakpoints(): Breakpoints {
    return this.breakpointsData
  }

  defineStyle(style: ResolvedStyle): string {
    const className = generateClassName(this.elementKey, undefined, ++this.styleCounter)
    return defineStyleWithContext(
      style,
      this.breakpointsData,
      className,
      this.context,
      this.elementKey
    )
  }

  child(propName: string): Stylesheet {
    return new UnifiedChildStylesheet(
      this.breakpointsData,
      this.elementKey,
      propName,
      this.context
    )
  }
}

// Unified child stylesheet implementation
export class UnifiedChildStylesheet implements Stylesheet {
  private childStyleCounter = 0

  constructor(
    private breakpointsData: Breakpoints,
    private elementKey?: string,
    private propName?: string,
    private context?: { collector?: CSSCollector; updater?: StyleUpdater }
  ) {}

  breakpoints(): Breakpoints {
    return this.breakpointsData
  }

  defineStyle(style: ResolvedStyle): string {
    const className = generateClassName(this.elementKey, this.propName, ++this.childStyleCounter)
    return defineStyleWithContext(
      style,
      this.breakpointsData,
      className,
      this.context,
      this.elementKey,
      this.propName
    )
  }

  child(childPropName: string): Stylesheet {
    const nestedPropName = this.propName ? `${this.propName}.${childPropName}` : childPropName
    return new UnifiedChildStylesheet(
      this.breakpointsData,
      this.elementKey,
      nestedPropName,
      this.context
    )
  }
}

// Factory function for creating stylesheets
export const createUnifiedStylesheet: StylesheetFactory['createStylesheet'] = (
  breakpoints,
  elementKey,
  context
) => {
  return new UnifiedStylesheet(breakpoints, elementKey, context)
}