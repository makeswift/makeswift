import { RemixAdapter, RemixAdapterOptions } from './adapter';

/**
 * Creates a Remix adapter for Makeswift
 */
export function createRemixAdapter(options?: RemixAdapterOptions): RemixAdapter {
  return new RemixAdapter(options);
}