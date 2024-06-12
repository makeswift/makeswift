---
"@makeswift/runtime": minor
---

BREAKING: The latest upgrade to the Makeswift client `getPages` method
introduces sorting, path filtering, and pagination. This method was not
previously paginated - in order to get all your pages, you may now use our
`toArray` pagination helper method, which will automatically paginate through
all results and aggregate them into an array:

```tsx
import { client } from '@/makeswift/client'
import { MakeswiftPage } from '@makeswift/runtime/next'

async function getAllPages(): Promise<MakeswiftPage[]> {
  return await client.getPages().toArray()
}
```

`getPages` now returns an instance of `IterablePaginationResult`, a decorated
async iterator which includes methods `.map` and `.filter`, in addition to
`.toArray`, mentioned above.

This change also deprecates the client `getSitemap` method, with the
recommendation that sitemaps should now be generated using data returned from
`getPages`. Note that the deprecation of `getSitemap` now involves the host
being responsible for the construction of page paths in the sitemap (either with
domain or path based localization). Below is an example that uses path-based
localization with the `next-sitemap` library:

```tsx pages/sitemap.xml.tsx
import { getServerSideSitemapLegacy } from 'next-sitemap'
import { MakeswiftPage } from '@makeswift/runtime/next'
import { client } from '@makeswift/client'

const DOMAIN = 'https://example.com'
const DEFAULT_PRIORITY = 0.75
const DEFAULT_FREQUENCY = 'hourly'

function pageToSitemapItem(page: MakeswiftPage) {
  const pageUrl = new URL(page.path, DOMAIN)
  return {
    loc: pageUrl.href,
    lastmod: page.createdAt,
    changefreq: page.sitemapFrequency ?? DEFAULT_FREQUENCY,
    priority: page.sitemapPriority ?? DEFAULT_PRIORITY,
    alternateRefs: page.localizedVariants.map(variant => {
      const localizedPath = `/${variant.locale}/${variant.path}`
      const localizedPageUrl = new URL(localizedPath, DOMAIN)
      return {
        hreflang: variant.locale,
        href: localizedPageUrl.href,
      }
    }),
  }
}

export async function getServerSideProps(context) {
  const sitemap = client
    .getPages()
    .filter(page => !page.excludedFromSearch)
    .map(page => pageToSitemapItem(page))
    .toArray()

  return getServerSideSitemapLegacy(context, sitemap)
}

export default function Sitemap() {}

```

Here's another example for Next.js's App Router built-in support for sitemaps:

```ts app/sitemap.ts

import { MetadataRoute } from 'next'
import { MakeswiftPage } from '@makeswift/runtime/dist/types/next'
import { client } from '@/lib/makeswift/client'

type NextSitemapItem = MetadataRoute.Sitemap[number]

const DOMAIN = 'https://example.com'
const DEFAULT_PRIORITY = 0.75
const DEFAULT_FREQUENCY = 'hourly'

function pageToSitemapEntry(page: MakeswiftPage): NextSitemapItem {
  const pageUrl = new URL(page.path, DOMAIN)
  return {
    url: pageUrl.href,
    lastModified: page.createdAt,
    changeFrequency: page.sitemapFrequency ?? DEFAULT_FREQUENCY,
    priority: page.sitemapPriority ?? DEFAULT_PRIORITY,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return client
    .getPages()
    .filter(p => p.path != null)
    .map(page => pageToSitemapEntry(page))
    .toArray()
}
```

BREAKING: The exported `MakeswiftPage` type now includes several more data
fields from the Makeswift page.