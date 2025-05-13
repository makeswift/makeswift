import { MakeswiftAdapter } from '@makeswift/runtime/core';
import { RemixAdapter, RemixAdapterOptions } from './adapter';

/**
 * Creates a new Remix adapter instance
 * 
 * This is the recommended way to create a RemixAdapter instance
 * 
 * @param options Options for the Remix adapter
 * @returns A configured MakeswiftAdapter instance
 */
export function createRemixAdapter(options?: RemixAdapterOptions): MakeswiftAdapter {
  return new RemixAdapter(options);
}