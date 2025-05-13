/**
 * Utilities for Makeswift site version detection
 */
import { createDraftCookie } from './cookies';

// Define site version type directly to avoid import issues with @makeswift/runtime
export type MakeswiftSiteVersion = 'published' | 'current' | string;

/**
 * Gets the current site version based on cookies
 */
export async function getSiteVersion(request: Request): Promise<MakeswiftSiteVersion> {
  const cookie = createDraftCookie();
  const cookieValue = await cookie.parse(request.headers.get('Cookie'));
  
  return cookieValue === 'Working' 
    ? 'current' 
    : 'published';
}