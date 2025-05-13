// Makeswift client for Remix

// For now, we'll still use the Next.js client as we start the decoupling process
import { Makeswift as NextMakeswift } from '@makeswift/runtime/next'
import type {
  MakeswiftRemixOptions,
  GetPageSnapshotOptions,
  PageData,
} from './types'

/**
 * Makeswift client for Remix integration
 *
 * Currently, this is a thin wrapper around the Next.js client.
 * As we decouple, we'll gradually replace the underlying implementation.
 */
export class Makeswift {
  private client: NextMakeswift

  /**
   * Create a new Makeswift client
   *
   * @param apiKey - The Makeswift site API key
   * @param options - Configuration options
   */
  constructor(apiKey: string, options: MakeswiftRemixOptions) {
    // Initialize the Next.js client which we'll use under the hood for now
    // As we decouple, we'll replace this with direct API calls
    this.client = new NextMakeswift(apiKey, {
      runtime: options.runtime,
      apiOrigin: options.apiOrigin,
    })
  }

  /**
   * Get a page snapshot by path
   *
   * @param path - The page path to fetch
   * @param options - Snapshot options
   * @returns The page snapshot
   */
  async getPageSnapshot(path: string, options?: GetPageSnapshotOptions) {
    try {
      return await this.client.getPageSnapshot(path, {
        siteVersion: options?.siteVersion || 'Live',
        locale: options?.locale,
      })
    } catch (error) {
      console.error('[Makeswift Remix] Error fetching page snapshot:', error)
      return null
    }
  }

  /**
   * Get all pages
   *
   * @returns A promise that resolves to all pages
   */
  async getPages() {
    try {
      return await this.client.getPages()
    } catch (error) {
      console.error('[Makeswift Remix] Error fetching pages:', error)
      // Return an empty array in case of error
      return {
        toArray: () => [] as PageData[],
      }
    }
  }
}
