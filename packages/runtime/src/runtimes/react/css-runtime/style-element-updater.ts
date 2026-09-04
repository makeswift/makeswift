import { BrowserStyleApplier } from './types'

export class StyleElementUpdater implements BrowserStyleApplier {
  constructor() {}

  apply({ className, css }: { className: string; css: string }): void {
    const styleElement = this.findStyleElement(className)
    if (styleElement) {
      styleElement.textContent = css
    }
  }

  private findStyleElement(className: string): HTMLStyleElement | null {
    const matchingStyleElements = document.querySelectorAll<HTMLStyleElement>(
      `style[data-href="${className}"]`,
    )
    if (matchingStyleElements.length === 0) {
      console.warn(
        `Attempted to remove stale style rules for an editable Makeswift class '${className}', but found no corresponding style element`,
      )
      return null
    }
    if (matchingStyleElements.length > 1) {
      console.warn(
        `Attempted to remove stale style rules for an editable Makeswift class '${className}', but found multiple corresponding style elements`,
      )
      return null
    }
    return matchingStyleElements[0]
  }
}
