import 'server-only'
import { cache } from 'react'

export class CSSCollector {
  private styles = new Map<string, string>()
  private elementStyles = new Map<string, Map<string, string>>()

  collect(className: string, css: string, elementKey?: string, propName?: string) {
    // Avoid duplicate styles
    if (this.styles.has(className)) return

    this.styles.set(className, css)

    // Track styles by element for debugging
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

  // Clear styles for a specific element (useful for hot reloading)
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
export const getCSSCollector = cache((): CSSCollector => {
  return new CSSCollector()
})

// React component to inject collected CSS
export function CSSInjector() {
  const collector = getCSSCollector()
  const css = collector.getAllStyles()

  if (!css) return null

  return <style data-makeswift-rsc={true} dangerouslySetInnerHTML={{ __html: css }} />
}
