/**
 * Enum representing the possible site versions in Makeswift
 */
export enum MakeswiftSiteVersion {
  /**
   * The published version of the site (production)
   */
  Live = 'LIVE',
  
  /**
   * The draft version of the site (preview/development)
   */
  Working = 'WORKING',
}

/**
 * Interface for the site version manager
 */
export interface SiteVersionManager {
  /**
   * Gets the current site version based on framework-specific context
   */
  getSiteVersion(context: unknown): Promise<MakeswiftSiteVersion> | MakeswiftSiteVersion;
  
  /**
   * Enables preview/draft mode
   */
  enablePreviewMode(context: unknown, options?: EnablePreviewOptions): Promise<void> | void;
  
  /**
   * Disables preview/draft mode
   */
  disablePreviewMode(context: unknown): Promise<void> | void;
}

/**
 * Options for enabling preview mode
 */
export interface EnablePreviewOptions {
  /**
   * The secret key used to verify preview requests
   */
  previewSecret?: string;
  
  /**
   * The path to redirect to after enabling preview mode
   */
  redirectPath?: string;
}

/**
 * Creates a basic site version manager that always returns Live
 */
export function createDefaultSiteVersionManager(): SiteVersionManager {
  return {
    getSiteVersion: () => MakeswiftSiteVersion.Live,
    enablePreviewMode: () => {},
    disablePreviewMode: () => {},
  };
}