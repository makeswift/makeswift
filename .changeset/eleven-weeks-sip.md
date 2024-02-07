---
'@makeswift/runtime': minor
---

BREAKING: Remove `runtime` prop from `Page` component and introduce new `ReactRuntimeProvider` component.

This change is an incremental step in adding App Router support to `@makeswift/runtime`.

Remove the `runtime` prop from any occurrence of the `Page` component:

```diff tsx
import { Page as MakeswiftPage } from '@makeswift/runtime/next'
import { runtime } from '@/makeswift/runtime'

export default function Page({ snapshot }: Props) {
-  return <MakeswiftPage snapshot={snapshot} runtime={runtime} />
+  return <MakeswiftPage snapshot={snapshot} />
}
```

Add `ReactRuntimeProvider` to your Next.js [Custom App](https://nextjs.org/docs/pages/building-your-application/routing/custom-app). If you don't have a Custom App, you'll need to add one.

```tsx
import { runtime } from '@/makeswift/runtime'
import { ReactRuntimeProvider } from '@makeswift/runtime/next'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReactRuntimeProvider runtime={runtime}>
      <Component {...pageProps} />
    </ReactRuntimeProvider>
  )
}
```
