import { notFound } from 'next/navigation'

import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { BLOG_POST_EMBEDDED_COMPONENT_ID } from '@/components/Builtins/BlogPost/BlogPost.makeswift'
import { GetBlogDocument } from '@/generated/prismic'
import { client as MakeswiftClient } from '@/lib/makeswift/client'
import { client } from '@/lib/prismic/client'
import { getAllBlogs } from '@/lib/prismic/fetchers'
import { PrismicProvider } from '@/lib/prismic/provider'

export async function generateStaticParams() {
  const blogs = await getAllBlogs()

  return blogs.map(blog => ({ slug: blog?._meta?.uid }))
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params

  if (!slug) {
    return notFound()
  }

  const componentSnapshot = await MakeswiftClient.getComponentSnapshot(
    BLOG_POST_EMBEDDED_COMPONENT_ID,
    {
      siteVersion: await getSiteVersion(),
    }
  )

  if (componentSnapshot == null) return notFound()

  const blogData = await client.request(GetBlogDocument, {
    uid: slug,
  })

  if (!blogData.blogpost) return notFound()

  return (
    <PrismicProvider value={blogData.blogpost}>
      <MakeswiftComponent
        snapshot={componentSnapshot}
        label="Blog Post"
        type={BLOG_POST_EMBEDDED_COMPONENT_ID}
      />
    </PrismicProvider>
  )
}
