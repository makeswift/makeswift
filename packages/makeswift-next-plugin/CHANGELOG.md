# @makeswift/next-plugin

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
