/**
 * The MakeswiftAdapter interface defines the contract that all framework adapters must implement.
 * This interface provides methods for framework-specific functionality like fetching, site version detection,
 * component rendering, and more.
 */
export interface MakeswiftAdapter {
  /**
   * Performs an HTTP request with framework-specific enhancements
   */
  fetch(
    path: string,
    options: FetchOptions
  ): Promise<Response>;
  
  /**
   * Returns the Image component implementation for the framework
   */
  getImageComponent(): React.ComponentType<ImageProps>;
  
  /**
   * Returns the Link component implementation for the framework
   */
  getLinkComponent(): React.ComponentType<LinkProps>;
  
  /**
   * Returns the site version based on framework-specific context
   */
  getSiteVersion(context: unknown): Promise<MakeswiftSiteVersion> | MakeswiftSiteVersion;
  
  /**
   * Renders head elements for the framework
   */
  renderHead(headElements: HeadElement[]): React.ReactNode;
  
  /**
   * Creates a style registry for the framework
   */
  createStyleRegistry(): StyleRegistry;
  
  /**
   * Resolves a page path within the framework
   */
  resolvePagePath(path: string, locale?: string): string;
}

/**
 * Options for the fetch adapter method
 */
export interface FetchOptions {
  /** The API key for authentication */
  apiKey: string;
  
  /** The API origin URL */
  apiOrigin: URL;
  
  /** The site version (live or working) */
  siteVersion: MakeswiftSiteVersion;
  
  /** The locale for localized content */
  locale?: string | null;
  
  /** Allow fallback to the default locale */
  allowLocaleFallback?: boolean;
  
  /** Additional headers */
  headers?: Record<string, string>;
  
  /** HTTP method */
  method?: string;
  
  /** Request body */
  body?: BodyInit;
}

/**
 * Placeholder for image component props, to be defined in more detail
 */
export interface ImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  layout?: 'fixed' | 'responsive' | 'fill';
  objectFit?: 'contain' | 'cover' | 'fill';
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  [key: string]: any;
}

/**
 * Placeholder for link component props, to be defined in more detail
 */
export interface LinkProps {
  href: string;
  children?: React.ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  [key: string]: any;
}

/**
 * Defines a head element to be rendered in the document head
 */
export interface HeadElement {
  type: 'title' | 'meta' | 'link' | 'script' | 'style';
  props: Record<string, any>;
  children?: string;
}

/**
 * Interface for style registries
 */
export interface StyleRegistry {
  extractStyles(): { css: string; ids: string[] };
  createCache(): any; // Will be properly typed based on emotion's cache
}

/**
 * Site versions supported by Makeswift
 */
export enum MakeswiftSiteVersion {
  Live = 'LIVE',
  Working = 'WORKING',
}