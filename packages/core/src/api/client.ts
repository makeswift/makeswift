import { MakeswiftAdapter, FetchOptions } from '../adapter';
import { MakeswiftSiteVersion } from '../site-version';
import { CacheData } from './types';

/**
 * Configuration options for the Makeswift client
 */
export interface MakeswiftConfig {
  /** Framework-specific adapter */
  adapter: MakeswiftAdapter;
  
  /** Optional API origin URL */
  apiOrigin?: string;
  
  /** ReactRuntime instance */
  runtime: any; // This will be properly typed once we have the ReactRuntime type
}

/**
 * Result of a page snapshot request
 */
export interface MakeswiftPageSnapshot {
  document: MakeswiftPageDocument;
  cacheData: CacheData;
}

/**
 * Page document returned from the API
 */
export interface MakeswiftPageDocument {
  id: string;
  site: { id: string };
  data: any; // Element data
  snippets: Array<{
    id: string;
    code: string;
    location: 'HEAD' | 'BODY';
    liveEnabled: boolean;
    builderEnabled: boolean;
    cleanup: string | null;
  }>;
  fonts: Array<{
    family: string;
    variants: string[];
  }>;
  meta: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    socialImage?: {
      id: string;
      publicUrl: string;
      mimetype: string;
    } | null;
    favicon?: {
      id: string;
      publicUrl: string;
      mimetype: string;
    } | null;
  };
  seo: {
    canonicalUrl?: string | null;
    isIndexingBlocked?: boolean | null;
  };
  localizedPages: Array<{
    id: string;
    data: any; // Element data
    elementTreeId: string;
    parentId: string | null;
    meta: Omit<MakeswiftPageDocument['meta'], 'favicon'>;
    seo: MakeswiftPageDocument['seo'];
  }>;
  locale: string | null;
}

/**
 * Options for getPageSnapshot method
 */
export interface GetPageSnapshotOptions {
  siteVersion: MakeswiftSiteVersion | Promise<MakeswiftSiteVersion>;
  locale?: string;
  allowLocaleFallback?: boolean;
}

/**
 * The base Makeswift client for API interactions
 */
export class Makeswift {
  private apiKey: string;
  private apiOrigin: URL;
  private adapter: MakeswiftAdapter;
  private runtime: any; // Will be typed properly once we have the ReactRuntime type

  constructor(apiKey: string, config: MakeswiftConfig) {
    if (typeof apiKey !== 'string') {
      throw new Error(
        'The Makeswift client must be passed a valid Makeswift site API key: ' +
          "`new Makeswift('<makeswift_site_api_key>')`\n" +
          `Received "${apiKey}" instead.`
      );
    }

    this.apiKey = apiKey;

    try {
      this.apiOrigin = new URL(config.apiOrigin || 'https://api.makeswift.com');
    } catch {
      throw new Error(
        `The Makeswift client received an invalid \`apiOrigin\` parameter: "${config.apiOrigin}".`
      );
    }

    this.adapter = config.adapter;
    this.runtime = config.runtime;
  }

  /**
   * Fetches a page snapshot from the API
   */
  async getPageSnapshot(
    pathname: string,
    options: GetPageSnapshotOptions
  ): Promise<MakeswiftPageSnapshot | null> {
    const queryParams = new URLSearchParams();
    
    if (options.locale) {
      queryParams.set('locale', options.locale);
    }
    
    if (options.allowLocaleFallback != null) {
      queryParams.set('allowLocaleFallback', `${options.allowLocaleFallback}`);
    }
    
    const siteVersion = await options.siteVersion;
    
    try {
      const response = await this.adapter.fetch(
        `v3/pages/${encodeURIComponent(pathname)}/document?${queryParams.toString()}`,
        {
          apiKey: this.apiKey,
          apiOrigin: this.apiOrigin,
          siteVersion,
          locale: options.locale,
          allowLocaleFallback: options.allowLocaleFallback,
        }
      );

      if (!response.ok) {
        if (response.status === 404) return null;

        const errorBody = await this.extractResponseError(response);
        console.error(`Failed to get page snapshot for '${pathname}'`, {
          response: errorBody,
          siteVersion,
          locale: options.locale,
        });

        throw new Error(`Failed to get page snapshot for '${pathname}': ${response.status} ${response.statusText}`);
      }

      const document: MakeswiftPageDocument = await response.json();
      
      // In a real implementation, we would do introspection here to build cacheData
      // For now, we'll return a stub
      const cacheData: CacheData = {
        apiResources: {
          Swatch: [],
          File: [],
          Typography: [],
          Table: [],
          PagePathnameSlice: [],
          GlobalElement: [],
          LocalizedGlobalElement: [],
        },
        localizedResourcesMap: {},
      };

      return {
        document,
        cacheData,
      };
    } catch (error) {
      console.error(`Error fetching page snapshot for '${pathname}':`, error);
      throw error;
    }
  }

  /**
   * Extracts error information from a response
   */
  private async extractResponseError(response: Response): Promise<unknown> {
    try {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    } catch (e) {
      return `Failed to extract response body: ${e}`;
    }
  }
}