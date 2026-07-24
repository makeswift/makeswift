import { BrowserStyleApplier } from "./types";


export class AdoptedStylesheetApplier implements BrowserStyleApplier {
  // Keyed by css class name
  private sheets: Map<string, CSSStyleSheet>

  constructor() {
    this.sheets = new Map()
  }

  apply({ className, css }: { className: string, css: string }): void {
    let sheet = this.sheets.get(className)
    if (sheet == null) {
      sheet = new CSSStyleSheet()
      this.sheets.set(className, sheet)
    }
    sheet.replaceSync(css)

    if (!document.adoptedStyleSheets.includes(sheet)) {
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
    }
  }

  dispose(): void {
    const managedSheets = new Set(this.sheets.values())
    if (document.adoptedStyleSheets != null && document.adoptedStyleSheets.length > 0) {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s) => !managedSheets.has(s))
    }
    this.sheets.clear()
  }
}
