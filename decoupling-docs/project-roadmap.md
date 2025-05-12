# Makeswift Runtime Decoupling Project Roadmap

This document outlines the comprehensive roadmap for decoupling the Makeswift runtime from Next.js and implementing a framework-agnostic core with framework-specific adapters.

## Project Goals

1. Create a framework-agnostic core runtime that can be used with any React-based framework
2. Develop adapters for Next.js and Remix (with React Router v7)
3. Maintain feature parity across framework implementations
4. Improve developer experience and performance
5. Provide clear migration paths for existing users

## High-Level Timeline

| Phase | Duration | Focus |
|-------|----------|-------|
| Research & Planning | 2 weeks | Architecture research, proof of concepts |
| Core Development | 4-6 weeks | Framework-agnostic core implementation |
| Next.js Adapter | 3-4 weeks | Next.js adapter implementation and testing |
| Remix Adapter | 3-4 weeks | Remix adapter implementation and testing |
| Documentation & Examples | 2-3 weeks | Documentation, examples, migration guides |
| Beta Testing | 2-3 weeks | Community testing, feedback integration |
| Release | 1 week | Final preparations and release |

## Detailed Roadmap

### Phase 1: Core Architecture Restructuring

**Duration: 4-6 weeks**

**Goal**: Create a clear separation between framework-agnostic code and framework-specific adapters.

#### Package Structure
We'll maintain the existing `@makeswift/runtime` package for core functionality, while creating separate adapter packages for framework-specific implementations:

- `@makeswift/runtime`: Main package with core, React-agnostic, and React-specific functionality
  - `/src/core`: Framework-agnostic core functionality
  - `/src/react`: React-specific (but framework-agnostic) functionality
- `@makeswift/next`: Next.js specific adapter and functionality
- `@makeswift/remix`: Remix specific adapter and functionality (to be added)

This approach maintains backward compatibility for the core runtime while allowing for clean separation of framework-specific code.

#### Key Tasks:
1. **Week 1-2: Foundation Setup**
   - Set up monorepo structure for new packages
   - Define clear interfaces between core and adapters
   - Create initial abstractions for framework-specific features

2. **Week 3-4: Decouple API Client & Data Fetching**
   - Modify the Makeswift client to accept adapters for framework-specific features
   - Extract core logic from Next.js-specific API handlers
   - Make site version and locale explicit parameters to all methods
   - Remove Next.js preview mode dependencies

3. **Week 5-6: Component & Control Abstraction**
   - Create base versions of Image and Link components
   - Develop a registration mechanism for framework-specific component implementations
   - Review all controls to ensure they return framework-agnostic data structures
   - Refactor ReactRuntimeProvider to remove Next.js dependencies

### Phase 2: Next.js Adapter Development

**Duration: 3-4 weeks**

**Goal**: Create a Next.js adapter that maintains all existing functionality with the new core package.

#### Key Tasks:
1. **Week 1-2: Core Next.js Integration**
   - Implement Next.js specific API routes
   - Integrate with Next.js preview/draft mode
   - Create Next.js specific Image and Link components

2. **Week 3-4: Advanced Next.js Features**
   - Implement head and style management for Next.js
   - Create adapters for Pages and App Router
   - Implement cache revalidation using Next.js specific methods
   - Test and ensure feature parity with existing implementation

### Phase 3: Remix Adapter Development

**Duration: 3-4 weeks**

**Goal**: Create a Remix adapter that provides equivalent functionality using Remix's patterns.

#### Key Tasks:
1. **Week 1-2: Core Remix Integration**
   - Set up Remix project structure
   - Implement dynamic routes for pages
   - Create adapter for API handler functionality

2. **Week 3-4: Advanced Remix Features**
   - Implement preview/draft mode using cookies
   - Create head management using Remix's meta API
   - Implement cache revalidation strategies
   - Leverage Remix's form handling capabilities

### Phase 4: Documentation & Examples

**Duration: 2-3 weeks**

**Goal**: Provide comprehensive documentation and examples for all implementations.

#### Key Tasks:
1. **Week 1: Core Documentation**
   - Document core runtime architecture
   - Create API reference for core package
   - Document adapter interfaces

2. **Week 2-3: Framework-Specific Guides**
   - Create comprehensive guides for Next.js adapter
   - Develop tutorials for Remix integration
   - Document migration paths from existing code
   - Create example projects for each framework

### Phase 5: Testing & Refinement

**Duration: 2-3 weeks**

**Goal**: Ensure reliability and performance across implementations.

#### Key Tasks:
1. **Week 1-2: Testing**
   - Create automated tests for core functionality
   - Test Next.js and Remix adapters
   - Performance benchmarking
   - Cross-browser testing

2. **Week 3: Refinement**
   - Address feedback from initial testing
   - Optimize performance bottlenecks
   - Refine developer experience
   - Final documentation updates

### Phase 6: Release & Adoption

**Duration: 1-2 weeks**

**Goal**: Successfully release the decoupled runtime and drive adoption.

#### Key Tasks:
1. **Week 1: Release Preparation**
   - Finalize package versioning strategy
   - Prepare release notes
   - Create migration scripts if needed

2. **Week 2: Launch**
   - Release packages to npm
   - Publish announcement and documentation
   - Provide support for early adopters

## Technical Challenges & Strategies

### 1. Preview/Draft Mode
- **Challenge**: Next.js has built-in preview mode, but other frameworks don't
- **Strategy**: Create a framework-agnostic interface for site version with framework-specific implementations using cookies/storage

### 2. Image Optimization
- **Challenge**: Different frameworks have different image optimization strategies
- **Strategy**: Create base Image component that can be extended by framework-specific implementations

### 3. Routing
- **Challenge**: Routing systems differ significantly between frameworks
- **Strategy**: Abstract route resolution and make pathname/locale explicit parameters

### 4. Head Management
- **Challenge**: Frameworks handle meta tags and head elements differently
- **Strategy**: Create a framework-agnostic head representation that adapters can interpret

### 5. SSR & CSS-in-JS
- **Challenge**: Server-side rendering of CSS-in-JS varies by framework
- **Strategy**: Extract core styling logic and create framework-specific utilities for SSR

### 6. API Routes
- **Challenge**: API route handling differs between frameworks
- **Strategy**: Create pure function handlers that adapters can expose through their routing systems

## Success Metrics

1. **Compatibility**: Core functionality works identically across frameworks
2. **Performance**: No performance regression compared to current implementation
3. **Developer Experience**: Clear, well-documented APIs with intuitive patterns
4. **Adoption**: Successful implementation of at least one production site with each adapter
5. **Maintenance**: Reduced codebase complexity and improved test coverage

## Conclusion

This roadmap provides a structured approach to decoupling the Makeswift runtime from Next.js and implementing framework-agnostic core with support for multiple frameworks. By following this plan, we can achieve a more flexible architecture that enables Makeswift to work seamlessly with different React frameworks while maintaining the feature-rich experience users expect.