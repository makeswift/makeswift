'use client'

import { createContext, PropsWithChildren } from 'react'
import { StylesRegistry } from '../styles-registry'

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

export const StylesContext = createContext<StylesContextValue | undefined>(undefined)

export function StylesContextProvider({
  children,
  classNamePrefix,
  enableCssReset,
  stylesRegistry,
  shouldRenderStyleElements,
}: PropsWithChildren<StylesContextValue>) {
  return (
    <StylesContext.Provider
      value={{
        classNamePrefix,
        enableCssReset,
        stylesRegistry,
        shouldRenderStyleElements,
      }}
    >
      {children}
    </StylesContext.Provider>
  )
}
