import React, { createContext, useContext, useState, useEffect } from 'react'
import { MAKESWIFT_API_ORIGIN, MAKESWIFT_APP_ORIGIN } from '../env'
import type { ReactRuntime } from '@makeswift/runtime/react'

// Define context type
interface MakeswiftContextType {
  // Basic Makeswift context values
  runtime: ReactRuntime
  previewMode: boolean
  locale?: string
  apiOrigin: string
  appOrigin: string
}

// Create context with default values
const MakeswiftContext = createContext<MakeswiftContextType | null>(null)

// Provider props type
interface SimplifiedProviderProps {
  children: JSX.Element
  runtime: ReactRuntime
  locale?: string
  previewMode?: boolean
}

/**
 * A simplified Makeswift provider that works with React 19 in a Remix app.
 * This provider avoids using any problematic hooks from the Next.js implementation.
 */
export function SimplifiedMakeswiftProvider({
  children,
  runtime,
  locale = undefined,
  previewMode = false,
}: SimplifiedProviderProps) {
  // Log when provider is mounted/updated
  useEffect(() => {
    console.log('SimplifiedMakeswiftProvider mounted/updated', {
      previewMode,
      locale,
      apiOrigin: MAKESWIFT_API_ORIGIN,
      appOrigin: MAKESWIFT_APP_ORIGIN,
    })
  }, [previewMode, locale])

  // Create context value
  const contextValue: MakeswiftContextType = {
    runtime,
    previewMode,
    locale,
    apiOrigin: MAKESWIFT_API_ORIGIN,
    appOrigin: MAKESWIFT_APP_ORIGIN,
  }

  return (
    <MakeswiftContext.Provider value={contextValue}>
      {children}
    </MakeswiftContext.Provider>
  )
}

/**
 * Hook to use the Makeswift context
 */
export function useMakeswift() {
  const context = useContext(MakeswiftContext)

  if (!context) {
    throw new Error(
      'useMakeswift must be used within a SimplifiedMakeswiftProvider',
    )
  }

  return context
}
