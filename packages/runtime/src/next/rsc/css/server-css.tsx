import 'server-only'
import { cache } from 'react'
import { type Breakpoints, type Stylesheet } from '@makeswift/controls'
import { createServerStylesheet } from './stylesheet-factory'

// Server-side CSS collection and management
export class ServerCSSCollector {
  private styles = new Map<string, string>()
  private elementStyles = new Map<string, Map<string, string>>()

  collect(className: string, css: string, elementKey?: string, propName?: string) {
    if (this.styles.has(className)) return

    this.styles.set(className, css)

    if (elementKey) {
      if (!this.elementStyles.has(elementKey)) {
        this.elementStyles.set(elementKey, new Map())
      }
      const elementMap = this.elementStyles.get(elementKey)!
      elementMap.set(propName || 'root', className)
    }
  }

  getAllStyles(): string {
    return Array.from(this.styles.values()).join('\n')
  }

  getElementStyles(elementKey: string): Map<string, string> | undefined {
    return this.elementStyles.get(elementKey)
  }

  clearElement(elementKey: string) {
    const elementMap = this.elementStyles.get(elementKey)
    if (elementMap) {
      for (const className of elementMap.values()) {
        this.styles.delete(className)
      }
      this.elementStyles.delete(elementKey)
    }
  }
}

// Request-scoped CSS collector using React's cache
export const getCSSCollector = cache((): ServerCSSCollector => {
  return new ServerCSSCollector()
})

// Create server stylesheet with automatic CSS collection
export function createCollectingServerStylesheet(breakpoints: Breakpoints, elementKey?: string): Stylesheet {
  const collector = getCSSCollector()

  const handleStyleGenerated = (className: string, css: string, elementKey?: string, propName?: string) => {
    collector.collect(className, css, elementKey, propName)
  }

  return createServerStylesheet(breakpoints, elementKey, handleStyleGenerated)
}

// React component to inject collected CSS
export function CSSInjector() {
  const collector = getCSSCollector()
  const css = collector.getAllStyles()

  if (!css) return null

  return <style data-makeswift-rsc={true} dangerouslySetInnerHTML={{ __html: css }} />
}