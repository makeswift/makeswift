import { MakeswiftSiteVersion } from '@makeswift/core';

/**
 * Utility function to create a cookie for Remix draft mode
 */
export function createDraftCookie() {
  // This is a stub - in a real implementation, this would
  // create and return a Remix cookie object
  return {
    parse: () => Promise.resolve(null),
    serialize: () => Promise.resolve(''),
  };
}

/**
 * Gets the site version from a Remix request
 */
export async function getSiteVersion(request: Request): Promise<MakeswiftSiteVersion> {
  // This is a stub - in a real implementation, this would
  // extract site version from Remix cookies
  return MakeswiftSiteVersion.Live;
}