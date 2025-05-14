# Next.js Dependency Analysis and Decoupling Strategy

This document provides a comprehensive analysis of Next.js dependencies in the Makeswift runtime package and outlines the strategy for decoupling the runtime from Next.js.

## Table of Contents

1. [Next.js Dependencies](#1-nextjs-dependencies)
2. [Dependency Graph and Relationships](#2-dependency-graph-and-relationships)
3. [Differences Between Pages Router and App Router](#3-differences-between-pages-router-and-app-router)
4. [Decoupling Strategy](#4-decoupling-strategy)
5. [Critical Design Decisions](#5-critical-design-decisions)
6. [Backward Compatibility](#6-backward-compatibility)

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
| Page rendering <----|--------------+-- next/router
|                     |              |-- _app.js/_document.js
+---------------------+              |
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| Preview/draft mode <|--------------+-- previewData
|                     |              |-- draftMode()
+---------------------+              |-- cookies()
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| API endpoints <-----|--------------+-- NextApiRequest/Response
|                     |              |-- NextRequest/Response
+---------------------+              |
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| SSR styling <-------|--------------+-- useServerInsertedHTML
|                     |              |-- custom _document.js
+---------------------+              |
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| Head management <---|--------------+-- next/head
|                     |              |-- App Router head management
+---------------------+              |
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| Image handling <----|--------------+-- next/image
|                     |              |-- next/legacy/image
+---------------------+              |
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| Navigation <--------|--------------+-- next/link
|                     |              |
+---------------------+              |
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| Revalidation <------|--------------+-- revalidatePath
|                     |              |-- revalidateTag
+---------------------+              |
         |                           |
         v                           |
+---------------------+              |
|                     |              |
| Locale handling <---|--------------+-- router.locale
|                     |              |-- headers()
+---------------------+              |
```

### Dependency Flow Across Components

```
┌───────────────────────┐      ┌───────────────────────┐
│ React Components      │      │ Next.js Components    │
├───────────────────────┤      ├───────────────────────┤
│                       │      │                       │
│ - Page                │◄────►│ - Head                │
│ - Builtin components  │      │ - Image               │
│ - Shared components   │      │ - Link                │
│                       │      │                       │
└───────────────────────┘      └───────────────────────┘
          ▲                               ▲
          │                               │
          │                               │
          ▼                               ▼
┌───────────────────────┐      ┌───────────────────────┐
│ Core State Management │      │ Next.js API Routes    │
├───────────────────────┤      ├───────────────────────┤
│                       │      │                       │
│ - Redux store         │◄────►│ - Preview/draft mode  │
│ - Actions/reducers    │      │ - Revalidation        │
│ - API client          │      │ - Webhook handling    │
│                       │      │                       │
└───────────────────────┘      └───────────────────────┘
          ▲                               ▲
          │                               │
          │                               │
          ▼                               ▼
┌───────────────────────┐      ┌───────────────────────┐
│ Runtime Provider      │      │ Next.js Context       │
├───────────────────────┤      ├───────────────────────┤
│                       │      │                       │
│ - ReactRuntimeProvider│◄────►│ - Router context      │
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

## 4. Decoupling Strategy

### Core-Adapter Pattern

The recommended architecture is a core-adapter pattern where:

- `@makeswift/runtime` becomes a framework-agnostic core
- `@makeswift/next` provides Next.js-specific adapters
- `@makeswift/remix` provides Remix-specific adapters

### Primary Abstraction Layers

The following layers need abstraction:

| Layer | Current Implementation | Abstraction Strategy |
|-------|------------------------|----------------------|
| Client | Makeswift class in `src/next/client.ts` | Extract core client functionality with pluggable adapters |
| API Handlers | Next.js API routes | Create abstract request/response interfaces |
| Preview Mode | previewData/draftMode | Abstract through site version provider interface |
| Components | next/image, next/link | Base components with framework-specific implementations |
| Head Management | next/head | Serializable head tag structure |
| SSR Styling | Custom document, useServerInsertedHTML | Framework-agnostic style registry |

### Implementation Phases

The implementation should follow these phases:

1. **Core Extraction**: Extract framework-agnostic code
2. **Interface Definition**: Create clear adapter interfaces
3. **Next.js Adapter**: Implement the Next.js adapter (maintaining compatibility)
4. **Remix Adapter**: Implement the Remix adapter as proof of concept
5. **Documentation & Testing**: Comprehensive documentation and test suite

## 4. Critical Design Decisions

### 1. API Structure

**Decision needed**: How to structure the API to maintain backward compatibility while enabling new frameworks.

**Options**:
- Direct replacement: `@makeswift/runtime` becomes core, users must install additional adapter
- Bundle compatibility: Core includes compatibility layer for existing users
- Proxy package: `@makeswift/runtime` becomes a thin proxy that re-exports from core + next

### 2. Preview/Draft Mode

**Decision needed**: How to abstract the preview/draft mode mechanism across frameworks.

**Options**:
- Cookie-based approach that works across frameworks
- Adapter interface that allows each framework to implement its own mechanism
- Query parameter fallback for frameworks without secure preview

### 3. SSR Styling

**Decision needed**: How to handle SSR styling across different frameworks.

**Options**:
- Abstract Emotion cache and extraction
- Support both streaming and non-streaming SSR
- Allow framework adapters to inject styles using their preferred method

## 5. Critical Design Decisions

### 1. API Structure

**Decision needed**: How to structure the API to maintain backward compatibility while enabling new frameworks.

**Options**:
- Direct replacement: `@makeswift/runtime` becomes core, users must install additional adapter
- Bundle compatibility: Core includes compatibility layer for existing users
- Proxy package: `@makeswift/runtime` becomes a thin proxy that re-exports from core + next

### 2. Preview/Draft Mode

**Decision needed**: How to abstract the preview/draft mode mechanism across frameworks.

**Options**:
- Cookie-based approach that works across frameworks
- Adapter interface that allows each framework to implement its own mechanism
- Query parameter fallback for frameworks without secure preview

### 3. SSR Styling

**Decision needed**: How to handle SSR styling across different frameworks.

**Options**:
- Abstract Emotion cache and extraction
- Support both streaming and non-streaming SSR
- Allow framework adapters to inject styles using their preferred method

## 6. Backward Compatibility

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