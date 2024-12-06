import { notFound } from 'next/navigation'

import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'
import { ParsedUrlQuery } from 'querystring'

import { BLOG_EMBEDDED_COMPONENT_ID } from '@/components/Embedded/Blog/Blog.makeswift'
import { BlogFeedDocument, BlogFeedQueryVariables } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'
import { client as MakeswiftClient } from '@/lib/makeswift/client'

import { SWRProvider } from './swr-provider'

const DEFAULT_PARAMS = {
  limit: 8,
  skip: 0,
  orderBy: ['feedDate_DESC'],
} as BlogFeedQueryVariables

export async function generateStaticParams() {
  const { blogCollection } = await client.request(BlogFeedDocument, DEFAULT_PARAMS)
  return blogCollection?.items.map(blog => ({ slug: blog?.slug }))
}

export default async function Page({ params, ...rest }: { params: { slug: string } }) {
  const { slug } = params

  // Fetch all blogs and validate the slug
  const { blogCollection } = await client.request(BlogFeedDocument, DEFAULT_PARAMS)
  const validSlugs = new Set(blogCollection?.items.map(blog => blog?.slug)) // Use a Set for O(1) lookups

  // Check if the slug exists
  if (!slug || !validSlugs.has(slug)) {
    return notFound()
  }

  const componentSnapshot = await MakeswiftClient.getComponentSnapshot(
    `blog-${slug}`, //id of the component rendered on the page
    { siteVersion: await getSiteVersion() }
  )

  if (componentSnapshot == null) return notFound()

  return (
    <SWRProvider
      fallback={{
        [`blog/${slug}`]: await client.request(BlogFeedDocument, {
          filter: { slug },
        }),
      }}
    >
      <MakeswiftComponent
        snapshot={componentSnapshot}
        label="Blog Page"
        type={BLOG_EMBEDDED_COMPONENT_ID}
      />
    </SWRProvider>
  )
}
