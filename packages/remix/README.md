# @makeswift/remix

Remix adapter for Makeswift.

## Overview

This package provides Remix-specific functionality for using Makeswift with Remix applications. It adapts the framework-agnostic core functionality to work seamlessly with Remix features like loaders, resource routes, meta API, and more.

## Features

- **Remix Link Integration**: Uses Remix Link for enhanced navigation
- **Resource Routes**: Implements Makeswift API handlers as Remix resource routes
- **Meta API**: Integrates with Remix's meta system for head management
- **Draft Mode**: Cookie-based draft mode implementation
- **Loaders & Actions**: Integration with Remix's data fetching system

## Usage

```tsx
import { Makeswift } from '@makeswift/core';
import { createRemixAdapter } from '@makeswift/remix';
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

// Create a Remix adapter
const remixAdapter = createRemixAdapter();

// Create a Makeswift client
export const client = new Makeswift('YOUR_SITE_API_KEY', {
  runtime,
  adapter: remixAdapter,
});
```