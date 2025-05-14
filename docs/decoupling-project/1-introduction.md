# Makeswift Decoupling Project: Introduction

This document outlines the initial project proposal and high-level strategy for decoupling the Makeswift runtime from Next.js. It serves as the foundation for the more detailed implementation plan and dependency analysis in the following documents.

## 1. Project Overview

The `@makeswift/runtime` package is currently tightly coupled with the Next.js framework. This integration has historically facilitated rapid development and provided a rich feature set for Next.js users. However, evolving business requirements necessitate exploring the use of Makeswift with other frameworks (e.g., Remix, Astro) and even in vanilla React environments.

This project aims to:

- Identify and catalog the specific points where `@makeswift/runtime` depends on Next.js
- Propose general strategies for decoupling these dependencies
- Estimate the relative difficulty of decoupling each identified point
- Implement a modular architecture with framework-specific adapters

The ultimate goal is to refactor `@makeswift/runtime` into a framework-agnostic core library, with Next.js-specific functionalities isolated into a separate adapter package (e.g., `@makeswift/next`). This document serves as a technical foundation for the decoupling implementation.

## 2. Methodology

The analysis was conducted by:

1. Reviewing the project pitch to understand the known areas of coupling and project goals
2. Performing a comprehensive scan of the `@makeswift/runtime` codebase to identify Next.js-specific imports, API usage, patterns, and conventions
3. Categorizing these dependencies and aligning them with the coupling points
4. Formulating high-level decoupling strategies and difficulty estimations for each point

Keywords and patterns searched for included: `next/router`, `next/link`, `next/image`, `next/head`, `next/document`, `next/cache`, `next/headers`, `next/navigation`, `NextApiRequest`, `NextApiResponse`, `NextRequest`, `NextResponse`, `previewData`, `draftMode`, and inspection of files within the `src/next/` directory.

## 3. Identified Coupling Points

The following sections highlight each identified point of coupling between `@makeswift/runtime` and Next.js. For a more detailed analysis with code references, specific import details, and dependency graphs, refer to the [Dependency Analysis](./3-dependency-analysis.md) document.

### 3.1. Routing and Locale Handling

The runtime relies on Next.js for determining the current URL pathname and locale, especially in the Pages Router. This information is crucial for fetching the correct page data and resolving localized resources. The implementation differs significantly between Pages Router (`useRouter()`) and App Router (URL-based inference), adding complexity to the abstraction layer.

### 3.2. Draft & Preview Mode

The system for viewing draft content or previewing unpublished changes is heavily reliant on Next.js's Preview Mode (Pages Router) and Draft Mode (App Router). This includes signed cookies, specific API routes for enabling/disabling these modes, and reading preview/draft state. The source code reveals distinct implementations in `preview-mode.tsx` for Pages Router and `draft-mode/index.tsx` for App Router.

### 3.3. HTTP API Endpoints

Several crucial backend functionalities (manifest, fonts, resource fetching, revalidation, webhooks) are exposed as HTTP endpoints implemented using Next.js API routes. The API handlers support both Pages Router (`NextApiRequest`/`NextApiResponse`) and App Router (`NextRequest`/`NextResponse`) conventions, using pattern matching to determine the correct handler.

### 3.4. Cache Revalidation

The runtime uses Next.js's advanced caching features, specifically on-demand ISR (`revalidatePath`) and tag-based revalidation (`revalidateTag`), to keep pages updated after changes in Makeswift. The webhook handlers and revalidation endpoints rely heavily on Next.js cache primitives.

### 3.5. Head Element Management and SSR Styling

The runtime manages HTML `<head>` elements (metadata, links, styles, scripts) using Next.js-specific components (`next/head` for Pages Router) and hooks (`useServerInsertedHTML` for App Router with Emotion CSS). The `head-tags.tsx` file demonstrates this router-specific conditional rendering.

### 3.6. Built-in Components with Next.js Dependencies

Several built-in components directly use Next.js components:

- **Image Component**: Directly uses `next/image` for optimized image rendering, with version detection to support both modern and legacy image components
- **Link Component**: Uses `next/link` for client-side navigation enhancements, with special handling for router-specific properties like `locale: false`

### 3.7. Build System and Packaging

The current build process and package structure output Next.js-specific submodules. The code analysis shows that certain files are specifically compiled for Next.js environments, requiring a restructuring of the build process for a modular approach.

### 3.8. Implicit Dependencies in Client/Runtime Initialization

The `ReactRuntimeProvider` and the `MakeswiftHostApiClient` are initialized with properties like `previewMode`, `locale`, `apiOrigin`, that are typically derived from Next.js contexts. While the abstractions exist, the default usage patterns assume a Next.js environment.

## 4. Proposed Phased Decoupling Roadmap

The following outlines a high-level approach to decoupling the Makeswift runtime. For a detailed, step-by-step implementation plan, please refer to the [Implementation Checklist](./2-implementation-checklist.md) document.

1. **Phase 1: Core Logic Isolation & Configuration Enhancement**

   - Refactor `MakeswiftHostApiClient` and internal fetchers to use fully configurable base URLs
   - Ensure core client methods take `siteVersion` and `locale` as explicit inputs
   - Isolate core logic from API handlers into utility functions
   - Create unified abstractions that work across router types

2. **Phase 2: Component and Control Abstraction**

   - Create base versions of `Image` and `Link` components
   - Develop a runtime registration mechanism for these components
   - Review all controls to ensure framework-agnostic values
   - Abstract version-specific behaviors seen in the source code

3. **Phase 3: Adapters for Next.js - API & Preview**

   - Develop the Next.js adapter for API route handlers and preview/draft mode
   - Implement preview/draft mode integration using patterns from existing implementations
   - Support both Pages Router and App Router in the adapter

4. **Phase 4: Adapters for Next.js - Head & Styling**

   - Generate head tag data structure from core runtime
   - Implement Next.js-specific rendering for these tags
   - Handle Emotion cache and SSR style extraction
   - Support both rendering approaches (next/head and direct rendering)

5. **Phase 5: Packaging, Testing, and Documentation**
   - Split into `@makeswift/runtime` (core) and `@makeswift/next` (adapter)
   - Test packages with comprehensive test coverage for both router types
   - Create a proof-of-concept with a non-Next.js setup (Remix)
   - Ensure backward compatibility for existing users

## 5. Conclusion

Decoupling `@makeswift/runtime` from Next.js is a significant architectural refactor. The most challenging areas involve replacing Next.js's infrastructure for preview/draft mode, API routing, on-demand cache revalidation, and SSR styling/head management. Analysis of the actual source code confirms these challenges but also reveals clear separation points where abstraction is feasible.

The proposed phased approach prioritizes abstracting core functionalities first, then building out the Next.js adapter, and finally restructuring the packaging. This project will enable Makeswift to expand beyond Next.js to other frameworks, starting with Remix, while maintaining the robust functionality that existing Next.js users expect.
