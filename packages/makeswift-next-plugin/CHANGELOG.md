# @makeswift/next-plugin

## 0.5.0

### Minor Changes

- 0785045: BREAKING: Replaces draft-mode and preview-mode query param rewrite rules with a single rewrite rule for preview tokens.

### Patch Changes

- 06a2462: Rename query param for clearing preview cookies
- ee0b65b: feat: add query param to clear preview cookies on redirect

## 0.4.1

### Patch Changes

- 461fe75: fix: Pages Router regression, localized pages redirect to the base locale in the builder

## 0.4.0

### Minor Changes

- 8241d49: feat: sets draft cookies directly on the client instead of proxying. Includes a new toolbar for exiting draft state outside of the builder. Removes all previous proxying related rewrites and endpoints.

## 0.3.1

### Patch Changes

- 5051cc0: fix: update `@makeswift/next-plugin`'s peer deps to include Next 15

## 0.3.0

### Minor Changes

- 39e160a: BREAKING: Drop support for Next.js versions lower than 13.4.0.

  We're moving our Preview Mode implementation to Draft Mode, which was added on Next.js v13.4.0.

- 9cb2f76: BREAKING: Stop transpiling `@makeswift/runtime`.

  This was needed because of `next/dynamic` which we're now using `React.lazy`.

### Patch Changes

- 2719416: Introduces draft mode for Next.js app router applications. Existing pages router applications are still supported via preview mode.
- a220ecb: Add Next.js as a peer dependency of `@makeswift/next-plugin`.

## 0.2.8

### Patch Changes

- 49b0981: Add `previewMode` option to Next.js plugin.

## 0.2.7

### Patch Changes

- f424011: Handle `resolveSymlinks` for versions of Next.js greater than 13.1.0.

## 0.2.6

### Patch Changes

- 07fd1de: Add missing dependencies on vendored `next-transpile-modules`.

## 0.2.5

### Patch Changes

- b25c046: Vendor `next-transpile-modules` because the package has a deprecation error, even though it's still needed for Next.js v12.

## 0.2.4

### Patch Changes

- e61c4f2: Fix images are not loading when using Next.js version `12.2.x`.

## 0.2.3

### Patch Changes

- a165537: Add Makeswift review app image remote patterns to Next.js config.

## 0.2.2

### Patch Changes

- 0e12b08: Fix development Google Storage bucket URL.

## 0.2.1

### Patch Changes

- 050f6f9: Add Makeswift Google Storage image remote patterns to Next.js config.

## 0.2.0

BREAKING CHANGE: The Next.js plugin will now check the version of Next.js being used and if it is less than v12.2.0 an error is thrown.

- c3041ff: Adds Next.js version checking, and transpile package support for Next.js 13.

## 0.1.7

### Patch Changes

- 5b06076: Remove `styledComponents` from Next.js config.

## 0.1.6

### Patch Changes

- c21792b: Set Preview Mode rewrites `locale` option to `false` so that it matches when using Next.js i18n features.

## 0.1.5

### Patch Changes

- e777f28: Hotfix: next plugin errors when `headers` is null.

## 0.1.4

### Patch Changes

- fcf33f5: Add Makeswift as an allowed request origin on request with `x-makeswift-allow-origin` query param.

## 0.1.3

### Patch Changes

- 51dc17b: Fix Preview Mode rewrite source so that it matches `/`.

## 0.1.2

### Patch Changes

- a033573: Add Preview Mode rewrites to @makeswift/next-plugin.

## 0.1.1

### Patch Changes

- e737cc7: Set compiler.styledComponents to true in Makeswift Next.js plugin

## 0.1.0

### Minor Changes

- 0e26971: Release @makeswift/next-plugin.

  This plugin automatically configures the Makeswift domain for next/image and also enables code-splitting via next/dynamic.
