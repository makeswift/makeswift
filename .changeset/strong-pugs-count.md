---
'@makeswift/runtime': minor
---

feat!: implement support for multiple isolated Makeswift-enabled React regions on a page.

## Breaking Changes

### `ReactRuntime` import

`ReactRuntime` import for Next.js has been moved from `@makeswift/runtime/react` to `@makeswift/runtime/next`:

```diff
- import { ReactRuntime } from '@makeswift/runtime/react';
+ import { ReactRuntime } from '@makeswift/runtime/next';

export const runtime = new ReactRuntime();
```

### (internal) `appOrigin` and `apiOrigin` params

Undocumented `appOrigin` and `apiOrigin` params are now passed directly to the `ReactRuntime` constructor. See [internal apps](/apps/) for details.
