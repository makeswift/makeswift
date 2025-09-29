import 'server-only'

import { type Breakpoints, type Stylesheet } from '@makeswift/controls'
import { getCSSCollector } from './css-collector'
import { createUnifiedStylesheet, type CSSCollector } from './css-engine'

// Server-side CSS collector adapter
class ServerCSSCollector implements CSSCollector {
  private cssCollector = getCSSCollector()

  collect(className: string, css: string, elementKey?: string, propName?: string): void {
    this.cssCollector.collect(className, css, elementKey, propName)
  }
}

export function createServerStylesheet(breakpoints: Breakpoints, elementKey?: string): Stylesheet {
  const collector = new ServerCSSCollector()
  return createUnifiedStylesheet(breakpoints, elementKey, { collector })
}
