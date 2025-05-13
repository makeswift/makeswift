/**
 * Makeswift provider component
 * 
 * Provides the runtime context for Makeswift pages in Remix
 */
import React, { createContext, useContext, useMemo } from 'react';
import { runtime } from './runtime';
import type { MakeswiftSiteVersion } from './utils/site-version';
import { RemixAdapter } from './adapter';

/**
 * Context for Remix-specific runtime values
 */
interface RemixRuntimeContextValue {
  locale: string;
  siteVersion: MakeswiftSiteVersion;
  adapter: RemixAdapter;
  runtime: typeof runtime;
}

// Default context values for safety
const RemixRuntimeContext = createContext<RemixRuntimeContextValue>({
  locale: 'en',
  siteVersion: 'published',
  adapter: new RemixAdapter(),
  runtime,
});

/**
 * Hook to access Remix runtime values
 */
export function useRemixRuntime() {
  return useContext(RemixRuntimeContext);
}

interface MakeswiftProviderProps {
  /** The site version from the loader data */
  siteVersion?: MakeswiftSiteVersion;
  
  /** The current locale */
  locale?: string;
  
  /** React children */
  children: React.ReactNode;
}

/**
 * Provider component for Makeswift runtime context
 * Similar to Next.js ReactRuntimeProvider but adapted for Remix
 */
export function MakeswiftProvider({ 
  siteVersion = 'published',
  locale = 'en',
  children 
}: MakeswiftProviderProps) {
  // Memoize adapter to avoid recreating on each render
  const adapter = useMemo(() => new RemixAdapter(), []);
  
  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo(() => ({
    locale: locale || 'en',
    siteVersion: siteVersion || 'published',
    adapter,
    runtime,
  }), [locale, siteVersion, adapter]);
  
  return (
    <RemixRuntimeContext.Provider value={contextValue}>
      {children}
    </RemixRuntimeContext.Provider>
  );
}