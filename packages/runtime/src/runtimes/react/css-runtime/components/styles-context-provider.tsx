'use client'

import { createContext, PropsWithChildren } from "react"
import { DEFAULT_CSS_CLASS_NAME_PREFIX, DEFAULT_CSS_RESET_ENABLED, DEFAULT_SHOULD_RENDER_STYLE_ELEMENTS } from "../constants"
import { StylesRegistry } from "../styles-registry"

export type StylesContextValue = {
  classNamePrefix: string
  enableCssReset: boolean
  stylesRegistry: StylesRegistry

  /**
   * By default, Makeswift-generated `<style>` elements are placed in JSX alongside the components that use them
   * (note that in practice, React may hoist `<style>`s into the document `<head>` such that they don't appear in the
   * `<body>` at all).
   * 
   * This setting allows you to disable the automatic rendering of Makeswift-generated `<style>` elements. The expectation
   * is that, when `shouldRenderStyleElements` is `false`, you will access generated styles from the Makeswift styles registry
   * and handle applying them manually.
   */
  shouldRenderStyleElements: boolean
}

// TODO erroring if no context was provided?
const defaultStylesContextValue: StylesContextValue = {
  classNamePrefix: DEFAULT_CSS_CLASS_NAME_PREFIX,
  enableCssReset: DEFAULT_CSS_RESET_ENABLED,
  stylesRegistry: new StylesRegistry(),
  shouldRenderStyleElements: DEFAULT_SHOULD_RENDER_STYLE_ELEMENTS,
}

export const StylesContext = createContext<StylesContextValue>(defaultStylesContextValue)

export function StylesContextProvider({
  children,
  classNamePrefix,
  enableCssReset,
  stylesRegistry,
  shouldRenderStyleElements,
}: PropsWithChildren<Partial<StylesContextValue>>) {
  return (
    <StylesContext.Provider value={
      {
        classNamePrefix: classNamePrefix ?? defaultStylesContextValue.classNamePrefix,
        enableCssReset: enableCssReset ?? defaultStylesContextValue.enableCssReset,
        stylesRegistry: stylesRegistry ?? defaultStylesContextValue.stylesRegistry,
        shouldRenderStyleElements: shouldRenderStyleElements ?? defaultStylesContextValue.shouldRenderStyleElements,
      }
    }>
      {children}
    </StylesContext.Provider>
  )
}
