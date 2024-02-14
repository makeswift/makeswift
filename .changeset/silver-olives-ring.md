---
'@makeswift/runtime': minor
---

BREAKING: Refactor `MakeswiftApiHandler` to support Next.js App Router Route Handlers.

This change introduces function overloads for the `MakeswiftApiHandler` so that it can be used with the new signature of App Router Route Handlers. It currently implements compatibility for Preview Mode by using the new Draft Mode and storing data in a `x-makeswift-draft-mode-data` cookie. This can be read from App Router using the `getSiteVersion` function exported from `@makesiwft/runtime/next/server`.

There shouldn't be any breaking API changes for Pages Router so there's no changes to upgrade.

This is what a Makeswift page in App Router should now look like:

```ts
import { client } from '@/makeswift/client'
import '@/makeswift/components'
import { getSiteVersion } from '@makeswift/runtime/next/server'
import { notFound } from 'next/navigation'
import { Page as MakeswiftPage } from '@makeswift/runtime/next'

type ParsedUrlQuery = { path?: string[] }

export async function generateStaticParams() {
  const pages = await client.getPages()

  return pages.map((page) => ({
    path: page.path.split('/').filter((segment) => segment !== ''),
  }))
}

export default async function Page({ params }: { params: ParsedUrlQuery }) {
  const path = '/' + (params?.path ?? []).join('/')
  const snapshot = await client.getPageSnapshot(path, {
    siteVersion: getSiteVersion(),
  })

  if (snapshot == null) return notFound()

  return <MakeswiftPage snapshot={snapshot} />
}
```
