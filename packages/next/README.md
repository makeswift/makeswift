# @makeswift/next

Next.js adapter for Makeswift.

## Overview

This package provides Next.js-specific functionality for using Makeswift with Next.js applications. It adapts the framework-agnostic core functionality to work seamlessly with Next.js features like Image optimization, Link prefetching, API routes, and more.

## Features

- **Next.js Image Optimization**: Uses `next/image` for optimized image loading
- **Enhanced Navigation**: Uses `next/link` for client-side navigation
- **API Routes**: Implements Makeswift API handlers as Next.js API routes
- **Draft/Preview Mode**: Integrates with Next.js preview/draft mode for content authoring
- **Cache Management**: Uses Next.js cache tags for efficient revalidation

## Usage

```tsx
import { Makeswift } from '@makeswift/core';
import { createNextAdapter } from '@makeswift/next';
import { ReactRuntime } from '@makeswift/react';

// Create a runtime
const runtime = new ReactRuntime({
  breakpoints: {
    mobile: { width: 575, viewport: 390, label: 'Mobile' },
    tablet: { width: 768, viewport: 765, label: 'Tablet' },
    laptop: { width: 1024, viewport: 1000, label: 'Laptop' },
    desktop: { width: 1280, label: 'Desktop' },
  },
});

// Create a Next.js adapter
const nextAdapter = createNextAdapter();

// Create a Makeswift client
export const client = new Makeswift('YOUR_SITE_API_KEY', {
  runtime,
  adapter: nextAdapter,
});
```