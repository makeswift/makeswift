# Makeswift Package Structure Plan

This document outlines the proposed package structure for the Makeswift decoupling project, defining the architecture for separating the core runtime from framework-specific code.

## 1. Package Architecture

```
@makeswift/runtime (Core)
+----------------------------------------+
|                                        |
|  +------------------+                  |
|  | Core Components  |                  |
|  |                  |                  |
|  | - Component API  |                  |
|  | - Controls       |                  |
|  | - Builder API    |                  |
|  | - Data Fetching  |<-----------------+
|  | - Rendering      |                  |
|  | - Runtime Types  |                  |
|  +------------------+                  |
|                                        |
+----------------^-----------------------+
                 |
                 | Shared Interfaces
                 |
+----------------+-----------+------------+
|                            |            |
| @makeswift/next            | @makeswift/remix
| +----------------------+   | +----------------------+
| | Next.js Integration  |   | | Remix Integration    |
| |                      |   | |                      |
| | - Route Handling     |   | | - Route Handling     |
| | - API Routes         |   | | - Loaders/Actions    |
| | - GetStaticProps     |   | | - Server Components  |
| | - Preview Mode       |   | | - Preview Mode       |
| | - Hydration          |   | | - Hydration          |
| | - App/Pages Router   |   | | - Client Hooks       |
| +----------------------+   | +----------------------+
|                            |            |
+----------------------------+------------+
              ^                        ^
              |                        |
              v                        v
   +------------------------+  +------------------------+
   | Next.js Applications   |  | Remix Applications     |
   | (Client Implementation)|  | (Client Implementation)|
   +------------------------+  +------------------------+
```

## 2. Key Integration Points

### 2.1. Component Registration System (ReactRuntime)

- **Location**: `@makeswift/runtime/react`
- **Description**: Core component registry, independent of framework
- **Implementation**: Framework-agnostic ReactRuntime class

### 2.2. Data Fetching Layer (Makeswift Client)

- **Location**: Framework-specific clients in `@makeswift/next` and `@makeswift/remix` with shared core in `@makeswift/runtime`
- **Description**: Handles page data retrieval and preview/draft mode integration
- **Implementation**: Base client with framework-specific adapters

### 2.3. API Handler (Preview Mode, Revalidation, Fonts, Webhooks)

- **Location**: Core logic in `@makeswift/runtime`, handlers in framework adapters
- **Description**: Processes API requests for Makeswift services
- **Implementation**: Framework-agnostic business logic with adapter interfaces

### 2.4. Provider Component (Context and Styling)

- **Location**: Core provider in `@makeswift/runtime`, style handling in adapters
- **Description**: Provides runtime context and handles SSR styling
- **Implementation**: Framework-agnostic provider with framework-specific style registry

### 2.5. Page Rendering (Catch-all Routes)

- **Location**: Core rendering in `@makeswift/runtime`, data fetching in adapters
- **Description**: Renders Makeswift pages with correct data and context
- **Implementation**: Framework-agnostic page component with framework-specific data loading

## 3. Package Structure

### 3.1. Core Package (`@makeswift/runtime`)

**Purpose**: Framework-agnostic core functionality
**Structure**:

- `/react` - Core React runtime and component system
- `/controls` - Builder controls (Style, TextInput, etc.)
- `/utils` - Shared utilities
- `/types` - TypeScript type definitions

### 3.2. Next.js Adapter (`@makeswift/next`)

**Purpose**: Next.js-specific integration
**Structure**:

- `/index.ts` - Client exports for browser usage
- `/server.ts` - Server-side functionality
- `/components` - Next.js specific component implementations
- `/api` - API route handlers

### 3.3. Remix Adapter (`@makeswift/remix`)

**Purpose**: Remix-specific integration
**Structure**:

- `/index.ts` - Client exports for browser usage
- `/server.ts` - Server-side functionality
- `/components` - Remix specific component implementations
- `/routes` - Resource route handlers

## 4. Package.json Configuration

### 4.1. Core Package Configuration

```json
{
  "name": "@makeswift/runtime",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./react": {
      "import": "./dist/react.mjs",
      "require": "./dist/react.js",
      "types": "./dist/react.d.ts"
    },
    "./controls": {
      "import": "./dist/controls.mjs",
      "require": "./dist/controls.js",
      "types": "./dist/controls.d.ts"
    },
    "./next": {
      "import": "./dist/next.mjs",
      "require": "./dist/next.js",
      "types": "./dist/next.d.ts"
    },
    "./next/server": {
      "import": "./dist/next/server.mjs",
      "require": "./dist/next/server.js",
      "types": "./dist/next/server.d.ts"
    }
  }
}
```

### 4.2. Framework Adapter Configuration

**@makeswift/next/package.json:**

```json
{
  "name": "@makeswift/next",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./server": {
      "import": "./dist/server.mjs",
      "require": "./dist/server.js",
      "types": "./dist/server.d.ts"
    }
  }
}
```

**@makeswift/remix/package.json:**

```json
{
  "name": "@makeswift/remix",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./server": {
      "import": "./dist/server.mjs",
      "require": "./dist/server.js",
      "types": "./dist/server.d.ts"
    }
  }
}
```

## 5. Backward Compatibility Layer

### 5.1. Re-export Mechanism

```typescript
// @makeswift/runtime/next.ts
export * from '@makeswift/next'

// @makeswift/runtime/next/server.ts
export * from '@makeswift/next/server'
```

### 5.2. Migration Path (Zero-Migration First)

1. **Phase 1 (Zero-Migration)**: Completely transparent with no user code changes required
2. **Phase 2 (Opt-in)**: Optional migration to direct imports from `@makeswift/next`
3. **Phase 3 (Future-Proof)**: Full migration with direct imports, still optional

## 6. Framework Detection System

A lightweight utility will be included to detect which framework is being used:

```typescript
export function detectFramework(): 'next' | 'remix' | 'unknown' {
  try {
    require.resolve('next/package.json')
    return 'next'
  } catch {
    try {
      require.resolve('@remix-run/react/package.json')
      return 'remix'
    } catch {
      return 'unknown'
    }
  }
}
```

This system will allow appropriate configuration based on the detected framework.

## 7. Zero-Migration Compatibility Guarantee

The package structure ensures existing users can update without any code changes:

1. All existing import paths from `@makeswift/runtime/next` are preserved
2. The compatibility layer handles redirecting imports to framework-specific packages
3. The upgrade is transparent, with identical behavior before and after

This approach allows refactoring the architecture while ensuring zero-migration effort for existing users.

## Conclusion

This package structure provides a clear path for decoupling Makeswift from Next.js while maintaining perfect backward compatibility. The approach enables framework-specific optimizations where needed while providing a consistent API surface across frameworks.

By creating a clean separation between core functionality and framework integration, Makeswift will be able to adopt new frameworks in the future while maintaining a consistent developer experience across all supported platforms.
