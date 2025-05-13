/**
 * Cookie utilities for Makeswift in Remix
 */
import { createCookie } from '@remix-run/node';

/**
 * Cookie name for Makeswift site version
 */
export const MAKESWIFT_SITE_VERSION_COOKIE = 'makeswift-site-version';

/**
 * Creates a cookie for storing Makeswift site version
 * 
 * @returns Remix cookie object
 */
export function createDraftCookie() {
  return createCookie(MAKESWIFT_SITE_VERSION_COOKIE, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}