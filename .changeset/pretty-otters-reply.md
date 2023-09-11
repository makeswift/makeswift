---
'@makeswift/runtime': patch
---

Add a new `merge-translated-data` API handler to merge translated data back into Makeswift pages.

To use this translation merging functionality, make sure to pass an instance of `ReactRuntime` to the Makeswift API handler like so:

```ts
import { MakeswiftApiHandler } from '@makeswift/runtime/next'
import { runtime } from '../../../lib/makeswift/register-components'

export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY, {
  runtime,
})
```
