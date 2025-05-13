/**
 * Client utilities for Makeswift in React Router v7 apps
 */
import { createRemixAdapter } from './create-adapter';

// Import the client constructor from the runtime package
const { ReactRuntime } = require('@makeswift/runtime/react');

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
 * @returns A configured Makeswift client
 */
export function createMakeswiftClient(options: CreateMakeswiftClientOptions) {
  const { apiKey, apiOrigin = 'https://api.makeswift.com' } = options;
  
  // Create the adapter
  const adapter = createRemixAdapter();
  
  // Create and return the client
  return new ReactRuntime.Client({
    apiKey,
    apiOrigin: new URL(apiOrigin),
    adapter,
  });
}