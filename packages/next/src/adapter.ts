import {
  MakeswiftAdapter,
  FetchOptions,
  HeadElement,
  ImageProps,
  LinkProps,
  StyleRegistry,
  MakeswiftSiteVersion
} from '@makeswift/core';
import { NextImage } from './components/next-image';
import { NextLink } from './components/next-link';
import { MAKESWIFT_CACHE_TAG } from './cache';

/**
 * Options for the Next.js adapter
 */
export interface NextAdapterOptions {
  /* Additional options specific to Next.js */
}

/**
 * Implementation of MakeswiftAdapter for Next.js
 */
export class NextAdapter implements MakeswiftAdapter {
  private options?: NextAdapterOptions;

  constructor(options?: NextAdapterOptions) {
    this.options = options;
  }

  /**
   * Performs a fetch with Next.js specific enhancements
   */
  async fetch(
    path: string,
    options: FetchOptions
  ): Promise<Response> {
    const { apiOrigin, siteVersion, apiKey, ...fetchOptions } = options;
    
    return fetch(new URL(path, apiOrigin).toString(), {
      ...fetchOptions,
      headers: {
        'X-API-Key': apiKey,
        'Makeswift-Site-API-Key': apiKey,
        'Makeswift-Site-Version': siteVersion,
        ...fetchOptions.headers,
      },
      ...(siteVersion === MakeswiftSiteVersion.Working ? { cache: 'no-store' } : {}),
      next: {
        tags: [MAKESWIFT_CACHE_TAG],
      },
    });
  }

  /**
   * Returns the Next.js Image component
   */
  getImageComponent() {
    return NextImage;
  }

  /**
   * Returns the Next.js Link component
   */
  getLinkComponent() {
    return NextLink;
  }

  /**
   * Gets site version from Next.js context
   */
  getSiteVersion(context: unknown): MakeswiftSiteVersion {
    // This is a stub - in a real implementation, this would
    // extract site version from Next.js preview/draft mode
    return MakeswiftSiteVersion.Live;
  }

  /**
   * Renders head elements for Next.js
   */
  renderHead(headElements: HeadElement[]): React.ReactNode {
    // This is a stub - in a real implementation, this would
    // use Next.js head components or metadata API
    return null;
  }

  /**
   * Creates a style registry for Next.js
   */
  createStyleRegistry(): StyleRegistry {
    // This is a stub - in a real implementation, this would
    // create an emotion style registry compatible with Next.js
    return {
      extractStyles: () => ({ css: '', ids: [] }),
      createCache: () => ({}),
    };
  }

  /**
   * Resolves a page path within Next.js
   */
  resolvePagePath(path: string, locale?: string): string {
    // This is a stub - in a real implementation, this would
    // handle Next.js specific path resolution
    return locale ? `/${locale}${path}` : path;
  }
}