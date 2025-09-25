'use client'

import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'

type RSCStyleContextValue = {
  updateStyle: (elementKey: string, propName: string, cssString: string) => void
}

const RSCStyleContext = createContext<RSCStyleContextValue>({
  updateStyle: () => {},
})

type RSCStyleProviderProps = {
  children: ReactNode
}

export function RSCStyleProvider({ children }: RSCStyleProviderProps) {
  const [injectedStyles, setInjectedStyles] = useState<Map<string, string>>(new Map())
  const styleElementRef = useRef<HTMLStyleElement | null>(null)
  const serverStylesRef = useRef<string>('')

  useEffect(() => {
    if (!styleElementRef.current) {
      let styleElement = document.querySelector(
        'style[data-makeswift-rsc="true"]',
      ) as HTMLStyleElement

      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.setAttribute('data-makeswift-rsc', 'true')
        document.head.appendChild(styleElement)
      }

      serverStylesRef.current = styleElement.textContent || ''
      styleElementRef.current = styleElement
    }

    return () => {
      styleElementRef.current = null
    }
  }, [])

  useEffect(() => {
    if (styleElementRef.current) {
      const dynamicStyles = Array.from(injectedStyles.values()).join('\n')
      const combinedStyles = serverStylesRef.current + (dynamicStyles ? '\n' + dynamicStyles : '')
      styleElementRef.current.textContent = combinedStyles
    }
  }, [injectedStyles])

  const updateStyle = (elementKey: string, propName: string, cssString: string) => {
    const key = `${elementKey}-${propName}`
    setInjectedStyles(prev => new Map(prev).set(key, cssString))
  }

  const contextValue = {
    updateStyle,
  }

  return <RSCStyleContext.Provider value={contextValue}>{children}</RSCStyleContext.Provider>
}

export function useRSCStyleRuntime() {
  return useContext(RSCStyleContext)
}
