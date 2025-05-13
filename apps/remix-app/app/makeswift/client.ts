/**
 * Makeswift client configuration
 */
import { Makeswift } from '@makeswift/runtime';
import { createRemixAdapter } from '@makeswift/remix';
import { runtime } from './runtime';
import { MAKESWIFT_SITE_API_KEY, MAKESWIFT_API_ORIGIN } from './env';

// Create the Remix adapter
const remixAdapter = createRemixAdapter();

// Initialize the Makeswift client
export const client = new Makeswift(MAKESWIFT_SITE_API_KEY, {
  runtime,
  adapter: remixAdapter,
  apiOrigin: MAKESWIFT_API_ORIGIN,
});