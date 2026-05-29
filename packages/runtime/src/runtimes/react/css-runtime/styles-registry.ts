import { styleTagHtml } from "./utils"
import { BaseStylesData, ControlledStyleData, CssResetData, MakeswiftStylePrecedence, OnControlledStyleDataWrite, UncontrolledStyleData } from "./types"

export class StylesRegistry {
  /*
    Uncontrolled (not editable in Makeswift) styles

    Maps class name to style data
  */
  private styles: Map<string, UncontrolledStyleData>


  /*
    Controlled (editable in Makeswift) styles

    Maps a namespace to a mapping from class name to style data
  */
  private namespaceControlledStyles: Map<string, Map<string, ControlledStyleData>>

  /*
    Keyframes (a special kind of "uncontrolled" style)

    Maps keyframes name to its corresponding css
  */
  private keyframes: Map<string, string>

  /*
    CSS resets

    These are technically "uncontrolled" styles, but differ in that:
    - they are not associated with any Makeswift class name
    - they are given different precedence
    - whether they're rendered or not is gated on a styles context setting

    Maps content hash to CSS reset data
  */
  private cssResets: Map<string, CssResetData>

  /*
    Base styles

    These are technically "uncontrolled" styles, but differ in that:
    - they are not associated with any Makeswift class name
    - they are given different precedence

    Maps content hash to base styles data
  */
  private baseStyles: Map<string, BaseStylesData>

  private controlledStyleWriteListeners: Set<OnControlledStyleDataWrite>

  constructor() {
    this.styles = new Map()
    this.namespaceControlledStyles = new Map()
    this.keyframes = new Map()
    this.cssResets = new Map()
    this.baseStyles = new Map()
    this.controlledStyleWriteListeners = new Set()
  }

  /*
    Getters
  */

  getStyles(): Map<string, UncontrolledStyleData> {
    return this.styles
  }

  getControlledStyles(namespace: string): Map<string, ControlledStyleData> {
    return this.getOrCreateControlledStylesMapForNamespace(namespace)
  }

  getKeyframes(): Map<string, string> {
    return this.keyframes
  }

  getCssResets(): Map<string, CssResetData> {
    return this.cssResets
  }

  getBaseStyles(): Map<string, BaseStylesData> {
    return this.baseStyles
  }

  /*
    Setters
  */

  createOrUpdateControlledStyleData({
    namespace,
    className,
    data,
  }: {
    namespace: string,
    className: string,
    data: Omit<ControlledStyleData, 'counter'>
  }) {
    const namespaceControlledStyleData = this.getOrCreateControlledStylesMapForNamespace(namespace)
    const previousData = namespaceControlledStyleData.get(className)
    const previousCounter = previousData?.counter ?? 0
    const cssContentChanged = previousData == null || previousData.contentHash !== data.contentHash

    const counter = cssContentChanged
      ? previousCounter + 1
      : previousCounter
    
    const result: ControlledStyleData = {
      ...data,
      counter
    }
    namespaceControlledStyleData.set(className, result)
    this.notifyOnControlledStyleWrite(className, result)
    return result
  }

  setStyle(className: string, data: UncontrolledStyleData) {
    this.styles.set(className, data)
  }

  setKeyframes(keyframesName: string, css: string) {
    this.keyframes.set(keyframesName, css)
  }

  setCssReset(contentHash: string, data: CssResetData) {
    this.cssResets.set(contentHash, data)
  }

  setBaseStyles(contentHash: string, data: BaseStylesData) {
    this.baseStyles.set(contentHash, data)
  }

  /*
    Serialization
  */

  /**
   * Creates an HTML string containing `<style>` tags for the contents of the
   * registry, ordered by precedence.
   * 
   * This is intended to be used server-side in scenarios where we don't want to
   * depend on React's hoisting behavior to place `<style>`s in the page `<head>`.
   */
  serializeToHtmlStyleTags(): string {
    const cssResetsHtml = this.serializeCssResetsToHtmlStyleTag()
    const classStylesHtml = this.serializeClassStylesToHtmlStyleTag()
    const baseStylesHtml = this.serializeBaseStylesToHtmlStyleTag()

    // Ordering is intentional here: lower precedences should appear earlier
    return [
      cssResetsHtml,
      classStylesHtml,
      baseStylesHtml,
    ].join('')
  }

  private serializeCssResetsToHtmlStyleTag(): string {
    const cssResets = this.getCssResets()
    const hrefs = new Array<string>()
    const allCss = new Array<string>()
    for (const [contentHash, cssResetData] of cssResets.entries()) {
      hrefs.push(`makeswift-css-reset-${contentHash}`)
      allCss.push(cssResetData.css)
    }
    const combinedCss = allCss.join('')
    return styleTagHtml({
      hrefValues: hrefs,
      css: combinedCss,
      precedence: MakeswiftStylePrecedence.RESET
    })
  }

  private serializeClassStylesToHtmlStyleTag(): string {
    const styles = this.getStyles()
    const controlledStyles = this.getAllControlledStyles()
    const keyframes = this.getKeyframes()

    const hrefs = new Array<string>()
    const allCss = new Array<string>()
    for (const [className, uncontrolledStyleData] of styles.entries()) {
      hrefs.push(className)
      allCss.push(uncontrolledStyleData.css)
    }
    for (const [className, controlledStyleData] of controlledStyles.entries()) {
      hrefs.push(className)
      allCss.push(controlledStyleData.css)
    }
    for (const [keyframesName, css] of keyframes.entries()) {
      hrefs.push(keyframesName)
      allCss.push(css)
    }
    const combinedCss = allCss.join('')
    return styleTagHtml({
      hrefValues: hrefs,
      css: combinedCss,
      precedence: MakeswiftStylePrecedence.MEDIUM
    })
  }

  private serializeBaseStylesToHtmlStyleTag(): string {
    const baseStyles = this.getBaseStyles()
    const hrefs = new Array<string>()
    const allCss = new Array<string>()
    for (const [contentHash, baseStylesData] of baseStyles.entries()) {
      hrefs.push(`makeswift-base-styles-${contentHash}`)
      allCss.push(baseStylesData.css)
    }
    const combinedCss = allCss.join('')
    return styleTagHtml({
      hrefValues: hrefs,
      css: combinedCss,
      precedence: MakeswiftStylePrecedence.HIGH
    })
  }

  /*
    Subscriptions
  */
  subscribeToControlledStyleWrites(listener: OnControlledStyleDataWrite): () => void {
    this.controlledStyleWriteListeners.add(listener)
    const unsubscribe = () => {
      this.controlledStyleWriteListeners.delete(listener)
    }
    return unsubscribe
  }

  notifyOnControlledStyleWrite(className: string, data: ControlledStyleData) {
    if (this.controlledStyleWriteListeners.size > 0) {
      queueMicrotask(() => {
        for (const listener of this.controlledStyleWriteListeners) {
          try {
            listener({ className, data })
          } catch (e) {
            console.error(`Error notifying listener for className ${className}:`, e)
          }
        }
      })
    }
  }

  /*
    Helpers
  */
  private getOrCreateControlledStylesMapForNamespace(namespace: string): Map<string, ControlledStyleData> {
    let namespaceControlledStyles = this.namespaceControlledStyles.get(namespace)
    if (namespaceControlledStyles == null) {
      namespaceControlledStyles = new Map()
      this.namespaceControlledStyles.set(namespace, namespaceControlledStyles)
    }
    return namespaceControlledStyles
  }

  private getAllControlledStyles(): Map<string, ControlledStyleData> {
    const result = new Map<string, ControlledStyleData>()
    const controlledStyleNamespaces = Array.from(this.namespaceControlledStyles.keys())
    for (const namespace of controlledStyleNamespaces) {
      const namespaceControlledStyles = this.namespaceControlledStyles.get(namespace)
      if (namespaceControlledStyles == null) continue
      for (const [className, data] of namespaceControlledStyles.entries()) {
        result.set(className, data)
      }
    }
    return result
  }
}
