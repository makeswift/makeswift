'use client'

import { createContext, PropsWithChildren } from "react"
import { defaultClassNamePrefix } from "../css-runtime"

const DEFAULT_CSS_RESET_ENABLED = true
const DEFAULT_CLASS_NAME_PREFIX = defaultClassNamePrefix

export type StylesContextValue = {
  classNamePrefix: string
  enableCssReset: boolean
}

export const StylesContext = createContext<StylesContextValue>({
  classNamePrefix: DEFAULT_CLASS_NAME_PREFIX,
  enableCssReset: DEFAULT_CSS_RESET_ENABLED,
})

export function StylesContextProvider({
  children,
  classNamePrefix,
  enableCssReset,
}: PropsWithChildren<Partial<StylesContextValue>>) {
  return (
    <StylesContext.Provider value={{
      classNamePrefix: classNamePrefix ?? DEFAULT_CLASS_NAME_PREFIX,
      enableCssReset: enableCssReset ?? DEFAULT_CSS_RESET_ENABLED}}
    >
      {children}
    </StylesContext.Provider>
  )
}
