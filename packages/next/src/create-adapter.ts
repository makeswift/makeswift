import { NextAdapter, NextAdapterOptions } from './adapter';

/**
 * Creates a Next.js adapter for Makeswift
 */
export function createNextAdapter(options?: NextAdapterOptions): NextAdapter {
  return new NextAdapter(options);
}