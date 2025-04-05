import { notFound } from 'next/navigation'

import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'
import { ParsedUrlQuery } from 'querystring'

import { BLOG_EMBEDDED_COMPONENT_ID } from '@/components/Embedded/Blog/Blog.makeswift'
import { BlogFeedDocument, BlogFeedQueryVariables, BlogPostDocument } from '@/generated/dato'
import { client } from '@/lib/dato/client'
import { client as MakeswiftClient } from '@/lib/makeswift/client'

import { SWRProvider } from './swr-provider'

const DEFAULT_PARAMS = {
  limit: 8,
  skip: 0,
  filter: {},
  orderBy: ['feedDate_DESC'],
} as BlogFeedQueryVariables

export async function generateStaticParams() {
  const { allBlogs } = await client.request(BlogFeedDocument, DEFAULT_PARAMS)
  return allBlogs.map(({ slug }) => ({ slug }))
}

export default async function Page({ params, ...rest }: { params: { slug: string } }) {
  const { slug } = params

  // Fetch all blogs and validate the slug
  const { allBlogs } = await client.request(BlogFeedDocument, DEFAULT_PARAMS)
  const validSlugs = new Set(allBlogs.map(blog => blog.slug)) // Use a Set for O(1) lookups

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
        [`blog/${slug}`]: await client.request(BlogPostDocument, {
          slug,
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
