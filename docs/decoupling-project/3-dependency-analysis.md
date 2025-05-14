# Next.js Dependency Analysis

This document provides a comprehensive analysis of Next.js dependencies in the Makeswift runtime package, building on the initial findings outlined in the introduction document. Rather than repeating information, this analysis focuses on specific details of the dependencies and provides additional insights for implementation.

## Table of Contents

1. [Next.js Dependencies](#1-nextjs-dependencies)
2. [Dependency Graph and Relationships](#2-dependency-graph-and-relationships)
3. [Differences Between Pages Router and App Router](#3-differences-between-pages-router-and-app-router)
4. [Decoupling Considerations](#4-decoupling-considerations)
5. [Critical Design Decisions](#5-critical-design-decisions)
6. [Dependency Prioritization](#6-dependency-prioritization)
7. [Testing Strategy](#7-testing-strategy)
8. [Cross-Framework Implementation Examples](#8-cross-framework-implementation-examples) 
9. [Risk Assessment](#9-risk-assessment)
10. [Backward Compatibility](#10-backward-compatibility)

## 1. Next.js Dependencies

### Core Framework Imports

- `next/server`: Used for App Router API routes and middleware
  - `NextRequest`, `NextResponse` - Used in API handlers and middleware
- `next/document`: Used for custom document setup in Pages Router
  - `Html`, `Head`, `Main`, `NextScript` - Components for document customization
- `next/cache`: Used for revalidation 
  - `revalidateTag`, `revalidatePath` - For on-demand revalidation
- `next/navigation`: Used for App Router features
  - `ServerInsertedHTMLContext` - For SSR styling
  - `useServerInsertedHTML` - For injecting styles on the server
- `next/head`: Used for managing `<head>` tags in Pages Router
  - `Head` component - For meta tags, title, etc.
- `next/headers`: Used for cookies and draft mode in App Router 
  - `cookies()`, `draftMode()` - For App Router cookie and draft mode access
- `next/router`: Used for routing in Pages Router
  - `useRouter` - For Pages Router navigation and page information
- `next/image`: Used for image optimization
  - `NextImage` - For optimized images
- `next/legacy/image`: Used for compatibility
  - `NextLegacyImageType` - For legacy image support
- `next/link`: Used for client-side navigation
  - `NextLink` - For client-side navigation
- `next/package.json`: Used for version detection
  - For feature detection based on Next.js version

### Next.js Types

- `NextApiRequest`: Used extensively in API handlers
- `NextApiResponse`: Used extensively in API handlers
- `NextRequest`: Used for App Router API routes
- `NextResponse`: Used for App Router API route responses
- `PreviewData`: Used for accessing preview data in Pages Router

### Hooks and Functions

- **Hooks**
  - `useRouter()`: Used for getting router information in Pages Router
  - `useServerInsertedHTML()`: Used for SSR styling in App Router

- **Functions**
  - `cookies()`: Used for accessing cookies in App Router
  - `draftMode()`: Used for draft mode in App Router
  - `revalidatePath()`: Used for on-demand revalidation in App Router
  - `revalidateTag()`: Used for tag-based revalidation in App Router

### Router-Specific Functionality

- **Pages Router Specific**
  - `useRouter` from 'next/router'
  - `next/head` for managing head tags
  - `previewData` for accessing preview mode data
  - `NextApiRequest`/`NextApiResponse` for API routes
  - Custom `_document.js` implementation

- **App Router Specific**
  - `cookies()` and `draftMode()` from 'next/headers'
  - `useServerInsertedHTML` from 'next/navigation'
  - `NextRequest`/`NextResponse` from 'next/server'
  - `revalidatePath` and `revalidateTag` from 'next/cache'

### API Route Dependencies

The following API handlers rely on Next.js:

1. `/api/makeswift/clear-draft` - Clears preview/draft mode
2. `/api/makeswift/element-tree` - Manages element trees
3. `/api/makeswift/fonts` - Serves custom fonts
4. `/api/makeswift/manifest` - Returns runtime capabilities
5. `/api/makeswift/merge-translated-data` - Manages translations
6. `/api/makeswift/redirect-draft` - Enables draft mode (App Router)
7. `/api/makeswift/redirect-preview` - Enables preview mode (Pages Router)
8. `/api/makeswift/revalidate` - On-demand revalidation
9. `/api/makeswift/translatable-data` - Manages translatable data
10. `/api/makeswift/webhook` - Handles Makeswift service webhooks

### Components with Next.js Dependencies

- `Image` component - Uses `next/image` for optimization
- `Link` component - Uses `next/link` for client-side navigation
- `HeadSnippet` component - Uses Next.js head management
- `BackgroundsContainer` - Uses `next/image` for optimized backgrounds

## 2. Dependency Graph and Relationships

### Core Functionality to Next.js API Mapping

```
+---------------------+     +----------------------+
|                     |     |                      |
| CORE FUNCTIONALITY  |     |  NEXT.JS FEATURES    |
|                     |     |                      |
+---------------------+     +----------------------+
         |                           ^
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| Page rendering -----|--------------+-- next/router
|                     |              |-- _app.js/_document.js
+---------------------+              |
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| Preview/draft mode -|--------------+-- previewData
|                     |              |-- draftMode()
+---------------------+              |-- cookies()
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| API endpoints ------|--------------+-- NextApiRequest/Response
|                     |              |-- NextRequest/Response
+---------------------+              |
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| SSR styling --------|--------------+-- useServerInsertedHTML
|                     |              |-- custom _document.js
+---------------------+              |
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| Head management ----|--------------+-- next/head
|                     |              |-- App Router head management
+---------------------+              |
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| Image handling -----|--------------+-- next/image
|                     |              |-- next/legacy/image
+---------------------+              |
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| Navigation ---------|--------------+-- next/link
|                     |              |
+---------------------+              |
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| Revalidation -------|--------------+-- revalidatePath
|                     |              |-- revalidateTag
+---------------------+              |
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| Locale handling ----|--------------+-- router.locale
|                     |              |-- headers()
+---------------------+              |
```

### Dependency Flow Across Components

```
┌───────────────────────┐      ┌───────────────────────┐
│ React Components      │      │ Next.js Components    │
├───────────────────────┤      ├───────────────────────┤
│                       │      │                       │
│ - Page                │─────►│ - Head                │
│ - Builtin components  │      │ - Image               │
│ - Shared components   │      │ - Link                │
│                       │      │                       │
└───────────────────────┘      └───────────────────────┘
          │                                
          │                                
          ▼                                
┌───────────────────────┐      ┌───────────────────────┐
│ Core State Management │      │ Next.js API Routes    │
├───────────────────────┤      ├───────────────────────┤
│                       │      │                       │
│ - Redux store         │─────►│ - Preview/draft mode  │
│ - Actions/reducers    │◄─────│ - Revalidation        │
│ - API client          │      │ - Webhook handling    │
│                       │      │                       │
└───────────────────────┘      └───────────────────────┘
          │                                
          │                                
          ▼                                
┌───────────────────────┐      ┌───────────────────────┐
│ Runtime Provider      │      │ Next.js Context       │
├───────────────────────┤      ├───────────────────────┤
│                       │      │                       │
│ - ReactRuntimeProvider│─────►│ - Router context      │
│ - Makeswift client    │      │ - App context         │
│ - Element registry    │      │ - Document context    │
│                       │      │                       │
└───────────────────────┘      └───────────────────────┘
```

### Dependency Complexity and Coupling Level

| Makeswift Feature | Coupling Level | Decoupling Difficulty |
|-------------------|----------------|------------------------|
| Page Rendering | High | High |
| Preview/Draft Mode | High | High |
| API Endpoints | High | Medium |
| SSR Styling | High | High |
| Head Management | Medium | Medium |
| Image Handling | Medium | Low |
| Navigation | Medium | Low |
| Revalidation | Medium | Medium |
| Locale Handling | Medium | Medium |

### Must-Have vs. Nice-to-Have Next.js Features

#### Must-Have Features
These features are essential for Makeswift's core functionality:

```
┌─────────────────────────┐
│ MUST-HAVE FEATURES      │
├─────────────────────────┤
│ 1. Server-side rendering│
│ 2. Preview/draft mode   │
│ 3. API route handlers   │
│ 4. Head management      │
│ 5. SSR styling          │
│ 6. Locale support       │
└─────────────────────────┘
```

#### Nice-to-Have Features
These features enhance the experience but are not critical:

```
┌─────────────────────────┐
│ NICE-TO-HAVE FEATURES   │
├─────────────────────────┤
│ 1. Image optimization   │
│ 2. Client-side routing  │
│ 3. On-demand ISR        │
│ 4. Edge runtime support │
│ 5. App/Pages Router     │
│    compatibility        │
└─────────────────────────┘
```

## 3. Differences Between Pages Router and App Router

Next.js has evolved from its original Pages Router to the newer App Router architecture. The Makeswift runtime supports both, but with different implementation patterns. Understanding these differences is crucial for the decoupling effort.

### 1. Preview/Draft Mode

- **Pages Router**:
  - Uses `previewData` from `getStaticProps` or `getServerSideProps`
  - Relies on `setPreviewData()` in API routes
  - Preview data stored in secure cookies automatically managed by Next.js
  - Implementation in `src/next/preview-mode.tsx`

- **App Router**:
  - Uses `draftMode()` from `next/headers`
  - Uses `cookies()` from `next/headers` for cookie management
  - Implementation in `src/next/draft-mode/index.tsx`
  - Manually manages cookie settings

### 2. Head Management

- **Pages Router**:
  - Uses `next/head` component for managing meta tags, titles, etc.
  - Merges multiple `<Head>` declarations automatically
  - Implementation primarily in `src/components/page/HeadSnippet.tsx`

- **App Router**:
  - Uses React's built-in ability to modify document head
  - Renders head tags directly, relying on React 18 features
  - Uses `<head>` component with optional `precedence` prop for stylesheets
  - Implementation in `src/next/components/head-tags.tsx`

### 3. API Routes

- **Pages Router**:
  - Uses `NextApiRequest` and `NextApiResponse` types
  - Files located in `pages/api/` directory
  - Request body parsing handled automatically
  - Implementation in multiple handlers in `src/next/api-handler/handlers/`

- **App Router**:
  - Uses `NextRequest` and `NextResponse` from `next/server`
  - Files use Route Handlers in `app/api/` directory with HTTP method exports
  - More edge-compatible
  - Implementation adapts to detect which router is being used

### 4. Styling

- **Pages Router**:
  - Custom `_document.js` with Emotion cache extraction
  - Implementation in `src/next/document.tsx`
  - Server-side rendering via `getInitialProps`

- **App Router**:
  - Uses `useServerInsertedHTML` hook for style injection
  - Implementation in `src/next/root-style-registry.tsx`
  - Works with React Server Components

### 5. Routing

- **Pages Router**:
  - Uses `useRouter` from `next/router`
  - Router provides locale information directly
  - Implementation in `src/components/hooks/useRouterLocaleSync.ts`

- **App Router**:
  - Uses React Context-based routing
  - Locale determined from URL path or parameters
  - Dynamic routing with more flexible patterns

### 6. Revalidation

- **Pages Router**:
  - Incremental Static Regeneration (ISR) with revalidate property in `getStaticProps`
  - Manual revalidation via custom API routes

- **App Router**:
  - `revalidatePath` and `revalidateTag` from `next/cache`
  - More granular control via tags
  - Implementation in `src/next/api-handler/handlers/revalidate.ts` and `src/next/api-handler/handlers/webhook/site-published.ts`

These differences significantly impact how the abstraction layer must be designed to accommodate both router styles in the Next.js adapter while providing framework-agnostic interfaces for other frameworks.

## 4. Decoupling Considerations

### Core-Adapter Pattern

The recommended architecture is a core-adapter pattern where:

- `@makeswift/runtime` becomes a framework-agnostic core
- `@makeswift/next` provides Next.js-specific adapters
- `@makeswift/remix` provides Remix-specific adapters

### Primary Abstraction Layers

The following layers need abstraction:

| Layer | Current Implementation | Abstraction Strategy | Remix Equivalent |
|-------|------------------------|----------------------|------------------|
| Client | Makeswift class in `src/next/client.ts` | Extract core client functionality with pluggable adapters | Uses Remix loaders and `useLoaderData` hook |
| API Handlers | Next.js API routes | Create abstract request/response interfaces | Remix resource routes with action/loader functions |
| Preview Mode | previewData/draftMode | Abstract through site version provider interface | Cookie-based session via `createCookieSessionStorage` |
| Components | next/image, next/link | Base components with framework-specific implementations | Standard `<img>` with Remix `<Link>` component |
| Head Management | next/head | Serializable head tag structure | Remix `<Meta>` component and meta export functions |
| SSR Styling | Custom document, useServerInsertedHTML | Framework-agnostic style registry | Remix `links` export and `<Links>` component |

## 5. Critical Design Decisions

### 1. API Structure

**Decision needed**: How to structure the API to maintain backward compatibility while enabling new frameworks.

**Options**:
- Direct replacement: `@makeswift/runtime` becomes core, users must install additional adapter
- Bundle compatibility: Core includes compatibility layer for existing users
- Proxy package: `@makeswift/runtime` becomes a thin proxy that re-exports from core + next

**Recommendation**: Bundle compatibility approach provides the smoothest transition path while still enabling a clean architecture long-term.

### 2. Preview/Draft Mode

**Decision needed**: How to abstract the preview/draft mode mechanism across frameworks.

**Options**:
- Cookie-based approach that works across frameworks
- Adapter interface that allows each framework to implement its own mechanism
- Query parameter fallback for frameworks without secure preview

**Recommendation**: Adapter interface with cookie-based implementation for both Next.js and Remix. The interface should focus on the core concept of "site version" rather than framework-specific preview mechanisms.

### 3. SSR Styling

**Decision needed**: How to handle SSR styling across different frameworks.

**Options**:
- Abstract Emotion cache and extraction
- Support both streaming and non-streaming SSR
- Allow framework adapters to inject styles using their preferred method

**Recommendation**: Create a framework-agnostic style registry interface with implementations for both streaming and non-streaming SSR patterns.

## 6. Dependency Prioritization

Based on the difficulty of decoupling and the potential for reuse across multiple frameworks, the following prioritization is recommended:

### Phase 1: Low-Hanging Fruit
1. **Image Component** - Create a base image component that works across frameworks
   - Relatively isolated in the codebase
   - Clear path to abstraction using the adapter pattern
   - Fast win to prove the concept

2. **Link Component** - Abstract navigation components
   - Similar to Image in complexity
   - High value for cross-framework compatibility

### Phase 2: Moderate Complexity
3. **Head Management** - Create serializable head tag structure
   - More complex than components but still straightforward
   - Critical for SEO and metadata across frameworks

4. **API Handler Interface** - Abstract the API handling layer
   - Requires careful design of framework-agnostic interfaces
   - Essential for server-side functionality

### Phase 3: High Complexity
5. **Preview/Draft Mode** - Create site version abstraction
   - Complex due to deep framework integration
   - Essential for core Makeswift functionality

6. **SSR Styling** - Abstract style injection mechanism
   - Highly coupled to framework rendering lifecycle
   - Critical for visual consistency

7. **Revalidation** - Create framework-agnostic cache invalidation
   - Deeply tied to framework caching mechanisms
   - Requires different approaches per framework

This prioritization allows for iterative development with increasing complexity, building confidence and validating the approach before tackling the most challenging dependencies.

## 7. Testing Strategy

Testing a framework-agnostic core with multiple framework adapters requires a comprehensive approach:

### Unit Testing

- **Core Components**: Test core functionality in isolation with mocked framework adapters
  ```typescript
  // Example unit test for core image component
  it('core image resolves correct props for adapters', () => {
    const coreImage = new CoreImage({ src: 'test.jpg', width: 100, height: 100 });
    const props = coreImage.getAdapterProps();
    expect(props).toHaveProperty('src');
    expect(props).toHaveProperty('width');
    expect(props).toHaveProperty('height');
  });
  ```

- **Adapter Implementation**: Test adapter-specific logic with framework testing tools
  ```typescript
  // Example Next.js adapter test
  it('next image adapter renders with correct props', () => {
    renderWithNextContext(<NextImageAdapter src="test.jpg" width={100} height={100} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('test.jpg'));
  });
  ```

### Integration Testing

- **Framework-Specific Tests**: Test each adapter in its native framework environment
  - For Next.js: Use Next.js testing utilities
  - For Remix: Use Remix testing utilities
  
- **Cross-Adapter Compatibility**: Ensure identical behavior across frameworks
  ```typescript
  // Test consistent behavior across frameworks
  function testImageBehavior(adapter) {
    const { rerender } = render(
      <adapter.Image src="test.jpg" width={100} height={100} />
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
    
    // Test responsive behavior
    rerender(<adapter.Image src="test.jpg" layout="responsive" />);
    // Assertions should be identical regardless of framework
  }
  
  it('should behave consistently in Next.js', () => {
    testImageBehavior(nextAdapter);
  });
  
  it('should behave consistently in Remix', () => {
    testImageBehavior(remixAdapter);
  });
  ```

### End-to-End Testing

- **Sample Applications**: Create test applications for each supported framework
  - Basic Next.js app (both Pages and App Router)
  - Basic Remix app
  
- **Feature Matrix Testing**: Verify all features across frameworks
  - Preview mode functionality
  - Styling and head management
  - Component rendering
  - API functionality

### Continuous Integration

- **Matrix Builds**: Test against multiple versions of each framework
  - Next.js: v12, v13, v14+
  - Remix: v1, v2+
  
- **Shared Test Suite**: Core test specifications that run across all adapters
  - Implementation details differ, but expected behaviors should be identical

This testing strategy ensures both framework-specific correctness and cross-framework consistency, critical for a successful decoupling effort.

## 8. Cross-Framework Implementation Examples

The following examples illustrate how key components will be implemented across frameworks after decoupling:

### Image Component

**Core Implementation**:
```typescript
// @makeswift/runtime-core
export interface ImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  layout?: 'fixed' | 'responsive' | 'fill';
  priority?: boolean;
}

export class CoreImage extends React.Component<ImageProps> {
  render() {
    // Delegate to current adapter's implementation
    const ImageAdapter = getRegisteredAdapter('image');
    return <ImageAdapter {...this.props} />;
  }
}
```

**Next.js Adapter**:
```typescript
// @makeswift/next
import NextImage from 'next/image';
import { major as nextMajorVersion } from './next-version';
import type { ImageProps } from '@makeswift/runtime-core';

export function NextImageAdapter(props: ImageProps) {
  const { src, alt = '', width, height, layout, priority } = props;
  
  if (nextMajorVersion < 13) {
    // Next.js 12 and below
    return (
      <NextLegacyImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        layout={layout}
        priority={priority}
      />
    );
  }
  
  // Next.js 13+
  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      style={{ width: '100%', height: 'auto' }}
    />
  );
}

// Register the adapter with the core
registerAdapter('image', NextImageAdapter);
```

**Remix Adapter**:
```typescript
// @makeswift/remix
import type { ImageProps } from '@makeswift/runtime-core';

export function RemixImageAdapter(props: ImageProps) {
  const { src, alt = '', width, height, layout, priority } = props;
  
  // Generate responsive srcSet if needed
  const srcSet = layout === 'responsive' ? generateSrcSet(src) : undefined;
  
  // Set loading priority
  const loading = priority ? 'eager' : 'lazy';
  
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      srcSet={srcSet}
      loading={loading}
      style={{
        width: layout === 'fill' || layout === 'responsive' ? '100%' : undefined,
        height: layout === 'fill' ? '100%' : 'auto',
      }}
    />
  );
}

// Register the adapter with the core
registerAdapter('image', RemixImageAdapter);
```

### Preview/Draft Mode

**Core Implementation**:
```typescript
// @makeswift/runtime-core
export enum SiteVersion {
  Live = 'live',
  Working = 'working',
}

export interface SiteVersionProvider {
  getSiteVersion(): Promise<SiteVersion>;
  enableDraftMode(key: string): Promise<void>;
  disableDraftMode(): Promise<void>;
}

// Core client uses the provider
export class MakeswiftClient {
  constructor(private siteVersionProvider: SiteVersionProvider) {}
  
  async getPageData(pathname: string) {
    const siteVersion = await this.siteVersionProvider.getSiteVersion();
    // Use site version to fetch appropriate data
  }
}
```

**Next.js Adapter (App Router)**:
```typescript
// @makeswift/next
import { cookies, draftMode } from 'next/headers';
import { SiteVersion, SiteVersionProvider } from '@makeswift/runtime-core';

export class NextAppRouterSiteVersionProvider implements SiteVersionProvider {
  async getSiteVersion(): Promise<SiteVersion> {
    const { isEnabled } = await draftMode();
    if (!isEnabled) return SiteVersion.Live;
    
    const cookie = cookies().get(MAKESWIFT_DRAFT_MODE_DATA_COOKIE);
    if (!cookie) return SiteVersion.Live;
    
    try {
      const data = JSON.parse(cookie.value);
      return data.siteVersion || SiteVersion.Live;
    } catch {
      return SiteVersion.Live;
    }
  }
  
  async enableDraftMode(key: string): Promise<void> {
    // Implementation using Next.js App Router draft mode
  }
  
  async disableDraftMode(): Promise<void> {
    // Implementation using Next.js App Router cookies
  }
}
```

**Remix Adapter**:
```typescript
// @makeswift/remix
import { createCookieSessionStorage } from '@remix-run/node';
import { SiteVersion, SiteVersionProvider } from '@makeswift/runtime-core';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'makeswift_draft_mode',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || 'default-secret'],
    secure: process.env.NODE_ENV === 'production',
  },
});

export class RemixSiteVersionProvider implements SiteVersionProvider {
  constructor(private request: Request) {}
  
  async getSiteVersion(): Promise<SiteVersion> {
    const session = await sessionStorage.getSession(
      this.request.headers.get('Cookie')
    );
    
    return session.get('siteVersion') || SiteVersion.Live;
  }
  
  async enableDraftMode(key: string): Promise<void> {
    // Implementation using Remix sessions
  }
  
  async disableDraftMode(): Promise<void> {
    // Implementation using Remix sessions
  }
}
```

These examples demonstrate how the adapter pattern allows for framework-specific implementations while maintaining a consistent core API.

## 9. Risk Assessment

The following matrix assesses the risks associated with each decoupling area:

| Decoupling Area | Technical Risk | Performance Risk | User Migration Risk | Mitigation Strategy |
|-----------------|---------------|------------------|---------------------|---------------------|
| Image Component | ⭐⭐☆☆☆ | ⭐☆☆☆☆ | ⭐☆☆☆☆ | Ensure responsive image optimization is preserved across frameworks |
| Link Component | ⭐☆☆☆☆ | ⭐☆☆☆☆ | ⭐☆☆☆☆ | Maintain prefetching behavior wherever possible |
| Head Management | ⭐⭐⭐☆☆ | ⭐⭐☆☆☆ | ⭐⭐☆☆☆ | Ensure all SEO features work consistently, especially with streaming SSR |
| API Handlers | ⭐⭐⭐⭐☆ | ⭐⭐⭐☆☆ | ⭐⭐⭐☆☆ | Maintain existing API URLs for backward compatibility |
| Preview/Draft Mode | ⭐⭐⭐⭐⭐ | ⭐⭐⭐☆☆ | ⭐⭐⭐⭐☆ | Provide fallback mechanisms for frameworks without built-in preview |
| SSR Styling | ⭐⭐⭐⭐☆ | ⭐⭐⭐⭐☆ | ⭐⭐⭐☆☆ | Address potential Flash of Unstyled Content (FOUC) across frameworks |
| Revalidation | ⭐⭐⭐⭐☆ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐☆☆ | Create adapter-specific optimizations for each framework's cache system |
| Locale Handling | ⭐⭐⭐☆☆ | ⭐⭐☆☆☆ | ⭐⭐☆☆☆ | Support multiple locale detection strategies |

### Critical Risk Areas

1. **Preview/Draft Mode**: Highest technical risk due to deep framework integration
   - **Potential Failure Modes**: Secure cookie handling differences, server/client synchronization
   - **Contingency Plan**: Implement query parameter fallback that works universally

2. **Revalidation**: Highest performance risk due to framework-specific cache optimizations
   - **Potential Failure Modes**: Inefficient cache invalidation, excessive rebuilds
   - **Contingency Plan**: Time-based fallback for frameworks without fine-grained cache control

3. **SSR Styling**: Critical for visual consistency across loading states
   - **Potential Failure Modes**: FOUC, missing styles in SSR
   - **Contingency Plan**: Client-side fallback style injection

### Performance Considerations

The abstraction layer will inevitably add some overhead. Key metrics to monitor:

- **Bundle Size**: Ensure core + adapter is not significantly larger than current solution
- **Time-to-First-Byte (TTFB)**: Monitor for degradation from additional indirection
- **Time-to-Interactive (TTI)**: Ensure client-side hydration remains efficient

Recommended performance benchmarks should be established for each adapter, with a tolerance of no more than 10% degradation from framework-specific implementations.

## 10. Backward Compatibility

### Breaking Changes

Potential breaking changes:

1. **API Route Changes**: Path structure may need to remain compatible
2. **Component Props**: Ensure backward compatibility for Image and Link components
3. **Configuration**: API may change for setup/initialization

### Migration Strategy

1. **Gradual Transition**: Maintain backward compatibility in initial releases
2. **Deprecation Notices**: Add warnings for APIs slated for removal
3. **Migration Guide**: Provide comprehensive documentation
4. **Codemod Tool**: Develop tooling to automate migration where possible

### Support Timeline

To ensure a smooth transition for existing users:

1. **Version Strategy**: Use semver to indicate breaking changes
2. **Deprecation Process**: Mark deprecated APIs and provide clear migration path
3. **Documentation**: Clear guides for migrating from monolithic to adapter approach
4. **Support Timeline**: Establish timeline for supporting legacy patterns

## Conclusion

The dependency analysis reveals significant coupling to Next.js, but with a clear architectural approach, Makeswift can be successfully decoupled. The core-adapter pattern provides flexibility while allowing framework-specific optimizations where needed.

The implementation will require careful consideration of backward compatibility, but will ultimately provide a more flexible and maintainable architecture that can support multiple frameworks beyond Next.js.

By following the prioritization strategy outlined in this document, the team can tackle decoupling incrementally, focusing first on low-risk, high-value components before addressing the more complex dependencies. The comprehensive testing strategy will ensure that functionality remains consistent across frameworks, while the risk assessment highlights areas requiring particular attention during implementation.