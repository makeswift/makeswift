/**
 * Utilities for Makeswift site version detection
 */
import { createDraftCookie } from './cookies';
import { MakeswiftSiteVersion } from '@makeswift/runtime';

/**
 * Gets the current site version based on cookies
 */
export async function getSiteVersion(request: Request): Promise<MakeswiftSiteVersion> {
  const cookie = createDraftCookie();
  const cookieValue = await cookie.parse(request.headers.get('Cookie'));
  
  return cookieValue === 'Working' 
    ? MakeswiftSiteVersion.Working 
    : MakeswiftSiteVersion.Live;
}