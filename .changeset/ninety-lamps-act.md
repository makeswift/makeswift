---
'@makeswift/runtime': minor
---

Adds support for viewing various site versions with preview tokens.

## Breaking Changes

### `MakeswiftSiteVersion` replaced with `SiteVersion`

We've replaced the `MakeswiftSiteVersion` type with `SiteVersion`, which is now
the return type of the `getSiteVersion` function. Any client method that accepts
a `siteVersion` option (including `getPageSnapshot`, `getComponentSnapshot`, and
`getPages`) should only be using the value returned by `getSiteVersion`. If
you're already using `getSiteVersion` for these methods (as recommended by our
installation guides), no changes should be required.

### `ReactRuntimeProvider` takes a `siteVersion` prop

The `<ReactRuntimeProvider>`'s `previewMode` prop has been replaced with the
required `siteVersion` prop. The value passed for this prop should be set
by the same `getSiteVersion` function.

#### App Router

If you're using App Router, use the `getSiteVersion` function to get the value
to be passed to the `siteVersion` prop of `<ReactRuntimeProvider>`. If you
followed our installation guide and created a `<MakeswiftProvider>` component in
`src/makeswift/provider.tsx`, you can update the props of this component:

```diff
"use client";

import { runtime } from "@/makeswift/runtime";
import {
  ReactRuntimeProvider,
  RootStyleRegistry,
+ type SiteVersion,
} from "@makeswift/runtime/next";
import "@/makeswift/components";

export function MakeswiftProvider({
  children,
-  previewMode,
+  siteVersion,
}: {
  children: React.ReactNode;
-  previewMode: boolean;
+  siteVersion: SiteVersion | null
}) {
  return (
    <ReactRuntimeProvider siteVersion={siteVersion} runtime={runtime}>
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  );
}
```

Then, you can update the value being passed to the `siteVersion` prop in the
root layout (`layout.tsx`):

```diff
import { MakeswiftProvider } from '@/makeswift/provider'
- import { draftMode } from 'next/headers'
+ import { getSiteVersion } from '@makeswift/runtime/next/server'

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Params
}>) {
  const { lang } = await params
  return (
    <html lang={lang}>
      <body>
-        <MakeswiftProvider previewMode={(await draftMode()).isEnabled} locale={lang}>
+        <MakeswiftProvider siteVersion={await getSiteVersion()} locale={lang}>
          {children}
        </MakeswiftProvider>
      </body>
    </html>
  )
}
```

#### Pages Router

If you’re using Pages Router, you’ll need to update the `getStaticProps`
function in your optional catch-all route to replace `previewMode` with
`siteVersion` in its returned data so that it becomes available in the
`_app.tsx` file:

```diff
return {
  props: {
    snapshot,
-   previewMode: Makeswift.getPreviewMode(previewData),
+   siteVersion: Makeswift.getSiteVersion(previewData),
    locale,
  },
};
```

Then, you can consume this data in your `_app.tsx` file and pass it to the
`<ReactRuntimeProvider>`.

```diff
export default function App({
  Component,
-  pageProps: { previewMode, locale, ...pageProps },
+  pageProps: { siteVersion, locale, ...pageProps },
}: AppProps) {
  return (
    <ReactRuntimeProvider
      runtime={runtime}
-     previewMode={previewMode}
+     siteVersion={siteVersion}
      locale={locale}
    >
      <Component {...pageProps} />
    </ReactRuntimeProvider>
  );
}
```
