/**
 * Client utilities for Makeswift in React Router v7 apps
 */
import { MakeswiftClient } from '@makeswift/runtime/react';
import { createRemixAdapter } from './create-adapter';

/**
 * Options for creating a Makeswift client
 */
export interface CreateMakeswiftClientOptions {
  /** Makeswift site API key */
  apiKey: string;
  
  /** Makeswift API origin URL (defaults to https://api.makeswift.com) */
  apiOrigin?: string;
}

/**
 * Creates a Makeswift client for React Router v7 apps
 * 
 * @param options Client configuration options
 * @returns A configured MakeswiftClient
 */
export function createMakeswiftClient(options: CreateMakeswiftClientOptions): MakeswiftClient {
  const { apiKey, apiOrigin = 'https://api.makeswift.com' } = options;
  
  // Create the adapter
  const adapter = createRemixAdapter();
  
  // Create and return the client
  return new MakeswiftClient({
    apiKey,
    apiOrigin: new URL(apiOrigin),
    adapter,
  });
}