# Makeswift Runtime Core Architecture

This document outlines the architecture of the decoupled Makeswift runtime core and its relationship with framework-specific adapters.

## Overview

The Makeswift runtime needs to be decoupled from Next.js to support multiple frameworks, including Remix, while maintaining feature parity and performance. This document details the proposed architecture for achieving this goal.

## Architecture Diagram

```
┌───────────────────────────────────────────────────────────┐
│                 @makeswift/runtime                        │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                      /src/core                      │  │
│  │                                                     │  │
│  │  ┌─────────────┐  ┌────────────────┐  ┌───────────┐ │  │
│  │  │ API Client  │  │ Component Base │  │   State   │ │  │
│  │  └─────────────┘  └────────────────┘  └───────────┘ │  │
│  │                                                     │  │
│  │  ┌─────────────┐  ┌────────────────┐  ┌───────────┐ │  │
│  │  │  Controls   │  │    Adapters    │  │  Builder  │ │  │
│  │  └─────────────┘  └────────────────┘  └───────────┘ │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                     /src/react                      │  │
│  │                                                     │  │
│  │  ┌─────────────┐  ┌────────────────┐  ┌───────────┐ │  │
│  │  │ Components  │  │     Hooks      │  │ Providers │ │  │
│  │  └─────────────┘  └────────────────┘  └───────────┘ │  │
│  │                                                     │  │
│  │  ┌─────────────┐  ┌────────────────┐  ┌───────────┐ │  │
│  │  │  Renderers  │  │ Control Impls  │  │  Runtime  │ │  │
│  │  └─────────────┘  └────────────────┘  └───────────┘ │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
└───────────────────────────────────────────────────────────┘
                          ▼
┌───────────────────────────────────────────────────────────────────┐
│                     Framework Adapters                      │
├─────────────────────┬─────────────────────┬─────────────────┤
│  @makeswift/next    │  @makeswift/remix   │  Other Future   │
│                     │                     │    Adapters     │
│                     │                     │                 │
│  - Next.js API      │  - Remix API        │                 │
│    Routes           │    Routes           │                 │
│  - Next Image       │  - Remix Image      │                 │
│  - Preview Mode     │  - Draft Cookies    │                 │
│  - Head Management  │  - Meta API         │                 │
│  - Cache Tags       │  - Cache Control    │                 │
└─────────────────────┴─────────────────────┴─────────────────┘
                          ▲
                          │
                          │ uses
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     Applications                            │
├─────────────────────┬─────────────────────┬─────────────────┤
│   Next.js App &     │      Remix App      │  Other Framework│
│   Pages Router      │                     │     Apps        │
└─────────────────────┴─────────────────────┴─────────────────┘
```

## Main Package: @makeswift/runtime

The `@makeswift/runtime` package contains both framework-agnostic core functionality and React-specific implementations, providing abstractions that can be implemented by framework-specific adapters. It is organized into two main subdirectories: `/src/core` for framework-agnostic functionality and `/src/react` for React-specific (but still framework-agnostic) functionality.

### Key Components

#### 1. API Client

The API client will be responsible for communication with the Makeswift API, but will delegate framework-specific concerns to adapters:

```typescript
export class Makeswift {
  constructor(
    apiKey: string,
    {
      adapter,
      apiOrigin = 'https://api.makeswift.com',
      runtime,
    }: {
      adapter: MakeswiftAdapter;
      apiOrigin?: string;
      runtime: ReactRuntime;
    }
  ) {
    this.adapter = adapter;
    this.apiKey = apiKey;
    this.apiOrigin = new URL(apiOrigin);
    this.runtime = runtime;
  }

  async getPageSnapshot(
    pathname: string,
    {
      siteVersion,
      locale,
      allowLocaleFallback = true,
    }: {
      siteVersion: MakeswiftSiteVersion;
      locale?: string;
      allowLocaleFallback?: boolean;
    }
  ): Promise<MakeswiftPageSnapshot | null> {
    // Core implementation using adapter for fetch
    const response = await this.adapter.fetch(
      `v3/pages/${encodeURIComponent(pathname)}`,
      {
        siteVersion,
        locale,
        allowLocaleFallback,
      }
    );
    
    // Process response...
  }
  
  // Other methods...
}
```

#### 2. Adapter Interface

A well-defined interface for framework-specific adapters:

```typescript
export interface MakeswiftAdapter {
  // Networking
  fetch(path: string, options: FetchOptions): Promise<Response>;
  
  // Site Version
  getSiteVersion(context: unknown): Promise<MakeswiftSiteVersion>;
  
  // Component Rendering
  getImageComponent(): React.ComponentType<ImageProps>;
  getLinkComponent(): React.ComponentType<LinkProps>;
  
  // Head Management
  renderHead(headElements: HeadElement[]): React.ReactNode;
  
  // Style Management
  createStyleRegistry(): StyleRegistry;
  
  // Routing
  resolvePagePath(path: string, locale?: string): string;
}
```

#### 3. Base Components

Framework-agnostic base components that can be extended by adapters:

```typescript
// Base Image component
export function BaseImage({
  src,
  alt,
  width,
  height,
  style,
  ...props
}: BaseImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={style}
      {...props}
    />
  );
}

// Base Link component
export function BaseLink({
  href,
  children,
  ...props
}: BaseLinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
```

#### 4. Page Renderer

A framework-agnostic page renderer that uses adapter-provided components:

```typescript
export function PageRenderer({
  snapshot,
  adapter,
}: {
  snapshot: MakeswiftPageSnapshot;
  adapter: MakeswiftAdapter;
}) {
  const { document } = snapshot;
  const components = {
    Image: adapter.getImageComponent(),
    Link: adapter.getLinkComponent(),
    // Other components...
  };

  return (
    <>
      {adapter.renderHead(createHeadElements(document.meta))}
      <RenderElement 
        element={document.data} 
        components={components} 
      />
    </>
  );
}
```

### State Management

The core will maintain a framework-agnostic state management system using Redux, which is already used in the current implementation:

```typescript
export function createStore() {
  return createReduxStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
  );
}

export interface ReactRuntimeOptions {
  breakpoints: Record<string, Breakpoint>;
}

export class ReactRuntime {
  store: Store;
  
  constructor(options: ReactRuntimeOptions) {
    this.store = createStore();
    this.store.dispatch(setBreakpoints(options.breakpoints));
  }
  
  // Methods for component registration, etc.
}
```

## Framework Adapters

Framework adapters will implement the adapter interface and provide framework-specific functionality.

### Next.js Adapter

```typescript
export class NextAdapter implements MakeswiftAdapter {
  constructor(options?: NextAdapterOptions) {
    this.options = options;
  }

  async getSiteVersion(context: GetServerSidePropsContext | undefined): Promise<MakeswiftSiteVersion> {
    // Use Next.js preview data
    return context?.previewData 
      ? MakeswiftSiteVersion.Working 
      : MakeswiftSiteVersion.Live;
  }

  getImageComponent(): React.ComponentType<ImageProps> {
    return NextImage;
  }

  getLinkComponent(): React.ComponentType<LinkProps> {
    return NextLink;
  }

  async fetch(path: string, options: FetchOptions): Promise<Response> {
    // Use Next.js cache tags
    return fetch(new URL(path, options.apiOrigin).toString(), {
      // ...
      next: {
        tags: [MAKESWIFT_CACHE_TAG],
      },
    });
  }

  // Other implementations...
}
```

### Remix Adapter

```typescript
export class RemixAdapter implements MakeswiftAdapter {
  constructor(options?: RemixAdapterOptions) {
    this.options = options;
  }

  async getSiteVersion(request: Request): Promise<MakeswiftSiteVersion> {
    // Use Remix cookies
    const cookie = createDraftCookie();
    const cookieValue = await cookie.parse(request.headers.get('Cookie'));
    
    return cookieValue === 'Working' 
      ? MakeswiftSiteVersion.Working 
      : MakeswiftSiteVersion.Live;
  }

  getImageComponent(): React.ComponentType<ImageProps> {
    return RemixImage;
  }

  getLinkComponent(): React.ComponentType<LinkProps> {
    return RemixLink;
  }

  async fetch(path: string, options: FetchOptions): Promise<Response> {
    // Standard fetch without Next.js specific options
    return fetch(new URL(path, options.apiOrigin).toString(), {
      headers: {
        'X-API-Key': options.apiKey,
        'Makeswift-Site-Version': options.siteVersion,
      },
      // Cache control based on site version
      cache: options.siteVersion === MakeswiftSiteVersion.Working 
        ? 'no-store' 
        : 'default',
    });
  }

  // Other implementations...
}
```

## API Routes and Handlers

The core package will provide pure function handlers that can be exposed through framework-specific routing:

```typescript
export interface MakeswiftApiHandlerContext {
  runtime: ReactRuntime;
  apiKey: string;
  apiOrigin?: string;
  appOrigin?: string;
  getFonts?: () => FontDefinition[];
}

export class MakeswiftApiHandlerCore {
  constructor(context: MakeswiftApiHandlerContext) {
    this.context = context;
  }

  async handleManifest(
    request: MakeswiftRequest
  ): Promise<MakeswiftResponse> {
    // Implementation...
  }

  async handleFonts(
    request: MakeswiftRequest
  ): Promise<MakeswiftResponse> {
    // Implementation...
  }

  async handleRevalidate(
    request: MakeswiftRequest
  ): Promise<MakeswiftResponse> {
    // Core implementation that adapters can use
  }

  // Other handlers...
}
```

## Draft/Preview Mode

The core will define a standard interface for managing site versions, while adapters will implement framework-specific mechanisms:

```typescript
// Core definition
export enum MakeswiftSiteVersion {
  Live = 'LIVE',
  Working = 'WORKING',
}

// Next.js implementation in adapter
export function getSiteVersionFromNextContext(
  context: GetServerSidePropsContext
): MakeswiftSiteVersion {
  return context.previewData?.makeswift?.siteVersion ?? MakeswiftSiteVersion.Live;
}

// Remix implementation in adapter
export async function getSiteVersionFromRemixRequest(
  request: Request
): Promise<MakeswiftSiteVersion> {
  const cookie = createDraftCookie();
  const value = await cookie.parse(request.headers.get('Cookie'));
  return value === 'Working' 
    ? MakeswiftSiteVersion.Working 
    : MakeswiftSiteVersion.Live;
}
```

## Head Management

The core will generate a structured representation of head elements, and adapters will handle rendering:

```typescript
// Core representation
export type HeadElement = {
  type: 'title' | 'meta' | 'link' | 'script' | 'style';
  props: Record<string, any>;
  children?: string;
};

export function createHeadElements(meta: PageMeta): HeadElement[] {
  return [
    { type: 'title', children: meta.title || '' },
    { type: 'meta', props: { name: 'description', content: meta.description || '' } },
    // Other elements...
  ];
}

// Next.js implementation
export function renderHeadInNext(elements: HeadElement[]): React.ReactNode {
  return (
    <Head>
      {elements.map((element, index) => {
        switch (element.type) {
          case 'title':
            return <title key={index}>{element.children}</title>;
          case 'meta':
            return <meta key={index} {...element.props} />;
          // Other cases...
        }
      })}
    </Head>
  );
}

// Remix implementation uses the meta export
export function createRemixMeta(elements: HeadElement[]): MetaFunction {
  return () => {
    return elements.reduce((acc, element) => {
      if (element.type === 'title') {
        acc.title = element.children || '';
      } else if (element.type === 'meta') {
        acc[element.props.name || element.props.property] = element.props.content;
      }
      // Other conversions...
      return acc;
    }, {} as Record<string, string>);
  };
}
```

## CSS-in-JS Integration

The core will provide styling utilities, while adapters handle framework-specific integration:

```typescript
// Core interface
export interface StyleRegistry {
  extractStyles(): { css: string; ids: string[] };
  createCache(): EmotionCache;
}

// Next.js implementation
export class NextStyleRegistry implements StyleRegistry {
  cache: EmotionCache;

  constructor() {
    this.cache = createEmotionCache();
  }

  extractStyles() {
    // Use @emotion/server
    const { html, ids } = extractCritical(/* rendered HTML */);
    return { css: html, ids };
  }

  createCache() {
    return this.cache;
  }
}

// Remix implementation
export class RemixStyleRegistry implements StyleRegistry {
  cache: EmotionCache;

  constructor() {
    this.cache = createEmotionCache();
  }

  extractStyles() {
    // Similar to Next.js but adapted for Remix
    const extracted = extractCritical(/* rendered HTML */);
    return { css: extracted.css, ids: extracted.ids };
  }

  createCache() {
    return this.cache;
  }
}
```

## Separation of Server/Client Code

The core must be careful about code splitting to avoid including server-only code in client bundles:

```typescript
// server.ts - Server-only exports
export { MakeswiftApiHandlerCore } from './core/api-handler';
export { getSiteVersion } from './core/site-version';

// client.ts - Client-side exports
export { ReactRuntimeProvider } from './react/runtime-provider';
export { PageRenderer } from './react/page-renderer';

// index.ts - Common exports
export { MakeswiftSiteVersion } from './core/types';
export { type MakeswiftAdapter } from './core/adapter';
export { ReactRuntime } from './react/runtime';
```

## Conclusion

This architecture provides a clear separation between framework-agnostic core functionality and framework-specific implementations. By defining clean interfaces for adapters, we can maintain consistent behavior across frameworks while allowing each adapter to leverage framework-specific features for optimal performance and developer experience.

The proposed architecture enables Makeswift to support multiple React frameworks with minimal code duplication, ensuring that new features can be developed once in the core and automatically benefit all supported frameworks.