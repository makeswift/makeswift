import { styleTagHtml } from './utils'
import {
  BaseStylesData,
  ClassStyleData,
  ControlledStyleData,
  CssResetData,
  KeyframesData,
  MakeswiftStylePrecedence,
  OnControlledStyleDataWrite,
} from './types'
import { ComponentProps } from 'react'
import { MakeswiftStyle } from './components/makeswift-style'

export class StylesRegistry {
  // Keyed by class name
  private uncontrolledClassStyles: Map<string, ClassStyleData>

  // Outer map keyed by namespace, inner map keyed by class name
  private namespaceControlledStyles: Map<string, Map<string, ControlledStyleData>>

  // Keyed by keyframes name
  private keyframes: Map<string, KeyframesData>

  // Keyed by content hash
  private cssResets: Map<string, CssResetData>

  // Keyed by content hash
  private baseStyles: Map<string, BaseStylesData>

  /*
    Preserve the initial controlled style data for a class name so it can be used
    by listeners to calculate CSS reverts.

    Keyed by class name
  */
  private controlledStylesInitialData: Map<string, ControlledStyleData>
  private controlledStyleWriteListeners: Set<OnControlledStyleDataWrite>

  constructor() {
    this.uncontrolledClassStyles = new Map()
    this.namespaceControlledStyles = new Map()
    this.keyframes = new Map()
    this.cssResets = new Map()
    this.baseStyles = new Map()
    this.controlledStyleWriteListeners = new Set()
    this.controlledStylesInitialData = new Map()
  }

  /*
    Getters
  */

  getUncontrolledClassStyles(): Map<string, ClassStyleData> {
    return this.uncontrolledClassStyles
  }

  getControlledStyles(namespace: string): Map<string, ControlledStyleData> {
    return this.getOrCreateControlledStylesMapForNamespace(namespace)
  }

  getKeyframes(): Map<string, KeyframesData> {
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

  setControlledStyle({
    namespace,
    className,
    data,
  }: {
    namespace: string
    className: string
    data: ControlledStyleData
  }) {
    const namespaceControlledStyleData = this.getOrCreateControlledStylesMapForNamespace(namespace)
    namespaceControlledStyleData.set(className, data)

    let initialData = this.controlledStylesInitialData.get(className)
    if (initialData == null) {
      initialData = data
      this.controlledStylesInitialData.set(className, data)
    }
    this.notifyOnControlledStyleWrite({
      className,
      currentData: data,
      initialData,
    })
  }

  setUncontrolledClassStyle(data: ClassStyleData) {
    this.uncontrolledClassStyles.set(data.className, data)
  }

  setKeyframes(data: KeyframesData) {
    this.keyframes.set(data.keyframesName, data)
  }

  setCssReset(data: CssResetData) {
    this.cssResets.set(data.contentHash, data)
  }

  setBaseStyles(data: BaseStylesData) {
    this.baseStyles.set(data.contentHash, data)
  }

  /*
    Serialization
  */

  /**
   * Creates an HTML string containing `<style>` elements for the contents of the
   * registry, ordered by precedence (lower precedences first).
   *
   * This is intended to be used server-side in scenarios where we can't
   * depend on React's hoisting behavior to place `<style>` elements in the page
   * `<head>`.
   *
   * When using this for SSR, the `RootStyleRegistry` should be configured so that
   * it does not render `<style>` elements alongside components (to avoid creating
   * duplicates).
   *
   * There's an argument for providing these as an array of raw style data so
   * that applications which render multiple React roots can deduplicate styles
   * between them.
   */
  serializeToHtmlStyleTags(): string {
    return this.serializeToStyleProps()
      .map(stylePropsForPrecedence => styleTagHtml(stylePropsForPrecedence))
      .join('')
  }

  /**
   * Returns an array of `MakeswiftStyle` component props for the contents of the
   * registry, ordered by precedence (lower precedences first).
   *
   * It might be desirable in some cases to avoid filtering out empty data, since
   * an empty `<style>` tag in the page `<head>` can still serve as an anchor to
   * which client-side React can hoist `<style>`s added after page load.
   */
  serializeToStyleProps(
    includeEmpty: boolean = false,
  ): Array<ComponentProps<typeof MakeswiftStyle>> {
    const resetPrecedenceStylesProps = this.getPropsForResetPrecedenceStyles()
    const mediumPrecedenceStylesProps = this.getPropsForMediumPrecedenceStyles()
    const highPrecedenceStylesProps = this.getPropsForHighPrecedenceStyles()

    const perPrecedenceProps = [
      resetPrecedenceStylesProps,
      mediumPrecedenceStylesProps,
      highPrecedenceStylesProps,
    ]
    return includeEmpty
      ? perPrecedenceProps
      : perPrecedenceProps.filter(props => props.href.length > 0)
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

  notifyOnControlledStyleWrite({
    className,
    currentData,
    initialData,
  }: {
    className: string
    currentData: ControlledStyleData
    initialData: ControlledStyleData
  }) {
    if (this.controlledStyleWriteListeners.size > 0) {
      queueMicrotask(() => {
        for (const listener of this.controlledStyleWriteListeners) {
          try {
            listener({ className, currentData, initialData })
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

  private getOrCreateControlledStylesMapForNamespace(
    namespace: string,
  ): Map<string, ControlledStyleData> {
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

  private getPropsForResetPrecedenceStyles(): ComponentProps<typeof MakeswiftStyle> {
    const cssResets = this.getCssResets()
    const hrefValues = new Array<string>()
    const allCss = new Array<string>()
    for (const [contentHash, cssResetData] of cssResets.entries()) {
      hrefValues.push(`makeswift-css-reset-${contentHash}`)
      allCss.push(cssResetData.css)
    }
    const combinedHref = hrefValues.join(' ')
    const combinedCss = allCss.join('')
    return {
      href: combinedHref,
      css: combinedCss,
      precedence: MakeswiftStylePrecedence.RESET,
    }
  }

  private getPropsForMediumPrecedenceStyles(): ComponentProps<typeof MakeswiftStyle> {
    const styles = this.getUncontrolledClassStyles()
    const controlledStyles = this.getAllControlledStyles()
    const keyframes = this.getKeyframes()

    const hrefValues = new Array<string>()
    const allCss = new Array<string>()
    for (const [className, uncontrolledStyleData] of styles.entries()) {
      hrefValues.push(className)
      allCss.push(uncontrolledStyleData.css)
    }
    for (const [className, controlledStyleData] of controlledStyles.entries()) {
      hrefValues.push(className)
      allCss.push(controlledStyleData.css)
    }
    for (const [keyframesName, keyframesData] of keyframes.entries()) {
      hrefValues.push(keyframesName)
      allCss.push(keyframesData.css)
    }
    const combinedHref = hrefValues.join(' ')
    const combinedCss = allCss.join('')
    return {
      href: combinedHref,
      css: combinedCss,
      precedence: MakeswiftStylePrecedence.MEDIUM,
    }
  }

  private getPropsForHighPrecedenceStyles(): ComponentProps<typeof MakeswiftStyle> {
    const baseStyles = this.getBaseStyles()
    const hrefValues = new Array<string>()
    const allCss = new Array<string>()
    for (const [contentHash, baseStylesData] of baseStyles.entries()) {
      hrefValues.push(`makeswift-base-styles-${contentHash}`)
      allCss.push(baseStylesData.css)
    }
    const combinedHref = hrefValues.join(' ')
    const combinedCss = allCss.join('')
    return {
      href: combinedHref,
      css: combinedCss,
      precedence: MakeswiftStylePrecedence.HIGH,
    }
  }
}
