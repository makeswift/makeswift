// Makeswift components for Remix

import * as React from 'react'
// For now, we'll still use the Next.js Page component
// As we decouple, we'll create our own implementation
import { Page as NextPage } from '@makeswift/runtime/next'

/**
 * Props for the Page component
 */
export interface PageProps {
  /** The page snapshot data from getPageSnapshot */
  snapshot: any
}

/**
 * Renders a Makeswift page using the page snapshot
 * 
 * Currently, this uses the Next.js Page component.
 * As we decouple, we'll replace it with our own implementation.
 */
export function Page({ snapshot }: PageProps) {
  // Eventually, this will be replaced with a Remix-specific implementation
  // that doesn't depend on Next.js
  return <NextPage snapshot={snapshot} />
}

// Add more component exports as needed