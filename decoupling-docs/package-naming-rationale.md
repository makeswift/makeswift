# Package Naming Rationale for Makeswift Decoupling Project

## Overview

This document explains the rationale behind the package naming convention adopted for the Makeswift runtime decoupling project. The chosen naming structure follows industry best practices while prioritizing backward compatibility and aims to create a clear, intuitive organization for the decoupled components.

## Adopted Naming Convention

The Makeswift decoupling project uses the following package naming convention:

```
@makeswift/runtime    - Core package containing framework-agnostic and React functionality
@makeswift/next       - Next.js adapter
@makeswift/remix      - Remix adapter
```

## Rationale

### Why We Chose This Approach

After evaluating various options, we decided to maintain the existing `@makeswift/runtime` as the main package while creating separate adapter packages:

1. **Backward Compatibility**: Keeping core functionality in `@makeswift/runtime` minimizes migration effort for existing users.

2. **Familiarity**: Existing users are already familiar with the `runtime` package name.

3. **Reduced Package Overhead**: Fewer packages means less complexity in dependency management and versioning.

4. **Clear Separation of Concerns**: Framework-specific code is isolated in dedicated adapter packages, while common logic remains in one place.

5. **Simplified Developer Experience**: Users need to install and manage fewer packages to get started.

### Internal Organization

Within the `@makeswift/runtime` package, we use directory structure to separate concerns:

```
@makeswift/runtime/
  └── src/
      ├── core/        - Framework-agnostic functionality
      ├── react/       - React-specific (but framework-agnostic) functionality
      └── index.ts     - Public API exports
```

This internal organization provides code separation without requiring multiple packages.

## Package Responsibilities

### @makeswift/runtime

Contains both framework-agnostic core and React-specific functionality:

#### In `/src/core`:
- API client foundation
- Core type definitions
- Adapter interfaces
- Content and resource models
- Site version management

#### In `/src/react`:
- React component base classes
- React hooks
- Context providers
- React state management
- Element renderers

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

## Advantages Over Multi-Package Approach

The chosen approach has several advantages compared to creating separate packages for core and React functionality:

1. **Simpler Dependency Management**: Users only need to manage one core package version.

2. **Easier Upgrades**: No need to coordinate version updates across multiple packages.

3. **Reduced Bundle Size**: Less package overhead can lead to smaller overall bundle sizes.

4. **Clearer Documentation**: Documentation can focus on one core package with adapter extensions.

5. **Simplified Publishing**: Fewer packages to publish and maintain release notes for.

## Examples from Other Libraries

Many popular libraries use a similar approach of keeping core functionality in one package and offering separate adapters:

### Emotion

Emotion maintains core functionality in their main packages while offering framework integrations:
- `@emotion/css` - Core package
- `@emotion/react` - React integration

### Prisma

Prisma keeps core functionality in one client package:
- `@prisma/client` - Main package
- Adapters are documented patterns rather than separate packages

### React Hook Form

React Hook Form has its core functionality in one package with resolver adapters:
- `react-hook-form` - Main package
- `@hookform/resolvers` - Validation library adapters

## Migration Strategy

For existing users, the migration path is straightforward:

1. **No Change for Core Usage**: Existing imports from `@makeswift/runtime` continue to work the same way.

2. **Framework Adapters**: When using a specific framework, install the appropriate adapter package.

3. **Import Organization**: We'll maintain clear documentation about which imports come from which package.

## Conclusion

By maintaining the existing `@makeswift/runtime` package for core and React functionality while creating separate adapter packages, we achieve a balance between backward compatibility and clean architecture. This approach simplifies the developer experience while still providing clear separation between framework-specific code.

The structure gives us the flexibility to support multiple frameworks through dedicated adapters while keeping the core experience consistent and familiar for existing users.