---
'@makeswift/runtime': minor
---

Next.js 15 / React 19 RC support

## Breaking Changes

### Pages Router's custom `Document`

The Makeswift custom `Document` export has been moved from `@makeswift/runtime/next` to `@makeswift/runtime/next/document`. To migrate, adjust the custom `Document` import in `src/pages/_document.ts` as follows:

```diff
- export { Document as default } from '@makeswift/runtime/next'
+ export { Document as default } from '@makeswift/runtime/next/document'
```
