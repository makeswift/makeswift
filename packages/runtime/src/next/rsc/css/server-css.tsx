import 'server-only'
import { cache } from 'react'
import { type Breakpoints, type Stylesheet } from '@makeswift/controls'
import { createStylesheet } from './css-runtime'

// Simplified server-side CSS collection
export class ServerCSSCollector {
  private styles = new Map<string, string>()

  collect(className: string, css: string, _elementKey?: string, _propPath?: string) {
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
export function createCollectingServerStylesheet(breakpoints: Breakpoints, elementKey?: string): Stylesheet {
  const collector = getCSSCollector()

  const handleStyleGenerated = (className: string, css: string, elementKey?: string, propPath?: string) => {
    collector.collect(className, css, elementKey, propPath)
  }

  return createStylesheet(breakpoints, elementKey, handleStyleGenerated)
}

// React component to inject collected CSS
export function CSSInjector() {
  const collector = getCSSCollector()
  const css = collector.getAllStyles()

  if (!css) return null

  return <style data-makeswift-rsc={true} dangerouslySetInnerHTML={{ __html: css }} />
}