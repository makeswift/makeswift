import { notFound } from 'next/navigation'

import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { BLOG_POST_EMBEDDED_COMPONENT_ID } from '@/components/Builtins/BlogPost/BlogPost.makeswift'
import { GetBlogsDocument } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'
import { getAllBlogs } from '@/lib/contentful/fetchers'
import { ContentfulProvider } from '@/lib/contentful/provider'
import { client as MakeswiftClient } from '@/lib/makeswift/client'

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map(blog => ({ slug: blog?.slug }))
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params

  if (!slug) {
    return notFound()
  }

  const componentSnapshot = await MakeswiftClient.getComponentSnapshot('blog-post-component', {
    siteVersion: await getSiteVersion(),
  })

  if (componentSnapshot == null) return notFound()

  const blogData = await client.request(GetBlogsDocument, {
    filter: { slug },
  })

  if (!blogData.blogPostCollection) return notFound()

  return (
    <ContentfulProvider value={blogData.blogPostCollection}>
      <MakeswiftComponent
        snapshot={componentSnapshot}
        label="Blog Post"
        type={BLOG_POST_EMBEDDED_COMPONENT_ID}
      />
    </ContentfulProvider>
  )
}
