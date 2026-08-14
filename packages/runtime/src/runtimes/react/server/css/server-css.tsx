import { type Breakpoints, type Stylesheet } from '@makeswift/controls'

import { StylesheetEngine, MAKESWIFT_RSC_STYLE_TAG_ID_PREFIX } from './css-runtime'

export class ServerCSSCollector {
  private styles = new Map<string, string>()

  collect(className: string, css: string) {
    if (this.styles.has(className)) return
    this.styles.set(className, css)
  }

  hasStyles(): boolean {
    return this.styles.size > 0
  }

  getAllStyles(): string {
    return Array.from(this.styles.values()).join('\n')
  }

  clear() {
    this.styles.clear()
  }
}

export function createCollectingServerStylesheet(
  collector: ServerCSSCollector,
  breakpoints: Breakpoints,
  elementKey?: string,
): Stylesheet {
  return new StylesheetEngine(breakpoints, elementKey, undefined, (className, css) => {
    collector.collect(className, css)
  })
}

export function InjectServerCSS({
  collector,
  elementKey,
}: {
  collector: ServerCSSCollector
  elementKey: string
}) {
  if (!collector.hasStyles()) return null

  const css = collector.getAllStyles()
  const styleTagId = `${MAKESWIFT_RSC_STYLE_TAG_ID_PREFIX}${elementKey}`

  return (
    // `precedence` and `href` props are required to opt the `<style>` element into React 19's stylesheet
    // hoisting; `href` here serves as a unique identifier, and doesn't have to be a valid URL; React
    // converts it to a `data-href` attribute in the actual HTML output
    <style href={styleTagId} precedence={styleTagId}>
      {css}
    </style>
  )
}
