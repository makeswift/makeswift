# Package Naming Rationale for Makeswift Decoupling Project

## Overview

This document explains the rationale behind the package naming convention adopted for the Makeswift runtime decoupling project. The chosen naming structure follows industry best practices and aims to create a clear, intuitive organization for the decoupled components.

## Adopted Naming Convention

The Makeswift decoupling project uses the following package naming convention:

```
@makeswift/core        - Core framework-agnostic functionality
@makeswift/react       - Base React implementation
@makeswift/next        - Next.js adapter
@makeswift/remix       - Remix adapter
@makeswift/runtime     - Meta-package (for backward compatibility)
```

## Rationale

### Why We Chose TanStack's Pattern

After researching package naming conventions across the ecosystem, we adopted TanStack's pattern for several reasons:

1. **Clarity and Simplicity**: The naming structure is clean, concise, and immediately understandable.

2. **Established Precedent**: TanStack (formerly React Query) is a highly respected and widely-used library family that follows this pattern for its multi-framework packages.

3. **Scalability**: The structure scales well as more framework adapters are added.

4. **Organizational Hierarchy**: The naming clearly indicates the relationship between packages - core functionality, React implementation, and framework-specific adapters.

5. **Developer Experience**: Package names are short and predictable, making them easier to remember and use.

### Comparison with Other Conventions

| Convention | Example | Analysis | 
|------------|---------|------------|
| TanStack Style | `@tanstack/react-query` | Clean, framework as part of name, organized by scope |
| Framework Suffix | `ui-core`, `ui-react` | Less clear ownership, possible namespace clashes |
| Long Descriptive | `runtime-next-adapter` | More verbose, less aligned with modern libraries |
| Feature Prefix | `next-makeswift` | Could be confused with third-party adaptations |

## Package Responsibilities

### @makeswift/core

Contains all framework-agnostic functionality:
- API client foundation
- Core type definitions
- Adapter interfaces
- Content and resource models
- Site version management

### @makeswift/react

Contains React-specific but framework-agnostic implementation:
- React component base classes
- React hooks
- Context providers
- React state management

### @makeswift/next

Implements the Next.js adapter:
- Next.js API routes
- Next.js image component
- Next.js preview mode integration
- Next.js head management
- Cache tag implementation

### @makeswift/remix

Implements the Remix adapter:
- Remix resource routes
- Remix meta API integration
- Draft mode using cookies
- Loaders and actions

### @makeswift/runtime

Optional meta-package that re-exports from the other packages for backward compatibility.

## Migration Strategy

For users of the existing `@makeswift/runtime` package, we provide a migration path:

1. **Short-term**: The `@makeswift/runtime` package will be maintained as a meta-package that re-exports from the new packages, allowing gradual migration.

2. **Mid-term**: Documentation will guide users to migrate to the new package structure directly.

3. **Long-term**: New features will be developed exclusively for the new package structure.

## Examples from Other Popular Libraries

### TanStack

TanStack uses a consistent pattern of `@tanstack/[framework]-[library]`:
- `@tanstack/react-query`
- `@tanstack/vue-query`
- `@tanstack/svelte-query`

### Emotion

Emotion uses a pattern of `@emotion/[feature]`:
- `@emotion/react`
- `@emotion/css`
- `@emotion/styled`

### Tailwind

Tailwind uses direct and framework-specific packages:
- `tailwindcss`
- `@tailwindcss/forms`
- `@tailwindcss/typography`

## Conclusion

The adopted package naming convention aligns with modern JavaScript library practices, particularly following TanStack's successful pattern. This structure provides a clear organization that scales well as more framework adapters are added while maintaining an intuitive developer experience.

By following this established pattern, we make it easier for developers familiar with other multi-framework libraries to understand and work with the Makeswift ecosystem.