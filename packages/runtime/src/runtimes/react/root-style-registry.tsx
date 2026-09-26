'use client'

import { useState, type PropsWithChildren } from 'react'
import { StylesContextProvider } from './css-runtime/components/styles-context-provider'
import { StylesRegistry } from './css-runtime/styles-registry'
import { useDynamicBrowserStyleUpdates } from './css-runtime/hooks/use-dynamic-browser-style-updates'
import {
  DEFAULT_CSS_CLASS_NAME_PREFIX,
  DEFAULT_SHOULD_RENDER_STYLE_ELEMENTS,
  DEFAULT_CSS_RESET_ENABLED,
  DEFAULT_CSS_FORCE_IMPORTANT,
} from './css-runtime/constants'
import { createMakeswiftStylesRegistry } from './css-runtime/utils'

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
  /**
   * Append `!important` to Makeswift-generated style rule declarations to
   * increase their priority relative to external styles.
   */
  forceImportant?: boolean
}

export function RootStyleRegistry({
  children,
  stylesRegistry,
  classNamePrefix = DEFAULT_CSS_CLASS_NAME_PREFIX,
  enableCssReset = DEFAULT_CSS_RESET_ENABLED,
  forceImportant = DEFAULT_CSS_FORCE_IMPORTANT,
  shouldRenderStyleElements = DEFAULT_SHOULD_RENDER_STYLE_ELEMENTS,
}: PropsWithChildren<{
  stylesRegistry: StylesRegistry
  classNamePrefix?: string
  enableCssReset?: boolean
  forceImportant?: boolean
  shouldRenderStyleElements?: boolean
}>) {
  useDynamicBrowserStyleUpdates(stylesRegistry)

  return (
    <StylesContextProvider
      classNamePrefix={classNamePrefix}
      enableCssReset={enableCssReset}
      forceImportant={forceImportant}
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
  enableCssReset,
  forceImportant,
}: PropsWithChildren<RootStyleProps>) {
  const [stylesRegistry] = useState(createMakeswiftStylesRegistry)
  return (
    <RootStyleRegistry
      stylesRegistry={stylesRegistry}
      classNamePrefix={classNamePrefix}
      enableCssReset={enableCssReset}
      forceImportant={forceImportant}
    >
      {children}
    </RootStyleRegistry>
  )
}
