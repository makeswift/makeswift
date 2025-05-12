import {
  MakeswiftAdapter,
  FetchOptions,
  HeadElement,
  ImageProps,
  LinkProps,
  StyleRegistry,
  MakeswiftSiteVersion
} from '@makeswift/core';
import { RemixImage } from './components/remix-image';
import { RemixLink } from './components/remix-link';

/**
 * Options for the Remix adapter
 */
export interface RemixAdapterOptions {
  /* Additional options specific to Remix */
}

/**
 * Implementation of MakeswiftAdapter for Remix
 */
export class RemixAdapter implements MakeswiftAdapter {
  private options?: RemixAdapterOptions;

  constructor(options?: RemixAdapterOptions) {
    this.options = options;
  }

  /**
   * Performs a fetch with Remix specific handling
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
    });
  }

  /**
   * Returns the Remix Image component
   */
  getImageComponent() {
    return RemixImage;
  }

  /**
   * Returns the Remix Link component
   */
  getLinkComponent() {
    return RemixLink;
  }

  /**
   * Gets site version from Remix context (usually a request)
   */
  async getSiteVersion(request: Request): Promise<MakeswiftSiteVersion> {
    // This is a stub - in a real implementation, this would
    // extract site version from Remix cookies
    return MakeswiftSiteVersion.Live;
  }

  /**
   * Creates meta objects for Remix
   */
  renderHead(headElements: HeadElement[]): React.ReactNode {
    // This is a stub - in a real implementation, this would
    // transform head elements into Remix meta exports
    return null;
  }

  /**
   * Creates a style registry for Remix
   */
  createStyleRegistry(): StyleRegistry {
    // This is a stub - in a real implementation, this would
    // create an emotion style registry compatible with Remix
    return {
      extractStyles: () => ({ css: '', ids: [] }),
      createCache: () => ({}),
    };
  }

  /**
   * Resolves a page path within Remix
   */
  resolvePagePath(path: string, locale?: string): string {
    // This is a stub - in a real implementation, this would
    // handle Remix specific path resolution
    return locale ? `/${locale}${path}` : path;
  }
}