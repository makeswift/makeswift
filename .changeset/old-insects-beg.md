---
'@makeswift/runtime': patch
---

Add `getSitemap` to Makeswift client.

Use this method to generate a sitemap for your Makeswift host. Here's an example using the popular library `next-sitemap`:

```ts
import { makeswift } from '@lib/makeswift'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getServerSideSitemapLegacy } from 'next-sitemap'

export async function getServerSideProps(
  ctx: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<{}>> {
  const sitemap = await makeswift.getSitemap()

  return getServerSideSitemapLegacy(ctx, sitemap)
}

export default function Sitemap() {}
```

The `getSitemap` method is paginated with a default page size of `50`. If you want to request more pages or use a different page size pass the `limit` and `after` arguments. Here's an example:

```ts
const sitemap: Sitemap = []
let page
let after: string | undefined = undefined

do {
  page = await makeswift.getSitemap({ limit: 10, after })

  sitemap.push(...page)
  after = page.at(-1)?.id
} while (page.length > 0)
```

If using TypeScript, you can import the `Sitemap` type from `@makeswift/runtime/next`.

Also, the `getSitemap` method supports filtering results by a pathname prefix using the `pathnamePrefix` parameter. Here's an example using the popular library `next-sitemap`:

```ts
import { makeswift } from '@lib/makeswift'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getServerSideSitemapLegacy } from 'next-sitemap'

export async function getServerSideProps(
  ctx: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<{}>> {
  const blogSitemap = await makeswift.getSitemap({ pathnamePrefix: '/blog/' })

  return getServerSideSitemapLegacy(ctx, blogSitemap)
}

export default function BlogSitemap() {}
```
