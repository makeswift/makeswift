# Consolidation Migration Plan

This document outlines the step-by-step process for consolidating the separate `core` and `react` packages into the unified `@makeswift/runtime` package structure as outlined in our architecture documentation.

## Background

Our documented architecture decision in `package-naming-rationale.md` and `CLEANUP.md` calls for a unified approach with `@makeswift/runtime` as the main package, containing both framework-agnostic code in `/src/core` and React-specific code in `/src/react`. However, the current implementation has created separate packages. This migration plan addresses how to consolidate them according to our design.

## Migration Steps

### Step 1: Prepare the Runtime Package Structure

Ensure `@makeswift/runtime` has the correct directory structure:
```
@makeswift/runtime/
  └── src/
      ├── core/        - For framework-agnostic code
      ├── react/       - For React-specific code
      └── index.ts     - Main exports
```

### Step 2: Migrate Core Package Code

1. Move all files from `/packages/core/src` to `/packages/runtime/src/core`
2. Preserve the directory structure within core (api, element, state, etc.)
3. Update internal imports within these files to reflect new paths
4. Ensure tests are also migrated to maintain test coverage

```bash
# Create the core directory if it doesn't exist
mkdir -p packages/runtime/src/core

# Copy files, preserving directory structure
cp -R packages/core/src/* packages/runtime/src/core/

# Copy tests
mkdir -p packages/runtime/src/core/__tests__
cp -R packages/core/src/__tests__/* packages/runtime/src/core/__tests__/
```

### Step 3: Migrate React Package Code

1. Move all files from `/packages/react/src` to `/packages/runtime/src/react`
2. Preserve component structure, hooks, and other organization
3. Update internal imports to reference the new paths
4. Migrate tests to maintain test coverage

```bash
# Create the react directory if it doesn't exist
mkdir -p packages/runtime/src/react

# Copy files, preserving directory structure
cp -R packages/react/src/* packages/runtime/src/react/

# Copy tests
mkdir -p packages/runtime/src/react/__tests__
cp -R packages/react/src/__tests__/* packages/runtime/src/react/__tests__/
```

### Step 4: Update Package Exports

Create or update `/packages/runtime/src/index.ts` to re-export from both core and react:

```typescript
// Core exports
export * from './core/adapter';
export * from './core/site-version';
export * from './core/element';
export * from './core/api';
export * from './core/state';

// React exports
export * from './react/runtime';
export * from './react/runtime-provider';
export * from './react/page';
export * from './react/element';
export * from './react/components';
export * from './react/state';
```

Also create separate entry points for specific imports:

```typescript
// packages/runtime/src/core.ts
export * from './core';

// packages/runtime/src/react.ts
export * from './react';
```

### Step 5: Update Adapter Packages

1. Modify imports in `@makeswift/next` and `@makeswift/remix` to reference `@makeswift/runtime`
2. Update `package.json` dependencies to correctly reference the runtime

For each file in the adapter packages, update imports like:
```typescript
// Before
import { MakeswiftAdapter } from '@makeswift/core';
import { PageRenderer } from '@makeswift/react';

// After
import { MakeswiftAdapter } from '@makeswift/runtime/core';
import { PageRenderer } from '@makeswift/runtime/react';
```

Update `package.json` dependencies:
```json
{
  "dependencies": {
    "@makeswift/runtime": "workspace:*",
    // Remove @makeswift/core and @makeswift/react dependencies
    // ...other dependencies
  }
}
```

### Step 6: Update Build Configuration

1. Adjust tsconfig and build settings to handle the new structure
2. Ensure proper output formats (ESM/CJS) are maintained

Review and update `packages/runtime/tsconfig.json` and `packages/runtime/tsup.config.ts` to handle the consolidated structure.

### Step 7: Testing

1. Run all tests to ensure functionality works with the new structure
2. Verify that adapter packages integrate correctly with the consolidated runtime

```bash
# Run tests for the runtime package
cd packages/runtime && npm test

# Run tests for the adapters
cd packages/next && npm test
cd packages/remix && npm test
```

### Step 8: Clean Up

After successful migration and testing:

1. Remove the separate `/packages/core` and `/packages/react` directories
2. Update documentation to reflect the final implemented structure

```bash
# Only do this after successful testing
rm -rf packages/core
rm -rf packages/react
```

## Migration Verification Checklist

- [ ] All code from core package migrated to runtime/src/core
- [ ] All code from react package migrated to runtime/src/react
- [ ] All imports updated to reflect new structure
- [ ] Entry points properly configured
- [ ] Adapter packages updated to import from runtime
- [ ] All tests passing
- [ ] Build process succeeds
- [ ] Documentation updated
- [ ] Old packages removed

## Rollback Plan

If significant issues are encountered during migration:

1. Keep separate packages operational until issues are resolved
2. If migration needs to be reverted, restore the original import paths in adapter packages
3. Document encountered issues for later resolution

## Conclusion

This consolidation brings our implementation in line with our documented architecture, providing a more streamlined package structure, simplified dependency management, and clearer organization of code. It also ensures we maintain backward compatibility for existing users while setting up a foundation for future framework adapters.