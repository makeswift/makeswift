import { MakeswiftSiteVersion } from '@makeswift/core';

/**
 * Gets the site version from Next.js server context
 */
export function getSiteVersion(context?: any): MakeswiftSiteVersion {
  // This is a stub - in a real implementation, this would
  // extract site version from Next.js draft mode or preview data
  return MakeswiftSiteVersion.Live;
}