/**
 * Core exports for framework-agnostic functionality
 * This file serves as the entry point for the core package
 */

// Export essential types and interfaces
export type { MakeswiftAdapter, FetchOptions, ImageProps, LinkProps, HeadElement, StyleRegistry } from './adapter';
export { MakeswiftSiteVersion } from './adapter';

// Export API client
export * from './api';

// Export element types and utilities
export * from './element';

// Export state management
export * from './state';

// Export site version utilities
export * from './site-version';