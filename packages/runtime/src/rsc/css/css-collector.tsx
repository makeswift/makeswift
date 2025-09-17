import 'server-only'
import { cache } from 'react'

// CSS collector for RSC-generated styles
export class CSSCollector {
  private styles = new Map<string, string>()

  collect(className: string, css: string) {
    if (!this.styles.has(className)) {
      this.styles.set(className, css)
    }
  }

  getAllStyles(): string {
    return Array.from(this.styles.values()).join('\n')
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
