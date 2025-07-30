---
'@makeswift/next-plugin': minor
'@makeswift/runtime': minor
---

Adds support for viewing various site versions with preview tokens.

## Breaking Changes

We've fully deprecated `MakeswiftSiteVersion`. All APIs that accept a
`siteVersion` option now accept a new `MakeswiftVersionData` type, which
is returned by `getSiteVersion`. For viewing published content, you can
pass `null`.

The `ReactRuntimeProvider`'s `previewMode` prop has been replaced with a
`siteVersion` prop. In app router:

```layout.tsx
import { MakeswiftProvider } from '@/makeswift/provider'
import { getSiteVersion } from '@makeswift/runtime/next/server'

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
        <MakeswiftProvider siteVersion={await getSiteVersion()} locale={lang}>
          {children}
        </MakeswiftProvider>
      </body>
    </html>
  )
}
```

In pages router:
