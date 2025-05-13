/**
 * Provider component for Makeswift in Remix apps
 */
import React, { createContext, useContext } from 'react';
import { MakeswiftSiteVersion } from '@makeswift/runtime';

/**
 * Context type for Remix runtime
 */
interface RemixRuntimeContext {
  /** The current site version */
  siteVersion: MakeswiftSiteVersion;
  
  /** The current locale */
  locale: string;
}

// Create context
const RemixContext = createContext<RemixRuntimeContext | null>(null);

/**
 * Props for the RemixRuntimeProvider component
 */
interface RemixRuntimeProviderProps {
  /** The current site version */
  siteVersion: MakeswiftSiteVersion;
  
  /** The current locale */
  locale: string;
  
  /** React children */
  children: React.ReactNode;
}

/**
 * Provides Makeswift Remix context to child components
 */
export function RemixRuntimeProvider({
  siteVersion,
  locale,
  children,
}: RemixRuntimeProviderProps) {
  return (
    <RemixContext.Provider value={{ siteVersion, locale }}>
      {children}
    </RemixContext.Provider>
  );
}

/**
 * Hook to access the Remix runtime context
 */
export function useRemixRuntime(): RemixRuntimeContext {
  const context = useContext(RemixContext);
  
  if (context === null) {
    throw new Error('useRemixRuntime must be used within a RemixRuntimeProvider');
  }
  
  return context;
}