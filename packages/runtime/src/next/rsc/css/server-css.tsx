import 'server-only'
import { cache } from 'react'
import { type Breakpoints, type Stylesheet } from '@makeswift/controls'
import { createStylesheet } from './css-runtime'

// Simplified server-side CSS collection
export class ServerCSSCollector {
  private styles = new Map<string, string>()

  collect(className: string, css: string) {
    if (this.styles.has(className)) return
    this.styles.set(className, css)
  }

  getAllStyles(): string {
    return Array.from(this.styles.values()).join('\n')
  }

  clear() {
    this.styles.clear()
  }
}

// Request-scoped CSS collector using React's cache
export const getCSSCollector = cache((): ServerCSSCollector => {
  return new ServerCSSCollector()
})

// Create server stylesheet with automatic CSS collection
export function createCollectingServerStylesheet(
  breakpoints: Breakpoints,
  elementKey?: string,
): Stylesheet {
  const collector = getCSSCollector()

  const handleStyleGenerated = (className: string, css: string) => {
    collector.collect(className, css)
  }

  return createStylesheet(breakpoints, elementKey, handleStyleGenerated)
}

// React component to inject collected CSS
export function CSSInjector() {
  const collector = getCSSCollector()
  const css = collector.getAllStyles()

  // Always render the style element, even when empty, to ensure consistency between server and client
  return <style data-makeswift-rsc="true">{css}</style>
}
