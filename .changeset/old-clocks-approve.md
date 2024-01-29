---
'@makeswift/runtime': minor
---

BREAKING: Move `MakeswiftApiHandler` from `@makeswift/runtime/next` to `@makeswift/runtime/next/server`.

This change was necessary because there are server-only dependencies for the API handler and if these dependencies are bundled and run in the browser it can cause various issues. In our case, a transitive dependency of `http-proxy` (`follow-redirects`) was being included in browser bundles resulting in client-side exceptions in Safari and Firefox due to an `Error.captureStackTrace` call that was intended to run only on Node.js.

To migrate change your `pages/api/makeswift/[...makeswift].ts` file:

```diff
-import { MakeswiftApiHandler } from '@makeswift/runtime/next'
+import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY)
```
