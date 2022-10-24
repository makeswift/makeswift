# makeswift

## 0.1.0

### Minor Changes

- e59fd1c: Release version 0.1.0 of the CLI

### Patch Changes

- e59fd1c: Add --env flag

## 0.0.10

### Patch Changes

- d946c97: Fix Google Chrome persistent connections issue

## 0.0.9

### Patch Changes

- ce1bd01: Fix two bugs — the server not closing and `at` used on older Node versions

## 0.0.8

### Patch Changes

- 5452780: Perform file integration operations in a staging environment
- f04722c: - fix error where next.config.js fails and CLI keeps going
  - make default value for integrating true
  - make `init` the default entrypoint to `npx makeswift`
  - support `src/pages` folder structures for integration
  - validate app name is a valid NPM package name
  - add a `register-components.ts` file upon integration

## 0.0.7

### Patch Changes

- 19ae5ea: Use a better workflow for deciding on the project name
- 764e971: Support --use-npm & --use-pnpm parameters
- 3823c46: - Less noisy log output
  - Ask approval before integrating and existing Next step
  - Support `MAKESWIFT_API_HOST` env var
  - Check for conflicting files before integrating
  - Don't integrate if the next config already integrated
  - Upgrade create-next-app
- 9e613bc: Cleaner error messaging

## 0.0.6

### Patch Changes

- 8e45e6b: Add support for preview mode

## 0.0.5

### Patch Changes

- f53dd00: Make name an optional parameter

## 0.0.4

### Patch Changes

- dc5f977: Added support for running `makeswift init` in existing Next.js applications

## 0.0.3

### Patch Changes

- b4bdb21: Fix directory name in npx

## 0.0.2

### Patch Changes

- 15ddfc6: Fix TS build issue

## 0.0.1

### Patch Changes

- 216bbf7: Release initial version of init command
