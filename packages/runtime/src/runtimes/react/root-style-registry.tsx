'use client'

import { type PropsWithChildren } from 'react'
import { StylesContextProvider } from './css-runtime/components/StylesContextProvider'

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
  classNamePrefix,
  enableCssReset,
}: PropsWithChildren<RootStyleProps>) {
  return (
    <StylesContextProvider classNamePrefix={classNamePrefix} enableCssReset={enableCssReset}>
      {children}
    </StylesContextProvider>
  )
}
