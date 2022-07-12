---
'@makeswift/runtime': minor
---

Add @makeswift/next-plugin to @makeswift/runtime.

Our new Next.js plugin is available at `@makeswift/runtime/next/plugin`. It enables code-splitting
via `next/dynamic` and also removes the need to manually configure `next/image` domains.

```js
const withMakeswift = require('@makeswift/runtime/next/plugin')()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
}

module.exports = withMakeswift(nextConfig)
```
