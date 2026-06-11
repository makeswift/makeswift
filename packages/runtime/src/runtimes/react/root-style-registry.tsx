'use client'

import { type PropsWithChildren, createContext, useContext } from 'react'
import { defaultClassNamePrefix } from './css-runtime/css-runtime'

const DEFAULT_CSS_RESET_ENABLED = true
const DEFAULT_CLASS_NAME_PREFIX = defaultClassNamePrefix

const CSSResetEnabledContext = createContext(DEFAULT_CSS_RESET_ENABLED)
const ClassNamePrefixContext = createContext(DEFAULT_CLASS_NAME_PREFIX)

// TODO still need to thread classNamePrefix through to StylesheetEngine

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
    <ClassNamePrefixContext.Provider value={classNamePrefix ?? DEFAULT_CLASS_NAME_PREFIX}>
      <CSSResetEnabledContext.Provider value={enableCssReset ?? DEFAULT_CSS_RESET_ENABLED}>
        {children}
      </CSSResetEnabledContext.Provider>
    </ClassNamePrefixContext.Provider>
  )
}

export function useClassNamePrefix(): string {
  return useContext(ClassNamePrefixContext)
}

export function useCSSResetEnabled(): boolean {
  return useContext(CSSResetEnabledContext)
}
