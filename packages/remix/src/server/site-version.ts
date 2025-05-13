/**
 * Utilities for handling Makeswift site version in Remix
 */
import { MakeswiftSiteVersion } from '@makeswift/runtime';
import { createDraftCookie } from './cookies';

/**
 * Gets the site version from a Remix request
 * 
 * @param request The Remix request object
 * @returns The current site version
 */
export async function getSiteVersion(request: Request): Promise<MakeswiftSiteVersion> {
  const cookie = createDraftCookie();
  const cookieValue = await cookie.parse(request.headers.get('Cookie'));
  
  return cookieValue === 'Working' 
    ? MakeswiftSiteVersion.Working 
    : MakeswiftSiteVersion.Live;
}