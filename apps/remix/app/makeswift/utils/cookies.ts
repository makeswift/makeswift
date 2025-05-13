/**
 * Cookie utilities for Makeswift
 */
import { createCookie } from '@remix-run/node';

/**
 * Creates a cookie for storing the Makeswift site version
 */
export function createDraftCookie() {
  return createCookie('makeswift-site-version', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // Set to true for production
    // 1 week expiration
    maxAge: 60 * 60 * 24 * 7,
  });
}