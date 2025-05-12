# Cleanup Plan for Package Restructuring

This document outlines the cleanup actions needed to implement the revised package architecture for the decoupling project.

## Current State

We have updated the documentation to reflect a new package structure:

- `@makeswift/runtime`: Core package containing framework-agnostic and React functionality
  - `/src/core`: Framework-agnostic functionality
  - `/src/react`: React-specific functionality
- `@makeswift/next`: Next.js adapter
- `@makeswift/remix`: Remix adapter

However, we currently have scaffolded separate packages that need to be cleaned up:

- `/packages/core`: Standalone core package (to be removed)
- `/packages/react`: Standalone react package (to be removed)

## Cleanup Tasks

1. **Consolidate code to runtime package**:
   - Move any useful code from `/packages/core/src` to `/packages/runtime/src/core`
   - Move any useful code from `/packages/react/src` to `/packages/runtime/src/react`

2. **Remove separate packages**:
   - Once code is consolidated, remove `/packages/core`
   - Once code is consolidated, remove `/packages/react`

3. **Update import paths**:
   - In all files that import from the core or react packages, update imports to point to runtime package
   - Update all examples in documentation to use the new import paths

4. **Testing**:
   - Ensure all tests pass with the new structure
   - Migrate any tests from core and react packages to the runtime package

## Migration Plan

1. First, copy essential code from core and react packages to runtime
2. Update import paths in the codebase to reference the new locations
3. Run tests to ensure everything works
4. Remove the now-unused packages

This approach ensures no code is lost during the transition and minimizes disruption.