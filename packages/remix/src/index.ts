/**
 * Makeswift Remix adapter
 */

// Export adapter
export { RemixAdapter, type RemixAdapterOptions } from './adapter';
export { createRemixAdapter } from './create-adapter';

// Export client utilities
export { createMakeswiftClient, type CreateMakeswiftClientOptions } from './client';

// Export components
export { MakeswiftPage } from './page';
export { RemixImage } from './components/remix-image';
export { RemixLink } from './components/remix-link';
export { RemixRuntimeProvider, useRemixRuntime } from './components/runtime-provider';
export { MakeswiftStyles } from './components/styles';

// Re-export server utilities
export * from './server';