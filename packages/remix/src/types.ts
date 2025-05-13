// Type definitions for the Remix adapter

// We'll temporarily use any for ReactRuntime until we properly decouple
import type { ReactNode } from 'react'

// Temporary type definition for ReactRuntime
export type ReactRuntime = any

/**
 * Options for the MakeswiftRemix client
 */
export interface MakeswiftRemixOptions {
  /** The ReactRuntime instance */
  runtime: ReactRuntime
  /** Optional API origin for Makeswift */
  apiOrigin?: string
  /** Optional app origin for Makeswift */
  appOrigin?: string
}

/**
 * Options for getPageSnapshot
 */
export interface GetPageSnapshotOptions {
  /** The site version to fetch (Live or Working) */
  siteVersion?: 'Live' | 'Working'
  /** The locale to fetch the page for */
  locale?: string
}

/**
 * Page data structure returned from Makeswift
 */
export interface PageData {
  id: string
  path: string
  name: string
  locale: string
  localizedVariants: Array<{
    id: string
    path: string
    locale: string
  }>
}

/**
 * Provider props
 */
export interface MakeswiftProviderProps {
  /** Child components */
  children: ReactNode
  /** Optional locale */
  locale?: string
  /** Whether preview mode is enabled */
  previewMode?: boolean
  /** Optional API origin for Makeswift */
  apiOrigin?: string
  /** Optional app origin for Makeswift */
  appOrigin?: string
  /** Runtime instance */
  runtime?: ReactRuntime
}