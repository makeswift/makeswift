# Makeswift Decoupling Project: Implementation Checklist

This document provides a detailed, step-by-step checklist for implementing the decoupling of Makeswift's runtime from Next.js and creating adapters for Next.js and Remix. Each step has been designed to be specific, actionable, and verifiable.

## Phase 1: Setup and Analysis

### 1.1. Initial Project Setup and Analysis

- [x] Create empty package directories for future implementation

  - [x] Create `@makeswift/next` directory (placeholder only)
  - [x] Create `@makeswift/remix` directory (placeholder only)
  - [x] Add basic README files explaining the intent of these packages

- [x] Set up development environment
  - [x] Configure monorepo tools to recognize the new package structure
  - [x] Set up a single command that check whether the builds are failing on `@makeswift/runtime`, `@makeswift/next`, and `@makeswift/remix`.

### 1.2. Next.js Dependency Analysis

- [x] Create a comprehensive inventory of Next.js imports in the codebase

  - [x] Run `grep -r "from 'next/" packages/runtime/src` and document all occurrences
  - [x] Find all instances of Next.js types (NextApiRequest, NextApiResponse, etc.)
  - [x] Document all Next.js specific hooks (useRouter, useParams, etc.)
  - [x] Identify differences between Pages Router and App Router usage

- [x] Identify all Next.js specific APIs used

  - [x] Document usage of headers(), cookies(), previewData, etc.
  - [x] Map all router-specific functionality
  - [x] List all server-side rendering dependencies
  - [x] Document middleware usage and requirements

- [x] Create a dependency graph of core functionality on Next.js features
  - [x] Identify "must have" vs "nice to have" Next.js features
  - [x] Map which core features depend on which Next.js APIs
  - [x] Analyze backward compatibility requirements for existing users
  - [x] Identify potential breaking changes and mitigation strategies

## Phase 2: Package Structure and Adapter System

### 2.1. Package Structure Planning

- [ ] Design new package structure based on dependency analysis
  - [ ] Create detailed architecture diagram showing relationship between packages
  - [ ] Define clear boundaries between core runtime/client functionality and framework-specific code
  - [ ] Identify the key integration points from Makeswift documentation:
    - [ ] Component registration system (ReactRuntime)
    - [ ] Data fetching layer (Makeswift client)
    - [ ] API handler (Preview mode, revalidation, fonts, webhooks)
    - [ ] Provider component (Context and styling)
    - [ ] Page rendering (Catch-all routes)
  - [ ] Document API surface that will remain stable during refactoring
  - [ ] Plan backward compatibility strategy for existing users

### 2.2. API Structure Implementation

- [ ] Implement chosen API structure approach
  - [ ] Create bundle compatibility layer for existing users
  - [ ] Set up package.json exports configuration
  - [ ] Develop framework detection utilities
  - [ ] Create deprecation warning system for future breaking changes

### 2.3. Adapter Registration System

- [ ] Create framework adapter registration system
  - [ ] Define `FrameworkAdapter` interface in `src/core/adapter.ts`
  - [ ] Implement adapter registry with registration/retrieval methods
  - [ ] Create default adapter fallbacks for each abstraction area
  - [ ] Implement automatic framework detection where possible
  - [ ] Add type-safe adapter validation

## Phase 3: Low-Complexity Component Abstractions

### 3.1. Image Component Abstraction

- [ ] Create image component abstraction

  - [ ] Implement `BaseImageComponent` in `src/components/image/base.tsx`
  - [ ] Extract core image properties and behaviors
  - [ ] Create adapter interface for framework-specific image components
  - [ ] Create responsive image utilities that work across frameworks
  - [ ] Implement image dimension detection and aspect ratio preservation

- [ ] Write unit tests for image abstraction
  - [ ] Test core image component functionality
  - [ ] Test responsive behavior and layout modes
  - [ ] Test dimension calculations

### 3.2. Link Component Abstraction

- [ ] Create link component abstraction

  - [ ] Implement `BaseLinkComponent` in `src/components/link/base.tsx`
  - [ ] Extract core link properties and behaviors
  - [ ] Create adapter interface for framework-specific link components
  - [ ] Implement cross-framework URL normalization utilities

- [ ] Write unit tests for link abstraction
  - [ ] Test core link component functionality
  - [ ] Test URL handling across different formats
  - [ ] Test click behavior and event handling

### 3.3. Create and Test Framework-Specific Implementations

- [ ] Implement Next.js image component

  - [ ] Create `NextImageComponent` using next/image
  - [ ] Handle responsive images and optimization
  - [ ] Support both legacy and modern image components
  - [ ] Implement version detection for Next.js 12/13+

- [ ] Implement Next.js link component

  - [ ] Create `NextLinkComponent` using next/link
  - [ ] Handle client-side navigation
  - [ ] Support locale prefixing
  - [ ] Handle Pages vs App Router differences

- [ ] Create preliminary Remix implementations

  - [ ] Basic `RemixImageComponent` implementation
  - [ ] Basic `RemixLinkComponent` implementation using React Router

- [ ] Test cross-framework compatibility
  - [ ] Verify consistent behavior across implementations
  - [ ] Test framework-specific optimizations
  - [ ] Ensure feature parity with current implementation

## Phase 4: Core Framework Abstraction

### 4.1. Client Abstraction

- [ ] Extract the core client functionality from Makeswift class

  - [ ] Create `src/core/base-client.ts` with framework-agnostic code
  - [ ] Define interfaces for all client methods that don't rely on Next.js
  - [ ] Create types for all parameters and return values
  - [ ] Ensure fetch implementations work across both server and client environments

- [ ] Implement abstract client factory

  - [ ] Create `createClient` function that takes framework adapter
  - [ ] Define interfaces for all required adapter methods
  - [ ] Ensure type safety across adapters
  - [ ] Create environment detection utilities (server vs client)

- [ ] Write unit tests for client abstraction
  - [ ] Test framework-agnostic client functionality
  - [ ] Test adapter integration points
  - [ ] Test environment detection

### 4.2. Head and Styling Abstraction

- [ ] Create headless document management

  - [ ] Define `HeadManager` interface in `src/core/head-manager.ts`
  - [ ] Implement serializable head tag structure
  - [ ] Create utilities for merging head tags
  - [ ] Support both streaming and non-streaming SSR patterns

- [ ] Extract Emotion styling logic

  - [ ] Create framework-agnostic style registry interface
  - [ ] Implement core utility for Emotion cache creation
  - [ ] Create abstract SSR style extraction utilities
  - [ ] Support hydration strategies for both frameworks
  - [ ] Implement client-side fallback style injection

- [ ] Write unit tests for head and styling abstractions
  - [ ] Test head tag serialization and merging
  - [ ] Test style extraction across SSR patterns
  - [ ] Test hydration consistency

### 4.3. API Handler Abstraction

- [ ] Extract core API logic from handlers

  - [ ] Move business logic from `src/next/api-handler/handlers/*` to `src/core/api-handlers/*`
  - [ ] Create framework-agnostic request/response interfaces
  - [ ] Implement pure functions for handling API requests
  - [ ] Separate core business logic from HTTP handling

- [ ] Create resource fetching abstractions

  - [ ] Move resource fetching logic to core package
  - [ ] Extract Next.js specific fetch logic to adapter interfaces
  - [ ] Create utilities for handling API resources
  - [ ] Implement caching strategies that work across frameworks

- [ ] Implement adapter interfaces for API handlers

  - [ ] Define `APIHandlerAdapter` interface for framework implementations
  - [ ] Create type definitions for all handler parameters
  - [ ] Define consistent error handling patterns
  - [ ] Create common status code and response format utilities

- [ ] Write unit tests for API handler abstractions
  - [ ] Test core API handler logic
  - [ ] Test request/response abstractions
  - [ ] Test error handling patterns

### 4.4. Preview/Draft Mode Abstraction

- [ ] Create preview/draft mode abstraction

  - [ ] Define `SiteVersionProvider` interface in `src/core/site-version.ts`
  - [ ] Extract preview detection logic from Next.js implementation
  - [ ] Create framework-agnostic methods for site version determination
  - [ ] Implement secure cookie handling utilities that work across frameworks
  - [ ] Create fallback query parameter mechanism for frameworks without built-in preview

- [ ] Write unit tests for preview/draft mode abstraction
  - [ ] Test site version determination
  - [ ] Test cookie and fallback mechanisms
  - [ ] Test security aspects

### 4.5. Data Fetching and SSR Abstraction

- [ ] Create SSR data fetching abstractions

  - [ ] Define data loading interfaces independent of framework
  - [ ] Create utilities for coordinating server and client data
  - [ ] Implement framework-agnostic hydration markers
  - [ ] Support both static and dynamic rendering patterns
  - [ ] Address differences between Next.js RSC and Remix loader patterns
  - [ ] Create abstractions for both getStaticProps/getServerSideProps and Remix loader patterns

- [ ] Implement error boundary abstractions

  - [ ] Create core error boundary interfaces
  - [ ] Implement error serialization utilities
  - [ ] Create abstractions for error handling during SSR
  - [ ] Support both synchronous and asynchronous error handling
  - [ ] Address differences between Next.js error.js and Remix ErrorBoundary

- [ ] Write unit tests for data fetching and SSR abstractions
  - [ ] Test data loading interfaces
  - [ ] Test hydration consistency
  - [ ] Test error boundary functionality

### 4.6. Internationalization and Localization

- [ ] Abstract internationalization support

  - [ ] Create framework-agnostic locale detection interfaces
  - [ ] Implement utilities for managing translated content
  - [ ] Support path-based and domain-based locale strategies
  - [ ] Create abstract interfaces for locale switching

- [ ] Write unit tests for internationalization abstractions
  - [ ] Test locale detection
  - [ ] Test translation content management
  - [ ] Test locale switching

### 4.7. Revalidation Abstraction

- [ ] Create framework-agnostic revalidation system

  - [ ] Define `RevalidationAdapter` interface
  - [ ] Implement core revalidation request processing
  - [ ] Create time-based fallback for frameworks without fine-grained cache control
  - [ ] Implement webhook handler abstraction

- [ ] Write unit tests for revalidation abstraction
  - [ ] Test revalidation processing
  - [ ] Test time-based fallback mechanism
  - [ ] Test webhook handling

## Phase 5: Package Structure Implementation

### 5.0. Build Configuration Updates

- [ ] Update `@makeswift/runtime` build configuration

  - [ ] Move Next.js from direct dependency to peer dependency in package.json
  - [ ] Create conditional exports in package.json to separate core and framework-specific exports
  - [ ] Update tsconfig.json with path aliases to differentiate core vs framework-specific code
  - [ ] Modify tsup.config.ts to create separate entry points for framework-specific code
  - [ ] Create clean dependency graph ensuring framework-specific code doesn't leak into core

- [ ] Setup `@makeswift/next` package

  - [ ] Initialize package.json with proper dependencies
  - [ ] Configure build system (tsup, tsconfig, etc.)
  - [ ] Setup correct imports from core package

- [ ] Setup `@makeswift/remix` package

  - [ ] Initialize package.json with proper dependencies
  - [ ] Configure build system (tsup, tsconfig, etc.)
  - [ ] Setup correct imports from core package

- [ ] Create continuous integration setup
  - [ ] Configure CI for all packages
  - [ ] Set up cross-package testing
  - [ ] Implement performance regression testing

## Phase 6: Next.js Adapter Implementation

### 6.1. Next.js Client Adapter

- [ ] Implement Next.js client in `@makeswift/next/src/client.ts`

  - [ ] Extend base client with Next.js specific functionality
  - [ ] Implement preview detection using Next.js APIs
  - [ ] Handle Next.js routing integration
  - [ ] Support both Node.js and Edge runtime environments

- [ ] Create Next.js site version provider

  - [ ] Implement `NextSiteVersionProvider` for App Router
  - [ ] Implement `NextSiteVersionProvider` for Pages Router
  - [ ] Create utilities for handling Next.js preview data
  - [ ] Support Next.js middleware integration for preview detection

- [ ] Write tests for Next.js client adapter
  - [ ] Test client functionality across router types
  - [ ] Test preview detection accuracy
  - [ ] Test runtime environment compatibility

### 6.2. Next.js API Routes

- [ ] Implement Next.js API handler in `@makeswift/next/src/api-handler.ts`

  - [ ] Create adapter for Next.js API routes
  - [ ] Implement Pages and App Router compatibility
  - [ ] Support both Edge and Node.js runtimes

- [ ] Implement Next.js specific API routes

  - [ ] Create draft/preview mode handlers
  - [ ] Implement revalidation endpoints
  - [ ] Add resource proxy handlers

- [ ] Write tests for Next.js API routes
  - [ ] Test API route functionality
  - [ ] Test router compatibility
  - [ ] Test runtime compatibility

### 6.3. Next.js Head Management

- [ ] Implement Next.js head management

  - [ ] Create head component for Pages Router using next/head
  - [ ] Create head component for App Router
  - [ ] Implement style registry for Emotion

- [ ] Write tests for Next.js head management
  - [ ] Test head component rendering
  - [ ] Test style injection
  - [ ] Test compatibility across router types

### 6.4. Next.js Provider

- [ ] Implement Next.js provider in `@makeswift/next/src/provider.tsx`

  - [ ] Create MakeswiftProvider component
  - [ ] Handle initialization with Next.js specific context
  - [ ] Implement style registry

- [ ] Write tests for Next.js provider
  - [ ] Test provider initialization
  - [ ] Test context propagation
  - [ ] Test compatibility with existing code

## Phase 7: Remix Adapter Implementation

### 7.1. Remix Client Adapter

- [ ] Implement Remix client in `@makeswift/remix/src/client.ts`

  - [ ] Extend base client with Remix specific functionality
  - [ ] Create cookie-based preview mode implementation
  - [ ] Handle React Router integration
  - [ ] Support Remix's data loading patterns with loaders

- [ ] Create Remix site version provider

  - [ ] Implement `RemixSiteVersionProvider`
  - [ ] Create cookie utilities for preview mode
  - [ ] Add session handling for secure state
  - [ ] Implement server/client coordination for draft mode

- [ ] Write tests for Remix client adapter
  - [ ] Test client functionality
  - [ ] Test preview mode implementation
  - [ ] Test data loading integration

### 7.2. Remix API Routes

- [ ] Implement Remix resource routes in `@makeswift/remix/src/routes/api/makeswift`

  - [ ] Create resource route modules following Remix conventions:
    - [ ] `routes/api/makeswift/$.tsx` (catch-all route that handles all Makeswift API requests)
    - [ ] `routes/api/makeswift/draft.tsx` (handles draft mode activation)
    - [ ] `routes/api/makeswift/clear-draft.tsx` (handles exiting draft mode)
    - [ ] `routes/api/makeswift/revalidate.tsx` (handles on-demand revalidation)
    - [ ] `routes/api/makeswift/webhook.tsx` (handles Makeswift webhooks)
  - [ ] Implement request/response adapters
  - [ ] Add cookie-based site version detection using Remix's cookie API
  - [ ] Ensure correct response headers for Remix's caching model

- [ ] Implement Remix specific endpoints adapters

  - [ ] Create draft mode handlers using Remix cookie and session APIs
  - [ ] Implement resource fetching routes with loader/action patterns
  - [ ] Add font handling that works with Remix's asset system
  - [ ] Design cache management strategies using Remix's CDN-friendly caching headers
  - [ ] Implement error boundary handling with Remix's ErrorBoundary pattern

- [ ] Write tests for Remix API routes
  - [ ] Test resource route functionality
  - [ ] Test cookie handling
  - [ ] Test caching strategies

### 7.3. Remix Components

- [ ] Finalize Remix image component

  - [ ] Complete `RemixImageComponent` implementation
  - [ ] Implement responsive image handling
  - [ ] Create image optimization utilities
  - [ ] Support asset handling through Remix's public folder structure

- [ ] Finalize Remix link component

  - [ ] Complete `RemixLinkComponent` using React Router's Link
  - [ ] Handle client-side navigation
  - [ ] Implement prefetching behavior
  - [ ] Support nested route transitions

- [ ] Implement Remix head management

  - [ ] Create meta export functions
  - [ ] Implement SEO utilities
  - [ ] Create document title management
  - [ ] Support nested route meta merging

- [ ] Implement Remix-specific UI components

  - [ ] Create components that leverage Remix's nested routing
  - [ ] Implement components for handling pending UI states
  - [ ] Create error boundary components compatible with Remix's error handling

- [ ] Write tests for Remix components
  - [ ] Test component rendering
  - [ ] Test navigation behavior
  - [ ] Test head management

### 7.4. Remix Provider

- [ ] Implement Remix provider in `@makeswift/remix/src/provider.tsx`

  - [ ] Create MakeswiftProvider component
  - [ ] Handle initialization with Remix specific context
  - [ ] Implement style registry for Emotion
  - [ ] Support both Remix v1 and v2 (React Router v7) APIs

- [ ] Write tests for Remix provider
  - [ ] Test provider initialization
  - [ ] Test context propagation
  - [ ] Test version compatibility

### 7.5. Caching and Optimization

- [ ] Implement Remix-specific caching strategies

  - [ ] Create headers utilities for CDN caching
  - [ ] Implement alternatives to Next.js ISR patterns
  - [ ] Build revalidation mechanisms compatible with Remix architecture
  - [ ] Document performance considerations specific to Remix deployment patterns

- [ ] Write tests for Remix caching
  - [ ] Test caching behavior
  - [ ] Test revalidation mechanisms
  - [ ] Test performance optimizations

## Phase 8: Cross-Framework Verification

### 8.1. Feature Parity Testing

- [ ] Create feature matrix test suite

  - [ ] Define core features that must work across frameworks
  - [ ] Implement tests for each feature across frameworks
  - [ ] Create automated comparison reporting

- [ ] Test critical functionality across frameworks
  - [ ] Preview/draft mode behavior
  - [ ] Image and link component behavior
  - [ ] Head management and SEO
  - [ ] API route functionality
  - [ ] Internationalization support

### 8.2. Integration Testing

- [ ] Create end-to-end tests for Next.js integration

  - [ ] Test complete page rendering flow
  - [ ] Test preview mode toggling
  - [ ] Test API endpoints

- [ ] Create end-to-end tests for Remix integration

  - [ ] Test complete page rendering flow
  - [ ] Test preview mode toggling
  - [ ] Test API endpoints

- [ ] Verify cross-framework behavior consistency
  - [ ] Compare rendering outputs
  - [ ] Compare network request patterns
  - [ ] Compare performance metrics

## Phase 9: Sample Implementation

### 9.1. Next.js Examples

- [ ] Update Next.js App Router example

  - [ ] Migrate to use `@makeswift/next` adapter
  - [ ] Update catch-all routes
  - [ ] Verify all existing functionality

- [ ] Update Next.js Pages Router example
  - [ ] Migrate to use `@makeswift/next` adapter
  - [ ] Update \_app and \_document pages
  - [ ] Verify all existing functionality

### 9.2. Remix Example

- [ ] Create basic Remix application

  - [ ] Set up project structure following Remix conventions
  - [ ] Implement catch-all route at `routes/($lang)._index.tsx` and `routes/($lang).$path.tsx`
  - [ ] Create resource route handlers at `routes/api/makeswift/`

- [ ] Implement Makeswift integration paralleling the Next.js structure

  - [ ] Create Makeswift runtime setup (`app/makeswift/runtime.ts`)
  - [ ] Create Makeswift client (`app/makeswift/client.ts`)
  - [ ] Register components (`app/makeswift/components.ts`) and organize component registration
  - [ ] Add MakeswiftProvider to root layout (`app/root.tsx`)
  - [ ] Configure preview/draft mode using Remix sessions
  - [ ] Implement page rendering with loaders and correct data flow

- [ ] Verify functionality
  - [ ] Test component registration in the Makeswift builder
  - [ ] Test page creation and editing
  - [ ] Verify preview/draft mode works correctly
  - [ ] Test on-demand revalidation via API endpoints
  - [ ] Verify fonts are correctly loaded

## Phase 10: Documentation and Release Preparation

### 10.1. Documentation

- [ ] Update core API documentation

  - [ ] Document all new interfaces and abstractions
  - [ ] Create migration guide for existing users
  - [ ] Document extension points for new adapters
  - [ ] Create framework comparison guide (Next.js vs Remix)

- [ ] Create Next.js adapter documentation

  - [ ] Document setup and configuration
  - [ ] Provide examples for both router types
  - [ ] Document migration from direct runtime usage
  - [ ] Include deployment best practices

- [ ] Create Remix adapter documentation
  - [ ] Document setup and configuration
  - [ ] Provide examples and best practices
  - [ ] Create troubleshooting guide
  - [ ] Include deployment strategies for various hosting platforms

### 10.2. Migration Tools

- [ ] Create migration utilities

  - [ ] Build automated codemod tools for converting Next.js direct usage to adapter
  - [ ] Create verification tools to validate successful migration
  - [ ] Build analysis tools to identify potential issues in existing code

- [ ] Develop framework migration utilities
  - [ ] Create tools for converting Next.js projects to Remix projects
  - [ ] Implement automatic page structure conversion
  - [ ] Provide data fetching translation utilities

### 10.3. Performance Verification

- [ ] Analyze and optimize bundle size

  - [ ] Use tree-shaking to reduce package size
  - [ ] Optimize dependencies
  - [ ] Create production build configurations

- [ ] Benchmark performance against baseline
  - [ ] Compare before/after page load metrics
  - [ ] Test server-side rendering performance
  - [ ] Optimize critical rendering paths
  - [ ] Verify performance meets targets (≤10% degradation)

## Phase 11: Finalization and Release

### 11.1. Release Preparation

- [ ] Finalize versioning strategy

  - [ ] Determine version numbers for all packages
  - [ ] Create upgrade path for existing users
  - [ ] Document breaking changes
  - [ ] Prepare deprecation notices for old APIs

- [ ] Create release packages

  - [ ] Build production versions
  - [ ] Create npm packages
  - [ ] Test installation from registry
  - [ ] Verify tree-shaking and bundle size

- [ ] Publish official release
  - [ ] Push to npm registry
  - [ ] Update documentation site
  - [ ] Announce to users with migration guide
  - [ ] Provide rollback plan in case of issues

### 11.2. Post-Release Support

- [ ] Implement monitoring and feedback systems

  - [ ] Create issue templates for adapter-specific problems
  - [ ] Set up tracking for adoption metrics
  - [ ] Establish support channels for migration questions

- [ ] Plan future framework support
  - [ ] Document process for adding new framework adapters
  - [ ] Create evaluation criteria for new framework support
  - [ ] Develop roadmap for additional framework adapters

### 11.3. Compatibility Verification

- [ ] Perform long-term compatibility verification
  - [ ] Create automated tests for new Next.js and Remix versions
  - [ ] Develop compatibility matrices for supported frameworks and versions
  - [ ] Implement continuous integration for adapter packages
  - [ ] Document update and maintenance processes for framework changes
