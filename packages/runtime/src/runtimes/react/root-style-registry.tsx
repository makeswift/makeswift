'use client'

import { useState, type PropsWithChildren } from 'react'
import { StylesContextProvider } from './css-runtime/components/styles-context-provider'
import { StylesRegistry } from './css-runtime/styles-registry'
import { useDynamicBrowserStyleUpdates } from './css-runtime/hooks/use-dynamic-browser-style-updates'

export type RootStyleProps = {
  /**
   * The prefix used for generated class names.
   * If not provided, a default prefix will be used.
   */
  classNamePrefix?: string
  /**
   * Toggle the built-in CSS reset.
   * Set to `false` when using `@layer`-based CSS frameworks like Tailwind.
   */
  enableCssReset?: boolean
}

export function RootStyleRegistry({
  children,
  stylesRegistry,
  classNamePrefix,
  enableCssReset,
  shouldRenderStyleElements,
}: PropsWithChildren<{
  stylesRegistry: StylesRegistry
  classNamePrefix?: string
  enableCssReset?: boolean
  shouldRenderStyleElements?: boolean
}>) {
  useDynamicBrowserStyleUpdates(stylesRegistry)

  return (
    <StylesContextProvider
      classNamePrefix={classNamePrefix}
      enableCssReset={enableCssReset}
      stylesRegistry={stylesRegistry}
      shouldRenderStyleElements={shouldRenderStyleElements}
    >
      {children}
    </StylesContextProvider>
  )
}

export function DefaultRootStyleRegistry({
  children,
  classNamePrefix,
  enableCssReset
}: PropsWithChildren<RootStyleProps>) {
  const [stylesRegistry] = useState(() => new StylesRegistry())
  return (
    <RootStyleRegistry stylesRegistry={stylesRegistry} classNamePrefix={classNamePrefix} enableCssReset={enableCssReset}>
      {children}
    </RootStyleRegistry>
  )
}
