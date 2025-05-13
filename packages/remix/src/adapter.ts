import {
  MakeswiftAdapter,
  FetchOptions,
  HeadElement,
  ImageProps,
  LinkProps,
  StyleRegistry,
  MakeswiftSiteVersion
} from '@makeswift/runtime/core';
import { RemixImage } from './components/remix-image';
import { RemixLink } from './components/remix-link';
import { getSiteVersion } from './server/site-version';
import { createStyleRegistry } from './server/style-registry';
import React from 'react';

/**
 * Options for the Remix adapter
 */
export interface RemixAdapterOptions {
  /** Custom base path for API routes */
  apiBasePath?: string;
  
  /** Options for the style registry */
  styleOptions?: {
    key?: string;
  };
}

/**
 * Implementation of MakeswiftAdapter for Remix/React Router v7
 */
export class RemixAdapter implements MakeswiftAdapter {
  private options: RemixAdapterOptions;

  constructor(options: RemixAdapterOptions = {}) {
    this.options = {
      apiBasePath: '/api/makeswift',
      styleOptions: {
        key: 'makeswift',
      },
      ...options,
    };
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
   * Gets site version from a Request object or defaults to Live
   */
  async getSiteVersion(request: Request | unknown): Promise<MakeswiftSiteVersion> {
    // If we received a Request, extract the site version from cookies
    if (request instanceof Request) {
      return getSiteVersion(request);
    }
    
    // Default to Live for any other context
    return MakeswiftSiteVersion.Live;
  }

  /**
   * Renders head elements for React Router app
   */
  renderHead(headElements: HeadElement[]): React.ReactNode {
    return (
      <>
        {headElements.map((element, index) => {
          const { type, props, children } = element;
          
          // Create React element based on the type
          switch (type) {
            case 'title':
              return <title key={index} {...props}>{children}</title>;
              
            case 'meta':
              return <meta key={index} {...props} />;
              
            case 'link':
              return <link key={index} {...props} />;
              
            case 'script':
              return children
                ? <script key={index} {...props} dangerouslySetInnerHTML={{ __html: children }} />
                : <script key={index} {...props} />;
                
            case 'style':
              return <style key={index} {...props} dangerouslySetInnerHTML={{ __html: children || '' }} />;
              
            default:
              return null;
          }
        })}
      </>
    );
  }

  /**
   * Creates a style registry using emotion for Remix
   */
  createStyleRegistry(): StyleRegistry {
    return createStyleRegistry();
  }

  /**
   * Resolves a page path with locale support
   */
  resolvePagePath(path: string, locale?: string): string {
    // Handle root path
    if (path === '/') {
      return locale ? `/${locale}` : '/';
    }
    
    // Handle other paths with locale
    return locale ? `/${locale}${path}` : path;
  }
}